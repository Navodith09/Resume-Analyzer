import { useState, useEffect } from 'react';
import { Upload, FileText, X, Check, Loader2 } from 'lucide-react';

const ResumeUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Effect to notify parent when file changes
  useEffect(() => {
    if (onFileSelect) {
        onFileSelect(file);
    }
  }, [file]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = (selectedFile) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
        setUploadProgress((prev) => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setFile(selectedFile);
                return 100;
            }
            return prev + 20; // Faster simulation
        });
    }, 50);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
      e.stopPropagation(); // Stop event bubbling to parent div
      e.preventDefault();
      setFile(null);
      setUploadProgress(0);
      // Reset input value if needed, but input is hidden and re-rendered
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Upload Resume</h2>
      <div 
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
          dragActive ? "border-blue-500 bg-blue-50 scale-[1.01]" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file && !isUploading && (
            <>
                <input
                type="file"
                id="resume-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                />
                
                <div className="space-y-4 pointer-events-none">
                    <div className="bg-white p-4 rounded-full inline-block shadow-sm">
                        <Upload className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-gray-700 font-medium text-lg">Drag and drop your resume here</p>
                        <p className="text-gray-500 mt-1">or click to browse from your device</p>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">PDF, DOC, DOCX up to 10MB</p>
                </div>
            </>
        )}

        {isUploading && (
             <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
                <p className="text-gray-600 font-medium mb-2">Uploading...</p>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{uploadProgress}%</p>
             </div>
        )}

        {file && !isUploading && (
             <div className="flex flex-col items-center relative z-20">
                <div className="bg-green-50 p-4 rounded-full mb-3 border border-green-100">
                    <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-800 font-semibold text-lg">{file.name}</p>
                    <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mb-4">{(file.size / 1024).toFixed(2)} KB</p>
                
                <button 
                    onClick={removeFile}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <X className="h-4 w-4" />
                    Remove file
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
