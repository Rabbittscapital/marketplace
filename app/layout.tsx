import "./globals.css";
import Providers from "./(components)/Providers";

export const metadata = { title: "Rabbiits Capital – Brokers" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{background:"#f6f8fb"}}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
