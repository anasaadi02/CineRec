'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import Image from 'next/image';

const featuredContent = [
  {
    id: 1,
    title: "The Latest Blockbuster",
    type: "Movie",
    year: "2024",
    rating: 8.7,
    description: "An epic adventure that takes you on a journey through time and space. Experience the ultimate cinematic masterpiece that has captivated audiences worldwide.",
    image: "/api/placeholder/1200/600",
    backdrop: "/api/placeholder/1920/1080"
  },
  {
    id: 2,
    title: "Trending Series",
    type: "TV Series",
    year: "2024",
    rating: 9.2,
    description: "A gripping drama series that explores the depths of human nature. Follow complex characters through their interconnected stories in this critically acclaimed show.",
    image: "/api/placeholder/1200/600",
    backdrop: "/api/placeholder/1920/1080"
  },
  {
    id: 3,
    title: "Award Winner",
    type: "Movie",
    year: "2024",
    rating: 8.9,
    description: "The most talked-about film of the year. A stunning visual experience combined with powerful storytelling that will leave you speechless.",
    image: "/api/placeholder/1200/600",
    backdrop: "/api/placeholder/1920/1080"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {featuredContent.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent relative">
              <div className="absolute inset-0 bg-gray-800"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {item.type}
                  </span>
                  <span className="text-gray-300">{item.year}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{item.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {item.title}
                </h1>
                
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                    <Play className="h-5 w-5" />
                    <span>Watch Trailer</span>
                  </button>
                  <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors">
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-red-600' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}