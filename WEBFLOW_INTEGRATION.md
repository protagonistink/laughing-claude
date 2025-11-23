# Webflow Integration Guide

## Step 1: Build Your React App

In your `collins-menu` folder:

```bash
npm install
npm run build
```

This creates the `dist/` folder with `assets/index.js` and `assets/index.css`.

---

## Step 2: Upload to Netlify

1. Go to your Netlify dashboard: https://app.netlify.com/projects/protagonist-ink
2. Drag and drop the entire `dist/` folder to deploy
3. Copy your live URL (e.g., `https://protagonist-ink.netlify.app`)

---

## Step 3: Webflow Setup

### A. Remove Webflow's Native Navbar Interactions

1. In Webflow Designer, select your hamburger button (`.w-nav-button`)
2. In the **Interactions** panel (right side), **DELETE** any click interactions
3. Or better: Replace the entire Webflow Navbar with a custom div structure

### B. Create the Root Container

1. Add a **Div Block** to your page
2. Give it the ID: `root`
3. Set these styles:
   - **Position:** Fixed
   - **Width:** 100%
   - **Height:** 100vh
   - **Top:** 0
   - **Left:** 0
   - **Z-index:** 9999
4. ⚠️ **Important:** Leave it empty - React will inject content here

### C. Add Custom Hamburger (If Needed)

If you deleted the Webflow navbar, create a simple hamburger:

1. Add a **Button** or **Link Block** in your header
2. Give it the class: `hamburger-trigger` (or any custom class)
3. Style it as your hamburger icon

---

## Step 4: Add Custom Code to Webflow

Go to **Project Settings → Custom Code**

### In the `<head>` section:

```html
<link rel="stylesheet" href="https://protagonist-ink.netlify.app/assets/index.css">
```

Replace `https://protagonist-ink.netlify.app` with your actual Netlify URL.

---

### Before `</body>` section:

```html
<!-- React App Module -->
<script type="module" src="https://protagonist-ink.netlify.app/assets/index.js"></script>

<!-- Webflow Hamburger Integration -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Find hamburger button - adjust selector to match your element
    const hamburger = document.querySelector('.menu-burger') ||
                      document.querySelector('.w-nav-button') ||
                      document.querySelector('.hamburger-trigger') ||
                      document.querySelector('[data-nav-trigger]');

    if (!hamburger) {
      console.error('❌ Hamburger button not found. Check your selector.');
      return;
    }

    console.log('✅ Hamburger found:', hamburger);

    // Trigger React overlay on click
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      // Dispatch custom event that React listens to
      const event = new CustomEvent('toggleMenu', {
        detail: { isOpen: true }
      });
      window.dispatchEvent(event);

      console.log('🎬 Menu opened');
    });
  });
</script>
```

⚠️ **Important:** Update the Netlify URL to match your deployment!

---

## Step 5: Publish and Test

1. **Publish** your Webflow site
2. Open it in a browser
3. Open **DevTools** (F12) → **Console** tab
4. Click the hamburger
5. You should see:
   - `✅ Hamburger found: [object]`
   - `🎬 Menu opened`
6. The cinematic overlay should appear!

---

## Troubleshooting

### Issue: Nothing happens when I click

**Check:**
1. Open Console (F12) - do you see the `✅ Hamburger found` message?
   - ❌ **No:** Your selector is wrong. Inspect your hamburger element and update the selector in the script
   - ✅ **Yes:** Continue to step 2

2. Do you see `🎬 Menu opened` when you click?
   - ❌ **No:** Click event not firing. Check if Webflow interactions are still active (remove them)
   - ✅ **Yes:** Continue to step 3

3. Check for errors in Console
   - `Failed to fetch` → Your Netlify URL is wrong
   - `root element not found` → Add the `<div id="root">` container

### Issue: Styles look broken

- Make sure the CSS `<link>` is in the `<head>`, not the footer
- Verify your Netlify URL ends with `/assets/index.css`
- Clear your browser cache

### Issue: Hamburger opens Webflow nav AND React overlay

- You still have Webflow interactions active
- Remove all interactions from the hamburger button
- Or add `e.stopPropagation()` in the script (already included above)

---

## Custom Hamburger Selector

If your hamburger has a different class or ID, update this line:

```javascript
const hamburger = document.querySelector('.YOUR-CUSTOM-CLASS');
```

Common selectors:
- `.w-nav-button` - Webflow default
- `#hamburger` - Custom ID
- `[data-nav="trigger"]` - Custom data attribute

---

## Need Help?

1. Share your Webflow **published URL**
2. Share the **DevTools Console** output
3. Confirm your **Netlify deployment URL**
