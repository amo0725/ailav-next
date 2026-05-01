import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ContentRepository } from './repository';
import type { Content } from './types';
import { ContentSchema } from './schema';
import { SEED_CONTENT } from './seed';

/**
 * Local filesystem-backed content repository for development / offline use.
 *
 * Stored at `<cwd>/.data/content.json`. Reads schema-validate; on missing
 * file or invalid payload we fall back to SEED_CONTENT so the editor still
 * renders. Writes throw if the payload doesn't satisfy the schema.
 *
 * The `.data/` dir is gitignored — see /.gitignore.
 */
export class LocalFsContentRepository implements ContentRepository {
  private readonly filePath = path.join(process.cwd(), '.data', 'content.json');

  async read(): Promise<Content> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, 'utf8');
    } catch {
      return SEED_CONTENT;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return SEED_CONTENT;
    }
    const result = ContentSchema.safeParse(parsed);
    if (!result.success) return SEED_CONTENT;
    return result.data;
  }

  async write(content: Content): Promise<void> {
    const validated = ContentSchema.parse(content);
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(
      this.filePath,
      JSON.stringify(validated, null, 2),
      'utf8'
    );
  }
}
