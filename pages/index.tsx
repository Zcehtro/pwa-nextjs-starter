import type { NextPage } from 'next';

import { Container, Typography, Box } from '@mui/material';

import Link from '../src/components/Link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { MainLayout } from '../src/components/layouts';

const HomePage: NextPage = () => {
  const { locales } = useRouter();

  const intl = useIntl();

  const title = intl.formatMessage({ id: 'page.home.head.title' });
  const description = intl.formatMessage({
    id: 'page.home.head.meta.description',
  });

  return (
    <MainLayout title={title} description={description} content={'Home Page'}>
      <Box>
        {locales &&
          [...locales].map((locale) => (
            <Link key={locale} href="/" locale={locale}>
              {locale}
            </Link>
          ))}
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            Index Page
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom>
            <FormattedMessage
              id="page.home.title"
              values={{ b: (chunks) => <b>{chunks}</b> }}
            />
          </Typography>
          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
          <Typography variant="body1">
            <FormattedMessage id="page.home.description" />
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default HomePage;
