import './App.css'
import Terminal from './features/test-runner'
import { FileProvider } from './context/fileContext'
import { OpenApiProvider } from './context/openApiContext'
import SchemaPage from './features/schema-input'
import TestDetailsPane from './features/test-details'
import { TestRunnerProvider } from './features/test-runner/TestRunnerContext'
function App() {
  return (
    <>
      <TestRunnerProvider>
        <OpenApiProvider>
          <FileProvider>
            <SchemaPage />
            <TestDetailsPane />
            <Terminal/>
          </FileProvider>
        </OpenApiProvider >
      </TestRunnerProvider >
    </>
  )
}

export default App
