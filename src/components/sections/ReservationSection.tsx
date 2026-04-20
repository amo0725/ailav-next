import type { Restaurant } from '@/lib/content/types';

export default function ReservationSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section
      className="relative z-[6] bg-[var(--bg)] px-[var(--gutter)] py-[clamp(80px,12vw,180px)]"
      id="reserve"
    >
      <div className="mx-auto max-w-[var(--max)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[clamp(60px,8vw,120px)] items-start">
        <div>
          <span className="rv block text-[clamp(.7rem,.9vw,.8rem)] tracking-[.35em] uppercase text-[var(--fg3)] mb-5">
            Reservation
          </span>
          <h2 className="rv rv-d1 [font-family:var(--serif)] text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.3]">
            預約訂位
          </h2>
          <div className="info-detail rv rv-d2">
            <h3>Address</h3>
            <p>{restaurant.address}</p>
          </div>
          <div className="info-detail rv rv-d2">
            <h3>{restaurant.hours.mainCourse.label}</h3>
            <p>{restaurant.hours.mainCourse.days}　{restaurant.hours.mainCourse.time}</p>
            <p className="text-[var(--fg3)] text-[.8rem] mt-1">現場排隊翻桌，不提供訂位</p>
          </div>
          <div className="info-detail rv rv-d3">
            <h3>{restaurant.hours.tasting.label}</h3>
            <p>{restaurant.hours.tasting.days}　{restaurant.hours.tasting.time}</p>
          </div>
          <div className="info-detail rv rv-d3">
            <h3>{restaurant.hours.wineBar.label}</h3>
            <p>{restaurant.hours.wineBar.days}　{restaurant.hours.wineBar.time}</p>
          </div>
          <div className="info-detail rv rv-d4">
            <h3>Closed</h3>
            <p>{restaurant.hours.closed}</p>
          </div>
          <a
            href="#"
            className="cta cta-shimmer rv rv-d4"
            id="ctaReserve"
          >
            <span>Online Reservation</span>
          </a>
        </div>
        <div className="rv rv-d2 aspect-square lg:aspect-square overflow-hidden">
          <iframe
            className="w-full h-full border-0 saturate-[.4] contrast-[1.1] transition-[filter] duration-300 hover:saturate-[.7]"
            src={restaurant.mapEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AILAV 餐廳位置"
          />
        </div>
      </div>
    </section>
  );
}
