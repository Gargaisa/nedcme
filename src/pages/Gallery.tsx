import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Eye, Plus, Upload } from 'lucide-react';
import { supabase, GalleryImage } from '../lib/supabase';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const years = [2022, 2023, 2024, 2025, 2026];

  useEffect(() => {
    fetchImages();
  }, [selectedYear]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('year', selectedYear)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      setImages([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const ImageModal = ({ image, onClose }: { image: GalleryImage; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{image.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-4">
          <img
            src={image.image_url}
            alt={image.title}
            className="w-full h-auto rounded-lg"
          />
          {image.description && (
            <p className="mt-4 text-gray-600">{image.description}</p>
          )}
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Calendar className="mr-1" size={16} />
            <span>Year: {image.year}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Camera className="mr-3 text-green-600" size={32} />
                M&E Gallery
              </h1>
              <p className="text-lg text-gray-600">
                Project monitoring photos from NEDC field activities across the North East region
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Upload className="mr-2" size={16} />
              Upload Photos
            </button>
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedYear === year
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading gallery...</span>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative aspect-video">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{image.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1" size={12} />
                      {image.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos for {selectedYear}</h3>
            <p className="text-gray-600 mb-4">
              No monitoring and evaluation photos have been uploaded for this year yet.
            </p>
            <button className="flex items-center mx-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="mr-2" size={16} />
              Add First Photo
            </button>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;