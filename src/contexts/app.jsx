import { ConfigProvider } from './config'

function AppProvider({ children }) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  )
}

export { AppProvider }
