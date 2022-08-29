import type { NextPage, GetStaticProps } from 'next';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

import { USERS_KEY } from '../../src/constants';
import { MainLayout } from '../../src/components/layouts';
import { User } from '../../src/interfaces';

import { usersApi } from '../../src/api';
import Link from '../../src/components/ui/Link';

// https://tanstack.com/query/v4/docs/guides/ssr
// React Query supports prefetching multiple queries on the server in Next.js and then dehydrating those queries to the queryClient. This means the server can prerender markup that is immediately available on page load and as soon as JS is available, React Query can upgrade or hydrate those queries with the full functionality of the library. This includes refetching those queries on the client if they have become stale since the time they were rendered on the server.

const Notifications: NextPage = () => {
  const onSuccess = (data: User[]) => {
    // Perform side effect after data fetching
    console.log('[DEBUG] onSuccess:', data);
  };

  const onError = (error: { message: string }) => {
    // Perform side effect after encountering error
    console.log('[DEBUG]  onError:', error);
  };

  // This useQuery could just as well happen in some deeper child to
  // the "Notifications"-page, data will be available immediately either way
  const { data: users, isLoading } = useQuery(['users-1'], fetchUsers, {
    staleTime: 30000,
    onSuccess,
    onError
  });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  // const { data: otherUsers, isLoading: isLoadingClientSide } = useQuery(
  //   ['users-2'],
  //   fetchUsers
  // );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // if (isLoadingClientSide) {
  //   return <h2>LoadingClientSide...</h2>;
  // }

  return (
    <MainLayout
      title={'Notifications'}
      description="Notifications Page description"
      content={'Notifications Page'}
    >
      <div>
        <h1>Server Side Rendering with React Query</h1>
        <ul>
          {users?.map((user) => (
            <div key={user.id}>
              <Link href={`/users/${user.id}`}>
                {user.id}-{user.name}
              </Link>
            </div>
          ))}
        </ul>

        {/* <button onClick={() => refetch()}>Trigger Refetch - React Query</button> */}
      </div>
    </MainLayout>
  );
};

const fetchUsers = async () => {
  const { data } = await usersApi.get<User[]>('/superheroes');

  return data;
};

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['users-1'], fetchUsers);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}

export default Notifications;
