import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import UlamSpiralPage from './Ulam.tsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UlamSpiralPage />
    <ToastContainer />
  </StrictMode>
);
