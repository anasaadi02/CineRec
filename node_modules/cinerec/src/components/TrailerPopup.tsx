'use client';

import { X, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrailerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
  mediaType: 'movie' | 'tv';
  title: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export default function TrailerPopup({ isOpen, onClose, movieId, mediaType, title }: TrailerPopupProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && movieId) {
      fetchVideos();
    }
  }, [isOpen, movieId, mediaType]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?api_key=${apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      const trailerVideos = data.results.filter((video: Video) => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      setVideos(trailerVideos);
      
      // Auto-select the first official trailer, or first trailer if no official ones
      const officialTrailer = trailerVideos.find(video => video.official);
      setSelectedVideo(officialTrailer || trailerVideos[0] || null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setVideos([]);
    setError(null);
    setIframeLoaded(false);
    onClose();
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIframeLoaded(false); // Reset loading state for new video
  };



  // Close popup when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
             {/* Modal */}
       <div className="relative w-full max-w-7xl mx-4 bg-gray-900 rounded-lg shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Play className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-white">
              {title} - Trailers
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <p className="text-gray-400">No trailers available for this {mediaType}.</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No trailers available for this {mediaType}.</p>
            </div>
          ) : (
            <div className="space-y-4">
                           <div className="flex flex-col lg:flex-row gap-6 justify-center">
               {/* Main Video Player */}
               <div className={`w-full ${videos.length > 1 ? 'lg:w-2/3' : 'lg:w-3/4'} max-w-4xl`}>
                 {selectedVideo && (
                   <div className="relative">
                     <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                       {/* Loading indicator */}
                       {!iframeLoaded && (
                         <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                           <div className="text-center">
                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                             <p className="text-white text-lg">Loading trailer...</p>
                           </div>
                         </div>
                       )}
                       
                                               <iframe
                          src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                         title={selectedVideo.name}
                         className="w-full h-full"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         style={{ position: 'relative', zIndex: 1 }}
                         onLoad={() => {
                           console.log('YouTube iframe loaded successfully');
                           setIframeLoaded(true);
                         }}
                         onError={() => {
                           console.error('YouTube iframe failed to load');
                           setIframeLoaded(false);
                         }}
                       />
                       
                       {/* Fallback link in case iframe doesn't work */}
                       <div className="absolute top-4 left-4 z-20">
                         <a
                           href={`https://www.youtube.com/watch?v=${selectedVideo.key}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                         >
                           Open on YouTube
                         </a>
                       </div>
                       
                       {/* Debug info - remove in production */}
                       <div className="absolute top-4 right-4 z-20">
                         <details className="text-white text-xs">
                           <summary className="cursor-pointer bg-black/50 px-2 py-1 rounded">
                             Debug
                           </summary>
                           <div className="bg-black/80 p-2 rounded mt-1 text-xs">
                             <p>Iframe Loaded: {iframeLoaded ? 'Yes' : 'No'}</p>
                             <p>Video Key: {selectedVideo.key}</p>
                             <p>Total Videos: {videos.length}</p>
                           </div>
                         </details>
                       </div>
                     </div>
                     
                     
                     
                     {/* Video Title */}
                     <div className="mt-3">
                       <h3 className="text-white font-medium text-lg">
                         {selectedVideo.name}
                       </h3>
                       {selectedVideo.official && (
                         <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                           Official
                         </span>
                       )}
                     </div>
                   </div>
                 )}
               </div>

               {/* Video Thumbnails Sidebar */}
               {videos.length > 1 && (
                 <div className="w-full lg:w-80 flex-shrink-0">
                   <h4 className="text-white font-medium mb-3">More Trailers</h4>
                   <div className="space-y-3 max-h-[300px] lg:max-h-[500px] overflow-y-auto">
                     {videos.map((video) => (
                       <button
                         key={video.id}
                         onClick={() => handleVideoSelect(video)}
                         className={`relative w-full aspect-video rounded-lg overflow-hidden transition-all hover:scale-105 ${
                           selectedVideo?.id === video.id 
                             ? 'ring-2 ring-red-500' 
                             : 'ring-1 ring-gray-600 hover:ring-gray-400'
                         }`}
                       >
                         <img
                           src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                           alt={video.name}
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <Play className="h-6 w-6 text-white" />
                         </div>
                         {video.official && (
                           <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                             Official
                           </span>
                         )}
                         <div className="absolute bottom-2 left-2 right-2">
                           <p className="text-white text-xs font-medium truncate">
                             {video.name}
                           </p>
                         </div>
                       </button>
                     ))}
                   </div>
                 </div>
               )}
             </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
