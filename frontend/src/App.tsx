import './App.css'
import { FileProvider } from './context/fileContext'
import { LoadingProvider } from './context/LoadingContext'
import { OpenApiProvider } from './context/openApiContext'
import { TerminalProvider } from './context/TerminalContext'
import Dashboard from './features/dashboard'
import SchemaPage from './features/schema-input'
import TestDetailsPane from './features/test-details'
import TestRunner from './features/test-runner'
import { TestRunnerProvider } from './features/test-runner/TestRunnerContext'
function App() {
  return (
    <>
      <TestRunnerProvider>
        <OpenApiProvider>
          <FileProvider>
            <TerminalProvider>
              <LoadingProvider>
                <SchemaPage />
                <TestDetailsPane />
                <TestRunner />
                <Dashboard />
              </LoadingProvider>
            </TerminalProvider>
          </FileProvider>
        </OpenApiProvider >
      </TestRunnerProvider >
    </>
  )
}

export default App
