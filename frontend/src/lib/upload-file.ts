import type { OpenApiData } from "@/types/openapi.type";
import { uploadSchemaFileAPI } from "@/features/schema-input/api";

export const uploadSchemaFile = async (
  file: File,
  setSpec: (spec: OpenApiData) => void,
  logToTerminal: (msg: string) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  logToTerminal("Uploading file to backend...");

  try {
    const response = await uploadSchemaFileAPI(file);
    logToTerminal("File uploaded successfully!");
    setSpec(response.data.data);
    return response.data;
  } catch (error) {
    logToTerminal(`Error uploading file: ${error}`);
    throw error;
  }
};
