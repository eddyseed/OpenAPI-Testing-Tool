import axios from "axios";

export const uploadSchema = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("Uploading file to backend...", formData);

  try {
    const response = await axios.post("/api/upload-schema", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("File uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
