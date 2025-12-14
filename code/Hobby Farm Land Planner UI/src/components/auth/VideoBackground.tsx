/**
 * VideoBackground Component
 * 
 * Features strong overlays to ensure text readability on any video content.
 * Works well with bright, colorful, or high-contrast videos.
 * 
 * To use your own video:
 * 1. Place your MP4 video file in the /public folder (e.g., /public/farm-video.mp4)
 * 2. Update the src in the <source> tag below
 * 3. For best results, use a video that:
 *    - Is 1920x1080 or higher resolution
 *    - Is optimized/compressed (under 10MB recommended)
 *    - Has a natural, slow-moving scene
 *    - Loops well (seamless transition from end to start)
 * 
 * The multi-layered overlay system ensures text remains readable even on:
 * - Bright, sunny scenes
 * - Colorful flower fields
 * - High-contrast landscapes
 * - White/light backgrounds
 */

interface VideoBackgroundProps {
  fallbackImage?: string;
  overlayIntensity?: 'light' | 'medium' | 'heavy';
}

export function VideoBackground({ 
  fallbackImage = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80",
  overlayIntensity = 'medium'
}: VideoBackgroundProps) {
  
  // Overlay configurations for different intensities
  const overlayConfigs = {
    light: {
      primary: 'from-black/50 via-black/40 to-black/50',
      accent: 'from-primary/15',
    },
    medium: {
      primary: 'from-black/65 via-black/55 to-black/65',
      accent: 'from-primary/20',
    },
    heavy: {
      primary: 'from-black/75 via-black/65 to-black/75',
      accent: 'from-primary/25',
    },
  };

  const config = overlayConfigs[overlayIntensity];

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Replace with your video path */}
        <source src="/farm-video.mp4" type="video/mp4" />
        
        {/* Fallback image if video doesn't load */}
        <img 
          src={fallbackImage}
          alt="Farm landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>
      
      {/* Multi-layer overlay system for maximum text readability */}
      
      {/* Layer 1: Base darkening gradient - ensures minimum darkness */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.primary}`} />
      
      {/* Layer 2: Radial gradient - darker edges, lighter center for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      
      {/* Layer 3: Bottom gradient - extra darkness at bottom for footer text */}
      <div className={`absolute inset-0 bg-gradient-to-t ${config.accent} via-transparent to-transparent opacity-60`} />
      
      {/* Layer 4: Subtle noise texture for premium feel (optional) */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
