import { useState } from 'react';
import Navbar from './components/Navbar';
import CustomersPage from './pages/CustomersPage';
import TransferPage from './pages/TransferPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('customers');

  return (
    <div className="app">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main className="app-content">
        {currentView === 'customers' && <CustomersPage />}
        {currentView === 'transfer' && <TransferPage />}
        {currentView === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}

export default App;
