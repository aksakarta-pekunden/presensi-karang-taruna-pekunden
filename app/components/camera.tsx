/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef } from 'react';

interface CameraFeedProps {
  onVideoReady: (video: HTMLVideoElement) => void;
}

export function CameraFeed({ onVideoReady }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            onVideoReady(videoRef.current!);
          };
        }
      } catch (error) {
        console.error('Camera error:', error);
      }
    };

    startCamera();

    return () => {
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach(track => track.stop());
    };
  }, [onVideoReady]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover rounded-lg transform scale-x-[-1]"
      muted
      playsInline
    />
  );
}