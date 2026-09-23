import LoaderWrapper from "@/components/common/LoaderWrapper";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../provider/authProvider";
import Providers from "../provider/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <AuthProvider>
            <Providers>
              <LoaderWrapper />
              {children}
            </Providers>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
