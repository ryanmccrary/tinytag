const COOKIE_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year

export function setCookie(name, value) {
  const expires = new Date(Date.now() + COOKIE_EXPIRY).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}

export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function getAnalyticsCookie(name, fallbackName) {
  const segmentCookie = getCookie(`ajs_${name}`);
  const rudderCookie = getCookie(`rl_${name}`);
  return segmentCookie || rudderCookie || getCookie(fallbackName);
}