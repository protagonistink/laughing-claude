# Protagonist Ink - Cinematic Menu Overlay

A full-screen, cinematic navigation overlay for Webflow sites. Features elegant typography, smooth animations, and seamless integration with your existing Webflow hamburger menu.

## ✨ Features

- **Full-screen cinematic overlay** that appears on hamburger click
- **Two-column layout:**
  - Left: Logo (upper left), large serif nav links, "Start Your Journey" button, email signup + social icons (bottom right)
  - Right: Scrollable story cards with movie poster-style images (2:3 aspect ratio)
- **Interactive elements:**
  - "Start Your Journey" button reveals email on hover
  - LinkedIn & Instagram icons with hover effects
  - Story cards with smooth hover animations
- **Webflow CMS ready:** Pull blog posts dynamically from your Webflow collections
- **Brand colors:** Dark charcoal (#282828), Red highlights (#C83C2F)
- **Typography:** Cormorant Garamond (serif) + Karla (sans-serif)
- **Responsive design** with mobile optimizations
- **Zero dependencies on Webflow's native navbar** - works independently

---

## 🚀 Quick Start

### 1. Copy These Files to Your `collins-menu` Folder

Copy all files from this repository into your local `collins-menu` folder, **replacing** the existing files:

```
collins-menu/
├── src/
│   ├── components/
│   │   └── StoryCard.tsx       ← New!
│   ├── App.tsx                 ← Replace!
│   ├── main.tsx                ← Replace!
│   ├── types.ts                ← New!
│   └── index.css               ← Replace!
├── index.html                   ← Replace!
├── package.json                 ← Replace!
├── vite.config.ts              ← Replace!
├── tailwind.config.js          ← Replace!
├── postcss.config.js           ← Replace!
├── tsconfig.json               ← Replace!
└── tsconfig.node.json          ← Replace!
```

### 2. Install Dependencies

```bash
cd collins-menu
npm install
```

### 3. Test Locally (Optional)

```bash
npm run dev
```

Visit `http://localhost:5173` and open the browser console. Type:

```javascript
window.dispatchEvent(new CustomEvent('toggleMenu', { detail: { isOpen: true } }));
```

The overlay should appear! (The hamburger won't work locally - that's added in Webflow)

### 4. Build for Production

```bash
npm run build
```

This creates `dist/assets/index.js` and `dist/assets/index.css`.

### 5. Deploy to Netlify

1. Go to https://app.netlify.com/projects/protagonist-ink
2. Drag and drop the `dist/` folder
3. Copy your Netlify URL (e.g., `https://protagonist-ink.netlify.app`)

### 6. Integrate with Webflow

**📖 Follow the complete guide:** [WEBFLOW_INTEGRATION.md](./WEBFLOW_INTEGRATION.md)

**TL;DR:**
1. Add `<div id="root">` to your Webflow page (fixed, 100vw × 100vh, z-index 9999)
2. Add CSS link in `<head>`: `<link rel="stylesheet" href="YOUR_NETLIFY_URL/assets/index.css">`
3. Add JS before `</body>`: `<script type="module" src="YOUR_NETLIFY_URL/assets/index.js"></script>`
4. Add the custom code snippet (see [WEBFLOW_INTEGRATION.md](./WEBFLOW_INTEGRATION.md)) to connect your hamburger
5. Publish and test!

---

## 🎨 Customization

### Change Colors

Edit `src/App.tsx` and replace:
- `#282828` - Background
- `#F9F9F9` - Text
- `#C83C2F` - Red highlights
- `#1E3F66` - Blue accents

Or use Tailwind classes defined in `tailwind.config.js`:
- `bg-brand-dark`
- `text-brand-light`
- `text-brand-red`
- `bg-brand-blue`

### Change Navigation Links

Edit the array in `src/App.tsx`:

```typescript
const navLinks = ["What's our Story", 'What We Do', 'Get in Touch'];
```

### Add Your Logo

Replace the placeholder logo in `src/App.tsx` (line ~82):

```tsx
<img
  src="/path/to/your-logo.svg"
  alt="Protagonist Ink"
  className="h-8 lg:h-10"
/>
```

Upload your logo to your Netlify site or use a Webflow asset URL.

### Connect to Webflow CMS (Blog Posts)

**📖 See complete guide:** [CMS_INTEGRATION.md](./CMS_INTEGRATION.md)

The story cards are designed to pull from your Webflow blog CMS with movie poster-style images (2:3 aspect ratio).

Quick setup:
1. Get your Webflow API token
2. Add credentials to `.env`
3. Create `src/services/webflowService.ts` (see CMS guide)
4. Update `src/App.tsx` to fetch posts on load

### Add Real Story Data (Manual)

```typescript
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Your Story Title',
    body: 'Story',
    imageUrl: 'https://your-image-url.com/image.jpg',
  },
  // Add more...
];
```

Or fetch from an API:

```typescript
const [stories, setStories] = useState<Story[]>([]);

useEffect(() => {
  fetch('YOUR_API_ENDPOINT')
    .then(res => res.json())
    .then(data => setStories(data));
}, []);
```

### Add Newsletter Integration

In `src/App.tsx`, find the `handleSubmit` function:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Add your newsletter service here (Mailchimp, ConvertKit, etc.)
  fetch('YOUR_NEWSLETTER_API', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  setEmail('');
};
```

---

## 🔧 How It Works

### React Side (Your App)
- `App.tsx` has an `isOpen` state (default: `false`)
- `useEffect` listens for a `toggleMenu` custom event
- When event received, `setIsOpen(true)` → overlay appears
- Click the X button → `setIsOpen(false)` → overlay disappears

### Webflow Side (Custom Code)
- Script finds your hamburger button
- Adds click listener
- Dispatches `toggleMenu` event → React receives it → overlay opens

They communicate via **window events** - no direct connection needed!

---

## 🐛 Troubleshooting

### Hamburger does nothing when clicked

**→** See [WEBFLOW_INTEGRATION.md - Troubleshooting](./WEBFLOW_INTEGRATION.md#troubleshooting)

Quick checks:
1. Open Console (F12) - see errors?
2. Do you see `✅ Hamburger found` in console?
3. Did you remove Webflow's native interactions?
4. Is the `<div id="root">` present in the DOM?

### Styles look broken

- CSS link must be in `<head>`, not footer
- Clear browser cache
- Check Netlify URL is correct

### Overlay doesn't close

- Make sure the X button (Lucide `<X />` icon) is rendering
- Check if `handleClose` is called (add `console.log`)

---

## 📁 Project Structure

```
src/
├── components/
│   └── StoryCard.tsx       # Individual story card with image + text
├── App.tsx                 # Main overlay component
├── main.tsx                # React entry point
├── types.ts                # TypeScript interfaces
└── index.css               # Tailwind + custom styles
```

---

## 🚢 Deployment Workflow

1. Make changes in `src/`
2. `npm run build`
3. Upload `dist/` to Netlify
4. Webflow auto-loads the new files (no changes needed!)

---

## 📝 Notes

- **Vite config** forces output to `assets/index.js` and `assets/index.css` (no hashes) for easy Webflow updates
- **Fonts** loaded from Google Fonts CDN in `index.css`
- **Icons** from Lucide React (tree-shakeable)
- **No Framer Motion** in this version (keep it simple), but you can add it later

---

## 🎯 Next Steps

- [ ] Add your real content (stories, links, images)
- [ ] Connect newsletter API
- [ ] Add page transitions (Framer Motion)
- [ ] Add custom cursor with ink trail (from original spec)
- [ ] Integrate Gemini AI for dynamic content

---

## 🆘 Need Help?

1. Check [WEBFLOW_INTEGRATION.md](./WEBFLOW_INTEGRATION.md)
2. Open browser DevTools Console for errors
3. Verify Netlify deployment is live
4. Share your published Webflow URL + console output for debugging

---

Built with ❤️ for Protagonist Ink