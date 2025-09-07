# Public Assets

## Hero Background Image

To add your beauty products background image:

1. **Save your image** as `beauty-hero-bg.jpg` in this `public` folder
2. **Recommended dimensions**: 1920x1080 pixels or larger
3. **File format**: JPG, PNG, or WebP
4. **File name**: Must be exactly `beauty-hero-bg.jpg`

## Current Setup

The hero section is configured to use:
- **Image path**: `/beauty-hero-bg.jpg`
- **Background size**: Cover (fills entire section)
- **Background position**: Center
- **Overlay**: Dark overlay (40% opacity) for text readability

## Alternative Image Names

If you want to use a different filename, update the `backgroundImage` style in `src/pages/HomePage.jsx`:

```jsx
style={{
    backgroundImage: `url('/your-image-name.jpg')`
}}
```

## Image Optimization Tips

- Use high-quality images (1920x1080 or larger)
- Optimize file size for web (under 500KB recommended)
- Consider using WebP format for better compression
