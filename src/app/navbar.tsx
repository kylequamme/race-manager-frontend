'use client'

import * as React from 'react'
import { AppBar, Grid, Icon, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { EmojiEvents as TrophyIcon, 
         Event as EventIcon, 
         FormatListNumbered as NumberedListIcon,
         MenuRounded, 
         SportsMotorsports as HelmetIcon, 
         SportsScore} from '@mui/icons-material'

export default function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const router = useRouter();
    const handleNavButtonClick = (path: string) => {
        setAnchorEl(null);
        router.push(path)
    };
    return(
        <main>
            <AppBar position="sticky">
              <Toolbar variant="dense">
                <IconButton
                  id="btnMenu" 
                  edge="start" 
                  color="inherit" 
                  aria-label="menu" 
                  sx={{ mr: 2 }}
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MenuRounded />
                </IconButton>
                <Menu
                  id="menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'btnBasic',
                  }}
                >
                  <MenuItem sx={{ verticalAlign: 'center' }} onClick={()=> handleNavButtonClick("/")}><Icon sx={{padding: '5px'}} fontSize='medium' ><EventIcon/></Icon>Events</MenuItem>
                  <MenuItem sx={{ verticalAlign: 'center' }} onClick={()=> handleNavButtonClick("/results")}><Icon sx={{padding: '5px'}} fontSize='medium' ><NumberedListIcon/></Icon>Results</MenuItem>
                  <MenuItem sx={{ verticalAlign: 'center' }} onClick={()=> handleNavButtonClick("/points")}><Icon sx={{padding: '5px'}} fontSize='medium' ><TrophyIcon/></Icon>Points</MenuItem>
                  <MenuItem sx={{ verticalAlign: 'center' }} onClick={()=> handleNavButtonClick("/drivers")}><Icon sx={{padding: '5px'}} fontSize='medium' ><HelmetIcon/></Icon>Drivers</MenuItem>
                </Menu>
                <Typography variant="h6" color="inherit" component="div">
                  Race Manager <Icon sx={{ verticalAlign: 'center' }} fontSize='medium' ><SportsScore/></Icon> 
                </Typography>
              </Toolbar>
            </AppBar>
        </main>
    )
}