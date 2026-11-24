import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { LostItemsPage } from './pages/LostItemsPage';
import { FoundItemsPage } from './pages/FoundItemsPage';
import { MatchesPage } from './pages/MatchesPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/report-lost" element={<ReportLostPage />} />
                <Route path="/report-found" element={<ReportFoundPage />} />
                <Route path="/lost-items" element={<LostItemsPage />} />
                <Route path="/found-items" element={<FoundItemsPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/item/:id" element={<ItemDetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
