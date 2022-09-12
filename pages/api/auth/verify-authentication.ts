import type { NextApiRequest, NextApiResponse } from 'next';
import base64url from 'base64url';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

import type {
  VerifyAuthenticationResponseOpts,
  VerifiedAuthenticationResponse
} from '@simplewebauthn/server';

import type { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types';

import {
  expectedOrigin,
  inMemoryUserDeviceDB,
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return postVerifyAuthentication(req, res);

    default:
      return res.status(400).json({
        message: 'Bad request'
      });
  }
}

/**@simplewebauthn/typescript-types
 * Login (a.k.a. "Authentication")
 */
const postVerifyAuthentication = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const body: AuthenticationCredentialJSON = req.body;

  const user = inMemoryUserDeviceDB[loggedInUserId];

  const expectedChallenge = user.currentChallenge;

  let dbAuthenticator;
  const bodyCredIDBuffer = base64url.toBuffer(body.rawId);
  // "Query the DB" here for an authenticator matching `credentialID`

  console.log('[DEBUG] user', user);
  // "Search for the authenticator in the user's list of devices"
  for (const dev of user.devices) {
    if (dev.credentialID.equals(bodyCredIDBuffer)) {
      dbAuthenticator = dev;
      break;
    }
  }

  console.log('[DEBUG] dbAuthenticator', dbAuthenticator);

  if (!dbAuthenticator) {
    return res
      .status(400)
      .send({ error: 'Authenticator is not registered with this site' });
  }

  let verification: VerifiedAuthenticationResponse;
  try {
    const opts: VerifyAuthenticationResponseOpts = {
      credential: body,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: dbAuthenticator,
      requireUserVerification: true
    };
    verification = await verifyAuthenticationResponse(opts);

    console.log('[DEBUG] verification', verification);
  } catch (error) {
    const _error = error as Error;
    console.error(_error);
    return res.status(400).send({ error: _error.message });
  }

  const { verified, authenticationInfo } = verification;

  if (verified) {
    // Update the authenticator's counter in the DB to the newest count in the authentication
    dbAuthenticator.counter = authenticationInfo.newCounter;
  }

  return res.status(200).json({ verified });
};
