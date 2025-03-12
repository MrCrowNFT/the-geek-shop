import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CircleDot, Circle } from "lucide-react";
import { SliderProps } from "@/types/slider";

const Slider: React.FC<SliderProps> = ({ 
  images, 
  autoSlide = false, 
  autoSlideInterval = 3000 
}) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImg = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSliderIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  const prevImg = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSliderIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSliderIndex(index);
  };

  // Reset transition state after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [sliderIndex]);

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide) return;
    
    const slideInterval = setInterval(nextImg, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, isTransitioning]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Image container */}
      <div className="flex h-full w-full overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`h-full w-full flex-shrink-0 object-cover transition-transform duration-500 ease-in-out`}
            style={{ transform: `translateX(${-100 * sliderIndex}%)` }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevImg}
        className="absolute left-0 top-0 bottom-0 flex items-center justify-center p-4 transition-colors duration-300 hover:bg-black/20 focus:outline-none"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
        <ChevronLeft className="h-8 w-8 text-white stroke-2 drop-shadow-md" />
      </button>

      <button
        onClick={nextImg}
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-4 transition-colors duration-300 hover:bg-black/20 focus:outline-none"
        aria-label="Next slide"
        disabled={isTransitioning}
      >
        <ChevronRight className="h-8 w-8 text-white stroke-2 drop-shadow-md" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex h-8 w-8 items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none ${
              isTransitioning ? 'pointer-events-none' : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === sliderIndex ? "true" : "false"}
          >
            {index === sliderIndex ? (
              <CircleDot className="h-full w-full text-white drop-shadow-md" />
            ) : (
              <Circle className="h-full w-full text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slider;