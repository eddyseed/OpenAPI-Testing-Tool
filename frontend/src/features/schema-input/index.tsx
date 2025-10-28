import React, { useRef, useState } from 'react';
import styles from './index.module.scss';
import { UploadIcon, PlayIcon } from "lucide-react";
import Editor from '@monaco-editor/react';
import toast, { Toaster } from 'react-hot-toast';
import { uploadSchemaFile } from '@/lib/upload-file';
import type { AxiosError } from 'axios';
import { useFile } from '@/hooks/useFile';
import { useLoading } from '@/hooks/useLoading';
import { useOpenApi } from '@/hooks/useOpenApi';
import { useTerminal } from '@/hooks/useTerminal';
import type { ErrorResponse } from '@/types/errorResponse.type';
import { useTestRunner } from '@/hooks/useTestRunner';
import { COLORS } from '@/config/appConfig';
import Button from '@/components/ui/button';
const SchemaPage: React.FC = () => {
    const { file, setFile } = useFile();
    const { setSpec } = useOpenApi();
    const [content, setContent] = useState<string>("");
    const [editorLanguage, setEditorLanguage] = useState<'json' | 'yaml'>('json');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { logToTerminal } = useTerminal();
    const { loading, setLoading } = useLoading();
    const { spec } = useOpenApi()
    const { runTests } = useTestRunner();
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    const handleRunTests = async () => {
        if (!spec) return;
        try {
            setLoading(true);
            await runTests(spec, logToTerminal);
        } finally {
            setLoading(false);
        }
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
            await uploadSchemaFile(file, setSpec, logToTerminal);
            toast.success(`Upload was successful`);
        } catch (err) {
            const error = err as AxiosError;

            if (error.response) {
                // Backend responded with error
                const status = error.response.status;
                const msg = (error.response.data as AxiosError<ErrorResponse>)?.message || "Server error";

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
        <div className={`${styles.schema_page}`} style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
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
                        value={content}
                        theme="vs-dark"
                        onChange={(value) => setContent(value || "")}
                        options={{
                            fontSize: 16,
                            minimap: { enabled: false },
                            lineNumbers: "on",
                            wordWrap: "on",
                            readOnly: true
                        }}
                    />
                </div>
                <div className='items-center'>
                    <header>
                        <h1 className="text-3xl font-bold">Upload or Paste your API Schema</h1>
                        <p className="text-lg">
                            Supported formats: OpenAPI (YAML/JSON)
                        </p>
                        <br />
                        <main className='mb-4'>
                            <ul className="space-y-3">
                                {[
                                    "Select a file to upload (e.g., sample.yaml).",
                                    "View the test cases to be executed.",
                                    "Review and modify the generated cases",
                                    "Run the test cases to validate"
                                ]
                                    .map((step, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="flex items-center justify-center w-7 h-7 rounded-full font-bold mr-3" style={{ backgroundColor: COLORS.text, color: COLORS.background }}>
                                                {i + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                            </ul>

                        </main>
                        <div className="space-x-4 flex">
                            {/* Upload Schema Button */}
                            <Button variant="secondary" onClick={handleButtonClick}>
                                <UploadIcon className="inline-block mr-2" />
                                Upload Schema
                            </Button>
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept=".json,.yaml,.yml"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />
                            <Button variant="primary" onClick={handleRunTests} disabled={!file || loading}>
                                <PlayIcon className="inline-block mr-2" />
                                Run Tests
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
