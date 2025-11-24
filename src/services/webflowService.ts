import { Story } from '../types';
import { MOCK_STORIES } from './geminiService';

// Webflow API Response Types
interface WebflowImage {
    url: string;
    alt?: string;
}

interface WebflowItem {
    id: string;
    fieldData: {
        name: string;
        slug: string;
        'main-image'?: WebflowImage; // Adjust based on actual field name
        'category'?: string;         // Adjust based on actual field name
        'short-description'?: string; // Adjust based on actual field name
    };
}

interface WebflowResponse {
    items: WebflowItem[];
}

// Configuration
// NOTE: Calling api.webflow.com directly from the browser will fail due to CORS.
// The recommended approach for static sites is to create a page in Webflow (e.g., /stories-json)
// that renders the collection as a JSON object, and fetch that URL instead.
const WEBFLOW_ENDPOINT = 'https://protagonistink.webflow.io/stories-json';

export const fetchWebflowStories = async (): Promise<Story[]> => {
    try {
        console.log('Fetching stories from:', WEBFLOW_ENDPOINT);
        const response = await fetch(WEBFLOW_ENDPOINT);

        if (!response.ok) {
            throw new Error(`Failed to fetch stories: ${response.statusText}`);
        }

        const data: WebflowResponse = await response.json();

        if (!data.items) {
            console.warn('No items found in Webflow response');
            return MOCK_STORIES;
        }

        // Map Webflow items to our Story type
        return data.items.map((item) => ({
            id: item.id,
            title: item.fieldData.name,
            category: item.fieldData.category || 'Featured Story', // Fallback
            imageUrl: item.fieldData['main-image']?.url || 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image',
            body: item.fieldData['short-description'] || '',
        })).slice(0, 3); // Limit to 3 stories

    } catch (error) {
        console.error('Error fetching Webflow stories:', error);
        // Fallback to mock stories so the UI doesn't break
        return MOCK_STORIES;
    }
};
