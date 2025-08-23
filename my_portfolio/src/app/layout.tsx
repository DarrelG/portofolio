
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import './Styles/index.css';
import Image from 'next/image';
import Providers from './Views/components/Providers'

export const metadata: Metadata = {
  title: "Darrel's Portfolio",
  description: "This is my portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body className="min-h-screen flex flex-col antialiased">
        <div className="Header mx-auto rounded-b-3xl bg-opacity-50">
          <div className="flex justify-between items-center w-full">
            <div className="nav flex gap-[150px]">
              <Link href="/"><div>Home</div></Link>

              <Link href="/Views/RecentWork"><div>Recent Work</div></Link>

              <Link href="/Views/GetInTouch"><div>Get In Touch</div></Link>
            </div>

            <div className="flex space-x-5 images">
              <a href="https://www.linkedin.com/in/darrel-gautama-4304042b4/" target="_blank"><Image src="/fi-xnsuxx-linkedin.png" alt="Logo" width={30} height={30} /></a>
              <a href="https://github.com/DarrelG" target="_blank"><Image src="/github.png" alt="Logo" width={30} height={30} /></a>
              <a href="https://www.instagram.com/darrel06_/" target="_blank"><Image src="/insta.png" alt="Logo" width={30} height={30} /></a>
            </div>
          </div>

        </div>

        <main className="flex-grow"><Providers> {children} </Providers></main>
        <br />
        
        <div className="mt-auto text-center w-screen p-10 footer footer">
          <hr className="w-3/5 m-auto" />
          <br />
          Darrel Gautama - 2025
        </div>
      </body>
    </html>
  );
}