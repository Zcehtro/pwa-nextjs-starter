import { db } from './';
import { User } from '../models';

export const getUserById = async (id: string): Promise<any> => {
  await db.connect();
  const user = await User.findOne({ id }).lean();
  await db.disconnect();

  if (!user) {
    return null;
  }

  return JSON.parse(JSON.stringify(user));
};

export const addUser = async (user: any): Promise<any> => {
  console.log('[DEBUG][SERVER] addUser', user);

  await db.connect();
  const userRes = await User.create(user);
  await db.disconnect();

  if (!userRes) {
    return null;
  }

  return JSON.parse(JSON.stringify(userRes));
};

export const updateUser = async (user: any): Promise<any> => {
  console.log('[DEBUG][SERVER] user', user);
  console.log('[DEBUG][SERVER] user.device', user.devices);
  console.log('[DEBUG][SERVER] typeof user.device', typeof user.devices);

  try {
    await db.connect();

    // const userToUpdate = await User.findOne({ id: user.id }).lean();
    // console.log('[DEBUG][SERVER] userToUpdate', userToUpdate);
    // // const updatedEntry = await User.findByIdAndUpdate(user.id, { ...user });

    // // userToUpdate.description = description;
    // userToUpdate.devices = [...user.devices];
    // await userToUpdate.save();

    const userToUpdatePrev = await User.findOne({ id: user.id }).lean();
    console.log('[DEBUG][SERVER] userToUpdatePrev', userToUpdatePrev);

    const userToUpdate = await User.findOneAndUpdate(
      { id: user.id },
      { devices: user.devices }
    );

    console.log('[DEBUG][SERVER] userToUpdate', userToUpdate);

    await db.disconnect();
    return JSON.parse(JSON.stringify(userToUpdate));
  } catch (error: any) {
    await db.disconnect();
    console.error('[ERROR] error', error);

    return { message: error };
  }
};

// ----
export const getAllProducts = async (): Promise<any> => {
  await db.connect();
  const users = await User.find().lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify(users));
};
