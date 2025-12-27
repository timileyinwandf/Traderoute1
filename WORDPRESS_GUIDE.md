# WordPress Integration Guide

Quick guide to embed Traderoute calculators in WordPress without double scrollbars.

---

## Step 1: Add Global Script (One Time Only)

Add this script **ONCE** to your WordPress site. Choose one method:

### Method A: Theme Footer
Edit your theme's `footer.php` and add before `</body>`:

```html
<script>
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'IFRAME_HEIGHT') {
    var iframes = document.querySelectorAll('iframe[src*="traderoute-mu.vercel.app"]');
    iframes.forEach(function(iframe) {
      iframe.style.height = event.data.height + 'px';
    });
  }
});
</script>
```

### Method B: Plugin
Use a plugin like "Insert Headers and Footers" and paste the above script in the footer section.

---

## Step 2: Embed Calculators

Use the HTML code below on any WordPress page/post (in HTML/Code editor mode):

### Trade Salary Calculator

```html
<iframe
  src="https://traderoute-mu.vercel.app/trade-salary-calculator"
  style="width:100%; border:none; min-height:600px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Trade Salary Calculator"
></iframe>
```

### Cost of Living Calculator

```html
<iframe
  src="https://traderoute-mu.vercel.app/cost-of-living-calculator"
  style="width:100%; border:none; min-height:700px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Cost of Living Calculator"
></iframe>
```

### Travel vs Local Calculator

```html
<iframe
  src="https://traderoute-mu.vercel.app/travel-vs-local-calculator"
  style="width:100%; border:none; min-height:650px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Travel vs Local Calculator"
></iframe>
```

### Trade Quiz

```html
<iframe
  src="https://traderoute-mu.vercel.app/trade-quiz"
  style="width:100%; border:none; min-height:700px; display:block;"
  scrolling="no"
  frameborder="0"
  title="Trade Quiz"
></iframe>
```

---

## Step 3: Test

1. **Save and preview** your WordPress page
2. **Check on mobile** using your phone or DevTools
3. **Verify**: 
   - ✅ Only ONE scrollbar (WordPress page scrolls, not the iframe)
   - ✅ Calculator is fully visible
   - ✅ No content cut off

---

## Quick Troubleshooting

**Problem**: Two scrollbars appear

**Fix**: 
- Make sure the global script from Step 1 is added
- Clear WordPress cache if using a caching plugin
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

**Problem**: Iframe shows blank or error

**Fix**:
- Check the URL is correct
- Try visiting the calculator URL directly in your browser first
- Make sure you're using the HTML/Code editor, not the Visual editor

---

## Optional: WordPress Shortcode

For easier management, add this to your theme's `functions.php`:

```php
function traderoute_calculator($atts) {
    $atts = shortcode_atts(array(
        'type' => 'trade-salary-calculator',
        'height' => '600'
    ), $atts);
    
    return sprintf(
        '<iframe src="https://traderoute-mu.vercel.app/%s" style="width:100%%; border:none; min-height:%spx; display:block;" scrolling="no" frameborder="0" title="Traderoute Calculator"></iframe>',
        esc_attr($atts['type']),
        esc_attr($atts['height'])
    );
}
add_shortcode('traderoute', 'traderoute_calculator');
```

Then use in WordPress editor:

```
[traderoute type="trade-salary-calculator"]
[traderoute type="cost-of-living-calculator" height="700"]
[traderoute type="travel-vs-local-calculator" height="650"]
[traderoute type="trade-quiz" height="700"]
```

---

## That's It! 🎉

Your calculators will now:
- Auto-resize to fit content
- Work on all devices (desktop, tablet, mobile)
- Use WordPress scrolling only (no double scrollbars)
- Feel like native WordPress content
