// Minimal Toast Events for RentRider
import { showToast } from '../components/CustomToast';

// Simple toast manager
class ToastEventManager {
  handleUrlToasts() {
    // Only handle URL-based toasts if needed
  }
}

// Minimal essential toast events
export const appToastEvents = {
  success: (message) => showToast.success(message, { duration: 2000 }),
  error: (message) => showToast.error(message, { duration: 2000 }),
  warning: (message) => showToast.warning(message, { duration: 2000 }),
  info: (message) => showToast.info(message, { duration: 2000 })
};

// Initialize minimal toast manager
export const toastManager = new ToastEventManager();

// Export for use in components
export default appToastEvents;