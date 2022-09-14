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
import { usersRepo } from '../../../helpers/users';

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

  // const user = inMemoryUserDeviceDB[loggedInUserId];
  const user = usersRepo.find((x: any) => x.id === loggedInUserId);

  const expectedChallenge = user.currentChallenge;

  let dbAuthenticator;
  const bodyCredIDBuffer = base64url.toBuffer(body.rawId);
  // "Query the DB" here for an authenticator matching `credentialID`

  console.log('========================');

  console.log('[DEBUG] bodyCredIDBuffer', bodyCredIDBuffer);
  // console.log('[DEBUG] credentialID', user?.devices[0].credentialID.data);

  // console.log('----');
  // var buf = Buffer.from(JSON.stringify(user?.devices[0].credentialID));
  // const buffer = Buffer.from(user?.devices[0].credentialID.data);
  // console.log('[DEBUG] bodyCredIDBuffer-buffer', buffer);
  // console.log('[DEBUG] credentialID-buf', buf);

  // console.log('========================');

  // "Search for the authenticator in the user's list of devices"
  for (const device of user.devices) {
    const buffer = Buffer.from(device.credentialID.data);
    if (buffer.equals(bodyCredIDBuffer)) {
      dbAuthenticator = {
        credentialPublicKey: Buffer.from(device.credentialPublicKey),
        credentialID: Buffer.from(device.credentialID),
        counter: device.counter,
        transports: device.transports
      };
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
