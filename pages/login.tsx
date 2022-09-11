import type { NextPage } from 'next';

import { Box, Typography } from '@mui/material';
import { LoginForm } from '../src/components/ui/login/LoginForm';

const Login: NextPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: 420, backgroundColor: 'primary.main' }}
      paddingY={7}
    >
      <Typography
        variant="h3"
        color="white"
        fontWeight="bold"
        textAlign="center"
      >
        LOGO
      </Typography>

      <LoginForm />
    </Box>
  );
};

export default Login;
