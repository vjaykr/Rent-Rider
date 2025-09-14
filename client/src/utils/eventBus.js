// Global event bus for real-time updates
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
    // Also emit as window event for compatibility
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

export const eventBus = new EventBus();

// Helper functions for common events
export const emitUserUpdate = (user) => {
  eventBus.emit('user:updated', user);
};

export const emitDataRefresh = (type) => {
  eventBus.emit('data:refresh', { type });
};