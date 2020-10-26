import CryptoJS from "crypto-js";
const key = CryptoJS.enc.Latin1.parse("f4k9f5w7f8g4er26"); // 密钥
const iv = CryptoJS.enc.Latin1.parse("5e8y6w45ju8w9jq8"); // 偏移量
export default {
  encrypt: message => {
    if (!message) return "";
    let encrypted = CryptoJS.AES.encrypt(message, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    let res = encrypted.toString();
    return encodeURIComponent(res);
  },
  decrypt: encrypted => {
    if (!encrypted) return "";

    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      padding: CryptoJS.pad.ZeroPadding
    });
    let res = decrypted.toString(CryptoJS.enc.Utf8);
    return res;
  }
};
