import React, { useMemo, useContext, useState } from "react";
import styles from "./index.module.scss";
import { useFile } from "@/context/fileContext";
import { FileIcon, FileTypeIcon, LeafyGreenIcon, PlayIcon } from "lucide-react";
import { useOpenApi } from "@/context/openApiContext";
import { TestRunnerContext } from "../test-runner/TestRunnerContext";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";

type EndpointRow = {
  method: string;
  path: string;
  summary: string;
  responses: string;
};

const TestDetailsPane: React.FC = () => {
  const { file } = useFile();
  const { spec } = useOpenApi();

  // ✅ use TestRunnerContext
  const ctx = useContext(TestRunnerContext);
  const [loading, setLoading] = useState(false);

  if (!ctx) {
    return <p className="text-red-500">❌ TestRunnerProvider missing!</p>;
  }

  const { runTests, results } = ctx;

  // Build table rows from spec
  const data: EndpointRow[] = useMemo(() => {
    if (!spec || !spec.paths) return [];
    const rows: EndpointRow[] = [];
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods || {})) {
        rows.push({
          method: method.toUpperCase(),
          path,
          summary: (operation as any).summary || "-",
          responses: Object.keys((operation as any).responses || {}).join(", "),
        });
      }
    }
    return rows;
  }, [spec]);

  const columns = useMemo<ColumnDef<EndpointRow>[]>(
    () => [
      { accessorKey: "method", header: "Method" },
      { accessorKey: "path", header: "Path" },
      { accessorKey: "summary", header: "Summary" },
      { accessorKey: "responses", header: "Responses" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRunTests = async () => {
    if (!spec) return;
    try {
      setLoading(true);
      await runTests(spec);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.test_details_page} bg-slate-950 `}>
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-white text-2xl font-bold flex items-center px-12">
        <span>Edit & Modify Test Configurations</span>
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
              <span className="px-8">
                {file ? file.name : "No file uploaded"}
              </span>
            </div>

            <div className="flex flex-col space-y-1 text-white">
              <span className="font-bold text-white flex space-x-2 mt-4">
                <FileTypeIcon className="mr-2" />
                FILE TYPE
              </span>
              <span className="px-8 text-white">
                {file?.name.endsWith(".json")
                  ? "JSON"
                  : file?.name.endsWith(".yaml") ||
                    file?.name.endsWith(".yml")
                    ? "YAML"
                    : "Unknown"}
              </span>
            </div>

            <div className="flex flex-col space-y-1 text-white">
              <span className="font-bold text-white flex space-x-2 mt-4">
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
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-700">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-2 border border-gray-700"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Generated Test Cases */}
          <div className="p-6 bg-slate-950 text-white">
            <h1 className="text-2xl font-bold mb-4">Generated Test Cases</h1>
            {results.length === 0 ? (
              <p>No test cases yet. Click the button above.</p>
            ) : (
              <ul className="space-y-2">
                {results.map((tc: any, i: number) => (
                  <li
                    key={i}
                    className="p-2 border border-gray-700 rounded"
                  >
                    {tc.name ?? `Test Case ${i + 1}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestDetailsPane;
