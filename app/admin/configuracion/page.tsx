"use client";

import { useState } from "react";

export default function SiteConfiguration() {
  const [config, setConfig] = useState({
    companyName: "Rabbiits Capital",
    welcomeText: "Bienvenido a la plataforma líder en inversiones inmobiliarias",
    descriptionText: "Conectamos inversionistas con las mejores oportunidades del mercado inmobiliario",
    logoUrl: "",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    contactEmail: "info@rabbiitscapital.com",
    phone: "+1 (555) 123-4567",
    address: "123 Financial District, Suite 456",
    socialMedia: {
      linkedin: "",
      facebook: "",
      twitter: "",
      instagram: ""
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const saveConfiguration = () => {
    // In a real implementation, this would save to a database or API
    console.log("Saving configuration:", config);
    alert("Configuración guardada exitosamente!");
  };

  const resetToDefaults = () => {
    setConfig({
      companyName: "Rabbiits Capital",
      welcomeText: "Bienvenido a la plataforma líder en inversiones inmobiliarias",
      descriptionText: "Conectamos inversionistas con las mejores oportunidades del mercado inmobiliario",
      logoUrl: "",
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
      contactEmail: "info@rabbiitscapital.com",
      phone: "+1 (555) 123-4567",
      address: "123 Financial District, Suite 456",
      socialMedia: {
        linkedin: "",
        facebook: "",
        twitter: "",
        instagram: ""
      }
    });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Configuración del Sitio</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Personaliza el contenido y la apariencia de la página principal.
      </p>

      <div style={{ display: "grid", gap: "2rem" }}>
        {/* Branding Section */}
        <section style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          background: "#f9f9f9"
        }}>
          <h2 style={{ marginTop: 0 }}>Marca y Contenido</h2>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
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
                Texto de Bienvenida
              </label>
              <input
                type="text"
                value={config.welcomeText}
                onChange={(e) => handleInputChange("welcomeText", e.target.value)}
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
                Descripción
              </label>
              <textarea
                value={config.descriptionText}
                onChange={(e) => handleInputChange("descriptionText", e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "vertical"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                URL del Logo (opcional)
              </label>
              <input
                type="url"
                value={config.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                placeholder="https://ejemplo.com/logo.png"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          background: "#f9f9f9"
        }}>
          <h2 style={{ marginTop: 0 }}>Colores de la Marca</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Color Primario
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                  style={{
                    width: "50px",
                    height: "40px",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Color Secundario
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                  style={{
                    width: "50px",
                    height: "40px",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                />
                <input
                  type="text"
                  value={config.secondaryColor}
                  onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          background: "#f9f9f9"
        }}>
          <h2 style={{ marginTop: 0 }}>Información de Contacto</h2>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Email de Contacto
              </label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
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
                Teléfono
              </label>
              <input
                type="tel"
                value={config.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
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
                Dirección
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          background: "#f9f9f9"
        }}>
          <h2 style={{ marginTop: 0 }}>Redes Sociales</h2>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            {Object.entries(config.socialMedia).map(([platform, url]) => (
              <div key={platform}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                  placeholder={`https://${platform}.com/empresa`}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={resetToDefaults}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Restaurar Valores por Defecto
          </button>
          <button
            onClick={saveConfiguration}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              background: "#667eea",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Guardar Configuración
          </button>
        </div>
      </div>

      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#fff3cd",
        borderRadius: "8px",
        border: "1px solid #ffeaa7"
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#856404" }}>⚠️ Nota Importante</h3>
        <p style={{ margin: 0, color: "#856404" }}>
          Los cambios de configuración se aplicarán inmediatamente al guardar. Para el entorno de producción,
          considera usar variables de entorno para estos valores en el archivo <code>.env</code>.
        </p>
      </div>
    </div>
  );
}