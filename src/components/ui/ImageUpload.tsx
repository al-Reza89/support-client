// components/ui/ImageUpload.tsx
"use client";

import { useCallback, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export const ImageUpload = ({
  value,
  onChange,
  maxFiles = 5,
  maxSize = 5,
}: ImageUploadProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Validate files
      const validFiles = acceptedFiles.filter(
        (file) => file.size <= maxSize * 1024 * 1024
      );

      if (validFiles.length + value.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }

      const newFiles = [...value, ...validFiles];
      onChange(newFiles);

      // Create preview URLs
      const urls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);
    },
    [value, onChange, maxFiles, maxSize]
  );

  const removeImage = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-4">
        {/* Image preview grid */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File input */}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG (MAX. {maxSize}MB each, up to {maxFiles} images)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onDrop(files);
                e.target.value = ""; // Reset input to allow selecting same files again
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
