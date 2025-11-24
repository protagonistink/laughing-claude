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
        'main-image'?: WebflowImage;
        'category'?: string;
        'post-summary'?: string; // Updated from short-description
        'featured'?: boolean;
        'sort-order'?: number;
    };
}


// Configuration
// We fetch the Webflow page that renders the collection as JSON.
// Since Webflow wraps it in HTML, we must parse the text to extract the JSON.
const WEBFLOW_ENDPOINT = 'https://protagonistink.webflow.io/json-stories';

export const fetchWebflowStories = async (): Promise<Story[]> => {
    try {
        console.log('Fetching stories from:', WEBFLOW_ENDPOINT);
        const response = await fetch(WEBFLOW_ENDPOINT);

        if (!response.ok) {
            throw new Error(`Failed to fetch stories: ${response.statusText}`);
        }

        // Webflow returns HTML, so we get text first
        const htmlText = await response.text();

        // Regex to find the JSON blocks inside the w-embed divs
        // We look for the pattern: { "items": [ ... ] }
        const jsonRegex = /{\s*"items":\s*\[[\s\S]*?\]\s*}/g;
        const matches = htmlText.match(jsonRegex);

        if (!matches) {
            console.warn('No JSON data found in Webflow response');
            return MOCK_STORIES;
        }

        const allItems: WebflowItem[] = [];

        // Parse each match and aggregate items
        matches.forEach(jsonStr => {
            try {
                // Clean up any potential HTML entities if necessary (though usually script tags handle this)
                const data = JSON.parse(jsonStr);
                if (data.items && Array.isArray(data.items)) {
                    allItems.push(...data.items);
                }
            } catch (e) {
                console.error('Failed to parse JSON block:', e);
            }
        });

        if (allItems.length === 0) {
            return MOCK_STORIES;
        }

        // Map Webflow items to our Story type
        return allItems
            // Optional: Filter by 'featured' if you only want featured stories
            // .filter(item => item.fieldData.featured) 
            // Optional: Sort by 'sort-order'
            // .sort((a, b) => (a.fieldData['sort-order'] || 0) - (b.fieldData['sort-order'] || 0))
            .map((item) => ({
                id: item.id,
                title: item.fieldData.name,
                category: item.fieldData.category || 'Featured Story',
                imageUrl: item.fieldData['main-image']?.url || 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image',
                body: item.fieldData['post-summary'] || '',
            }))
            .slice(0, 3); // Limit to 3 stories

    } catch (error) {
        console.error('Error fetching Webflow stories:', error);
        // Fallback to mock stories so the UI doesn't break
        return MOCK_STORIES;
    }
};
