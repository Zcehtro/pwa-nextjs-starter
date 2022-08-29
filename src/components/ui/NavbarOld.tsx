// TODO majo: Delete component if not used by November 2022
import { FC } from 'react';
import { ActiveLink } from './ActiveLink';

export const Navbar: FC = () => {
  return (
    <nav style={{ padding: '2rem' }}>
      <ActiveLink text={'About'} href={'/about'} />
      <ActiveLink text={'Users'} href={'/users'} />
      <ActiveLink text={'Notifications'} href={'/users/notifications'} />
      <ActiveLink text={'Transactions'} href={'/transactions'} />
      <ActiveLink text={'Friends'} href={'/friends'} />
    </nav>
  );
};
