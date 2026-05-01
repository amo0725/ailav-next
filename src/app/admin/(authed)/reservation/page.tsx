import { Suspense } from 'react';
import { getContent } from '@/lib/content';
import EditorSkeleton from '@/components/admin/EditorSkeleton';
import ReservationEditor from './ReservationEditor';

export default function ReservationPage() {
  return (
    <>
      <div className="adm-head">
        <p className="adm-crumb">Content · Reservation</p>
        <h1 className="adm-title">預約 / 資訊</h1>
        <p className="adm-subtitle">地址、各時段營業時間、Google 地圖嵌入網址。</p>
      </div>
      <Suspense fallback={<EditorSkeleton />}>
        <ReservationEditorLoader />
      </Suspense>
    </>
  );
}

async function ReservationEditorLoader() {
  const content = await getContent();
  return (
    <ReservationEditor key={content.version} initial={content.restaurant} />
  );
}
