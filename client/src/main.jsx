import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider } from './store/auth.jsx'; // auth.jsx
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from "./store/cart.jsx";

import './index.css';
import AppWrapper from './App.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <AppWrapper />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            bodyClassName="toastBody"
          />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);