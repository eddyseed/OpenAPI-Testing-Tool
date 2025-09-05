import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
interface OpenApiSchema {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, any>;
  components?: Record<string, any>;
}

export const uploadSchema = async (
  file: File,
  setSpec: (spec: OpenApiSchema) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  socket.emit("fileUploadStarted", file.name);
  console.log("Uploading file to backend...", formData);

  try {
    const response = await axios.post("/api/upload-schema/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("File uploaded successfully:", response.data);
    socket.emit("confirmUpload", file.name);
    setSpec(response.data.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
