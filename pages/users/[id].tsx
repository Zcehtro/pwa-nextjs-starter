import React from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '../../src/components/layouts';

import styles from '../../styles/Users.module.css';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { usersApi } from '../../src/api';
import { User } from '../../src/interfaces';

type Props = {
  user: User;
};

const UserPage: NextPage<Props> = ({ user }) => {
  // const router = useRouter();
  // const userId = router.query.id;

  return (
    <MainLayout
      title={'User'}
      description="User Page description"
      content={'User Page'}
    >
      <div className={styles.containerUsers}>
        <h1>Hello from User: {user.name}</h1>
      </div>
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const users3 = [...Array(3)].map((value, index) => `${index + 1}`);

  return {
    paths: users3.map((id) => ({
      params: { id },
    })),
    // fallback: false, // return 404 page
    fallback: 'blocking', // pass to execute getStaticProps to search if the user exist.
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };

  try {
    const { data } = await usersApi.get<User>(`/superheroes/${id}`);

    return {
      props: {
        user: data,
      },
      revalidate: 86400, // 60 * 60 * 24 (every 24hrs)
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default UserPage;
