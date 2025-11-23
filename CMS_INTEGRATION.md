# Webflow CMS Integration Guide

## Overview

This guide shows you how to fetch blog posts from your Webflow CMS and display them as story cards in the overlay menu.

---

## Option 1: Webflow CMS API (Recommended)

### Step 1: Get Your API Credentials

1. Go to your Webflow project settings
2. Navigate to **Integrations** → **API Access**
3. Generate an API token
4. Copy your **Site ID** and **Collection ID** for your blog

### Step 2: Create Environment Variable

In your `collins-menu` folder, create a `.env` file:

```bash
VITE_WEBFLOW_API_TOKEN=your_api_token_here
VITE_WEBFLOW_COLLECTION_ID=your_collection_id_here
```

### Step 3: Create CMS Service

Create `src/services/webflowService.ts`:

```typescript
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  'featured-image': {
    url: string;
  };
  'post-summary': string;
  _archived: boolean;
  _draft: boolean;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const apiToken = import.meta.env.VITE_WEBFLOW_API_TOKEN;
  const collectionId = import.meta.env.VITE_WEBFLOW_COLLECTION_ID;

  if (!apiToken || !collectionId) {
    console.warn('Webflow API credentials not found, using sample data');
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
      throw new Error(`Webflow API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Filter out archived and draft posts
    return data.items.filter(
      (post: BlogPost) => !post._archived && !post._draft
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}
```

### Step 4: Update App.tsx

Replace the `sampleStories` section in `src/App.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { X, Linkedin, Instagram } from 'lucide-react';
import StoryCard from './components/StoryCard';
import type { Story } from './types';
import { fetchBlogPosts, type BlogPost } from './services/webflowService';

// Fallback data if API fails
const fallbackStories: Story[] = [
  {
    id: '1',
    title: 'Sample Story',
    body: 'Featured Story',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [stories, setStories] = useState<Story[]>(fallbackStories);
  const [loading, setLoading] = useState(false);

  // Fetch blog posts when overlay opens
  useEffect(() => {
    if (isOpen && stories === fallbackStories) {
      setLoading(true);
      fetchBlogPosts()
        .then((posts) => {
          const mappedStories: Story[] = posts.map((post) => ({
            id: post.id,
            title: post.title,
            body: post['post-summary'] || 'Featured Story',
            imageUrl: post['featured-image']?.url || '',
          }));

          if (mappedStories.length > 0) {
            setStories(mappedStories);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch stories:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Rest of your component...
}
```

---

## Option 2: Static Export from Webflow

If you don't want to use the API, you can export data statically:

### Step 1: Export CMS Data

1. In Webflow Designer, go to **CMS** → your blog collection
2. Click **Export** (top right)
3. Download the CSV file

### Step 2: Convert to JSON

Create `src/data/blogPosts.ts`:

```typescript
import type { Story } from '../types';

export const blogPosts: Story[] = [
  {
    id: '1',
    title: 'Your Blog Post Title',
    body: 'Featured Story',
    imageUrl: 'https://your-webflow-site.com/path-to-feature-image.jpg',
  },
  {
    id: '2',
    title: 'Another Post',
    body: 'Featured Story',
    imageUrl: 'https://your-webflow-site.com/path-to-feature-image-2.jpg',
  },
  // Add more posts...
];
```

### Step 3: Import in App.tsx

```typescript
import { blogPosts } from './data/blogPosts';

// Then use:
const [stories] = useState<Story[]>(blogPosts);
```

**Note:** You'll need to manually update this file whenever you add new blog posts.

---

## Option 3: Fetch from Published Webflow Site

If your blog is published, you can scrape it (requires CORS proxy):

### Using Webflow's Collection List API endpoint

```typescript
export async function fetchPublishedBlogPosts(): Promise<Story[]> {
  try {
    // This requires your site to expose a JSON feed
    // You can create this in Webflow using custom code
    const response = await fetch('https://your-site.webflow.io/blog.json');
    const posts = await response.json();

    return posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      body: post.summary || 'Featured Story',
      imageUrl: post.image || '',
    }));
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}
```

---

## Customizing Story Cards for Blog Posts

### Update StoryCard Component

The current `StoryCard.tsx` already has:
- ✅ 2:3 aspect ratio (movie poster style)
- ✅ Feature image support
- ✅ Hover effects

You can enhance it further:

```typescript
// src/components/StoryCard.tsx
import { ArrowRight } from 'lucide-react';
import type { Story } from '../types';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <a
      href={`/blog/${story.slug || story.id}`} // Link to blog post
      className="group flex items-center gap-6 hover:opacity-80 transition-opacity duration-300"
    >
      {/* Movie Poster Style Image - 2:3 aspect ratio */}
      <div className="flex-shrink-0 w-32 h-48 overflow-hidden rounded-lg shadow-lg">
        {story.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1E3F66] to-[#C83C2F] flex items-center justify-center">
            <span className="text-[#F9F9F9] text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs text-[#F9F9F9]/60 mb-2 uppercase tracking-wide"
          style={{ fontFamily: 'Karla, sans-serif' }}
        >
          {story.body}
        </p>
        <h3
          className="text-xl font-light leading-tight"
          style={{ fontFamily: 'Karla, sans-serif' }}
        >
          {story.title}
        </h3>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={24}
        className="flex-shrink-0 text-[#F9F9F9] group-hover:translate-x-2 transition-transform duration-300"
      />
    </a>
  );
}
```

---

## Testing

### Test with Sample Data

1. Build: `npm run build`
2. Deploy to Netlify
3. Open overlay in Webflow
4. You should see sample stories

### Test with Real CMS Data

1. Add `.env` with your API credentials
2. Run `npm run dev` locally
3. Open console and trigger overlay:
   ```javascript
   window.dispatchEvent(new CustomEvent('toggleMenu', { detail: { isOpen: true } }));
   ```
4. Check console for API calls
5. Verify stories load from CMS

---

## Troubleshooting

### API returns empty array

- Check your API token is valid
- Verify Collection ID is correct
- Make sure posts are **published** (not draft or archived)

### CORS errors

- Webflow API doesn't have CORS restrictions with proper auth headers
- If using Option 3, you may need a CORS proxy

### Images not loading

- Verify `featured-image` field name matches your Webflow CMS
- Check that images are published with the post
- Use browser DevTools → Network tab to see image requests

### Loading is slow

- Add a loading spinner:
  ```typescript
  {loading && <p>Loading stories...</p>}
  {!loading && stories.map((story) => <StoryCard ... />)}
  ```

---

## Next Steps

1. ✅ Choose integration method (API recommended)
2. ✅ Add credentials to `.env`
3. ✅ Create `webflowService.ts`
4. ✅ Update `App.tsx` to fetch posts
5. ✅ Test locally then deploy
6. ✅ Verify in Webflow published site

---

## Additional Resources

- [Webflow CMS API Documentation](https://developers.webflow.com/reference/cms-api)
- [Webflow Collection Items Endpoint](https://developers.webflow.com/reference/list-collection-items)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
