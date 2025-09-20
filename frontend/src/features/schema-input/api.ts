import axios from "axios";
interface OpenApiSchema {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, unknown>;
  components?: Record<string, unknown>;
}
export const uploadSchema = async (
  file: File,
  setSpec: (spec: OpenApiSchema) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log("Uploading file to backend...", formData);

  try {
    const response = await axios.post("/api/upload-schema/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("File uploaded successfully:", response.data);
    setSpec(response.data.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
