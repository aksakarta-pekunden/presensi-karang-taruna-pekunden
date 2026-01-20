/* eslint-disable @next/next/no-img-element */
"use client";

import type { DetectedFace } from "./overlay";

interface AttendanceModalProps {
  isOpen: boolean;
  face: DetectedFace | null;
  onClose: () => void;
}

export function AttendanceModal({
  isOpen,
  face,
  onClose,
}: AttendanceModalProps) {
  if (!isOpen || !face) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-end md:items-center justify-center z-50 p-0 md:p-4 backdrop-blur-sm transition-all duration-300">
      <div className="w-full md:max-w-md bg-white dark:bg-zinc-900 rounded-t-4xl md:rounded-3xl shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-500 via-amber-500 to-orange-500"></div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-700 rounded-full"></div>
        </div>

        <div className="px-6 pt-4 pb-2 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 mb-3 ring-4 ring-orange-100 dark:ring-orange-900/10 shadow-sm">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
            Presensi Berhasil!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Data Anda telah tersimpan di sistem
          </p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-amber-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-800 shadow-lg bg-gray-100 dark:bg-zinc-800">
                {face.photo ? (
                  <img
                    src={face.photo}
                    alt={face.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm flex items-center gap-1">
                <span>{(face.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-100 dark:border-zinc-700/50">
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-zinc-700 border-dashed">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </p>
                <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  {face.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Jabatan
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    {face.position}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-3 border border-orange-100 dark:border-orange-900/20">
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                  Tanggal
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {face.detectionDate}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-3 border border-orange-100 dark:border-orange-900/20">
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                  Waktu
                </p>
                <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                  {face.detectionTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 bg-white dark:bg-zinc-900 relative z-20">
          <button
            onClick={onClose}
            className="w-full group relative overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-xl shadow-xl transition-transform active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
              <span>Tutup & Lanjutkan</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
