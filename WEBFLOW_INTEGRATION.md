# Webflow Integration Guide

## Overview
This guide shows you how to add the custom menu overlay to your live Webflow site at protagonistink.webflow.io.

## What You Need to Add

The menu is currently working on your GitHub Pages site. To make it work on Webflow, you need to add three things to your Webflow project:

### 1. **Before `</head>` Tag** - Add CSS
In Webflow: **Project Settings → Custom Code → Head Code**

```html
<!-- Menu Overlay Styles -->
<link rel="stylesheet" crossorigin href="https://protagonistink.github.io/laughing-claude/assets/index.css">
```

### 2. **Before `</body>` Tag** - Add React App and Scripts
In Webflow: **Project Settings → Custom Code → Footer Code**

```html
<!-- React App Root (the menu will render here) -->
<div id="root"></div>

<!-- Menu Overlay Script -->
<script type="module" crossorigin src="https://protagonistink.github.io/laughing-claude/assets/index.js"></script>

<!-- Hamburger Integration Script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Looking for hamburger menu...');

  // Find hamburger button - tries multiple selectors
  const hamburger = document.querySelector('.menu-burger') ||
                    document.querySelector('.w-nav-button') ||
                    document.querySelector('.hamburger-trigger') ||
                    document.querySelector('[data-nav-trigger]') ||
                    document.querySelector('.navbar-menu-button');

  if (!hamburger) {
    console.error('❌ Hamburger button not found. Available elements:', {
      menuBurgers: document.querySelectorAll('.menu-burger').length,
      wNavButtons: document.querySelectorAll('.w-nav-button').length,
      customTriggers: document.querySelectorAll('[data-nav-trigger]').length
    });
    return;
  }

  console.log('✅ Hamburger found:', hamburger);

  // Trigger React overlay on click
  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('🍔 Hamburger clicked!');

    // Dispatch custom event that React listens to
    const event = new CustomEvent('toggleMenu', {
      detail: { isOpen: true }
    });
    window.dispatchEvent(event);
  });

  // Listen for close event from React
  window.addEventListener('menuClosed', function() {
    console.log('✅ Menu closed');

    // Reset Webflow's open state
    if (hamburger.classList.contains('w--open')) {
      hamburger.classList.remove('w--open');
    }

    if (hamburger.hasAttribute('aria-expanded')) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  console.log('✅ Menu integration ready!');
});
</script>
```

## Step-by-Step Instructions

1. **Open Webflow Editor**
   - Go to your Protagonist Ink project in Webflow
   - Click the gear icon (Project Settings)

2. **Add Head Code**
   - Navigate to: **Custom Code** tab
   - Find the **Head Code** section
   - Paste the CSS link tag shown above
   - Click **Save Changes**

3. **Add Footer Code**
   - In the same Custom Code settings
   - Find the **Footer Code** section
   - Paste the entire footer code block shown above
   - Click **Save Changes**

4. **Publish Your Site**
   - Click **Publish** in the top right
   - Select **Publish to Selected Domains**
   - Wait for deployment to complete

5. **Test the Menu**
   - Visit protagonistink.webflow.io
   - Click the hamburger menu in your navbar
   - The overlay should slide down from the top
   - Click the × button to close it

## Troubleshooting

### Menu doesn't open when clicking hamburger

**Check the browser console:**
1. Right-click on the page → Inspect
2. Go to the **Console** tab
3. Click the hamburger menu
4. Look for error messages

**Common issues:**

**"Hamburger button not found"**
- The script can't find your hamburger element
- You may need to update the selector in the integration script
- Tell me what Webflow class your hamburger uses, and I'll update the script

**Script errors**
- Make sure you pasted the code in the **Footer Code** section, not the header
- Verify there are no typos in the code

### Menu opens but styling looks off

- Check that the CSS link is in the **Head Code** section
- Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check browser console for CSS loading errors

### Need to update the menu content/design

- The menu content is defined in the React app
- Any changes need to be made in this GitHub repository
- After changes, commit and push - GitHub Actions will rebuild and deploy automatically
- Webflow will automatically use the updated version (it's linked to GitHub Pages)

## Finding Your Hamburger Selector

If the menu doesn't work, you may need to identify the correct selector for your hamburger:

1. Right-click on your hamburger menu → Inspect Element
2. Look for the class names on the button element
3. Common Webflow classes: `w-nav-button`, `menu-button`, etc.
4. Update line 10 in the integration script with your selector

## Next Steps

Once this is working, you can:
- Customize the menu categories in `src/App.tsx`
- Update navigation links
- Adjust colors and styling in `tailwind.config.js`
- Add your Gemini API key for AI-generated stories (optional)

---

**Need help?** Check the browser console for debugging messages, or let me know what errors you see!
