import type { AuthenticatorDevice } from '@simplewebauthn/typescript-types';

const {
  ENABLE_CONFORMANCE,
  ENABLE_HTTPS,
  RP_ID = 'pwa-nextjs-starter.vercel.app/'
  // RP_ID = 'localhost'
} = process.env;

interface LoggedInUser {
  id: string;
  username: string;
  devices: AuthenticatorDevice[];
  currentChallenge?: string;
}

/**
 * RP ID represents the "scope" of websites on which a authenticator should be usable. The Origin
 * represents the expected URL from which registration or authentication occurs.
 */
export const rpID = RP_ID;
// This value is set at the bottom of page as part of server initialization (the empty string is
// to appease TypeScript until we determine the expected origin based on whether or not HTTPS
// support is enabled)

export let expectedOrigin = '';
const port = 3000;
expectedOrigin = `https://pwa-nextjs-starter.vercel.app/`;
// expectedOrigin = `http://localhost:${port}`;

/**
 * 2FA and Passwordless WebAuthn flows expect you to be able to uniquely identify the user that
 * performs registration or authentication. The user ID you specify here should be your internal,
 * _unique_ ID for that user (uuid, etc...). Avoid using identifying information here, like email
 * addresses, as it may be stored within the authenticator.
 *
 * Here, the example server assumes the following user has completed login:
 */
export const loggedInUserId = 'internalUserId';

export const inMemoryUserDeviceDB: { [loggedInUserId: string]: LoggedInUser } =
  {
    [loggedInUserId]: {
      id: loggedInUserId,
      username: `user@${rpID}`,
      devices: [],
      /**
       * A simple way of storing a user's current challenge being signed by registration or authentication.
       * It should be expired after `timeout` milliseconds (optional argument for `generate` methods,
       * defaults to 60000ms)
       */
      currentChallenge: undefined
    }
  };
