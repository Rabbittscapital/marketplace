"use client";

import { useState } from "react";

interface CarouselImage {
  id: number;
  url?: string;
  alt: string;
  fallback: string;
  gradient: string;
}

export default function CarouselAdmin() {
  const [images, setImages] = useState<CarouselImage[]>([
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
  ]);

  const [newImage, setNewImage] = useState<Partial<CarouselImage>>({
    url: "",
    alt: "",
    fallback: "🏠",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  });

  const addImage = () => {
    if (newImage.alt && (newImage.url || newImage.fallback)) {
      const image: CarouselImage = {
        id: Date.now(),
        url: newImage.url || undefined,
        alt: newImage.alt,
        fallback: newImage.fallback || "🏠",
        gradient: newImage.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      };
      setImages([...images, image]);
      setNewImage({
        url: "",
        alt: "",
        fallback: "🏠",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      });
    }
  };

  const removeImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
  };

  const predefinedGradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
    "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
    "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
    "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
    "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
  ];

  const commonEmojis = ["🏢", "💼", "🏠", "📈", "🏗️", "🎯", "💰", "🔑", "🌟", "📊"];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Gestionar Carousel</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Administra las imágenes del carousel en la página principal. 
        Puedes usar URLs de imágenes o emojis con gradientes como respaldo.
      </p>

      {/* Current Images */}
      <div style={{ marginBottom: "3rem" }}>
        <h2>Imágenes Actuales</h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          {images.map((image, index) => (
            <div key={image.id} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                background: image.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem"
              }}>
                {image.fallback}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{image.alt}</div>
                <div style={{ fontSize: "0.875rem", color: "#666" }}>
                  {image.url ? `URL: ${image.url.substring(0, 50)}...` : "Sin imagen URL"}
                </div>
              </div>
              <button
                onClick={() => removeImage(image.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer"
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Image */}
      <div style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "2rem",
        background: "#f9f9f9"
      }}>
        <h2>Agregar Nueva Imagen</h2>
        
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Descripción *
            </label>
            <input
              type="text"
              placeholder="Ej: Edificios modernos de oficinas"
              value={newImage.alt || ""}
              onChange={(e) => setNewImage({...newImage, alt: e.target.value})}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              URL de imagen (opcional)
            </label>
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={newImage.url || ""}
              onChange={(e) => setNewImage({...newImage, url: e.target.value})}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Emoji de respaldo
            </label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setNewImage({...newImage, fallback: emoji})}
                  style={{
                    padding: "0.5rem",
                    border: newImage.fallback === emoji ? "2px solid #667eea" : "1px solid #ddd",
                    borderRadius: "4px",
                    background: "white",
                    cursor: "pointer",
                    fontSize: "1.2rem"
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="O escribe tu propio emoji"
              value={newImage.fallback || ""}
              onChange={(e) => setNewImage({...newImage, fallback: e.target.value})}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Gradiente de fondo
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.5rem" }}>
              {predefinedGradients.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => setNewImage({...newImage, gradient})}
                  style={{
                    height: "40px",
                    border: newImage.gradient === gradient ? "3px solid #333" : "1px solid #ddd",
                    borderRadius: "4px",
                    background: gradient,
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={addImage}
          disabled={!newImage.alt}
          style={{
            background: newImage.alt ? "#667eea" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 1.5rem",
            cursor: newImage.alt ? "pointer" : "not-allowed",
            fontSize: "1rem",
            fontWeight: "500"
          }}
        >
          Agregar Imagen
        </button>
      </div>

      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#e3f2fd",
        borderRadius: "8px",
        border: "1px solid #bbdefb"
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#1565c0" }}>💡 Consejos</h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1565c0" }}>
          <li>Las imágenes con URL se mostrarán primero, con el emoji como respaldo</li>
          <li>Si no hay URL, se mostrará solo el emoji con el gradiente</li>
          <li>Las imágenes se muestran en el orden que aparecen aquí</li>
          <li>Recomendamos imágenes de al menos 800x600 píxeles</li>
        </ul>
      </div>
    </div>
  );
}