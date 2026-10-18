/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler for Google Maps authentication/key errors
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
};

// Console guard to suppress unhandled InvalidKeyMapError logs when no key or invalid key is configured
const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const msg = args.map((a) => String(a)).join(' ');
  if (
    msg.includes('InvalidKeyMapError') || 
    msg.includes('Google Maps JavaScript API error') ||
    msg.includes('ApiNotActivatedMapError')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
    return;
  }
  origConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
