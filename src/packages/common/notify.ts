import { toast } from 'react-toastify';

export const notify = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
  });
};
