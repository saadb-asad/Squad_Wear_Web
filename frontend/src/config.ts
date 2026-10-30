export const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8787' : 'https://squadgear-api.saadbasad18.workers.dev');
export const FREE_SHIPPING_THRESHOLD = 5000;
