/**
 * Device ID Utility
 * 
 * Generates and persists a unique device identifier in localStorage
 * Used for tracking anonymous users across sessions
 */

const DEVICE_ID_KEY = 'ajdrew_device_id';

export function getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') {
        // Server-side rendering
        return '';
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
        // Generate new UUID with fallback for non-secure contexts
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            deviceId = crypto.randomUUID();
        } else {
            // Fallback UUID generator
            deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
}

export function getDeviceId(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem(DEVICE_ID_KEY);
}

export function clearDeviceId(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(DEVICE_ID_KEY);
    }
}
