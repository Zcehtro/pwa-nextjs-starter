import { useRouter } from 'next/router';
import { Button, Card, CardContent, Typography, Divider } from '@mui/material';

export const WebAuthnModal = () => {
  const router = useRouter();

  const handleYesBtnClick = () => {
    console.log('[DEBUG] Call webauthnRegistration function');
  };

  return (
    <Card sx={{ maxWidth: 350, mt: 5, paddingY: 3, borderRadius: '10px' }}>
      <CardContent>
        <Typography variant="h5" color="primary" fontWeight="bold" textAlign="center">
          WebAuthn
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography
          variant="body1"
          color="#555"
          fontSize="15px"
          fontWeight="bold"
          textAlign="center"
        >
          ¿Do you want to register WebAuthn for 2fa?
        </Typography>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleYesBtnClick}>
          Yes
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          //on click navigate to home
          onClick={() => router.push('/')}
        >
          No
        </Button>
      </CardContent>
    </Card>
  );
};
