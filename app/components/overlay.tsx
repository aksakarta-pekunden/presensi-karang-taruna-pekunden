'use client';

import { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image'; 
import { USER_DATABASE, TM_MODEL_URL } from '../constant/data';

export interface DetectedFace {
  name: string;
  position: string;
  detectionDate: string;
  detectionTime: string;
  photo?: string;
  confidence: number;
}

interface FaceDetectionOverlayProps {
  video: HTMLVideoElement | null;
  onFaceDetected: (face: DetectedFace) => void;
}

export function FaceDetectionOverlay({ video, onFaceDetected }: FaceDetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedFace, setDetectedFace] = useState<DetectedFace | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);
  const lastPredictionTime = useRef<number>(0);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = TM_MODEL_URL + "model.json";
        const metadataURL = TM_MODEL_URL + "metadata.json";

        const model = await tmImage.load(modelURL, metadataURL);
        modelRef.current = model;
        setIsModelLoading(false);
        console.log("Teachable Machine Model Loaded!");
      } catch (error) {
        console.error("Error loading model:", error);
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (!video || !canvasRef.current || isModelLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const predict = async () => {
      if (modelRef.current && video.readyState === 4) { 
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now();
        if (now - lastPredictionTime.current > 500) {
          lastPredictionTime.current = now;

          const predictions = await modelRef.current.predict(video);
          
          let highestProb = 0;
          let bestClass = "";

          predictions.forEach((p) => {
            if (p.probability > highestProb) {
              highestProb = p.probability;
              bestClass = p.className;
            }
          });

          if (highestProb > 0.85 && USER_DATABASE[bestClass]) {
            const userData = USER_DATABASE[bestClass];
            const dateNow = new Date();

            const faceData: DetectedFace = {
              name: userData.name,
              position: userData.position,
              detectionDate: dateNow.toLocaleDateString('id-ID'),
              detectionTime: dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              confidence: highestProb
            };

            setDetectedFace(faceData);
            onFaceDetected(faceData);
          } else {
          }
        }
      }
      animationId = requestAnimationFrame(predict);
    };

    predict();
    
    return () => {
        cancelAnimationFrame(animationId);
    }
  }, [video, isModelLoading, onFaceDetected]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="text-white font-medium flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            Memuat Model AI...
          </div>
        </div>
      )}

      {!isModelLoading && detectedFace && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-linear-to-t from-black/90 via-black/60 to-transparent pt-8 pb-4 px-4 md:px-6">
             <div className="flex items-center gap-4 animate-in slide-in-from-bottom duration-500">
                
                <div className="shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center backdrop-blur-md">
                    <span className="text-xl md:text-2xl">👤</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-white">
                   <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                        Wajah Terdeteksi ({(detectedFace.confidence * 100).toFixed(0)}%)
                      </p>
                   </div>
                   
                   <h3 className="text-lg md:text-xl font-bold truncate leading-tight">
                     {detectedFace.name}
                   </h3>
                   <p className="text-sm text-gray-300 truncate">
                     {detectedFace.position}
                   </p>
                </div>

                <div className="hidden xs:block text-right">
                    <p className="text-xs text-gray-400">Waktu</p>
                    <p className="text-sm font-mono font-medium text-white">{detectedFace.detectionTime}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}