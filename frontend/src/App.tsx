import './App.css'
import Navbar01 from './components/ui/navbar'
import { FileProvider } from './context/FileProvider'
import { LoadingProvider } from './context/LoadingProvider'
import { OpenApiProvider } from './context/openApiProvider'
import { TerminalProvider } from './context/TerminalProvider'
import { TestRunnerProvider } from './context/TestRunnerProvider'
import MainLayout from './layout/main-layout'
function App() {
  return (
    <>
      <TestRunnerProvider>
        <OpenApiProvider>
          <FileProvider>
            <TerminalProvider>
              <LoadingProvider>
                <MainLayout Navbar={Navbar01} />
              </LoadingProvider>
            </TerminalProvider>
          </FileProvider>
        </OpenApiProvider>
      </TestRunnerProvider>

    </>
  )
}

export default App
