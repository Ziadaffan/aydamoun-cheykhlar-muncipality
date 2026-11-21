import { toast } from 'react-toastify';
import { isDarkTheme } from './utils/theme.utils';

export const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  toast[type](message, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    rtl: true,
    theme: isDarkTheme() ? 'dark' : 'light',
    style: {
      fontSize: '14px',
      maxWidth: '90vw',
      margin: '10px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};
