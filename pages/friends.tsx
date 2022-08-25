import { useState } from 'react';

import type { NextPage, NextPageContext, GetServerSideProps } from 'next';

import { MainLayout } from '../src/components/layouts/MainLayout';

import { usersApi } from '../src/api';

type Friend = {
  id: number;
  website: string;
  name: string;
};

type Props = {
  usersList: Friend[];
};

const fetchFriends = async () => {
  const { data } = await usersApi.get<Friend[]>('/friends');

  return data;
};

// Example: Server Side Rendering -> call getServerSideProps on every request
const FriendsPage: NextPage<Props> = ({ usersList }) => {
  const [users, setUsers] = useState(usersList);

  if (users?.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainLayout
        title={'Friends'}
        description="Friends Page description"
        content={'Friends Page'}
      >
        <div>
          {/* <div className={styles.containerUsers}> */}
          <h1>Server side rendering (getServerSideProps sin React Query)</h1>
          <p>In prod it will run on every request to the server.</p>
          <ul>
            {/* <ul className={styles.listUsers}> */}
            {users?.map((user) => (
              <li key={user?.id}>
                <a href={user?.website} target="_blank" rel="noreferrer">
                  {user?.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query, req } = ctx;

  if (!req) {
    return { props: { usersList: [] } };
  }

  const usersList = await fetchFriends();

  return { props: { usersList } };
};

export default FriendsPage;
