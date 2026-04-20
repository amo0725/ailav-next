import { getContent } from '@/lib/content';
import ReservationEditor from './ReservationEditor';

export default async function ReservationPage() {
  const content = await getContent();
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Reservation</p>
        <h1 className="adm-title">預約 / 資訊</h1>
        <p className="adm-subtitle">地址、各時段營業時間、Google 地圖嵌入網址。</p>
      </div>
      <ReservationEditor initial={content.restaurant} />
    </>
  );
}
