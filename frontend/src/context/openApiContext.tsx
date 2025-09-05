import React, { createContext, useContext, useState } from "react";

interface OpenApiSpec {
    openapi: string;
    info: { title: string; version: string };
    paths: Record<string, unknown>;
}
interface OpenApiContextType {
    spec: OpenApiSpec | null;
    setSpec: (spec: OpenApiSpec | null) => void;
}
const OpenApiContext = createContext<OpenApiContextType | undefined>(undefined);

export const OpenApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [spec, setSpec] = useState<OpenApiSpec | null>(null);

    return (
        <OpenApiContext.Provider value={{ spec, setSpec }}>
            {children}
        </OpenApiContext.Provider>
    );
};
export const useOpenApi = () => {
    const context = useContext(OpenApiContext);
    if (!context) {
        throw new Error("useOpenApi must be used inside OpenApiProvider");
    }
    return context;
};