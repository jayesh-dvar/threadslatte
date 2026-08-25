import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Made-to-Order Womenswear, Made More You. | Threads & Latte",
  description: "Discover made-to-order dresses, co-ords, tops and bottoms by Threads & Latte—consciously crafted womenswear with thoughtful customisation for your style and fit.",
  openGraph: { title: "Made-to-Order Womenswear, Made More You. | Threads & Latte", description: "Contemporary womenswear with a little more personality, a lot more comfort, and thoughtful customisation built in.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
