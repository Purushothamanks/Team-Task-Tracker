/**
 * TeamTask-Tracker Enterprise Real-Time Synchronization Service
 * Provides peer-to-peer tab-level real-time synchronization using BroadcastChannel
 * with fallback to storage event dispatchers.
 */

class RealtimeSyncService {
  constructor() {
    this.channelName = 'teamtask_tracker_enterprise_bus';
    this.channel = null;
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn('[RealtimeSync] BroadcastChannel not supported, falling back to storage events.', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('teamtask_')) {
          this.notifyListeners({
            type: 'STORAGE_SYNC',
            key: event.key,
            newValue: event.newValue ? JSON.parse(event.newValue) : null,
            timestamp: Date.now()
          });
        }
      });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(data) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('[RealtimeSync] Listener error:', err);
      }
    });
  }

  broadcast(type, payload) {
    const message = {
      type,
      payload,
      senderId: typeof window !== 'undefined' ? window.name || 'tab_' + Math.random().toString(36).substring(2, 9) : 'server',
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.warn('[RealtimeSync] Failed to post message via BroadcastChannel:', err);
      }
    }
  }

  broadcastTaskUpdate(tasks) {
    this.broadcast('TASKS_UPDATED', tasks);
  }

  broadcastMemberUpdate(members) {
    this.broadcast('MEMBERS_UPDATED', members);
  }

  broadcastAuditLog(logEntry) {
    this.broadcast('AUDIT_LOG_ADDED', logEntry);
  }
}

export const realtimeSync = new RealtimeSyncService();
