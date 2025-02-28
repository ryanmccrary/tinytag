
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

  test('decodeV3Cookie decodes base64 v3 RudderStack cookie', () => {
    const v3Value = 'RS_ENC_v3_' + btoa(JSON.stringify('user123'));
    setCookie('rl_user_id', v3Value);
    expect(decodeV3Cookie(getCookie('rl_user_id'))).toBe('user123');
  });

  test('decodeV3Cookie returns original value if not v3 format', () => {
    setCookie('rl_user_id', 'plain-value');
    expect(decodeV3Cookie(getCookie('rl_user_id'))).toBe('plain-value');
  });
  
  test('decryptV1Cookie decrypts v1 RudderStack cookie', () => {
    const plainValue = 'anon123asdasdasdlskdjasdlkajdalskdjasldsdl';
    const encrypted = CryptoJS.AES.encrypt(plainValue, 'Rudder').toString();
    expect(decryptV1Cookie(encrypted)).toBe(plainValue); // Direct test
  });

  test('decryptV1Cookie returns original value if not encrypted', () => {
    setCookie('rl_anonymous_id', 'plain-value');
    expect(decryptV1Cookie(getCookie('rl_anonymous_id'))).toBe('plain-value');
  });

  test('window.tt.getUserId reads v3 encoded cookie', () => {
    const v3Value = 'RS_ENC_v3_' + btoa(JSON.stringify('user123'));
    setCookie('rl_user_id', v3Value);
    expect(window.tt.getUserId()).toBe('user123');
  });

  test('window.tt.getAnonymousId reads v1 encrypted cookie', () => {
    const plainValue = 'anon123';
    const encrypted = CryptoJS.AES.encrypt(plainValue, 'Rudder').toString();
    setCookie('rl_anonymous_id', encrypted);
    expect(window.tt.getAnonymousId()).toBe(plainValue);
  });

  test('window.tt.getTraits reads v3 encoded traits', () => {
    const traits = { email: 'test@example.com' };
    const v3Value = 'RS_ENC_v3_' + btoa(JSON.stringify(JSON.stringify(traits)));
    setCookie('rl_trait', v3Value);
    expect(window.tt.getTraits()).toEqual(traits);
  });

  test('decryptV1Cookie decrypts v1 RudderStack cookie', () => {
    const plainValue = 'anon123asdasdasdlskdjasdlkajdalskdjasldsdl';
    const encrypted = CryptoJS.AES.encrypt(plainValue, 'Rudder').toString();
    const decrypted = decryptV1Cookie(encrypted);
    console.log('Encrypted:', encrypted, 'Decrypted:', decrypted);
    expect(decrypted).toBe(plainValue);
  });
});