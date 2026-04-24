import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, UploadCloud, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';

// Initialize Gemini API
// Note: In Vite, process.env is polyfilled in vite.config.ts for GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function AIScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError('无法访问摄像头，请确保已授予权限。');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setError(null);
    setScanResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 image data (remove the data:image/jpeg;base64, prefix for Gemini)
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      // 1. Send to Gemini for analysis
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          },
          "Analyze this image. Identify the food or object. Return ONLY a valid JSON object with the following keys: 'name' (string, name of the item), 'calories' (number, estimated calories, use 0 if not food), 'healthScore' (number 1-10, 10 being healthiest), 'description' (string, brief description or health advice)."
        ],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const resultText = response.text || '{}';
      const parsedData = JSON.parse(resultText);
      setScanResult(parsedData);

      // 2. Save using our Cloudflare worker API
      const saveResponse = await fetch('/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: parsedData.name,
          calories: parsedData.calories,
          health_score: parsedData.healthScore,
          description: parsedData.description,
          image_b64: base64Image
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save to database.');
      }

    } catch (err: any) {
      console.error('Analysis/DB error:', err);
      setError(err.message || '识别或保存失败，请重试。');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-indigo-500" />
        AI 智能视觉扫描
      </h2>

      <div className="relative w-full max-w-md aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
        {!stream ? (
          <div className="text-center p-6">
            <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-4">开启摄像头以识别食物或物品</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              开启摄像头
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-white animate-spin mb-3" />
                <p className="text-white font-medium">Gemini 正在分析中...</p>
              </div>
            )}
          </>
        )}
      </div>

      {stream && (
        <div className="flex gap-3 w-full max-w-md">
          <button 
            onClick={stopCamera}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
          >
            关闭
          </button>
          <button 
            onClick={captureAndAnalyze}
            disabled={isScanning}
            className="flex-[2] py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
          >
            {isScanning ? '处理中...' : '拍照并分析'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg w-full max-w-md border border-red-100">
          {error}
        </div>
      )}

      {scanResult && !isScanning && (
        <div className="mt-6 w-full max-w-md bg-emerald-50 border border-emerald-100 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              {scanResult.name}
            </h3>
            <span className="px-2.5 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full">
              健康分: {scanResult.healthScore}/10
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-white p-3 rounded-lg border border-emerald-100">
              <p className="text-xs text-slate-500 mb-1">预估热量</p>
              <p className="text-lg font-bold text-slate-800">{scanResult.calories} <span className="text-sm font-normal text-slate-500">kcal</span></p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-100 flex items-center justify-center">
               <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                 <UploadCloud className="w-4 h-4" />
                 已同步至云端
               </p>
            </div>
          </div>
          <p className="text-sm text-emerald-800 leading-relaxed">
            {scanResult.description}
          </p>
        </div>
      )}
    </div>
  );
}
