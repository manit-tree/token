var sha256 = function(exports) {
  "use strict";
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var sha256$1 = { exports: {} };
  var convertHex = { exports: {} };
  var hasRequiredConvertHex;
  function requireConvertHex() {
    if (hasRequiredConvertHex) return convertHex.exports;
    hasRequiredConvertHex = 1;
    (function(module) {
      !function(globals) {
        var convertHex2 = {
          bytesToHex: function(bytes) {
            return arrBytesToHex(bytes);
          },
          hexToBytes: function(hex) {
            if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.");
            if (hex.indexOf("0x") === 0) hex = hex.slice(2);
            return hex.match(/../g).map(function(x) {
              return parseInt(x, 16);
            });
          }
        };
        function arrBytesToHex(bytes) {
          return bytes.map(function(x) {
            return padLeft(x.toString(16), 2);
          }).join("");
        }
        function padLeft(orig, len) {
          if (orig.length > len) return orig;
          return Array(len - orig.length + 1).join("0") + orig;
        }
        if (module.exports) {
          module.exports = convertHex2;
        } else {
          globals.convertHex = convertHex2;
        }
      }(commonjsGlobal);
    })(convertHex);
    return convertHex.exports;
  }
  var convertString = { exports: {} };
  var hasRequiredConvertString;
  function requireConvertString() {
    if (hasRequiredConvertString) return convertString.exports;
    hasRequiredConvertString = 1;
    (function(module) {
      !function(globals) {
        var convertString2 = {
          bytesToString: function(bytes) {
            return bytes.map(function(x) {
              return String.fromCharCode(x);
            }).join("");
          },
          stringToBytes: function(str) {
            return str.split("").map(function(x) {
              return x.charCodeAt(0);
            });
          }
        };
        convertString2.UTF8 = {
          bytesToString: function(bytes) {
            return decodeURIComponent(escape(convertString2.bytesToString(bytes)));
          },
          stringToBytes: function(str) {
            return convertString2.stringToBytes(unescape(encodeURIComponent(str)));
          }
        };
        if (module.exports) {
          module.exports = convertString2;
        } else {
          globals.convertString = convertString2;
        }
      }(commonjsGlobal);
    })(convertString);
    return convertString.exports;
  }
  (function(module) {
    !function(globals) {
      var _imports = {};
      if (module.exports) {
        _imports.bytesToHex = requireConvertHex().bytesToHex;
        _imports.convertString = requireConvertString();
        module.exports = sha2563;
      } else {
        _imports.bytesToHex = globals.convertHex.bytesToHex;
        _imports.convertString = globals.convertString;
        globals.sha256 = sha2563;
      }
      var K = [];
      !function() {
        function isPrime(n2) {
          var sqrtN = Math.sqrt(n2);
          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n2 % factor)) return false;
          }
          return true;
        }
        function getFractionalBits(n2) {
          return (n2 - (n2 | 0)) * 4294967296 | 0;
        }
        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
          if (isPrime(n)) {
            K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
            nPrime++;
          }
          n++;
        }
      }();
      var bytesToWords = function(bytes) {
        var words = [];
        for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
          words[b >>> 5] |= bytes[i] << 24 - b % 32;
        }
        return words;
      };
      var wordsToBytes = function(words) {
        var bytes = [];
        for (var b = 0; b < words.length * 32; b += 8) {
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
        }
        return bytes;
      };
      var W = [];
      var processBlock = function(H, M, offset) {
        var a = H[0], b = H[1], c = H[2], d = H[3];
        var e = H[4], f = H[5], g = H[6], h = H[7];
        for (var i = 0; i < 64; i++) {
          if (i < 16) {
            W[i] = M[offset + i] | 0;
          } else {
            var gamma0x = W[i - 15];
            var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
            var gamma1x = W[i - 2];
            var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
            W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
          }
          var ch = e & f ^ ~e & g;
          var maj = a & b ^ a & c ^ b & c;
          var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
          var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
          var t1 = h + sigma1 + ch + K[i] + W[i];
          var t2 = sigma0 + maj;
          h = g;
          g = f;
          f = e;
          e = d + t1 | 0;
          d = c;
          c = b;
          b = a;
          a = t1 + t2 | 0;
        }
        H[0] = H[0] + a | 0;
        H[1] = H[1] + b | 0;
        H[2] = H[2] + c | 0;
        H[3] = H[3] + d | 0;
        H[4] = H[4] + e | 0;
        H[5] = H[5] + f | 0;
        H[6] = H[6] + g | 0;
        H[7] = H[7] + h | 0;
      };
      function sha2563(message, options) {
        if (message.constructor === String) {
          message = _imports.convertString.UTF8.stringToBytes(message);
        }
        var H = [
          1779033703,
          3144134277,
          1013904242,
          2773480762,
          1359893119,
          2600822924,
          528734635,
          1541459225
        ];
        var m = bytesToWords(message);
        var l = message.length * 8;
        m[l >> 5] |= 128 << 24 - l % 32;
        m[(l + 64 >> 9 << 4) + 15] = l;
        for (var i = 0; i < m.length; i += 16) {
          processBlock(H, m, i);
        }
        var digestbytes = wordsToBytes(H);
        return options && options.asBytes ? digestbytes : options && options.asString ? _imports.convertString.bytesToString(digestbytes) : _imports.bytesToHex(digestbytes);
      }
      sha2563.x2 = function(message, options) {
        return sha2563(sha2563(message, { asBytes: true }), options);
      };
    }(commonjsGlobal);
  })(sha256$1);
  var sha256Exports = sha256$1.exports;
  const sha2562 = /* @__PURE__ */ getDefaultExportFromCjs(sha256Exports);
  function base64_encode(str) {
    return Buffer.from(str).toString("base64");
  }
  function base64_decode(str) {
    return Buffer.from(str, "base64");
  }
  function create_token(payload, secret) {
    let part1 = base64_encode(JSON.stringify(payload));
    let signature = sha2562(`${part1}.${secret}`);
    return part1 + "." + signature;
  }
  function verify_token(token, secret) {
    return new Promise((resolve, reject) => {
      let arr = token.split(".");
      if (arr.length == 2) {
        let signature = sha2562(`${arr[0]}.${secret}`);
        if (signature == arr[1]) {
          resolve(JSON.parse(base64_decode(arr[0])));
        } else {
          reject({ status: 501, description: "invalid signature" });
        }
      }
      reject({ status: 502, description: "invalid token" });
    });
  }
  exports.base64_decode = base64_decode;
  exports.base64_encode = base64_encode;
  exports.create_token = create_token;
  exports.sha256 = sha2562;
  exports.verify_token = verify_token;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
}({});
