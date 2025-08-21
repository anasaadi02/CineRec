import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import HomeSearch from '@/components/HomeSearch';
import MediaTabs from '@/components/MediaTabs';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <HeroSlider />
      <ErrorBoundary>
        <HomeSearch />
      </ErrorBoundary>
      <MediaTabs />
      <Footer />
    </div>
  );
}
