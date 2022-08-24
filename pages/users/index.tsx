import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';
import { MainLayout } from '../../src/components/layouts';
import { usersApi } from '../../src/api';
import { User } from '../../src/interfaces';

import styles from '../../styles/Users.module.css';

type Props = {
  users: User[];
};

// Example using getStaticProps -> will be call ONE time during build time
// if API changes I will not see the updates
const UsersPage: NextPage<Props> = ({ users }) => {
  return (
    <MainLayout
      title={'Users'}
      description="Users Page description"
      content={'Users Page'}
    >
      <div className={styles.containerUsers}>
        <h1>getStaticProps (at build time)</h1>
        <p>In prod it will run once at build time.</p>
        <ul className={styles.listUsers}>
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
      </div>
    </MainLayout>
  );
};

const fetchUsers = async () => {
  const { data } = await usersApi.get<User[]>('/superheroes');

  return data;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const users = await fetchUsers();

  return {
    props: { users },
    revalidate: 86400, // 60 * 60 * 24
  };
};

export default UsersPage;
