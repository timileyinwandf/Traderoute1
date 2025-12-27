# WordPress Iframe Embedding Guide

This guide explains how to embed the Traderoute calculators in WordPress without double scrollbars.

## 🎯 Goal

- **No internal iframe scrolling** - WordPress handles all scrolling
- **Auto-resizing** - Iframe height adjusts to content automatically
- **Mobile responsive** - Works on all screen sizes (desktop, tablet, mobile)
- **Seamless experience** - Feels like native WordPress content

---

## ✅ What's Already Implemented (Vite Project)

The following changes have been made to this Vite project:

### 1. Auto-Height Hook
**File**: `src/hooks/useIframeHeight.ts`

This hook automatically sends height updates to WordPress whenever content changes.

### 2. Calculator Integration
**File**: `src/pages/TravelVsLocalCalculator.tsx`

The hook is imported and used:
```tsx
import { useIframeHeight } from "@/hooks/useIframeHeight";

const TravelVsLocalCalculator = () => {
  const [results, setResults] = useState<any>(null);
  
  // Sends height updates when results change
  useIframeHeight([results]);
  
  // ... rest of component
};
```

### 3. Iframe Detection
**File**: `src/App.tsx`

Automatically detects when running in an iframe and prevents internal scrolling:
```tsx
useEffect(() => {
  if (window.self !== window.top) {
    document.documentElement.classList.add('iframe-embedded');
  }
}, []);
```

### 4. Scroll Prevention CSS
**File**: `src/index.css`

```css
html.iframe-embedded,
html.iframe-embedded body {
  overflow: hidden !important;
  height: auto !important;
  min-height: 0 !important;
}
```

### 5. Vercel Headers
**File**: `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors *"
        }
      ]
    }
  ]
}
```

This allows the site to be embedded in any iframe.

---

## 🚀 How to Deploy

1. **Commit and push changes to your repository**:
   ```bash
   git add .
   git commit -m "Add iframe embedding support"
   git push
   ```

2. **Deploy to Vercel**:
   - Push to main branch (auto-deploys if connected)
   - Or manually deploy via Vercel dashboard

3. **Note your deployment URL**:
   - Example: `https://your-project.vercel.app`

---

## 📋 WordPress Implementation

### Step 1: Add Global JavaScript (One Time Setup)

Add this script **ONCE** to your WordPress site. You can add it to:
- Theme's `footer.php` (before `</body>`)
- A site-wide custom HTML block
- Using a plugin like "Insert Headers and Footers"

```html
<script>
(function() {
  'use strict';
  
  // Listen for height messages from iframes
  window.addEventListener('message', function(event) {
    // Optional: Validate origin for security
    // if (event.origin !== 'https://your-project.vercel.app') return;
    
    if (event.data && event.data.type === 'IFRAME_HEIGHT') {
      // Find all Traderoute iframes and update their height
      var iframes = document.querySelectorAll('iframe[src*="vercel.app"]');
      
      iframes.forEach(function(iframe) {
        // Match iframe by path if multiple calculators on same page
        if (!event.data.path || iframe.src.includes(event.data.path)) {
          iframe.style.height = event.data.height + 'px';
        }
      });
    }
  });
})();
</script>
```

### Step 2: Embed Calculators on Any Page

#### Travel vs Local Calculator
```html
<iframe
  src="https://your-project.vercel.app/travel-vs-local-calculator"
  style="width:100%; border:none; min-height:600px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Travel vs Local Calculator"
></iframe>
```

#### Trade Salary Calculator
```html
<iframe
  src="https://your-project.vercel.app/trade-salary-calculator"
  style="width:100%; border:none; min-height:500px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Trade Salary Calculator"
></iframe>
```

#### Cost of Living Calculator
```html
<iframe
  src="https://your-project.vercel.app/cost-of-living-calculator"
  style="width:100%; border:none; min-height:700px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Cost of Living Calculator"
></iframe>
```

### Key Attributes Explained:

- `src` - Your Vercel deployment URL + calculator path
- `style="width:100%"` - Makes iframe responsive
- `style="border:none"` - Removes iframe border
- `style="min-height:600px"` - Initial height before auto-resize
- `scrolling="no"` - Prevents internal scrollbar
- `frameborder="0"` - Removes border (older browsers)
- `title` - Accessibility for screen readers

---

## 🎨 Optional: WordPress Shortcode (Advanced)

For easier management, create a shortcode in `functions.php`:

```php
/**
 * Shortcode to embed Traderoute calculators
 * Usage: [traderoute_calculator page="travel-vs-local"]
 */
function traderoute_calculator_shortcode($atts) {
    // Set default attributes
    $atts = shortcode_atts(array(
        'page' => 'travel-vs-local-calculator',
        'url' => 'https://your-project.vercel.app',
        'min-height' => '600'
    ), $atts);
    
    // Build iframe URL
    $iframe_url = trailingslashit($atts['url']) . $atts['page'];
    
    // Return iframe HTML
    return sprintf(
        '<iframe src="%s" style="width:100%%; border:none; min-height:%spx; display:block;" scrolling="no" frameborder="0" title="Traderoute Calculator"></iframe>',
        esc_url($iframe_url),
        esc_attr($atts['min-height'])
    );
}
add_shortcode('traderoute_calculator', 'traderoute_calculator_shortcode');
```

#### Then use in WordPress editor:

```
[traderoute_calculator page="travel-vs-local-calculator"]
[traderoute_calculator page="trade-salary-calculator" min-height="500"]
[traderoute_calculator page="cost-of-living-calculator" min-height="700"]
```

