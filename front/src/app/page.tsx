import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import MovieGrid from '@/components/MovieGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <HeroSlider />
      <MovieGrid />
      <Footer />
    </div>
  );
}
