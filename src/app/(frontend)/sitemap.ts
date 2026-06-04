import { getPublishedPosts } from '@/lib/posts'

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default async function sitemap() {
  let blogs = await getPublishedPosts().then((posts) => {
    return posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
    }))
  })

  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}