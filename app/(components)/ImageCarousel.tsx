"use client";

import { useState, useEffect } from "react";

interface CarouselImage {
  id: number;
  url?: string;
  alt: string;
  fallback: string;
  gradient: string;
}

export default function ImageCarousel() {
  // Default images with fallback gradients - these can be customized through environment variables or admin interface
  const defaultImages: CarouselImage[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Edificios modernos de oficinas",
      fallback: "🏢",
      gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Inversiones inmobiliarias",
      fallback: "💼",
      gradient: "linear-gradient(135deg, #00b894 0%, #00a085 100%)"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Propiedades de lujo",
      fallback: "🏠",
      gradient: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Portafolio de inversión",
      fallback: "📈",
      gradient: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)"
    }
  ];

  const [images, setImages] = useState<CarouselImage[]>(defaultImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const handleImageError = (imageId: number) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "500px",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    }}>
      {/* Main Image Display */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}>
        {images.map((image, index) => (
          <div
            key={image.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: index === currentIndex ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
            }}
          >
            {imageErrors.has(image.id) || !image.url ? (
              /* Fallback gradient display */
              <div style={{
                width: "100%",
                height: "100%",
                background: image.gradient,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "4rem",
                  marginBottom: "1rem",
                }}>
                  {image.fallback}
                </div>
                <div style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  maxWidth: "80%",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}>
                  {image.alt}
                </div>
              </div>
            ) : (
              <img
                src={image.url}
                alt={image.alt}
                onError={() => handleImageError(image.id)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ))}

        {/* Overlay for better text readability */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          height: "40%",
          pointerEvents: "none",
        }} />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            fontSize: "1.2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          ←
        </button>

        <button
          onClick={goToNext}
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            fontSize: "1.2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          →
        </button>

        {/* Image Title */}
        <div style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          color: "white",
          fontSize: "1.1rem",
          fontWeight: "500",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
        }}>
          {images[currentIndex]?.alt}
        </div>
      </div>

      {/* Dot Indicators */}
      <div style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        display: "flex",
        gap: "0.5rem",
        zIndex: 10,
      }}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: "0.75rem",
              height: "0.75rem",
              borderRadius: "50%",
              border: "none",
              background: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            onMouseOver={(e) => {
              if (index !== currentIndex) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
              }
            }}
            onMouseOut={(e) => {
              if (index !== currentIndex) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
              }
            }}
          />
        ))}
      </div>

      {/* Upload area (for future admin functionality) */}
      <div style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "8px",
        padding: "0.5rem",
        fontSize: "0.75rem",
        color: "#6b7280",
        pointerEvents: "none",
      }}>
        📷 {images.length} fotos
      </div>
    </div>
  );
}