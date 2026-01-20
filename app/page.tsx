'use client';

import { useState, useCallback } from 'react';
import { CameraFeed } from './components/camera';
import { FaceDetectionOverlay, type DetectedFace } from './components/overlay';
import { AttendanceModal } from './components/modal';

export default function AttendancePage() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [detectedFace, setDetectedFace] = useState<DetectedFace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<DetectedFace[]>([]);

  const handleVideoReady = useCallback((videoElement: HTMLVideoElement) => {
    setVideo(videoElement);
  }, []);

  const handleFaceDetected = useCallback((face: DetectedFace) => {
    setDetectedFace(face);
  }, []);

  const handleAttendanceSubmit = () => {
    if (detectedFace) {
      setAttendanceHistory([...attendanceHistory, detectedFace]);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDetectedFace(null);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-gray-900 p-4 md:p-8 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-gray-200/20 to-orange-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-orange-500/20">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            AI Powered System
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-gray-200/50 to-orange-200/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white dark:bg-zinc-900 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800 p-3">
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-3/4 md:aspect-video lg:aspect-auto lg:h-125">
                  <CameraFeed onVideoReady={handleVideoReady} />
                  {video && (
                    <FaceDetectionOverlay 
                      video={video} 
                      onFaceDetected={handleFaceDetected}
                    />
                  )}
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAttendanceSubmit}
              disabled={!detectedFace}
              className={`w-full relative overflow-hidden group rounded-2xl font-black text-lg md:text-xl py-5 px-8 transition-all duration-300 shadow-xl ${
                detectedFace
                  ? 'bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white hover:shadow-2xl hover:shadow-orange-500/20 transform hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {detectedFace ? (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi Presensi</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Menunggu Deteksi Wajah...</span>
                  </>
                )}
              </span>
              {detectedFace && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              )}
            </button>
          </div>

          <div className="space-y-6">
            
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-gray-200/50 to-orange-100/50 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Status Deteksi
                  </h3>
                </div>
                
                {detectedFace ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                      <span className="text-orange-600 dark:text-orange-400 font-bold text-sm uppercase tracking-wide">
                        Wajah Terdeteksi
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-2xl p-4 border border-gray-200 dark:border-zinc-700">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nama</p>
                        <p className="text-base font-black text-gray-900 dark:text-white">{detectedFace.name}</p>
                      </div>
                      
                      <div className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-2xl p-4 border border-gray-200 dark:border-zinc-700">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Jabatan</p>
                        <p className="text-base font-black text-gray-900 dark:text-white">{detectedFace.position}</p>
                      </div>
                      
                      <div className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl p-4 border border-orange-200/50 dark:border-orange-900/50">
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Waktu</p>
                        <p className="text-base font-black text-gray-900 dark:text-white font-mono">{detectedFace.detectionTime}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                      <span className="text-4xl opacity-50">🔍</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                      Menunggu deteksi wajah
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-gray-200/50 to-orange-100/50 rounded-3xl blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Riwayat
                  </h3>
                </div>
                
                <div className="mb-4">
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 mb-1">
                    {attendanceHistory.length}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold">
                    Total presensi hari ini
                  </p>
                </div>

                {attendanceHistory.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {attendanceHistory.slice().reverse().map((record, idx) => (
                      <div 
                        key={idx} 
                        className="bg-linear-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-800/50 rounded-xl p-3 border border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900 transition-all"
                      >
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{record.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{record.position}</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-mono font-semibold">{record.detectionTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-amber-500/10 rounded-3xl blur-lg"></div>
          <div className="relative bg-linear-to-br from-white via-gray-50 to-orange-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-3xl">💡</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  Tips Penggunaan
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Untuk hasil terbaik
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: '💡', text: 'Pastikan pencahayaan cukup untuk hasil deteksi maksimal' },
                { icon: '📏', text: 'Hadapkan wajah langsung ke kamera dengan jarak 30-60 cm' },
                { icon: '🌞', text: 'Hindari cahaya berlebihan atau backlight dari belakang' },
                { icon: '✅', text: 'Klik tombol "Konfirmasi Presensi" saat wajah terdeteksi' },
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/80 dark:bg-zinc-950/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-900 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                    <span className="text-xl">{tip.icon}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AttendanceModal 
        isOpen={isModalOpen} 
        face={detectedFace}
        onClose={handleModalClose}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #d97706);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b45309);
        }
      `}</style>
    </main>
  );
}