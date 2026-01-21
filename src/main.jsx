import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';

import App from './app/App.jsx';
import { AuthProvider } from './features/auth/AuthProvider.jsx';
import { CoPilotProvider } from './features/copilot/CoPilotProvider.jsx';
import { ToastProvider } from './components/common/ToastProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CoPilotProvider>
            <App />
          </CoPilotProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
