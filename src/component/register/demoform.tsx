'use client';

import { CheckCircle, Upload } from 'lucide-react';
import { useState } from 'react';

export default function UploadTestPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string>('');

  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState<string>('');

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    addLog('📷 Image selection triggered');
    
    if (!file) {
      addLog('❌ No file selected');
      return;
    }

    addLog(`✅ File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB');
      addLog('❌ File too large');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file');
      addLog('❌ Invalid file type');
      return;
    }

    try {
      const preview = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(preview);
      setImageError('');
      addLog(`✅ Preview created: ${preview}`);
    } catch (error) {
      addLog(`❌ Preview error: ${error}`);
      setImageError('Failed to create preview');
    }
  };

  // Handle Video Selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    addLog('🎥 Video selection triggered');
    
    if (!files || files.length === 0) {
      addLog('❌ No files selected');
      return;
    }

    const fileArray = Array.from(files).slice(0, 3);
    addLog(`✅ ${fileArray.length} file(s) selected`);

    const validFiles: File[] = [];
    const previews: string[] = [];

    fileArray.forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        addLog(`❌ ${file.name} is too large (max 50MB)`);
        return;
      }
      if (!file.type.startsWith('video/')) {
        addLog(`❌ ${file.name} is not a video`);
        return;
      }

      validFiles.push(file);
      const preview = URL.createObjectURL(file);
      previews.push(preview);
      addLog(`✅ ${file.name} validated and preview created`);
    });

    setVideoFiles(validFiles);
    setVideoPreviews(previews);
    setVideoError('');
  };

  // Upload Image
  const uploadImage = async () => {
    if (!imageFile) {
      addLog('❌ No image to upload');
      return;
    }

    setImageUploading(true);
    setImageError('');
    addLog('⬆️ Starting image upload...');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      addLog('📤 Sending to /api/upload/image');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      addLog(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      addLog(`✅ Upload successful!`);
      addLog(`🔗 URL: ${result.url}`);

      setImageUrl(result.url);
    } catch (error: any) {
      addLog(`❌ Upload error: ${error.message}`);
      setImageError(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Upload Videos
  const uploadVideos = async () => {
    if (videoFiles.length === 0) {
      addLog('❌ No videos to upload');
      return;
    }

    setVideoUploading(true);
    setVideoError('');
    addLog(`⬆️ Starting upload of ${videoFiles.length} video(s)...`);

    try {
      const urls: string[] = [];

      for (let i = 0; i < videoFiles.length; i++) {
        const file = videoFiles[i];
        addLog(`📤 Uploading video ${i + 1}/${videoFiles.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/video', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json();
        urls.push(result.url);
        addLog(`✅ Video ${i + 1} uploaded: ${result.url}`);
      }

      setVideoUrls(urls);
      addLog('✅ All videos uploaded successfully!');
    } catch (error: any) {
      addLog(`❌ Upload error: ${error.message}`);
      setVideoError(error.message);
    } finally {
      setVideoUploading(false);
    }
  };

  // Clear All
  const clearAll = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setImageError('');
    setVideoFiles([]);
    setVideoPreviews([]);
    setVideoUrls([]);
    setVideoError('');
    setLogs([]);
    addLog('🔄 Cleared all data');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <h1 className="text-3xl font-bold text-[#a72c3e] mb-2">Upload Test Page</h1>
          <p className="text-gray-600 mb-6">Test image and video uploads independently</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">📷 Image Upload</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm text-gray-600">{imageFile?.name}</p>
                    <label className="inline-block px-4 py-2 bg-gray-500 text-white rounded-lg cursor-pointer hover:bg-gray-600">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <label className="inline-block px-6 py-3 bg-[#a72c3e] text-white rounded-lg cursor-pointer hover:bg-[#8b2433]">
                      Select Image
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
                  </>
                )}
              </div>

              {imageError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{imageError}</p>
                </div>
              )}

              <button
                onClick={uploadImage}
                disabled={!imageFile || imageUploading}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                {imageUploading ? 'Uploading...' : 'Upload Image'}
              </button>

              {imageUrl && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-800">Upload Success!</p>
                  </div>
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                    {imageUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Video Upload Section */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">🎥 Video Upload</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <label className="inline-block px-6 py-3 bg-[#a72c3e] text-white rounded-lg cursor-pointer hover:bg-[#8b2433]">
                  Select Videos
                  <input type="file" accept="video/*" multiple onChange={handleVideoSelect} className="hidden" />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max 3 videos, 50MB each</p>

                {videoPreviews.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-semibold text-sm">{videoFiles.length} video(s) selected</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {videoPreviews.map((preview, i) => (
                        <div key={i} className="relative">
                          <video src={preview} className="w-32 h-24 rounded-lg border-2 border-gray-300" controls />
                          <p className="text-xs text-gray-600 mt-1">{videoFiles[i]?.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {videoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{videoError}</p>
                </div>
              )}

              <button
                onClick={uploadVideos}
                disabled={videoFiles.length === 0 || videoUploading}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                {videoUploading ? 'Uploading...' : `Upload ${videoFiles.length} Video(s)`}
              </button>

              {videoUrls.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-800">{videoUrls.length} Video(s) Uploaded!</p>
                  </div>
                  {videoUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline break-all mb-1">
                      Video {i + 1}: {url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📋 Console Logs</h2>
            <button
              onClick={() => setLogs([])}
              className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Try selecting and uploading files.</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className={`mb-1 ${
                  log.includes('❌') ? 'text-red-400' : 
                  log.includes('✅') ? 'text-green-400' : 
                  log.includes('📤') || log.includes('⬆️') ? 'text-blue-400' :
                  log.includes('📥') ? 'text-yellow-400' :
                  'text-gray-300'
                }`}>
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}