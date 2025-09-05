import React, { useRef, useState } from 'react';
import styles from './index.module.scss';
import { Button } from "@/components/ui/button";
import { UploadIcon, PlayIcon } from "lucide-react";
import Editor from '@monaco-editor/react';
import toast, { Toaster } from 'react-hot-toast';
import { uploadSchema } from './api';
import type { AxiosError } from 'axios';
import { useFile } from '@/context/fileContext';
import { useOpenApi } from '@/context/openApiContext';
const SchemaPage: React.FC = () => {
    const { file, setFile } = useFile();
    const { setSpec } = useOpenApi();
    const [content, setContent] = useState<string>("");
    const [editorLanguage, setEditorLanguage] = useState<'json' | 'yaml'>('json');
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

            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension === 'yaml' || fileExtension === 'yml') {
                setEditorLanguage('yaml');
            } else {
                setEditorLanguage('json');
            }
        };
        reader.readAsText(file);
        setFile(file.name ? file : null); // Update context with the file name

        // Now we'll send the file to the backend
        try {
            await uploadSchema(file, setSpec);
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
            <section className={`${styles.activity_area} h-full`}>
                <div className="editor flex justify-center items-center">
                    <Editor
                        height="70vh"
                        width="90%"
                        language={editorLanguage}
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
                <div className='items-center'>
                    <header className='text-white'>
                        <h1 className="text-3xl font-bold text-white">Upload or Paste your API Schema</h1>
                        <p className="text-lg text-gray-300">
                            Supported formats: OpenAPI (YAML/JSON)
                        </p>
                        <br />
                        <main className='mb-4'>
                            <ul className="space-y-3">
                                {[
                                    "Select a file to upload or paste your schema directly into the editor.",
                                    "Click \"Generate Test Cases\" to create test cases based on the schema.",
                                    "Review and modify the generated test cases as needed.",
                                    "Run the test cases to validate your API endpoints.",
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold mr-3">
                                            {i + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>

                        </main>
                        <div className='space-x-4'>
                            <Button className={`${styles.upload_json_schema_btn} py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20 cursor-pointer`} onClick={handleButtonClick}>
                                <UploadIcon /> Upload Schema File
                            </Button>

                            <input
                                type="file"
                                accept=".json,.yaml,.yml"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />

                            {/* Generate Test Case Button */}
                            <Button disabled={!file} type="submit" className={`${styles.generate_test_cases_btn} py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200 focus:outline-hidden focus:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:text-teal-500 dark:bg-teal-800/30 dark:hover:bg-teal-800/20 dark:focus:bg-teal-800/20`}>
                                <PlayIcon /> Generate Test Cases
                            </Button>

                        </div>
                    </header>
                    <div>
                        <span className='text-white w-4/5'>
                            Learn more about
                            <a className='text-blue-400 underline mx-1' href="https://spec.openapis.org/oas/v3.1.0.html#openapi-specification" >OpenAPI Specification</a>
                            here.
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SchemaPage;
