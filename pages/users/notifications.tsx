import type { NextPage } from 'next';

import { MainLayout } from '../../src/components/layouts/MainLayout';

const NotificationsPage: NextPage = () => {
  return (
    <>
      <MainLayout
        title={'About'}
        description="About Page description"
        content={'About Page'}
      >
        <h1>Notifications ...in progress</h1>
        <p>Server Side Rendering con React Query</p>
      </MainLayout>
    </>
  );
};

export default NotificationsPage;
