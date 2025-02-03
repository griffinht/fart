'use client';

import { useState, useRef, useEffect } from 'react';

export default function FartControls() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch and set up the current fart sound when component mounts
  useEffect(() => {
    loadCurrentFart();
  }, []);

  const loadCurrentFart = async () => {
    try {
      const response = await fetch('/api/fart');
      if (!response.ok) throw new Error('Failed to fetch fart sound');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
    } catch (error) {
      console.error('Error loading fart sound:', error);
    }
  };

  const playCurrentFart = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // Create a URL for the audio file preview
      const audioUrl = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
    }
  };

  const handleUpload = async () => {
    if (!audioFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await fetch('/api/fart', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload fart sound');
      }

      // Reload the current fart after successful upload
      await loadCurrentFart();
      setAudioFile(null);
      alert('Fart sound updated successfully! 💨');
    } catch (error) {
      console.error('Error uploading fart sound:', error);
      alert('Failed to upload fart sound');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} />
      
      {/* Play button for current fart sound */}
      <button 
        className="rounded-full bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 text-lg font-bold"
        onClick={playCurrentFart}
      >
        Fart
      </button>

      {/* Upload section */}
      <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-600">Fart.mp3</p>
        <input 
          type="file" 
          accept="audio/mp3"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
        />
        <button 
          className="rounded-full bg-green-500 hover:bg-green-600 text-white px-6 py-2"
          onClick={handleUpload}
          disabled={!audioFile || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Fart.mp3'}
        </button>
      </div>
    </>
  );
} 