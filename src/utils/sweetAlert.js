import Swal from 'sweetalert2';

/**
 * Configuración base de SweetAlert2 con el tema de la aplicación
 */
const swalBase = Swal.mixin({
  customClass: {
    popup: 'rounded-xl shadow-2xl',
    title: 'text-2xl font-bold',
    htmlContainer: 'text-gray-600 dark:text-gray-300',
    confirmButton: 'bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors mr-2',
    cancelButton: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2.5 px-6 rounded-lg transition-colors',
    denyButton: 'bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors mr-2',
  },
  buttonsStyling: false,
  reverseButtons: true,
});

/**
 * Muestra un diálogo de confirmación
 * @param {string} title - Título del diálogo
 * @param {string} text - Texto descriptivo
 * @param {string} confirmText - Texto del botón de confirmación
 * @param {string} cancelText - Texto del botón de cancelación
 * @returns {Promise<boolean>} - true si confirma, false si cancela
 */
export const confirmDialog = async ({
  title = '¿Estás seguro?',
  text = '',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  icon = 'question',
} = {}) => {
  const result = await swalBase.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    focusCancel: true,
  });

  return result.isConfirmed;
};

/**
 * Muestra un mensaje de éxito
 */
export const successAlert = async ({
  title = '¡Éxito!',
  text = '',
  timer = 2000,
} = {}) => {
  return swalBase.fire({
    title,
    text,
    icon: 'success',
    timer,
    showConfirmButton: false,
    toast: false,
  });
};

/**
 * Muestra un mensaje de error
 */
export const errorAlert = async ({
  title = 'Error',
  text = 'Algo salió mal',
} = {}) => {
  return swalBase.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Entendido',
  });
};

/**
 * Muestra un mensaje de advertencia
 */
export const warningAlert = async ({
  title = 'Advertencia',
  text = '',
} = {}) => {
  return swalBase.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'Entendido',
  });
};

/**
 * Muestra un mensaje de información
 */
export const infoAlert = async ({
  title = 'Información',
  text = '',
} = {}) => {
  return swalBase.fire({
    title,
    text,
    icon: 'info',
    confirmButtonText: 'Entendido',
  });
};

/**
 * Muestra un toast (notificación pequeña)
 */
export const showToast = ({
  title = '',
  icon = 'success',
  position = 'top-end',
  timer = 3000,
} = {}) => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};

/**
 * Muestra un diálogo de carga
 */
export const loadingAlert = ({
  title = 'Cargando...',
  text = 'Por favor espera',
} = {}) => {
  return swalBase.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Cierra cualquier alerta abierta
 */
export const closeAlert = () => {
  Swal.close();
};

export default swalBase;


