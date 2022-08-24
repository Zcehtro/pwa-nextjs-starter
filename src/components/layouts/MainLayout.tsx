import { FC } from 'react';
import Head from 'next/head';
import { Navbar } from '../ui';
import styles from './MainLayout.module.css';

interface Props {
  title: string;
  description: string;
  content: string;
  children: React.ReactNode;
}

export const MainLayout: FC<Props> = ({
  title,
  description,
  content,
  children,
}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name={description} content={content} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>{children}</main>
    </div>
  );
};
