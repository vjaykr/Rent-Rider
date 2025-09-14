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
  success: (message) => showToast.success(message),
  error: (message) => showToast.error(message),
  warning: (message) => showToast.warning(message),
  info: (message) => showToast.info(message)
};

// Initialize minimal toast manager
export const toastManager = new ToastEventManager();

// Export for use in components
export default appToastEvents;