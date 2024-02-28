import React, { useEffect, useState } from "react";
import { FaCamera, FaUser } from "react-icons/fa";

interface AvatarUploadProps {
  label: string;
  name: string;
  url?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  label,
  name,
  url,
}) => {
  // const [avatar, setAvatar] = useState<File | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (url && !imagePreview) {
      setImagePreview(url);
    }
  }, [imagePreview, url]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // const formData = new FormData();
      // formData.append(name, file);

      // submit(URLSearchParams, );
      // Create a preview URL for the uploaded image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      // const formData = new FormData();
      // formData.append(name, file);

      // submit(formData);
      // Create a preview URL for the uploaded image
      setImagePreview(URL.createObjectURL(file));
    }
    setIsHovered(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    // Trigger the file input
    const fileInput = document.getElementById("avatar-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`relative mt-1 flex items-center justify-center ${
          isHovered ? "border-dashed" : ""
        } rounded-md p-4`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="presentation"
      >
        {/* Display the uploaded image preview or user icon */}
        <div className="relative flex-shrink-0">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Avatar Preview"
              className="h-24 w-24 overflow-hidden rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <FaUser size={40} />
            </div>
          )}
          {/* Button to trigger file selection */}
          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none"
          >
            <FaCamera size={20} />
          </button>
        </div>

        {/* Input for file selection */}
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          name={name}
          className="hidden"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Click or drag and drop to upload a photo
      </p>
    </div>
  );
};
