# Video Background Setup Guide

## Overview
Your authentication screens now feature a beautiful full-screen video background with glassmorphic UI elements overlaid on top. The system includes **multi-layer overlays** to ensure perfect text readability on any video content - bright, dark, or colorful.

## Text Contrast & Readability

### Built-in Protection
The design includes multiple layers of protection to ensure text is always readable:

1. **Base Dark Gradient** (65% opacity) - Primary darkening layer
2. **Radial Gradient** - Darker edges, lighter center for depth
3. **Bottom Gradient** - Extra darkness for footer text
4. **Text Shadows** - All headlines have strong drop shadows
5. **Enhanced Backgrounds** - Feature pills have dark backgrounds with blur

This means your text will pop even on:
- ✅ Bright sunny scenes
- ✅ Colorful flower fields  
- ✅ White/light backgrounds
- ✅ High-contrast landscapes
- ✅ Snow scenes
- ✅ Beach/water videos

### Overlay Intensity Options

You can adjust the overlay darkness in `/components/auth/VideoBackground.tsx`:

```tsx
// Light overlay (more video visible, use with darker videos)
<VideoBackground overlayIntensity="light" />

// Medium overlay (default, works with most videos)
<VideoBackground overlayIntensity="medium" />

// Heavy overlay (maximum text contrast, use with very bright videos)
<VideoBackground overlayIntensity="heavy" />
```

### Alternative: Solid Panel Design

For **maximum text contrast**, use the alternative welcome screen with a solid dark panel:

**In `/App.tsx`:**
```tsx
// Replace this import:
import { WelcomeScreen } from "./components/auth/WelcomeScreen";

// With this:
import { WelcomeScreenAlt } from "./components/auth/WelcomeScreenAlt";

// Then in the component:
<WelcomeScreenAlt
  onSignIn={() => setAuthView('signin')}
  onCreateAccount={() => setAuthView('signup')}
/>
```

This creates a centered dark panel (70% opacity) that provides guaranteed contrast.

## Current Setup
- **Video Component**: `/components/auth/VideoBackground.tsx`
- **Fallback**: High-quality Unsplash image of farmland
- **Overlay**: Dark gradient for text readability
- **Performance**: Auto-plays, loops, muted, mobile-optimized

## Adding Your Own Video

### Step 1: Get Your Video
Choose or create a video with these characteristics:
- **Resolution**: 1920x1080 (Full HD) or higher
- **Format**: MP4 (H.264 codec recommended)
- **File Size**: Under 10MB for web (compress if needed)
- **Duration**: 15-60 seconds is ideal
- **Content**: Slow-moving, natural scenes work best
- **Looping**: Should transition smoothly from end to start

### Step 2: Optimize Your Video
Before using, optimize your video:

```bash
# Using ffmpeg (install via brew/apt/chocolatey)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1920:1080 -an farm-video.mp4
```

Options explained:
- `-crf 28`: Compression quality (18-28 is good, lower = better quality but larger file)
- `-preset slow`: Better compression
- `-vf scale=1920:1080`: Resize to Full HD
- `-an`: Remove audio (not needed for background video)

### Step 3: Add Video to Project

#### Option A: Local Video (Recommended)
1. Place your video in the `/public` folder:
   ```
   /public/farm-video.mp4
   ```

2. The video is already configured to load from `/farm-video.mp4`

#### Option B: External URL
If hosting externally (CDN, Cloudflare Stream, etc.):

1. Open `/components/auth/VideoBackground.tsx`
2. Update the `src` attribute:
   ```tsx
   <source src="https://your-cdn.com/farm-video.mp4" type="video/mp4" />
   ```

### Step 4: Test
- The video should autoplay when you visit the welcome/login page
- If the video doesn't load, the fallback image will display
- Video should loop seamlessly
- Mobile devices will show the video (muted autoplay is supported)

## Recommended Video Sources

### Free Stock Video Sites
1. **Pexels Videos** (pexels.com/videos)
   - Search: "farm", "agriculture", "maple trees", "countryside"
   
2. **Pixabay** (pixabay.com/videos)
   - Search: "farm landscape", "green field", "nature"
   
3. **Coverr** (coverr.co)
   - Category: Nature, Outdoors

### Suggested Themes for Farm Planner
- ✅ Sunrise over farmland
- ✅ Wind moving through wheat/grass fields
- ✅ Maple forest in spring
- ✅ Slow drone footage of countryside
- ✅ Time-lapse of clouds over fields
- ✅ Gentle rain on crops
- ❌ Avoid: Fast motion, busy scenes, people in focus

## Performance Tips

### Mobile Optimization
The video automatically:
- Uses `playsInline` for iOS devices
- Displays fallback image if video fails to load
- Is muted (required for autoplay)

### Further Optimization
1. **Multiple formats** (optional):
   ```tsx
   <source src="/farm-video.webm" type="video/webm" />
   <source src="/farm-video.mp4" type="video/mp4" />
   ```

2. **Lazy loading** for slower connections:
   ```tsx
   <video preload="metadata" ... >
   ```

3. **Poster image** (shows while loading):
   ```tsx
   <video poster="/farm-poster.jpg" ... >
   ```

## Customization

### Change Overlay Darkness
In `/components/auth/VideoBackground.tsx`, adjust the overlay:

```tsx
// Lighter overlay (more video visible)
<div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />

// Darker overlay (better text readability)
<div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
```

### Change Fallback Image
Update the `fallbackImage` prop in `AuthLayout.tsx` or pass it directly:

```tsx
<VideoBackground fallbackImage="https://your-image-url.com/farm.jpg" />
```

### Remove Video (Use Static Image Only)
In `/components/auth/VideoBackground.tsx`, comment out the video and keep only the fallback:

```tsx
<div className="absolute inset-0 w-full h-full">
  <img 
    src={fallbackImage}
    alt="Farm landscape"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Overlays stay the same */}
</div>
```

## Troubleshooting

### Video Not Playing
1. **Check file path**: Ensure video is in `/public` folder
2. **Check format**: MP4 with H.264 is most compatible
3. **Check file size**: Very large files may timeout
4. **Browser autoplay policy**: Video must be muted to autoplay

### Video Looks Pixelated
- Use higher resolution source (1920x1080 minimum)
- Reduce `-crf` value when compressing (lower = better quality)

### Video Takes Too Long to Load
- Compress further with ffmpeg
- Use a lower resolution (1280x720)
- Consider using external CDN
- Add poster image for instant display

### Mobile Issues
- Ensure `playsInline` attribute is present
- Test on actual devices (not just browser DevTools)
- iOS may not autoplay video in low power mode

## Need Help?
- Check browser console for errors
- Verify video file is accessible: `http://localhost:5173/farm-video.mp4`
- Test with a small, simple video first

## Example: Perfect Farm Video Settings
```
Format: MP4 (H.264)
Resolution: 1920x1080
Framerate: 30fps
Duration: 20 seconds
File size: 3-8 MB
Audio: None
Content: Slow sunrise over green hills
Loop: Seamless
```