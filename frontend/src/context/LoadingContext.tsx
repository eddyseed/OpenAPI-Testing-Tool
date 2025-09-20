// LoadingContext.tsx
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<any>(null);

export function LoadingProvider({ children }: any) {
    const [loading, setLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingContext);
}
