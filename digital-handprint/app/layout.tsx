// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Digital Handprint",
  description: "Kecilkan jejak digitalmu demi bumi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {/* Konten langsung dirender tanpa template tambahan */}
        {children}
      </body>
    </html>
  );
}