import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    </div>
  );
}