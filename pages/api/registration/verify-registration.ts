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
  inMemoryUserDeviceDB,
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';

import { usersRepo } from '../../../helpers/users';

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

  const user = usersRepo.find((x: any) => x.id === loggedInUserId);

  const expectedChallenge = user?.currentChallenge;
  // console.log('[DEBUG] user', user);

  let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      credential: body,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true
    };
    // console.log('[DEBUG] expectedOrigin', expectedOrigin);

    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    const _error = error as Error;
    console.error('[ERROR]', _error);
    return res.status(400).send({ error: _error.message });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const existingDevice = user.devices.find((device) =>
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

      user.devices.push(newDevice);
      usersRepo.update(loggedInUserId, user);
    }
  }

  return res.status(200).json({ verified });
};
