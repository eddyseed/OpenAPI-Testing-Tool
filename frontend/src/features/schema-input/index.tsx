import React, { useRef, useState } from 'react';
import styles from './index.module.scss';
import { Button } from "@/components/ui/button";
import { UploadIcon, PlayIcon } from "lucide-react";
import Editor from '@monaco-editor/react';
import toast, { Toaster } from 'react-hot-toast';
import { uploadSchema } from './api';
import type { AxiosError } from 'axios';
const SchemaPage: React.FC = () => {
    const [content, setContent] = useState<string>("");
    const [fileName, setFileName] = useState<string>("No file selected");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setContent(text);
        };
        reader.readAsText(file);
        setFileName(file.name);

        // Now we'll send the file to the backend
        try {
            await uploadSchema(file);
            toast.success(`Upload was successful`);
        } catch (err) {
            const error = err as AxiosError;

            if (error.response) {
                // Backend responded with error
                const status = error.response.status;
                const msg = (error.response.data as any)?.message || "Server error";

                if (status === 400) {
                    toast.error(`Bad Request: ${msg}`);
                } else if (status === 401) {
                    toast.error("Unauthorized. Please log in.");
                } else if (status === 500) {
                    toast.error("Internal server error. Try again later.");
                } else {
                    toast.error(`Error ${status}: ${msg}`);
                }
            } else if (error.request) {
                // No response received
                toast.error("No response from server. Check your internet or backend.");
            } else {
                // Something else went wrong
                toast.error(`Unexpected error: ${error.message}`);
            }
        }

    };

    return (
        <div className={`${styles.schema_page} bg-slate-950`}>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <header>
                <h1 className="text-3xl font-bold text-white">Upload or Paste your API Schema</h1>
                <p className="text-lg text-gray-300">
                    Supported formats: OpenAPI (YAML/JSON), Postman Collection, GraphQL Schema
                </p>
            </header>

            <div className="space-x-4">
                <Button className={styles.upload_json_schema_btn} onClick={handleButtonClick}>
                    <UploadIcon /> Upload Schema File
                </Button>

                <input
                    type="file"
                    accept=".json,.yaml,.yml,.graphql"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                />

                {/* Generate Test Case Button */}
                <Button type="submit" className={`${styles.generate_test_cases_btn} text-white`}>
                    <PlayIcon /> Generate Test Cases
                </Button>

                <section>
                    <span className='text-white'>{fileName}</span>
                </section>
            </div>

            <div className="editor flex justify-center items-center mt-4">
                <Editor
                    height="70vh"
                    width="90%"
                    language="json"
                    value={content}   // controlled value, updates with file upload
                    theme="vs-dark"
                    onChange={(value) => setContent(value || "")} // update state on content change
                    options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        wordWrap: "on",
                    }}
                />
            </div>
        </div>
    );
};

export default SchemaPage;
