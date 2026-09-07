import type { Metadata } from "next";
import "./globals.css";
import UserProfileMenu from "./components/UserProfileMenu";

export const metadata: Metadata = {
  title: "AyushBridge",
  description:
    "Academia–Industry Competency Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <UserProfileMenu />
      </body>
    </html>
  );
}