#!/usr/bin/env node
/**
 * AILAV admin bootstrap.
 * Generates password hash + TOTP secret + QR code for Google Authenticator.
 *
 * Usage:  node scripts/admin-init.mjs
 */
import readline from 'node:readline';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { TOTP, Secret } from 'otpauth';
import QRCode from 'qrcode';

function ask(question, { silent = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    if (silent) {
      const stdin = process.stdin;
      const onData = (char) => {
        const s = char.toString();
        if (s === '\n' || s === '\r' || s === '\u0004') stdin.removeListener('data', onData);
        else process.stdout.write('*');
      };
      stdin.on('data', onData);
    }
    rl.question(question, (answer) => {
      if (silent) process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

(async function main() {
  console.log('\n╭─────────────────────────────────────────╮');
  console.log('│  AILAV Admin 初始化工具                 │');
  console.log('╰─────────────────────────────────────────╯\n');

  const password = (await ask('輸入新的管理員密碼（至少 8 字元）：', { silent: true })).trim();
  if (password.length < 8) {
    console.error('\n✗ 密碼至少需要 8 字元，請重新執行。\n');
    process.exit(1);
  }

  const confirmed = (await ask('再輸入一次密碼確認：', { silent: true })).trim();
  if (confirmed !== password) {
    console.error('\n✗ 兩次密碼不一致，請重新執行。\n');
    process.exit(1);
  }

  console.log('\n產生密碼 hash ...');
  const hash = await bcrypt.hash(password, 12);

  console.log('產生 TOTP 密鑰 ...');
  const secret = new Secret({ size: 20 });
  const totp = new TOTP({
    issuer: 'AILAV Admin',
    label: 'admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });
  const otpauthUri = totp.toString();

  console.log('產生 Session 密鑰 ...');
  const sessionSecret = crypto.randomBytes(32).toString('base64url');

  const qr = await QRCode.toString(otpauthUri, { type: 'terminal', small: true });

  console.log('\n─────────────────────────────────────────');
  console.log('📱 用 Google Authenticator / 1Password / Authy 掃描此 QR Code：\n');
  console.log(qr);
  console.log('如果終端機顯示有問題，手動輸入此 URI 或 Base32 密鑰：');
  console.log('  URI    : ' + otpauthUri);
  console.log('  Base32 : ' + secret.base32);
  console.log('─────────────────────────────────────────\n');

  const hashB64 = Buffer.from(hash).toString('base64');

  console.log('✅ 將下列變數貼到 `.env.local`（本機）與 Vercel → Project → Settings → Environment Variables（正式）：\n');
  console.log('# ── AILAV Admin ───────────────────────────');
  // Base64-encoded hash avoids all dotenv-expand quirks around "$" sequences.
  console.log('ADMIN_PASSWORD_HASH_B64=' + hashB64);
  console.log('ADMIN_TOTP_SECRET=' + secret.base32);
  console.log('ADMIN_SESSION_SECRET=' + sessionSecret);
  console.log('');
  console.log('# ── Vercel Blob（在 Vercel Dashboard 建立後取得）──');
  console.log('# BLOB_READ_WRITE_TOKEN=');
  console.log('');
  console.log('# ── Upstash Redis（登入速率限制；可選但建議）──');
  console.log('# UPSTASH_REDIS_REST_URL=');
  console.log('# UPSTASH_REDIS_REST_TOKEN=');
  console.log('\n完成。可以執行 `npm run dev` 後造訪 /admin/login 登入。\n');
})();
