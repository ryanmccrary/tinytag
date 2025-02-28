// import CryptoJS from 'crypto-js'; // For v1 decryption
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js'; // Needed for tests
import { getCookie } from './cookie.js'; // Reuse TinyTag's getCookie

// RudderStack v1 decryption key (placeholder, needs actual key)
const V1_ENCRYPTION_KEY = 'Rudder'; // Replace with real key from RudderStack

function decryptV1Cookie(value) {
    if (value && !value.startsWith('RS_ENC_v3_')) {
      try {
        const bytes = AES.decrypt(value, V1_ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || value;
      } catch (e) {
        return value;
      }
    }
    return value;
  }
  
  const originalGetUserId = window.tt.getUserId;
  window.tt.getUserId = function () {
    const value = getCookie('rl_user_id');
    return decryptV1Cookie(value) || originalGetUserId();
  };
  
  const originalGetAnonymousId = window.tt.getAnonymousId;
  window.tt.getAnonymousId = function () {
    const value = getCookie('rl_anonymous_id');
    return decryptV1Cookie(value) || originalGetAnonymousId();
  };
  
  const originalGetTraits = window.tt.getTraits;
  window.tt.getTraits = function () {
    const value = getCookie('rl_trait');
    const decoded = decryptV1Cookie(value);
    return decoded ? JSON.parse(decoded) : originalGetTraits();
  };
  
  export { decryptV1Cookie };