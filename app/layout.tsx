import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mimo & Arte | Produtos personalizados",
  description: "Presentes e produtos personalizados feitos com carinho. Você imagina, a Mimo & Arte cria.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
