import type { NextApiRequest, NextApiResponse } from 'next';

import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { GenerateAuthenticationOptionsOpts } from '@simplewebauthn/server';

import {
  inMemoryUserDeviceDB,
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';
import { usersRepo } from '../../../helpers/users';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getGenerateAuthenticationOptions(req, res);

    default:
      return res.status(400).json({
        message: 'Bad request'
      });
  }
}

/**
 * Login (a.k.a. "Authentication")
 */
const getGenerateAuthenticationOptions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const user = usersRepo.find((x: any) => x.id === loggedInUserId);

  if (!user) {
    return res.status(400).json({ message: `User not register webauthn` });
  }

  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: user.devices.map((dev) => ({
      id: dev.credentialID,
      type: 'public-key',
      transports: dev.transports
    })),
    userVerification: 'required',
    rpID
  };
  const options = generateAuthenticationOptions(opts);

  /**
   * The server needs to temporarily remember this value for verification, so don't lose it until
   * after you verify an authenticator response.
   */
  // inMemoryUserDeviceDB[loggedInUserId.toString()].currentChallenge =
  //   options.challenge;

  user.currentChallenge = options.challenge;

  usersRepo.update(loggedInUserId, user);

  return res.status(200).json(options);
};
