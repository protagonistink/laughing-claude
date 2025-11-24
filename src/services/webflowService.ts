import { Story } from '../types';

export interface WebflowItem {
  id: string;
  name: string;
  slug: string;
  'featured-image'?: {
    url: string;
  };
  'post-summary'?: string;
  category?: string;
  _archived: boolean;
  _draft: boolean;
}

export interface WebflowResponse {
  items: WebflowItem[];
  count: number;
  limit: number;
  offset: number;
  total: number;
}

/**
 * Fetch blog posts from Webflow CMS
 * Falls back to empty array if credentials are missing or request fails
 */
export async function fetchWebflowStories(): Promise<Story[]> {
  const apiToken = import.meta.env.VITE_WEBFLOW_API_TOKEN;
  const collectionId = import.meta.env.VITE_WEBFLOW_COLLECTION_ID;

  if (!apiToken || !collectionId) {
    console.warn('Webflow API credentials not found. Set VITE_WEBFLOW_API_TOKEN and VITE_WEBFLOW_COLLECTION_ID in .env');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.webflow.com/collections/${collectionId}/items`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'accept-version': '1.0.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.status} ${response.statusText}`);
    }

    const data: WebflowResponse = await response.json();

    // Filter out archived and draft posts, then map to Story format
    const stories: Story[] = data.items
      .filter((item) => !item._archived && !item._draft)
      .map((item) => ({
        id: item.id,
        title: item.name,
        category: item.category || 'FEATURED STORY',
        imageUrl: item['featured-image']?.url || '',
        body: item['post-summary'],
      }));

    console.log(`✅ Fetched ${stories.length} stories from Webflow CMS`);
    return stories;
  } catch (error) {
    console.error('❌ Error fetching Webflow stories:', error);
    return [];
  }
}
