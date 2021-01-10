import { useState, useEffect } from 'react'
import firebase from '../firebase'

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

    const [data, setData] = useState([]);
    const [newSpellName, setNewSpellName] = useState('');

    const loadAccountPage = (event) => {
		console.log('Account Clicked');
	};

	const loadTodoPage = (event) => {
		console.log('Todo Clicked');
	};

	const logoutHandler = (event) => {
		console.log('Logout Clicked');
		//this.props.history.push('/login');
	};

    const onCreate = () => {
        const db = firebase.firestore();
        db.collection("notes").add({ name: newSpellName });
    };

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection("notes").get();
            setData(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            TodoApp
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
                        <Avatar alt="Remy Sharp" src="https://i.pravatar.cc/300" className={classes.avatar} />
                        <p>
                            {' '}
                            Jim Happer
                        </p>
                    </center>
                    <Divider />
                    <List>
                        <ListItem button key="Todo" onClick={loadTodoPage}>
                            <ListItemIcon>
                                {' '}
                                <NotesIcon />{' '}
                            </ListItemIcon>
                            <ListItemText primary="Todo" />
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

                <div>                
                    <ul>
                        <input value={newSpellName} onChange={e => setNewSpellName(e.target.value)} />
                        <button onClick={onCreate}>Creat</button>
                        {data.map(note => (
                            <li key={note.name}>
                                {note.name}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>


        </div>

    )
}

export default withStyles(styles)(Home);