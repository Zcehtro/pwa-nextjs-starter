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
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';

import { dbUsers } from '../../../src/database';

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

  // TODO majo: get loggedInUserId from POST body

  // Get user from Mongo DB
  const userFromDB = await dbUsers.getUserById(loggedInUserId);

  const expectedChallenge = userFromDB.currentChallenge;

  let dbAuthenticator;
  const bodyCredIDBuffer = base64url.toBuffer(body.rawId);

  // "Search for the authenticator in the user's list of devices"
  for (const device of userFromDB.devices) {
    const buffer = Buffer.from(
      JSON.parse(JSON.stringify(base64url.toBuffer(device.credentialID))).data
    );
    if (buffer.equals(bodyCredIDBuffer)) {
      dbAuthenticator = {
        credentialPublicKey: base64url.toBuffer(device.credentialPublicKey),
        credentialID: base64url.toBuffer(device.credentialID),
        counter: device.counter,
        transports: device.transports
      };
      break;
    }
  }

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

    // console.log('[DEBUG] verification', verification);
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
