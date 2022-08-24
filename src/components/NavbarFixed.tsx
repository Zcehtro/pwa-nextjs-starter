import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import theme from '../theme';
import Link from './Link';
import Home from '../../pages/index';

export const NavbarFixed = () => {
  const [value, setValue] = useState(0);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          href="/"
          component={Link}
          icon={<HomeIcon />}
        />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction
          label="Location"
          value="/location"
          href="/location"
          component={Link}
          icon={<LocationOnIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};
