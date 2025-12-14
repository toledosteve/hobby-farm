/**
 * VideoBackground Component
 *
 * YouTube video background with overlay and early loop
 * to avoid suggested video popups.
 */

import { useCallback, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

const VIDEO_ID = '0AlNe_8Mq8A';
const LOOP_BEFORE_END_SECONDS = 8; // Loop back before suggested videos appear

interface VideoBackgroundProps {
  onReady?: () => void;
}

export function VideoBackground({ onReady }: VideoBackgroundProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const checkIntervalRef = useRef<number | null>(null);
  const hasNotifiedReady = useRef(false);

  const startTimeCheck = useCallback(() => {
    // Clear any existing interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Check video time every 500ms to loop before end
    checkIntervalRef.current = window.setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();

        // If we're within LOOP_BEFORE_END_SECONDS of the end, restart
        if (duration > 0 && currentTime >= duration - LOOP_BEFORE_END_SECONDS) {
          playerRef.current.seekTo(0, true);
        }
      }
    }, 500);
  }, []);

  const handleReady = useCallback((event: YouTubeEvent) => {
    playerRef.current = event.target;
    // Start playing - but don't notify parent yet, wait for actual playback
    event.target.playVideo();
  }, []);

  const handleStateChange = useCallback((event: YouTubeEvent) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 0) {
      // Video ended - restart from beginning
      event.target.seekTo(0, true);
      event.target.playVideo();
    } else if (event.data === 1) {
      // Video is actually playing now - notify parent and start time check
      if (!hasNotifiedReady.current) {
        hasNotifiedReady.current = true;
        onReady?.();
      }
      startTimeCheck();
    }
  }, [onReady, startTimeCheck]);

  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      playsinline: 1,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3, // Hide annotations
    },
  };

  return (
    <>
      <style>{`
        .video-foreground {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
        .video-foreground iframe {
          width: 100%;
          height: 100%;
        }
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          pointer-events: none;
          z-index: 2;
        }
        @media (min-aspect-ratio: 16/9) {
          .video-foreground { width: 100%; height: 300%; top: -100%; left: 0; }
        }
        @media (max-aspect-ratio: 16/9) {
          .video-foreground { width: 300%; height: 100%; top: 0; left: -100%; }
        }
      `}</style>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10 bg-black">
        <div className="video-foreground">
          <YouTube
            videoId={VIDEO_ID}
            opts={opts}
            onReady={handleReady}
            onStateChange={handleStateChange}
            style={{ width: '100%', height: '100%' }}
            iframeClassName="w-full h-full"
          />
        </div>
        <div className="video-overlay" />
      </div>
    </>
  );
}
