
import type { OpenApiContextType } from "@/types/openApiContext.type";
import { createContext } from "react";

export const OpenApiContext = createContext<OpenApiContextType | undefined>(undefined);

    