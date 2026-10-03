import type { Metadata, Viewport } from "next";
import { GlobalDefs } from "@/components/card/ornaments";
import { BIZ_TEXTURE_CSS } from "@/components/business/textures";
import "./fontFaces";
import "./fontVars.css";
import "./globals.css";
import "./card.css";
import "./viewer.css";
import "./app.css";
import "./business.css";
import "./biz-base.css";
import "./biz-trend.css";
import "./biz-heritage.css";
import "./biz-pro.css";
import "./wedding.css";
import "./signature.css";
import "./festival.css";

export const metadata: Metadata = {
  title: "Shubh Cards — Digital invitations that feel real",
  description: "Realistic digital wedding, engagement, griha pravesh and shop-opening invitations, plus digital business cards.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1b1410",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: BIZ_TEXTURE_CSS }} />
        <GlobalDefs />
        {children}
      </body>
    </html>
  );
}
