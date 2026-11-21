import { getCollection } from 'astro:content'

const defaultTopics = ['Intune', 'Entra ID', 'Exchange Online', 'PowerShell']

export const topicSlug = (tag: string) => tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const topicUrl = (tag: string) => '/topics/' + topicSlug(tag) + '/'
export const articleUrl = (id: string) => '/articles/' + id + '/'

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(date)

export async function listArticles() {
  const articles = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft)
  return articles.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.id.localeCompare(b.id))
}

export function listTopics(articles: Awaited<ReturnType<typeof listArticles>>) {
  const topics = new Map(defaultTopics.map((tag) => [topicSlug(tag), tag]))
  for (const article of articles) {
    for (const tag of article.data.tags) {
      const slug = topicSlug(tag)
      if (slug && !topics.has(slug)) topics.set(slug, tag)
    }
  }
  return [...topics].map(([slug, label]) => ({ slug, label }))
}
