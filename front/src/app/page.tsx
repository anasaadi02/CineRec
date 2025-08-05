import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import MediaTabs from '@/components/MediaTabs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <HeroSlider />
      <MediaTabs />
      <Footer />
    </div>
  );
}
