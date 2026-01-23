import React, { useRef, useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { DataPoint } from '../types';
import { parseCSV } from '../utils/dataUtils';

interface UploadControlProps {
  onDataLoaded: (data: DataPoint[]) => void;
}

export const UploadControl: React.FC<UploadControlProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      if (data.length === 0) {
        throw new Error("No valid data found in CSV");
      }
      onDataLoaded(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse CSV");
    } finally {
      setLoading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-xs text-red-400 flex items-center gap-1 mr-2 animate-pulse">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
      
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
          bg-indigo-600 hover:bg-indigo-500 text-white
          transition-colors shadow-lg shadow-indigo-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {loading ? 'Processing...' : 'Upload CSV'}
      </button>
    </div>
  );
};