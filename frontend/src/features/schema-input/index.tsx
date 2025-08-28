import React from 'react';
import styles from './index.module.scss';
import { Button } from "@/components/ui/button"
import { UploadIcon } from "lucide-react"
import Editor from '@monaco-editor/react';
import { useState } from 'react';
const SchemaPage: React.FC = () => {
    const [content, setContent] = useState<string>("");
    return (
        <div className={`${styles.schema_page} bg-slate-950`}>
            <header>
                <h1 className="text-3xl font-bold text-white">Upload or Paste your API Schema</h1>
                <p className="text-lg text-gray-300">
                    Supported formats: OpenAPI (YAML/JSON), Postman Collection, GraphQL Schema
                </p>
            </header>
            <div>
                <Button type='submit' className={styles.upload_json_schema_btn}>
                    <UploadIcon /> Upload Schema File
                </Button>
                {/* Add Generate Test Case Button */}
                <Button type='submit'>
                    <UploadIcon /> Upload Schema File
                </Button>

            </div>
            <div className="editor">
                <Editor height="90vh" defaultLanguage="json" defaultValue={content} />
            </div>
        </div >
    );
};

export default SchemaPage;