import { z } from "zod";

// 1. Schemas for the Components Section
// Validate that the key is a string and the value is any object
const SchemaObject = z.record(z.string(), z.any()); // Fix applied here
const ComponentsSchemas = z.record(z.string(), SchemaObject); // Fix applied here

const ComponentsSchema = z
  .object({
    schemas: ComponentsSchemas.optional(),
  })
  .optional();

// 2. Schemas for the Paths Section
// Apply the same fix to all z.record() uses for consistency
const ResponseSchema = z
  .object({
    description: z.string(),
    content: z.record(z.string(), z.any()).optional(), // Fix: z.record(z.string(), z.any())
  })
  .passthrough();

const OperationSchema = z
  .object({
    summary: z.string().optional(),
    description: z.string().optional(),
    requestBody: z.any().optional(),
    responses: z.record(z.string(), ResponseSchema), // Fix: z.record(z.string(), ResponseSchema)
  })
  .passthrough();

// This is for the path items (e.g., the 'get', 'post' methods under a path)
// The keys are HTTP methods (strings) and the values are OperationSchema
const PathItemSchema = z.record(z.string(), OperationSchema); // Fix applied here

// This is for the main paths object (e.g., the '/books' path)
// The keys are route paths (strings) and the values are PathItemSchema
const PathsSchema = z.record(z.string(), PathItemSchema); // Fix applied here

// 3. The Main OpenAPI Schema
export const OpenApiSchema = z
  .object({
    openapi: z.string(),
    info: z.object({
      title: z.string(),
      description: z.string().optional(),
      version: z.string(),
    }),
    servers: z.array(z.any()).optional(),
    paths: PathsSchema,
    components: ComponentsSchema.optional(),
  })
  .passthrough();

export type OpenApiSpec = z.infer<typeof OpenApiSchema>;
