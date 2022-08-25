import { useState } from 'react';

import Link from './Link';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';

import theme from '../../theme';
import Home from '../../../pages/index';

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
        <BottomNavigationAction
          label="Users"
          value="/users"
          href="/users"
          component={Link}
          icon={<GroupIcon />}
        />
        <BottomNavigationAction
          label="Pay"
          value="/transactions"
          href="/transactions"
          component={Link}
          icon={<PaidIcon />}
        />
        <BottomNavigationAction
          label="Notifications"
          value="/users/notifications"
          href="/users/notifications"
          component={Link}
          icon={<NotificationsIcon />}
        />
        <BottomNavigationAction
          label="Friends"
          value="/friends"
          href="/friends"
          component={Link}
          icon={<AddReactionIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};
