import { uploadToS3 } from "@/utils/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = ({ username }: { username: string }) => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async (files: { file_key: string; file_name: string }[]) => {
      console.log(files, username);

      const response = await axios.post(
        "http://localhost:3000/api/create-chat",
        { files, username, chatname: "first" }
      );
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 5,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.some((file) => file.size > 10 * 1024 * 1024)) {
        alert("Please ensure all files are smaller than 10MB");
        return;
      }
      try {
        setUploading(true);
        const uploadPromises = acceptedFiles.map((file) => uploadToS3(file));
        const uploadedFiles = await Promise.all(uploadPromises);
        const validFiles = uploadedFiles.filter(
          (file): file is { file_key: string; file_name: string } =>
            !!file && !!file.file_key && !!file.file_name
        );
        if (validFiles.length === 0) {
          console.log("No valid files were uploaded");
          return;
        }
        console.log(validFiles);

        mutate(validFiles, {
          onSuccess: (data) => {
            console.log("Files processed successfully", data);
          },
          onError: (err) => {
            console.log("Error processing files", err);
          },
        });
      } catch (error) {
        console.log("Error during file upload", error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <div>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-600">Processing files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-600">
              Drop PDF or image files here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
