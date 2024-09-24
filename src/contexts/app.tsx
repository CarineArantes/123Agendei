import { ReactNode } from 'react'

import { ConfigProvider } from './config'

interface AppProviderProps {
  children: ReactNode
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  )
}

export { AppProvider }
