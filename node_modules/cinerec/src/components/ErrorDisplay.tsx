interface ErrorDisplayProps {
    error: string;
  }
  
  export default function ErrorDisplay({ error }: ErrorDisplayProps) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-8 max-w-md">
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }