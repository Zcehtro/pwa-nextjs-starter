import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import { USERS_KEY } from '../src/constants';
import { MainLayout } from '../src/components/layouts';
import { User } from '../src/interfaces';

import styles from '../styles/Users.module.css';
import { usersApi } from '../src/api';

const fetchUsers = async () => {
  const { data } = await usersApi.get<User[]>('/superheroes');

  return data;
};

// Example using React-Query
// Now -> we are calling React query on client side
// TODO -> call React Query on getStaticProps ??? will it work? what if the database change?
const Transactions: NextPage = () => {
  const onSuccess = (data: User[]) => {
    // Perform side effect after data fetching
    console.log('[DEBUG] onSuccess:', data);
  };

  const onError = (error: { message: string }) => {
    // Perform side effect after encountering error
    console.log('[DEBUG]  onError:', error);
  };

  const {
    isLoading,
    data: users,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery([USERS_KEY], fetchUsers, {
    staleTime: 30000,
    onSuccess,
    onError,
  });

  if (isError) {
    return <h2>{error?.message}</h2>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <MainLayout
      title={'Transactions'}
      description="Transactions Page description"
      content={'Transactions Page'}
    >
      <div>
        {/* <div className={styles.containerUsers}> */}
        <h1>Client Side Rendering with React Query</h1>
        <ul>
          {/* <ul className={styles.listUsers}> */}
          {users?.map((user) => (
            <div key={user.id}>
              <Link href={`/users/${user.id}`}>
                <a>
                  {user.id}-{user.name}
                </a>
              </Link>
            </div>
          ))}
        </ul>
        <button
          // className={`${styles.btn} ${styles.btnXs} ${styles.fetchBtn}`}
          onClick={() => refetch()}
        >
          Trigger Refetch - React Query
        </button>
      </div>
    </MainLayout>
  );
};

export default Transactions;
