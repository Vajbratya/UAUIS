import React from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { Footer } from './components/Footer'
import { AIAssistant } from './components/AIAssistant'
import { Toaster } from './components/ui/toaster'
import { AppContextProvider } from './contexts/AppContext'

export function App() {
  return (
    <AppContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex min-h-0">
            <Sidebar />
            <main className="flex-1 p-4 flex min-h-0">
              <div className="flex-grow mr-4 min-h-0">
                <Editor />
              </div>
              <div className="w-64 min-h-0">
                <AIAssistant />
              </div>
            </main>
          </div>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </AppContextProvider>
  )
}
