import { useState } from "react";
import { OpenApiContext } from "./openApiContext";
import { type OpenApiData } from "@/types/openapi.type";

export const OpenApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [spec, setSpec] = useState<OpenApiData | null>(null);

    return (
        <OpenApiContext.Provider value={{ spec, setSpec }}>
            {children}
        </OpenApiContext.Provider>
    );
};
