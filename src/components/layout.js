import { useContext, useState, useEffect } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../userContext"

import Box from '@material-ui/core/Box'
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShieldIcon from '@material-ui/icons/Shield';
import { EmojiPeople } from '@material-ui/icons';

const drawerWidth = 200;

 const menuItemsUser = [
    { 
        text: 'My Plans', 
        icon: <NotesIcon color="secondary" />, 
        path: '/' 
    },
    { 
        text: 'Account', 
        icon: <AccountBoxIcon color="secondary" />, 
        path: '/account' 
    },
    {
        text: 'MyBadges',
        icon: <ShieldIcon color="primary" />,
        path: '/myBadges'
    }
  ];

  const menuItemsAdmin = [
    { 
        text: 'My Classes', 
        icon: <NotesIcon color="secondary" />, 
        path: '/classes' 
    },
    { 
        text: 'Account', 
        icon: <AccountBoxIcon color="secondary" />, 
        path: '/account' 
    },
    {
        text: 'Students',
        icon: <EmojiPeople color="secondary" />,
        path: '/students'
    }
  ]

function Layout({ children }) {

    const { currentUser, isAdmin, avatar, logout } = useContext(UserContext);
    const location = useLocation()
    const [ menuItems, setMenuItems ] = useState([])



    let history = useHistory();

    if(currentUser){
        console.log('In Layout user is Admin is '+isAdmin)
    } else {
        history.push('/login')
    }

    useEffect(() => {
        if(isAdmin){
            setMenuItems(menuItemsAdmin)
        } else {
            setMenuItems(menuItemsUser)
        }
    },[isAdmin])

	const logoutHandler = async(event) => {
        console.log('Logout Clicked');
        await logout().then(() => {
            history.push('/login')
          }).catch((error) => {
            console.log('Error signing out')
          });;
	};

    if(currentUser) {
        return (
            <Box sx={{display:'flex'}}>
                <CssBaseline />
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}} >
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            NotesApp
                        </Typography>
                        <Box sx={{flexGrow:1}}/>
                        <Button color='inherit' onClick={() => history.push('/badges')} >Badges</Button>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                >
                    <Toolbar />
                    <Divider />
                    <center>
                        <Avatar alt="User Avatar" src={avatar} sx={{height: 110, width: 100, flexShrink: 0, flexGrow: 0, marginTop: 2}} />
                        <p>
                            {' '}
                            {currentUser && currentUser.displayName ? currentUser.displayName : "Welcome!"}
                        </p>
                    </center>
                    <Divider />
                    <List>
                    {menuItems.map((item) => (
                        <ListItem 
                        button 
                        key={item.text} 
                        onClick={() => history.push(item.path)}
                        className={location.pathname === item.path ? null : null}
                        >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                        <ListItem
                        button
                        key='logout'
                        onClick={() => logoutHandler()}
                        >
                            <ListItemIcon>
                                {' '}
                                <ExitToAppIcon />{' '}
                                <ListItemText primary='Logout' />
                            </ListItemIcon>
                        </ListItem>
                    </List>
                </Drawer>
                <Box sx={{width:1, m:2}} >{children}</Box>
            </Box>    
        )
    } else {
        return <div></div>
    }

}

export default Layout;