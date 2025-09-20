import "./globals.css";
export const metadata = { title: "Rabbitts Capital – Brokers" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="es"><body style={{background:"#f6f8fb"}}>{children}</body></html>);
}
