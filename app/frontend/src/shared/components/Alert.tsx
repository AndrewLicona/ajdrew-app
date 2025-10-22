import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export interface AlertOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  showLoaderOnConfirm?: boolean;
  preConfirm?: <T = unknown>() => Promise<T>;
  toast?: boolean;
  position?: 'top' | 'top-start' | 'top-end' | 'center-start' | 'center-end' | 'bottom-start' | 'bottom-end';
}

export const Alert = {
  success: (title: string, text?: string) => {
    return MySwal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  },

  error: (title: string, text?: string) => {
    return MySwal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  },

  warning: (title: string, text?: string) => {
    return MySwal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  },

  info: (title: string, text?: string) => {
    return MySwal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  },

  confirm: (options: AlertOptions) => {
    return MySwal.fire({
      ...options,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    });
  },

  toast: (options: AlertOptions) => {
    return MySwal.fire({
      ...options,
      toast: true,
      position: options.position || 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast: HTMLElement) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }
};
