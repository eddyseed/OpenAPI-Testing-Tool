import React, { useMemo } from "react";
import styles from "./index.module.scss";
import { FileIcon, FileTypeIcon, LeafyGreenIcon, PlayIcon } from "lucide-react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import { useFile } from "@/hooks/useFile";
import { useLoading } from "@/hooks/useLoading";
import { useOpenApi } from "@/hooks/useOpenApi";
import { useTerminal } from "@/hooks/useTerminal";
import { useTestRunner } from "@/hooks/useTestRunner";
import type { OpenAPIV3 } from "openapi-types";
import type { EndpointRow } from "@/types/endPointRow.type";

type OperationObject = OpenAPIV3.OperationObject;
type PathItemObject = OpenAPIV3.PathItemObject;

const TestDetailsPane: React.FC = () => {
  const { file } = useFile();
  const { spec } = useOpenApi();
  const { logToTerminal } = useTerminal();
  const { loading, setLoading } = useLoading();
  const { runTests } = useTestRunner();

  // Build table rows from OpenAPI spec
  const data: EndpointRow[] = useMemo(() => {
    if (!spec?.paths) return [];
    const rows: EndpointRow[] = [];

    for (const [path, pathItem] of Object.entries(spec.paths) as [string, PathItemObject][]) {
      for (const [method, operation] of Object.entries(pathItem) as [string, OperationObject][]) {
        rows.push({
          method: method.toUpperCase(),
          path,
          summary: operation.summary || "-",
          responses: Object.keys(operation.responses || {}).join(", "),
        });
      }
    }

    return rows;
  }, [spec]);

  // Define table columns
  const columns = useMemo<ColumnDef<EndpointRow>[]>(
    () => [
      { accessorKey: "method", header: "Method" },
      { accessorKey: "path", header: "Path" },
      { accessorKey: "summary", header: "Summary" },
      { accessorKey: "responses", header: "Responses" },
    ],
    []
  );

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Run tests handler
  const handleRunTests = async () => {
    if (!spec) return;
    try {
      setLoading(true);
      await runTests(spec, logToTerminal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.test_details_page} bg-slate-950`} id="TEST_DETAILS_PANE">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-white flex flex-col justify-center px-12 space-y-2">
        <span className="text-2xl font-bold">Edit & Modify Test Configurations</span>
        <p className="text-green-300">Using Ollama Model: Gemma2:2b</p>
      </h1>

      <div className="grid space-x-3 px-3 items-center">
        {/* File Info Section */}
        <section className={`${styles.test_info} bg-slate-900`}>
          <header>
            <span>Test Case & File Details</span>
          </header>
          <div className="px-4 py-2">
            <div className="flex flex-col space-y-1 text-white">
              <span className="font-bold flex space-x-2">
                <FileIcon className="mr-2" />
                UPLOADED FILE
              </span>
              <span className="px-8">{file ? file.name : "No file uploaded"}</span>
            </div>

            <div className="flex flex-col space-y-1 text-white">
              <span className="font-bold flex space-x-2 mt-4">
                <FileTypeIcon className="mr-2" />
                FILE TYPE
              </span>
              <span className="px-8 text-white">
                {file?.name.endsWith(".json")
                  ? "JSON"
                  : file?.name.endsWith(".yaml") || file?.name.endsWith(".yml")
                    ? "YAML"
                    : "Unknown"}
              </span>
            </div>

            <div className="flex flex-col space-y-1 text-white">
              <span className="font-bold flex space-x-2 mt-4">
                <LeafyGreenIcon className="mr-2" />
                FILE SIZE
              </span>
              <span className="px-8 text-white">
                {file ? `${(file.size / 1024).toFixed(2)} KB` : "N/A"}
              </span>
            </div>
          </div>
        </section>

        {/* Test Runner Section */}
        <section className={`${styles.test_info} bg-gray-700`}>
          <header className="flex justify-between items-center text-white font-bold">
            <span>Run & View Test Results</span>
            <Button
              type="button"
              disabled={!file || loading}
              onClick={handleRunTests}
              className={`${styles.generate_test_cases_btn} cursor-pointer py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
            >
              {loading ? "Generating..." : <><PlayIcon /> Generate Test Cases</>}
            </Button>
          </header>

          {/* API Endpoints Table */}
          <div className="p-6 bg-slate-950 text-white">
            <h1 className="text-2xl font-bold mb-4">API Endpoints</h1>
            {data.length === 0 ? (
              <p>No endpoints found</p>
            ) : (
              <table className="min-w-full border border-gray-700">
                <thead className="bg-gray-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2 border border-gray-700 text-left"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-700">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-2 border border-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestDetailsPane;
