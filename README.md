## OpenAPI Testing Tool

Automatically generate comprehensive API test cases from your OpenAPI specification using a local Ollama model. This tool simplifies API validation, reduces manual effort, and integrates seamlessly into your development workflow.

For learning more about OpenAPI Specifications: https://spec.openapis.org/oas/v3.1.0.html#openapi-specification

### Features

- **OpenAPI Integration** - Parses your API specification to understand endpoints and schemas.
- **Local Ollama Model** - Uses a locally hosted LLM for generating intelligent test cases.
- **Automated Test Generation** - Quickly produces unit/integration tests for endpoints.
- **User Friendly Interface** - View the snapshots of the application below
- **Fast & Secure** - No external API calls; all processing happens locally.

### Prequisities

- Node.js `v22.12.0` or higher (Important)
- npm or yarn
- Ollama installed locally (https://ollama.com/download)
- Your OpenAPI specification file (`openapi.yaml` or .json)

## 🛠 Installation Steps

1. Clone the Repository

```shell
git clone git@github.com:eddyseed/OpenAPI-Testing-Tool.git
cd OpenAPI-Testing-Tool/
```

2. Install Dependencies (For both Frontend & Backend)

```shell
npm install
```

3. Verify Ollama Installation

```shell
ollama list
```

Ensure your desired model (e.g., `phi3:mini`) is available.

4. Edit your `.env.sample` in `backend/`
```env
# All variables should be changed according to the development requirements.

PORT=3000
NODE_ENV=development 

LOCAL_HOST=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
OLLAMA_HOST=http://localhost:11434

#Set your own local model name
MODEL_NAME=your_model_name
```
> For getting a list of all models do `ollama list`

## Screenshots


