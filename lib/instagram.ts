export type InstagramPost = {
  id: string;
  image: string;
  href: string;
  alt: string;
  caption?: string;
};

const instagramProfile = "https://www.instagram.com/threadsandlatte/";

export const fallbackInstagramPosts: InstagramPost[] = [
  {
    id: "fallback-1",
    image: "https://threadsandlatte.com/cdn/shop/files/IMG_6172_70bf4632-c358-4ef2-8544-2e50210a6bbb.jpg?v=1750079928",
    href: instagramProfile,
    alt: "Threads & Latte community look by the water",
  },
  {
    id: "fallback-2",
    image: "https://threadsandlatte.com/cdn/shop/files/IMG_0827.webp?v=1750080002",
    href: instagramProfile,
    alt: "Threads & Latte community look in the city",
  },
  {
    id: "fallback-3",
    image: "https://threadsandlatte.com/cdn/shop/files/IMG_8859.webp?v=1750079258",
    href: instagramProfile,
    alt: "Threads & Latte pink occasion look",
  },
  {
    id: "fallback-4",
    image: "https://threadsandlatte.com/cdn/shop/files/Untitled_design.zip_-_8_645e6148-37f8-4837-89e8-7b8940f07f87.png?v=1750767713",
    href: instagramProfile,
    alt: "Threads & Latte blue co-ord by the beach",
  },
];
