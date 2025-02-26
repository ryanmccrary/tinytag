import { setCookie, getCookie, generateId, getAnalyticsCookie } from './cookie.js';

describe('Cookie Utilities', () => {
  beforeEach(() => {
    // Explicitly clear all cookies by expiring them
    document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
      // Extra safety: ensure specific cookies are cleared
      document.cookie = 'ajs_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = 'rl_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = 'fallback=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  test('setCookie and getCookie work together', () => {
    setCookie('test', 'value');
    expect(getCookie('test')).toBe('value');
  });

  test('generateId creates a valid UUID', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('getAnalyticsCookie prefers Segment over RudderStack', () => {
    setCookie('ajs_test', 'segment');
    setCookie('rl_test', 'rudder');
    expect(getAnalyticsCookie('test', 'fallback')).toBe('segment');
  });

  test('getAnalyticsCookie prefers RudderStack over TinyTag', () => {
    setCookie('rl_test', 'rudder');
    setCookie('fallback', 'tinytag');
    expect(getAnalyticsCookie('test', 'fallback')).toBe('rudder');
  });

  test('getAnalyticsCookie falls back to TinyTag cookie', () => {
    document.cookie = 'ajs_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'rl_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setCookie('fallback', 'tinytag');
    expect(getAnalyticsCookie('test', 'fallback')).toBe('tinytag');
  });
});