import {AbstractValidationHandler, ValidationParams} from './validation-handler';
import {Jwt} from '../crypto/jwt';

/**
 * Validates the signature of an id_token against one
 * of the keys of an JSON Web Key Set (jwks).
 *
 * This jwks can be provided by the discovery document.
 */
export class JwksValidationHandler extends AbstractValidationHandler {

  /**
   * Time period in seconds the timestamp in the signature can
   * differ from the current time.
   */
  gracePeriodInSec = 600;

  private jwt: Jwt = new Jwt();

  async validateSignature(params: ValidationParams, retry = false): Promise<any> {
    if (!params.idToken) { throw new Error('Parameter idToken expected!'); }
    if (!params.idTokenHeader) {
      throw new Error('Parameter idTokenHandler expected.');
    }
    if (!params.jwks) { throw new Error('Parameter jwks expected!'); }

    if (
      !params.jwks['keys'] ||
      !Array.isArray(params.jwks['keys']) ||
      params.jwks['keys'].length === 0
    ) {
      throw new Error('Array keys in jwks missing!');
    }

    const kid: string = params.idTokenHeader['kid'];
    const keys: JsonWebKey[] = params.jwks['keys'];
    let key: JsonWebKey;

    const alg = params.idTokenHeader['alg'];

    if (kid) {
      key = keys.find(k => k['kid'] === kid /* && k['use'] === 'sig' */);
    } else {
      const kty = this.alg2kty(alg);
      const matchingKeys = keys.filter(
        k => k['kty'] === kty && k['use'] === 'sig'
      );

      if (matchingKeys.length > 1) {
        const error =
          'More than one matching key found. Please specify a kid in the id_token header.';
        console.error(error);
        return Promise.reject(error);
      } else if (matchingKeys.length === 1) {
        key = matchingKeys[0];
      }
    }

    if (!key && !retry && params.loadKeys) {
      return params
        .loadKeys()
        .then(loadedKeys => (params.jwks = loadedKeys))
        .then(_ => this.validateSignature(params, true));
    }

    if (!key && retry && !kid) {
      const error = 'No matching key found.';
      console.error(error);
      return Promise.reject(error);
    }

    if (!key && retry && kid) {
      const error =
        'expected key not found in property jwks. ' +
        'This property is most likely loaded with the ' +
        'discovery document. ' +
        'Expected key id (kid): ' +
        kid;

      console.error(error);
      return Promise.reject(error);
    }

    const isValid = await this.jwt.verify(params.idToken, key, alg);

    if (isValid) {
      return Promise.resolve(true);
    } else {
      return Promise.reject('Signature not valid');
    }
  }

  private alg2kty(alg: string) {
    switch (alg.charAt(0)) {
      case 'R':
        return 'RSA';
      case 'E':
        return 'EC';
      default:
        throw new Error('Cannot infer kty from alg: ' + alg);
    }
  }

  async calcHash(valueToHash: string, algorithm: string): Promise<string> {
    return this.jwt.hash(valueToHash, algorithm);
  }

}
