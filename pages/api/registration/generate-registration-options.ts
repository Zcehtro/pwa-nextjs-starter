import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRegistrationOptions } from '@simplewebauthn/server';
import type { GenerateRegistrationOptionsOpts } from '@simplewebauthn/server';

import {
  inMemoryUserDeviceDB,
  loggedInUserId,
  rpID
} from '../../../src/constants/webAuthn';

import { usersRepo } from '../../../helpers/users';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getGenerateRegistrationOptions(req, res);

    default:
      return res.status(400).json({
        message: 'Bad request'
      });
  }
}

/**
 * Registration (a.k.a. "Registration")
 */
const getGenerateRegistrationOptions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Delete DB, user not persisted. Not production ready.
  usersRepo.delete(loggedInUserId);

  const user = {
    id: loggedInUserId,
    username: `user@${rpID}`,
    devices: [],
    currentChallenge: undefined
  };

  // console.log('[DEBUG] user', user);

  const {
    /**
     * The username can be a human-readable name, email, etc... as it is intended only for display.
     */
    username,
    devices
  } = user;

  const opts: GenerateRegistrationOptionsOpts = {
    rpName: 'SimpleWebAuthn Example',
    rpID,
    userID: loggedInUserId,
    userName: username,
    timeout: 60000,
    attestationType: 'none',
    /**
     * Passing in a user's list of already-registered authenticator IDs here prevents users from
     * registering the same device multiple times. The authenticator will simply throw an error in
     * the browser if it's asked to perform registration when one of these ID's already resides
     * on it.
     */
    excludeCredentials: devices.map((dev) => ({
      id: dev.credentialID,
      type: 'public-key',
      transports: dev.transports
    })),
    /**
     * The optional authenticatorSelection property allows for specifying more constraints around
     * the types of authenticators that users to can use for registration
     */
    authenticatorSelection: {
      userVerification: 'required',
      residentKey: 'required'
    },
    /**
     * Support the two most common algorithms: ES256, and RS256
     */
    supportedAlgorithmIDs: [-7, -257]
  };

  const options = generateRegistrationOptions(opts);

  /**
   * The server needs to temporarily remember this value for verification, so don't lose it until
   * after you verify an authenticator response.
   */
  // inMemoryUserDeviceDB[loggedInUserId.toString()].currentChallenge =
  //   options.challenge;

  user.currentChallenge = options.challenge;

  // if (usersRepo.find((x: any) => x.id === user.id)) {
  //   throw `User with the username "${user.id}" already exists`;
  // }

  usersRepo.create(user);

  return res.status(200).json(options);
};
