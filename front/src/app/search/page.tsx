import Navbar from '@/components/Navbar';
import SearchResultsWrapper from '@/components/SearchResultsWrapper';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary>
            <SearchResultsWrapper />
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  );
}
