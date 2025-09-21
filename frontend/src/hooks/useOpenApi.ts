import { useContext } from "react";
import { OpenApiContext } from "@/context/openApiContext";

export const useOpenApi = () => {
  const context = useContext(OpenApiContext);
  if (!context) {
    throw new Error("useOpenApi must be used inside OpenApiProvider");
  }
  return context;
};
