import { apiClient } from "@/lib/api-client";

export const uploadSchemaFileAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/upload-schema/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
