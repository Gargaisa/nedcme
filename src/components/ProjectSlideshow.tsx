import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { supabase, GalleryImage } from '../lib/supabase';

const ProjectSlideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides, setSlides] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8); // Get latest 8 images for slideshow

      if (error) {
        // Fallback to sample images if database is not connected
        setSlides([
          {
            id: '1',
            title: "Agricultural Development Project - Adamawa",
            description: "Modern irrigation system implementation in Yola North LGA",
            image_url: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1200",
            year: 2024
          },
          {
            id: '2',
            title: "Educational Infrastructure - Borno",
            description: "New primary school construction in Maiduguri",
            image_url: "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=1200",
            year: 2024
          },
          {
            id: '3',
            title: "Healthcare Facility - Gombe",
            description: "Primary healthcare center upgrade in Billiri LGA",
            image_url: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200",
            year: 2023
          },
          {
            id: '4',
            title: "Road Infrastructure - Taraba",
            description: "Rural road construction connecting communities",
            image_url: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1200",
            year: 2023
          }
        ] as GalleryImage[]);
      } else {
        // If no data from database, use fallback images
        if (!data || data.length === 0) {
          setSlides([
            {
              id: '1',
              title: "Agricultural Development Project - Adamawa",
              description: "Modern irrigation system implementation in Yola North LGA",
              image_url: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1200",
              year: 2024
            },
            {
              id: '2',
              title: "Educational Infrastructure - Borno",
              description: "New primary school construction in Maiduguri",
              image_url: "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=1200",
              year: 2024
            },
            {
              id: '3',
              title: "Healthcare Facility - Gombe",
              description: "Primary healthcare center upgrade in Billiri LGA",
              image_url: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200",
              year: 2023
            },
            {
              id: '4',
              title: "Road Infrastructure - Taraba",
              description: "Rural road construction connecting communities",
              image_url: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1200",
              year: 2023
            }
          ] as GalleryImage[]);
        } else {
          setSlides(data);
        }
      }
    } catch (err) {
      // Fallback to sample images
      setSlides([
        {
          id: '1',
          title: "Agricultural Development Project - Adamawa",
          description: "Modern irrigation system implementation in Yola North LGA",
          image_url: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1200",
          year: 2024
        },
        {
          id: '2',
          title: "Educational Infrastructure - Borno",
          description: "New primary school construction in Maiduguri",
          image_url: "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=1200",
          year: 2024
        }
      ] as GalleryImage[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading slideshow...</span>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
          <p className="text-gray-600">Upload images to the M&E Gallery to display them here.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-96 md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="max-w-4xl">
                <span className="inline-block px-3 py-1 bg-green-600 rounded-full text-sm font-medium mb-2">
                  {slide.year}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
                <p className="text-lg opacity-90">{slide.description || 'NEDC Development Project'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectSlideshow;