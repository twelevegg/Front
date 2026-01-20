import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';

import App from './app/App.jsx';
import { AuthProvider } from './features/auth/AuthProvider.jsx';
import { CoPilotProvider } from './features/copilot/CoPilotProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CoPilotProvider>
          <App />
        </CoPilotProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
