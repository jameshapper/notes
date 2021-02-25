import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import Chips from './chips';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import MuiDialogContent from '@material-ui/core/DialogContent';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MultipleSelect from './select';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 220
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function TeacherClasses(props) {

    const [ user ] = useState(firebase.auth().currentUser)

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ selectedStudents, setSelectedStudents ] = useState([])
    const [ currentClass, setCurrentClass ] = useState([])

    const [ errors, setErrors ] = useState([])
    const [ open, setOpen ] = useState(false)
    const [ viewOpen, setViewOpen ] = useState(false)
    const [ uiLoading, setUiLoading ] = useState(true)

    const [ teacherClasses, setTeacherClasses ] = useState([]);
    const [ notes, setNotes ] = useState([]);


    useEffect(() => {

        const db = firebase.firestore()
        
        console.log("User",user)
        return db.collection("users").doc(user.uid).get()
        .then((doc) => {
			if (doc.exists) {
				let teacherData = doc.data()
				console.log("Document data:", teacherData);
				setTeacherClasses(teacherData.classes)
                setUiLoading(false)
			} else {
				// doc.data() will be undefined in this case
				console.log("No such teacher document!");
			}
		})
    }, [user]);

    const DialogTitle = withStyles(styles)((props) => {
        const { children, onClose, classes, ...other } = props;
        return (
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    });

    const DialogContent = withStyles((theme) => ({
        viewRoot: {
            padding: theme.spacing(2)
        }
    }))(MuiDialogContent);

    dayjs.extend(relativeTime);
    const { classes } = props;

    const handleSelectOpen = (teacherClass) => {
        setTitle(teacherClass.name)
        setCurrentClass(teacherClass.students)
        console.log("currentClass is "+currentClass)
        console.log("class title is "+title)
        console.log("passed array is "+teacherClass.students)
        setOpen(true)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const db = firebase.firestore();

		db.collectionGroup('notes')
        .where('uid','in',selectedStudents)
        .get()
		.then((querySnapshot) => {
            const notesData = [];
            querySnapshot.forEach((doc) => {
                notesData.push({ ...doc.data(), id: doc.id })
                console.log(doc.id)
            })
            setNotes(notesData)
			setOpen(false);
		})
		.catch((error) => {
			setErrors(error)
			setOpen(true)
			console.error(error);
			alert('Something went wrong' );
		});
    };

    const handleViewOpen = (data) => {
        setTitle(data.todo.title)
        setBody(data.todo.body)
        setViewOpen(true)
	}

    const handleViewClose = () => setViewOpen(false);

    const handleClose = (event) => setOpen(false);

    if (uiLoading === true) {
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
            </main>
        );
    } else {
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />

                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Select students to view recent notes
                            </Typography>
                            <Button
                                autoFocus
                                color="inherit"
                                onClick={handleSubmit}
                                className={classes.submitButton}
                            >
                                Submit
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} key='title'>
								<DialogTitle id="customized-dialog-title" onClose={handleClose}>
									{title}
								</DialogTitle>
                            </Grid>
                            <Grid item xs={12} key="chips">
                                <MultipleSelect allOptions={currentClass} getList={selectedStudents => setSelectedStudents(selectedStudents)}></MultipleSelect>
                            </Grid>
                        </Grid>
                    </form>
                </Dialog>

                <Grid container spacing={8} justify='center'>
                    {teacherClasses.map((teacherClass) => (
                        <Grid item xs={8} sm={6} key = {teacherClass.name}>
                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" component="h3">
                                        {teacherClass.name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => handleSelectOpen( teacherClass )}>
                                        {' '}
                                        Select Students{' '}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                { notes && notes.length > 0 && 
                <div>
                      <Grid container spacing={2}>
                      {notes.map((todo) => (
                          <Grid item xs={12} sm={6}>
                              <Card className={classes.root} variant="outlined">
                                  <CardContent>
                                      <Typography variant="h5" component="h2">
                                          {todo.title}
                                      </Typography>
                                      {todo.activities && todo.activities.length > 0 && <Chips activities={todo.activities}></Chips>}
                                      <Typography className={classes.pos} color="textSecondary">
                                          {dayjs(todo.createdAt).fromNow()}
                                      </Typography>
                                      <Typography variant="body2" component="p">
                                          {todo.body.substring(0, 65)+"..."}
                                      </Typography>
                                  </CardContent>
                                  <CardActions>
                                      <Button size="small" color="primary" onClick={() => handleViewOpen({ todo })}>
                                          {' '}
                                          View{' '}
                                      </Button>
                                  </CardActions>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
  
                  <Dialog
                      onClose={handleViewClose}
                      aria-labelledby="customized-dialog-title"
                      open={viewOpen}
                      fullWidth
                      classes={{ paperFullWidth: classes.dialogeStyle }}
                  >
                      <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                          {title}
                      </DialogTitle>
                      <DialogContent dividers>
                          <TextField
                              fullWidth
                              id="todoDetails"
                              name="body"
                              multiline
                              readonly
                              rows={1}
                              rowsMax={25}
                              value={body}
                              InputProps={{
                                  disableUnderline: true
                              }}
                          />
                      </DialogContent>
                  </Dialog>
                </div>  
                }

            </main>
        );
    }
}

export default withStyles(styles)(TeacherClasses);
