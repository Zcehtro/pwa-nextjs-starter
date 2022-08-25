import React from 'react';
import type { NextPage } from 'next';
import { MainLayout } from '../../src/components/layouts/MainLayout';

// import styles from '../../styles/Common.module.css';

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
        {/* >
        <h1 className={styles.title}>Notifications</h1>
        <p className={styles.description}>List Notifications</p> */}
      </MainLayout>
    </>
  );
};

export default NotificationsPage;
