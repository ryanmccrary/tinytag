// import CryptoJS from 'crypto-js'; // For v1 decryption
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js'; // Needed for tests
import { getCookie } from './cookie.js'; // Reuse TinyTag's getCookie

// RudderStack v1 decryption key (placeholder, needs actual key)
const V1_ENCRYPTION_KEY = 'Rudder'; // Replace with real key from RudderStack

// Decode v3 encoded cookie (base64 JSON)
function decodeV3Cookie(value) {
  if (value && value.startsWith('RS_ENC_v3_')) {
    const encoded = value.replace('RS_ENC_v3_', '');
    try {
      return JSON.parse(atob(encoded));
    } catch (e) {
      return null; // Invalid encoding
    }
  }
  return value; // Not v3, return as-is
}

// Decrypt v1 encrypted cookie
function decryptV1Cookie(value) {
    if (value && !value.startsWith('RS_ENC_v3_')) {
      try {
        const bytes = AES.decrypt(value, V1_ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || value; // Return original if decryption fails or is empty
      } catch (e) {
        return value; // Return original on exception
      }
    }
    return value; // Not v3 or encrypted, return as-is
  }

// Enhance window.tt methods with RudderStack compatibility
const originalGetUserId = window.tt.getUserId;
window.tt.getUserId = function () {
  const value = getCookie('rl_user_id');
  return decodeV3Cookie(decryptV1Cookie(value)) || originalGetUserId();
};

const originalGetAnonymousId = window.tt.getAnonymousId;
window.tt.getAnonymousId = function () {
  const value = getCookie('rl_anonymous_id');
  return decodeV3Cookie(decryptV1Cookie(value)) || originalGetAnonymousId();
};

const originalGetTraits = window.tt.getTraits;
window.tt.getTraits = function () {
  const value = getCookie('rl_trait');
  const decoded = decodeV3Cookie(decryptV1Cookie(value));
  return decoded ? JSON.parse(decoded) : originalGetTraits();
};

// Export for testing (optional, not used in IIFE)
export { decodeV3Cookie, decryptV1Cookie };