// app/page.tsx
"use client";

import { useState } from "react";
import ImageCarousel from "./(components)/ImageCarousel";
import LoginForm from "./(components)/LoginForm";

export default function Home() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Rabbiits Capital";
  const welcomeText = process.env.NEXT_PUBLIC_WELCOME_TEXT || "Bienvenido a la plataforma líder en inversiones inmobiliarias";
  const descriptionText = process.env.NEXT_PUBLIC_DESCRIPTION_TEXT || "Conectamos inversionistas con las mejores oportunidades del mercado inmobiliario";

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      padding: "2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    }}>
      <div className="landing-grid" style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        alignItems: "center",
        width: "100%",
      }}>
        {/* Left side - Welcome Banner and Login */}
        <div style={{ color: "white" }}>
          {/* Banner Section */}
          <div style={{ marginBottom: "3rem" }}>
            <h1 className="landing-title" style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}>
              {companyName}
            </h1>
            <p className="landing-subtitle" style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              opacity: 0.9,
            }}>
              {welcomeText}
            </p>
            <p style={{
              fontSize: "1.1rem",
              opacity: 0.8,
              lineHeight: "1.6",
            }}>
              {descriptionText}
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Right side - Image Carousel */}
        <div className="carousel-container">
          <ImageCarousel />
        </div>
      </div>
    </main>
  );
}
