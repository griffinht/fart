'use client';

import { useState, useRef } from 'react';

export default function FartControls() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playCurrentFart = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // Create a URL for the audio file
      const audioUrl = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
    }
  };

  const handleUpload = () => {
    // TODO: Implement actual upload to backend
    console.log('Uploading new fart sound:', audioFile?.name);
  };

  return (
    <>
      <audio ref={audioRef} />
      
      {/* Play button for current fart sound */}
      <button 
        className="rounded-full bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 text-lg font-bold"
        onClick={playCurrentFart}
      >
        Play Current Fart 💨
      </button>

      {/* Upload section */}
      <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-600">Upload new fart sound (MP3 only)</p>
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
          disabled={!audioFile}
        >
          Upload New Fart
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {audioFile ? `Selected: ${audioFile.name}` : 'Current fart sound will be replaced for everyone!'}
      </p>
    </>
  );
} 