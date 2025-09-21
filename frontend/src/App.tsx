import './App.css'
import Navbar01 from './components/ui/navbar'
import { FileProvider } from './context/FileProvider'
import { LoadingProvider } from './context/LoadingProvider'
import { OpenApiProvider } from './context/openApiProvider'
import { TerminalProvider } from './context/TerminalProvider'
import { TestRunnerProvider } from './context/TestRunnerProvider'
import Dashboard from './features/dashboard'
import SchemaPage from './features/schema-input'
import TestDetailsPane from './features/test-details'
import TestRunner from './features/test-runner'
function App() {
  return (
    <>
      <TestRunnerProvider>
        <OpenApiProvider>
          <FileProvider>
            <TerminalProvider>
              <LoadingProvider>
                <Navbar01 />
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
