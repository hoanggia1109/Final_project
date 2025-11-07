'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from 'next/navigation';
import BootstrapClient from './BootstrapClient';
import Header from './component/Header';
import HomeButton from './component/HomeButton';
import Footer from './component/Footer';
// import DebugAuth from './component/DebugAuth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Các trang không hiển thị Header và Footer
  const noLayoutPages = ['/login', '/register', '/auth'];
  const isNoLayoutPage = noLayoutPages.includes(pathname);

  return (
    <html lang="en">
      <head>
        {/* Bootstrap Icons CDN Backup */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <BootstrapClient />
        {!isNoLayoutPage && <Header />}
        {children}
        {!isNoLayoutPage && <Footer />}
        {!isNoLayoutPage && <HomeButton />}
        {/* <DebugAuth /> */}
      </body>
    </html>
  );
}
