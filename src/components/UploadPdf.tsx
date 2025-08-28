import { shrinkText } from "@/lib/utils";
import { CloudUpload } from "lucide-react";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface UploadPdfProps {
  onUpload?: (file: File) => void;
  file?: File | null;
}

const UploadPdf: React.FC<UploadPdfProps> = ({ onUpload, file }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }
    onUpload && onUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0] as File);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0] as File);
    }
  };

  return (
    <div className="flex cta  text-white items-center justify-center flex-col gap-6 w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2  gap-4 sm:justify-between flex-wrap sm:flex-nowrap items-center border-dashed rounded-md w-full p-36  text-center transition-all duration-200 ${
          isDragOver
            ? "border-success-500 bg-green-100"
            : file
            ? "border-primary-300 bg-blue-50"
            : "border-warning-150"
        }`}
      >
        <div className="   gap-4">
          <div className="flex m-auto justify-center">
            <CloudUpload className="w-10 h-10 " />
          </div>

          {file ? (
            <div className="flex text-center flex-col">
              <p className="text-lg font-semibold text-primary-300 whitespace-pre-line">
                File Selected: {shrinkText(file.name, 15)}
              </p>
              <p className="text-sm text-primary-300">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center mx-auto  sm:max-w-60 ">
              <p className="text-xs text-neutral-500">
                Supported formats: PDF, JPG, PNG | Max size: 10MB
              </p>
              <p className="text-xs font-semibold text-black">
                Drag and Drop an image here or
              </p>
            </div>
          )}
        </div>
        <div className="">
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
          />
          <label
            htmlFor="file-input"
            className="inline-block px-8 py-2 bg-white border border-warning-150 text-black rounded-md font-semibold cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200"
          >
            Choose File
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadPdf;
