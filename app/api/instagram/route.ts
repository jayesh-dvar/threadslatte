import { fallbackInstagramPosts, type InstagramPost } from "../../../lib/instagram";

type InstagramMedia = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
};

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return Response.json({ posts: fallbackInstagramPosts, live: false });
  }

  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink");
    url.searchParams.set("limit", "4");
    url.searchParams.set("access_token", token);

    const response = await fetch(url, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error(`Instagram request failed: ${response.status}`);

    const payload = await response.json() as { data?: InstagramMedia[] };
    const posts = (payload.data ?? [])
      .filter((post) => (post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM") && (post.media_url || post.thumbnail_url))
      .map<InstagramPost>((post, index) => ({
        id: post.id ?? `instagram-${index}`,
        image: post.media_url ?? post.thumbnail_url ?? "",
        href: post.permalink ?? "https://www.instagram.com/threadsandlatte/",
        alt: post.caption?.split("\n")[0]?.slice(0, 120) || "Threads & Latte on Instagram",
        caption: post.caption,
      }));

    return Response.json({ posts: posts.length ? posts : fallbackInstagramPosts, live: Boolean(posts.length) });
  } catch {
    return Response.json({ posts: fallbackInstagramPosts, live: false });
  }
}
