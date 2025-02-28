
import '../src/index.js'; // Load tt.js first to set up window.tt
import '../src/rudder-compat.js'; // Then load rudder-compat.js to enhance it
import { setCookie, getCookie } from '../src/cookie.js';
import { decodeV3Cookie, decryptV1Cookie } from '../src/rudder-compat.js';
import CryptoJS from 'crypto-js';

describe('RudderStack Compatibility', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  });

  test('window.tt.getUserId reads v1 encrypted cookie', () => {
    const plainValue = 'user123';
    const encrypted = CryptoJS.AES.encrypt(plainValue, 'Rudder').toString();
    setCookie('rl_user_id', encrypted);
    expect(window.tt.getUserId()).toBe(plainValue);
  });

  test('window.tt.getAnonymousId reads v1 encrypted cookie', () => {
    const plainValue = 'anon123';
    const encrypted = CryptoJS.AES.encrypt(plainValue, 'Rudder').toString();
    setCookie('rl_anonymous_id', encrypted);
    expect(window.tt.getAnonymousId()).toBe(plainValue);
  });

  test('window.tt.getTraits reads v1 encrypted traits', () => {
    const traits = { email: 'test@example.com' };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(traits), 'Rudder').toString();
    setCookie('rl_trait', encrypted);
    expect(window.tt.getTraits()).toEqual(traits);
  });
});