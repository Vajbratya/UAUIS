import React from 'react'
import { Menu, Bell, Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'
import { useAppContext } from '../contexts/AppContext'
import { useTheme } from './ThemeProvider'

export function Header() {
  const { notifications } = useAppContext()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="bg-background text-foreground p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Laudos.AI</h1>
        <span className="text-sm">Report Generator</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{notifications.length}</span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full transition-colors duration-200"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6 text-slate-900 transition-transform duration-200 rotate-0 scale-100" />
          ) : (
            <Sun className="h-6 w-6 text-yellow-400 transition-transform duration-200 rotate-90 scale-0" />
          )}
        </Button>
      </div>
    </header>
  )
}
