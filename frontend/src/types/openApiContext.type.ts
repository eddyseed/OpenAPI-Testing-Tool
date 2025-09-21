import type { OpenApiData } from "./openapi.type";

export interface OpenApiContextType {
  spec: OpenApiData | null;
  setSpec: (spec: OpenApiData | null) => void;
}
