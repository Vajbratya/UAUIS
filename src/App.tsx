import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './components/Editor';
import { AIAssistant } from './components/AIAssistant';

function App() {
  // TODO: Replace with actual auth check
  const isAuthenticated = false;

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/editor"
            element={isAuthenticated ? <Editor /> : <Navigate to="/" />}
          />
          <Route
            path="/ai-assistant"
            element={isAuthenticated ? <AIAssistant /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
