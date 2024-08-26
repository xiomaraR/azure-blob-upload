"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
} from "react";

import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";
import toast from "react-hot-toast";
import LoadingDots from "@/components/loading-dots";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        if (selectedFile.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
        } else {
          setFile(selectedFile);
          const reader = new FileReader();
          reader.onload = (e) => setImagePreview(e.target?.result as string);
          reader.readAsDataURL(selectedFile);
        }
      }
    },
    []
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else {
        setFile(droppedFile);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(droppedFile);
      }
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setSaving(true);

    const containerName =
      process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME ?? "";
    const sasUrl = process.env.NEXT_PUBLIC_BLOB_SERVICE_SAS_URL ?? "";

    try {
      // Initialize the BlobServiceClient with the SAS URL
      const blobServiceClient = new BlobServiceClient(
        sasUrl,
        new AnonymousCredential()
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Create a BlockBlobClient
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      // Upload the file
      await blockBlobClient.uploadData(file);

      toast.success("File uploaded successfully!");
      setImagePreview(null); // Clear the preview after upload
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during file upload.");
    }

    setSaving(false);
  };

  const saveDisabled = useMemo(() => !file || saving, [file, saving]);

  return (
    <div>
      <h1>Upload an Image</h1>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={handleDrop}
        >
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              imagePreview
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          )}
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          disabled={saveDisabled}
          className={`${
            saveDisabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-black bg-black text-white hover:bg-white hover:text-black"
          } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
        >
          {saving ? (
            <LoadingDots color="#808080" />
          ) : (
            <p className="text-sm">Confirm upload</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
