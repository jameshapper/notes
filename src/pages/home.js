import Note from '../components/note';
import Account from '../components/account'
//import Editor from '../components/editortest'
import { useContext, useState } from 'react'
import { useHistory } from "react-router-dom";
import { UserContext } from "../userContext"
import TeacherClasses from "../components/classes"
//import Grid from '@material-ui/core/Grid';


import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//import CircularProgress from '@material-ui/core/CircularProgress';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

function Home({ classes }) {

    const { currentUser, isAdmin, loading, avatar, logout } = useContext(UserContext);
    const [ accountOpen, setAccountOpen ] = useState(false)

    let history = useHistory();

    if(currentUser){
        console.log('In HOME user value '+currentUser.uid)
        console.log('In HOME user profile url is '+currentUser.photoURL)
        console.log('In HOME user is Admin is '+isAdmin)
        console.log('In HOME loading is '+loading)
        console.log('currentUser is ', currentUser)
        console.log('avatar url is '+avatar)
    } else {
        history.push('/login')
    }

    const loadAccountPage = (event) => {
		console.log('Account Clicked');
        setAccountOpen(true)
	};

	const loadTodoPage = (event) => {
		console.log('Todo Clicked');
        setAccountOpen(false)
	};

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
            <div>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                NotesApp
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        <div className={classes.toolbar} />
                        <Divider />
                        <center>
                            <Avatar alt="User Avatar" src={avatar} className={classes.avatar} />
                            <p>
                                {' '}
                                {currentUser && currentUser.displayName ? currentUser.displayName : "Welcome!"}
                            </p>
                        </center>
                        <Divider />
                        <List>
                            <ListItem button key="Todo" onClick={loadTodoPage}>
                                <ListItemIcon>
                                    {' '}
                                    <NotesIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Notes" />
                            </ListItem>
    
                            <ListItem button key="Account" onClick={loadAccountPage}>
                                <ListItemIcon>
                                    {' '}
                                    <AccountBoxIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Account" />
                            </ListItem>
    
                            <ListItem button key="Logout" onClick={logoutHandler}>
                                <ListItemIcon>
                                    {' '}
                                    <ExitToAppIcon />{' '}
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Drawer>
                    <div>{accountOpen ? <Account/> : isAdmin ? <TeacherClasses/> : <Note />}  </div>
                </div>
    
            </div>
    
        )
    } else {
        return <div></div>
    }


}

export default withStyles(styles)(Home);