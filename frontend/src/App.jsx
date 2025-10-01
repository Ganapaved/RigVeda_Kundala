import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CulturalBackground from './components/CulturalBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SuktaView from './pages/SuktaView';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <CulturalBackground />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sukta/:id" element={<SuktaView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;