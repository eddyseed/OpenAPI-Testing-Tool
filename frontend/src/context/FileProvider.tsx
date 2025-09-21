import { useState, type ReactNode } from "react";
import { FileContext } from "./fileContext";


export const FileProvider = ({ children }: { children: ReactNode }) => {
    const [file, setFile] = useState<File | null>(null);

    return (
        <FileContext.Provider value={{ file, setFile }}>
            {children}
        </FileContext.Provider>
    );
};

