import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans(
  { subsets: ["latin"], 
    variable:'--font-ork-sans',
    weight: ['400','600', '700']

  });

export const metadata: Metadata = {
  title: "Learning Pro",
  description: "Realtime Collaberative learning and Notetaking Using Fabric.js and LiveBlocks for realtime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className={`${workSans.className} bg-primary-grey-200 p-`}>
          <Room>            
            {children}
          </Room>
        </body>
    </html>
  );
}
 