import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ConceptSection from '@/components/sections/ConceptSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import ChefSection from '@/components/sections/ChefSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import MenuSection from '@/components/sections/MenuSection';
import ReservationSection from '@/components/sections/ReservationSection';
import Loader from '@/components/ui/Loader';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ThumbBar from '@/components/ui/ThumbBar';
import AccessibilityPanel from '@/components/ui/AccessibilityPanel';
import WelcomeBanner from '@/components/ui/WelcomeBanner';
import SoundToggle from '@/components/ui/SoundToggle';
import LiquidDistortionFilter from '@/components/common/LiquidDistortionFilter';
import ScrollRevealInit from '@/components/common/ScrollRevealInit';
import GlobalEffects from '@/components/common/GlobalEffects';
import { getContent } from '@/lib/content';

export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      {/* Global UI */}
      <LiquidDistortionFilter />
      <a href="#main" className="skip">
        跳至主要內容
      </a>
      <ScrollProgress />
      <CustomCursor />
      <Loader />
      <ScrollRevealInit />
      <GlobalEffects />

      {/* Header + Navigation */}
      <Header />

      {/* Main Content */}
      <main id="main">
        <HeroSection hero={content.hero} />
        <ConceptSection concept={content.concept} />
        <MarqueeSection />
        <ChefSection chefs={content.chefs} />
        <ManifestoSection manifesto={content.manifesto} />
        <MenuSection items={content.menu} />
        <ReservationSection restaurant={content.restaurant} />
      </main>

      {/* Footer */}
      <Footer tagline={content.site.tagline} />

      {/* Floating UI */}
      <AccessibilityPanel />
      <ThumbBar />
      <WelcomeBanner />
      <SoundToggle />
    </>
  );
}
