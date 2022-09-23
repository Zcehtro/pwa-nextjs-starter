import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyRegistrationResponse } from '@simplewebauthn/server';

import type {
  VerifyRegistrationResponseOpts,
  VerifiedRegistrationResponse
} from '@simplewebauthn/server';

import type {
  RegistrationCredentialJSON,
  AuthenticatorDevice
} from '@simplewebauthn/typescript-types';

import {
  expectedOrigin,
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';
import type { LoggedInUser } from '../../../src/constants/webAuthn';

import { dbUsers } from '../../../src/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return postVerifyRegistration(req, res);

    default:
      return res.status(400).json({
        message: 'Bad request'
      });
  }
}

/**
 * Registration (a.k.a. "Registration")
 */
const postVerifyRegistration = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const body: RegistrationCredentialJSON = req.body;

  // TODO majo: get loggedInUserId

  const userFromDB: LoggedInUser = await dbUsers.getUserById(loggedInUserId);

  const expectedChallenge = userFromDB?.currentChallenge;

  let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      credential: body,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true
    };

    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    const _error = error as Error;
    console.error('[ERROR]', _error);
    return res.status(400).send({ error: _error.message });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const existingDevice = userFromDB.devices.find((device) =>
      device.credentialID.equals(credentialID)
    );

    if (!existingDevice) {
      /**
       * Add the returned device to the user's list of devices
       */
      const newDevice: AuthenticatorDevice = {
        credentialPublicKey,
        credentialID,
        counter,
        transports: body.transports
      };

      userFromDB.devices.push(newDevice);

      await dbUsers.updateUserDevices(userFromDB);
    }
  }

  return res.status(200).json({ verified });
};