---

## 🧪 Testing Checklist

### Before Deploying:

1. **Local Test**:
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:8080/travel-vs-local-calculator`
   - Check that page loads correctly
   - Check console for errors

2. **Create Test HTML File**:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Iframe Test</title>
   </head>
   <body style="padding: 20px;">
     <h1>Test Page</h1>
     <p>This simulates WordPress.</p>
     
     <iframe
       id="test-iframe"
       src="http://localhost:8080/travel-vs-local-calculator"
       style="width:100%; border:1px solid #ccc;"
       scrolling="no"
     ></iframe>
     
     <script>
       window.addEventListener('message', (e) => {
         if (e.data?.type === 'IFRAME_HEIGHT') {
           document.getElementById('test-iframe').style.height = e.data.height + 'px';
           console.log('Height updated to:', e.data.height + 'px');
         }
       });
     </script>
   </body>
   </html>
   ```
   - Open this file in browser
   - Check that iframe resizes automatically
   - Try interacting with calculator

### After Deploying to Vercel:

1. **Direct Access Test**:
   - Visit `https://your-project.vercel.app/travel-vs-local-calculator`
   - Should work normally

2. **DevTools Network Check**:
   - Open DevTools → Network tab
   - Look at response headers
   - Should see: `Content-Security-Policy: frame-ancestors *`
   - Should NOT see: `X-Frame-Options: DENY`

3. **WordPress Test**:
   - Add iframe to a WordPress page
   - View on desktop
   - View on mobile (DevTools device toolbar)
   - Check for:
     - ✅ Only ONE scrollbar (WordPress, not iframe)
     - ✅ Iframe height adjusts when interacting
     - ✅ No content cut off
     - ✅ Responsive on mobile

---

## 🐛 Troubleshooting

### Problem: Double scrollbars appear

**Cause**: JavaScript not running or CSS not applied

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify the global script is added to WordPress
3. Verify `scrolling="no"` attribute is on iframe
4. Clear WordPress cache (if using caching plugin)

### Problem: Iframe shows "Refused to display"

**Cause**: Headers blocking iframe embedding

**Solutions**:
1. Check `vercel.json` file exists
2. Redeploy to Vercel
3. Check DevTools → Network → Response Headers
4. Should see `Content-Security-Policy: frame-ancestors *`

### Problem: Iframe height doesn't adjust

**Cause**: Message listener not working

**Solutions**:
1. Check browser console for messages: `console.log(event.data)`
2. Verify the global script is loaded (view page source)
3. Check that `useIframeHeight` hook is imported
4. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

### Problem: Content appears cut off on mobile

**Cause**: Fixed min-height or viewport issues

**Solutions**:
1. Remove or reduce `min-height` value
2. Check calculator has responsive design
3. Test in actual mobile device, not just DevTools

### Problem: Iframe is blank or shows 404

**Cause**: Incorrect URL or route

**Solutions**:
1. Verify deployment URL is correct
2. Check route exists in `App.tsx`
3. Visit URL directly to test
4. Check for typos in path

---

## 🔒 Security Considerations

### Current Setup: `frame-ancestors *`

**Allows**: Any website to embed your calculators

**Good for**:
- Public tools/calculators
- Multiple WordPress sites
- No login/sensitive data

### Alternative: Restrict to Specific Domains

If you want to limit embedding to specific domains only:

**Update `vercel.json`**:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors https://yourwordpresssite.com https://anotherdomain.com"
        }
      ]
    }
  ]
}
```

**Update WordPress script** to validate origin:
```javascript
window.addEventListener('message', function(event) {
  // Validate origin
  if (event.origin !== 'https://your-project.vercel.app') return;
  
  // ... rest of code
});
```

---

## 📱 Responsive Design Tips

### Adjust min-height by screen size:

```html
<style>
  .traderoute-iframe {
    width: 100%;
    border: none;
    display: block;
    min-height: 700px;
  }
  
  @media (max-width: 768px) {
    .traderoute-iframe {
      min-height: 500px;
    }
  }
</style>

<iframe 
  class="traderoute-iframe"
  src="https://your-project.vercel.app/travel-vs-local-calculator"
  scrolling="no"
></iframe>
```

---

## 🔄 Adding More Calculators

To add the iframe functionality to other calculator pages:

1. **Import the hook**:
   ```tsx
   import { useIframeHeight } from "@/hooks/useIframeHeight";
   ```

2. **Use in component**:
   ```tsx
   const YourCalculator = () => {
     const [someState, setSomeState] = useState(null);
     
     // Pass any state that affects content height
     useIframeHeight([someState]);
     
     return (
       // ... your component
     );
   };
   ```

3. **Deploy and use same WordPress setup** - it automatically works!

---

## 📊 URL Parameters (Optional)

You can pre-fill calculator values via URL parameters:

```html
<iframe
  src="https://your-project.vercel.app/travel-vs-local-calculator?local=35"
  style="width:100%; border:none;"
  scrolling="no"
></iframe>
```

The calculator already reads `local` from URL parameters (see `TravelVsLocalCalculator.tsx`).

---

## 🎉 Summary

### What You Get:

✅ **No double scrollbars** on any device  
✅ **Auto-resizing** iframes  
✅ **Native WordPress feel**  
✅ **Mobile responsive**  
✅ **Easy to embed** anywhere  
✅ **Works with multiple calculators**  
✅ **Future-proof** for new pages  

### Support:

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all steps in Testing Checklist
3. Check browser console for errors
4. Test URL directly before embedding

---

**Last Updated**: December 27, 2025
