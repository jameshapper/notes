import React, { useState, useEffect, useContext } from 'react';
import firebase, { db, auth } from '../firebase';
import { UserContext } from '../userContext';
import ListCards from './listcards'
import ViewNotes from './viewnotes'

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MultiSelect from "react-multi-select-component";

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
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
		maxWidth: '75%'
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

    const [ user ] = useState(auth.currentUser)

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ noteId, setNoteId ] = useState('')
    const [ studentId, setStudentId ] = useState('')
    const [ selectedStudents, setSelectedStudents ] = useState([])
    const [ currentClass, setCurrentClass ] = useState([])
    const [ created, setCreated ] = useState("")
    const [ author, setAuthor ] = useState("")
    const [ noteAvatar, setNoteAvatar ] = useState("")

    const [ errors, setErrors ] = useState([])
    const [ open, setOpen ] = useState(false)
    const [ viewOpen, setViewOpen ] = useState(false)
    const [ uiLoading, setUiLoading ] = useState(true)

    const [ teacherClasses, setTeacherClasses ] = useState([]);
    const [ notes, setNotes ] = useState([]);
    const [ selectedDate, setSelectedDate ] = useState(new Date(Date.now() - 604800000))

    const [ selected, setSelected ] = useState([])
    const [ rt, setRt ] = useState("")
    const [ commentBody, setCommentBody ] = useState("")
    const [ commentRt, setCommentRt ] = useState("")
    const [ comments, setComments ] = useState([])

    const { avatar } = useContext(UserContext)

    useEffect(() => {
        
        console.log("User",user)
        if(user){
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
        }

    }, [user]);

    useEffect(() => {
        console.log('selected ids are '+selected.map((student) => student.value))
        setSelectedStudents(selected.map(a => a.value))
    },[selected])

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

    dayjs.extend(relativeTime);
    const { classes } = props;

    const handleSelectOpen = (teacherClass) => {
        setTitle(teacherClass.name)
        setCurrentClass(teacherClass.students)
        setOpen(true)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let recentDate = selectedDate

		db.collectionGroup('notes')
        .where('uid','in', selectedStudents)
        .where("timestamp", ">=", recentDate)
        .orderBy("timestamp","desc")
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

    const handleSubmitComment = (event) => {
        event.preventDefault();

        if (false) {

        } else {
            const newComment = {
                body: commentBody,
                createdAt: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid,
                author: user.displayName,
                avatar: avatar,
                rt: commentRt,
                studentId: studentId,
                noteId: noteId
            }
            db.collection('users').doc(studentId).collection('notes').doc(noteId).collection('comments').add(newComment)
            .then((doc)=>{
                console.log("New comment added to db")
                setViewOpen(false);
            })
            .then(() => {
                let noteRef = db.collection('users').doc(studentId).collection('notes').doc(noteId)
                noteRef.update({ commentNum: firebase.firestore.FieldValue.increment(1)})
            })
            .catch((error) => {
                setErrors(error)
                setOpen(true)
                console.error(error);
                alert('Something went wrong' );
            });
        }
    };

    const handleViewOpen = (data) => {
        setTitle(data.note.title)
        setBody(data.note.body)
        setNoteId(data.note.id)
        setStudentId(data.note.uid)
        setCreated(data.note.createdAt)
        setAuthor(data.note.author)
        setRt(data.note.rt)
        setNoteAvatar(data.note.avatar)
        setViewOpen(true)
	}

    useEffect(() => {
        
        if(noteId){
            return db.collectionGroup("comments")
            .where("noteId","==",noteId)
            .get()
            .then((querySnapshot) => {
                const commentsData = [];
                querySnapshot.forEach((doc) => {
                    commentsData.push({ ...doc.data(), id: doc.id })
                    console.log("comment doc id is "+doc.id)
                })
                setComments(commentsData)
            })
            .catch((error) => {
                alert('something wrong while looking for comments')
                console.log(error)
            })
        }
    }, [noteId]);

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
                            <Grid item xs={12} key='date'>
                                <Typography>
                                    How far back do you want to see notes?
                                </Typography>
                                <Datepicker 
                                    selected={selectedDate} 
                                    onChange={date => setSelectedDate(date)}
                                    maxDate={new Date()}
                                />
                            </Grid>
                            <Grid item xs={12} key='title'>
								<DialogTitle id="customized-dialog-title" onClose={handleClose}>
									{title}
								</DialogTitle>
                            </Grid>

                            <Grid>
                                <div>
                                    <h1>Select Students</h1>
                                    <MultiSelect
                                    options={currentClass}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy={"Select"}
                                    />
                                </div>
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
                    <ListCards notes={notes} handleEditClickOpen={()=>alert('permission denied')} handleViewOpen={handleViewOpen} deleteNoteHandler={()=>alert('permission denied')} canEdit={false}/>
                </div>  
                }
  
                <ViewNotes handleViewClose={handleViewClose} viewOpen={viewOpen} title={title} author={author} created={created} avatar={noteAvatar} comments={comments} rt={rt} classes={classes} handleSubmitComment={handleSubmitComment} setCommentBody={setCommentBody} setCommentRt={setCommentRt} commentRt={commentRt}/>

            </main>
        );
    }
}

export default withStyles(styles)(TeacherClasses);
