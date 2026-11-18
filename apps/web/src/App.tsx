import { configureApiBaseUrl } from './lib/api'
import { useNuiEvent } from './nui/useNuiEvent'
import { HomePage } from './pages/HomePage'

function App() {
  useNuiEvent<{ apiBaseUrl?: string }>('setConfig', (data) => {
    if (data.apiBaseUrl) {
      configureApiBaseUrl(data.apiBaseUrl)
    }
  })

  return <HomePage />
}

export default App
