import {Algorithms} from './algorithms';
import {JwtHelperService} from '@auth0/angular-jwt';

export class Jwt {

  private jwtHelper = new JwtHelperService();

  private cyptoObj: Crypto = window.crypto || (window as any).msCrypto; // for IE11
  private textEncoder = new (window as any).TextEncoder();

  // Needed for signature decoding
  private static parseBase64(base64url) {
    base64url = base64url.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    return new Uint8Array(Array.prototype.map.call(atob(base64url), function (c) { return c.charCodeAt(0); }));
  }

  public async hash(valueToHash: string, algorithm: string): Promise<string> {
    const valueAsBytes = this.textEncoder.encode(valueToHash);
    const resultBytes = await this.cyptoObj.subtle.digest(algorithm, valueAsBytes);
    return String.fromCharCode.apply(null, new Uint8Array(resultBytes));
  }

  public async verify(jwt: string, key: JsonWebKey, alg?: string): Promise<boolean> {
    const [header, body, sig] = jwt.split('.');
    if (!alg) {
      const decodedHeader = this.decodePart(header);
      if (!decodedHeader['alg']) {
        throw new Error('Cannot get algorithm from header.');
      }
      alg = decodedHeader['alg'];
    }
    const keyDict = Algorithms.get(alg);
    const decodedSig = Jwt.parseBase64(sig);
    const payload = this.textEncoder.encode([header, body].join('.'));
    const cyptokey = await this.cyptoObj.subtle.importKey('jwk', key as any, keyDict, true, ['verify']);
    return await this.cyptoObj.subtle.verify(keyDict.name, cyptokey, decodedSig, payload);
  }

  public decodePart(part: string): any {
    const decoded = this.jwtHelper.urlBase64Decode(part);
    if (!decoded) {
      throw new Error('Cannot decode the part.');
    }
    return JSON.parse(decoded);
  }

}
