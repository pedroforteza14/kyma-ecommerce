import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KYMA | Moda femenina",
  description: "Ropa femenina con estilo y personalidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${geist.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
