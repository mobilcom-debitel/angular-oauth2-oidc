export class Algorithms {
  public static get(key: string): any {
    return algorithms[key];
  }
}

// See https://www.w3.org/TR/WebCryptoAPI/#jwk-mapping
const algorithms = {
    'RS1': {
      'name': 'RSASSA-PKCS1-v1_5',
      'hash': {
        'name': 'SHA-1'
      }
    },
    'RS256': {
      'name': 'RSASSA-PKCS1-v1_5',
      'hash': {
        'name': 'SHA-256'
      }
    },
    'RS384': {
      'name': 'RSASSA-PKCS1-v1_5',
      'hash': {
        'name': 'SHA-384'
      }
    },
    'RS512': {
      'name': 'RSASSA-PKCS1-v1_5',
      'hash': {
        'name': 'SHA-512'
      }
    },
    'PS256': {
      'name': 'RSA-PSS',
      'hash': {
        'name': 'SHA-256'
      }
    },
    'PS384': {
      'name': 'RSA-PSS',
      'hash': {
        'name': 'SHA-384'
      }
    },
    'PS512': {
      'name': 'RSA-PSS',
      'hash': {
        'name': 'SHA-512'
      }
    },
    'RSA-OAEP': {
      'name': 'RSA-OAEP',
      'hash': {
        'name': 'SHA-1'
      }
    },
    'RSA-OAEP-256': {
      'name': 'RSA-OAEP',
      'hash': {
        'name': 'SHA-256'
      }
    },
    'RSA-OAEP-384': {
      'name': 'RSA-OAEP',
      'hash': {
        'name': 'SHA-384'
      }
    },
    'RSA-OAEP-512': {
      'name': 'RSA-OAEP',
      'hash': {
        'name': 'SHA-512'
      }
    },
    'ES256': {
      'name': 'ECDSA',
      'namedCurve': 'P-256',
      'hash': {
        'name': 'SHA-256'
      }
    },
    'ES384': {
      'name': 'ECDSA',
      'namedCurve': 'P-384',
      'hash': {
        'name': 'SHA-384'
      }
    },
    'ES512': {
      'name': 'ECDSA',
      'namedCurve': 'P-521',
      'hash': {
        'name': 'SHA-512'
      }
    },
    'A128CTR': {
      'name': 'AES-CTR',
      'length': 128
    },
    'A192CTR': {
      'name': 'AES-CTR',
      'length': 192
    },
    'A256CTR': {
      'name': 'AES-CTR',
      'length': 256
    },
    'A128CBC': {
      'name': 'AES-CBC',
      'length': 128
    },
    'A192CBC': {
      'name': 'AES-CBC',
      'length': 192
    },
    'A256CBC': {
      'name': 'AES-CBC',
      'length': 256
    },
    'A128KW': {
      'name': 'AES-KW',
      'length': 128
    },
    'A192KW': {
      'name': 'AES-KW',
      'length': 192
    },
    'A256KW': {
      'name': 'AES-KW',
      'length': 256
    },
    'A128GCM': {
      'name': 'AES-GCM',
      'length': 128
    },
    'A192GCM': {
      'name': 'AES-GCM',
      'length': 192
    },
    'A256GCM': {
      'name': 'AES-GCM',
      'length': 256
    },
    'A128GCMKW': {
      'name': 'AES-GCM',
      'length': 128
    },
    'A192GCMKW': {
      'name': 'AES-GCM',
      'length': 192
    },
    'A256GCMKW': {
      'name': 'AES-GCM',
      'length': 256
    },
    'HS1': {
      'name': 'HMAC',
      'hash': {
        'name': 'SHA-1'
      }
    },
    'HS256': {
      'name': 'HMAC',
      'hash': {
        'name': 'SHA-256'
      }
    },
    'HS384': {
      'name': 'HMAC',
      'hash': {
        'name': 'SHA-384'
      }
    },
    'HS512': {
      'name': 'HMAC',
      'hash': {
        'name': 'SHA-512'
      }
    }
  };
