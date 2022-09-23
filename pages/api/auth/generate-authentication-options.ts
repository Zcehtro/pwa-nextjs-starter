import type { NextApiRequest, NextApiResponse } from 'next';
import base64url from 'base64url';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { GenerateAuthenticationOptionsOpts } from '@simplewebauthn/server';

import {
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';
import type { LoggedInUser } from '../../../src/constants/webAuthn';

import { dbUsers } from '../../../src/database';

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
  // TODO majo: get loggedInUserId from POST request

  const userFromDB: LoggedInUser = await dbUsers.getUserById(loggedInUserId);

  if (!userFromDB) {
    return res.status(400).json({ message: `User not register webauthn` });
  }

  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    allowCredentials: userFromDB.devices.map((dev) => ({
      id: JSON.parse(
        JSON.stringify(base64url.toBuffer(dev.credentialID.toString()))
      ),
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

  await dbUsers.updateUserChallenge(userFromDB, options.challenge);

  return res.status(200).json(options);
};
