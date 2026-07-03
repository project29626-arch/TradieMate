import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Quotes from './pages/Quotes';
import CreateQuote from './pages/CreateQuote';
import QuoteDetail from './pages/QuoteDetail';
import Profile from './pages/Profile';
import AppShell from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes wrapped in AppShell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/quotes/new" element={<CreateQuote />} />
              <Route path="/quotes/:id" element={<QuoteDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
