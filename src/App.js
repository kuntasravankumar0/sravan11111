import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Tools
const ToolsIndex = lazy(() => import('./pages/tools/ToolsIndex'));
const QRCodeGenerator = lazy(() => import('./pages/tools/QRCodeGenerator'));
const Calculator = lazy(() => import('./pages/tools/Calculator'));
const FixMySpeaker = lazy(() => import('./pages/tools/FixMySpeaker'));
const TextTools = lazy(() => import('./pages/tools/TextTools'));
const TypingSpeedTest = lazy(() => import('./pages/tools/TypingSpeedTest'));
const UnitConverter = lazy(() => import('./pages/tools/UnitConverter'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            <Header />
            <main>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/templates" element={<Projects />} />

                  {/* Tools */}
                  <Route path="/tools" element={<ToolsIndex />} />
                  <Route path="/tools/qr-code" element={<QRCodeGenerator />} />
                  <Route path="/tools/calculator" element={<Calculator />} />
                  <Route path="/tools/speaker" element={<FixMySpeaker />} />
                  <Route path="/tools/text" element={<TextTools />} />
                  <Route path="/tools/typing" element={<TypingSpeedTest />} />
                  <Route path="/tools/converter" element={<UnitConverter />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
