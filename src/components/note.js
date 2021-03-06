import React, { useState, useEffect, useContext } from 'react';
import firebase, { db } from '../firebase';
import "react-quill/dist/quill.snow.css";
import "./styles.css";
import Editor from "./editortest2"
import MultipleSelect from './select';
import { UserContext } from '../userContext';
import ListCards from './listcards'
import ViewNotes from './viewnotes'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

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
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	}
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function Note(props) {

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ noteId, setNoteId ] = useState('')
    const [ studentId, setStudentId ] = useState('')

    const [ newActivities, setNewActivities ] = useState([])
    const [ created, setCreated ] = useState("")
    const [ author, setAuthor ] = useState("")

    const [ errors, setErrors ] = useState([])
    const [ open, setOpen ] = useState(false)
    const [ uiLoading, setUiLoading ] = useState(true)
    const [ buttonType, setButtonType ] = useState('')
    const [ viewOpen, setViewOpen ] = useState(false)

    const [ notes, setNotes ] = useState([]);
    const [ rt, setRt ] = useState("")
    const [ commentRt, setCommentRt ] = useState("")
    const [ comments, setComments ] = useState([])
    const [ commentBody, setCommentBody ] = useState("")

    const { currentUser, avatar } = useContext(UserContext)

    const dataList = [
        {label:'Hands-on',value: 'Hands-on'},
        {label:'App-IT', value: 'App-IT'},
        {label:'Study', value: 'Study'},
        {label:'Problems', value: 'Problems'},
        {label:'Sharing', value: 'Sharing'},
        {label:'Connect', value: 'Connect'}
      ];

    dayjs.extend(relativeTime);

    const { classes } = props;

    useEffect(() => {
        // const fetchData = async () => {
        //     const db = firebase.firestore();
        //     const data = await db.collection("notes").get();
        //     setNotes(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        //     setUiLoading(false);
        // };
        // fetchData()

        let recentDate = new Date('2021-02-29')
        
        console.log("user from firebase auth", currentUser)
        return db.collectionGroup("notes").where("uid", "==", currentUser.uid)
        .where("timestamp", ">=", recentDate)
        .orderBy("timestamp","desc")
        .onSnapshot(snapshot => {
            const notesData = [];
            snapshot.forEach(doc => notesData.push({ ...doc.data(), id: doc.id }));
            setNotes(notesData)
            setUiLoading(false)
        })
    }, [currentUser]);

    const handleTitleChange = (event) => setTitle(event.target.value);
    //const handleBodyChange = (event) => setBody(event.target.value);

	const deleteNoteHandler = (data) => {
        const document = db.collection('users').doc(currentUser.uid).collection('notes').doc(data.note.id)
        document.delete()
        .then(() => alert("Document deleted"))
        .then(() => setNoteId(''))
        .catch((error) => console.error("Error deleting document", error));
    }

	const handleEditOpen = (note) => {
        setTitle(note.title)
        setBody(note.body)
        setNoteId(note.id)
        setRt(note.rt)
        setButtonType('Edit')
        setOpen(true)
	}

    const handleViewOpen = (note) => {
        setTitle(note.title)
        setBody(note.body)
        setNoteId(note.id)
        setStudentId(currentUser.uid)
        setRt(note.rt)
        setViewOpen(true)
        setCreated(note.createdAt)
        setAuthor(note.author)
	}

    useEffect(() => {
        
        if(noteId && studentId){
            return db.collectionGroup("comments")
            .where("studentId", "==", studentId)
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

    }, [noteId, studentId]);


    const handleClickOpen = () => {
        setTitle('')
        setBody('')
        setNoteId('')
        setButtonType('')
        setRt('')
        setOpen(true)
    };

    const handleViewClose = () => setViewOpen(false);
    const handleClose = (event) => setOpen(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (buttonType === 'Edit') {
            let document = db.collection('users').doc(currentUser.uid).collection('notes').doc(noteId);
            document.update( {title : title, body : body, activities: newActivities, rt:rt} )
            .then((doc)=>{
                console.log("Note edited")
                setOpen(false);
                setRt("")
                setTitle("")
                setBody("")
            })
        } else {
            const newNote = {
                title: title,
                body: body,
                createdAt: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: currentUser.uid,
                activities: newActivities,
                author: currentUser.displayName,
                avatar: avatar,
                rt: rt
            }
            db.collection('users').doc(currentUser.uid).collection('notes').add(newNote)
            .then((doc)=>{
                console.log("New note added to db")
                setOpen(false);
                setRt("")
                setTitle("")
                setBody("")
            })
            .catch((error) => {
                setErrors(error)
                setOpen(true)
                console.error(error);
                alert('Something went wrong' );
            });
        }
    };

    const handleSubmitComment = (event) => {
        event.preventDefault();

        if (false) {

        } else {
            const newComment = {
                body: commentBody,
                createdAt: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: currentUser.uid,
                author: currentUser.displayName,
                avatar: avatar,
                rt: commentRt,
                studentId: studentId,
                noteId: noteId
            }
            db.collection('users').doc(studentId).collection('notes').doc(noteId).collection('comments').add(newComment)
            .then((doc)=>{
                console.log("New comment added to db")
                setViewOpen(false);
                setCommentRt("")
            })
            .catch((error) => {
                setErrors(error)
                setOpen(true)
                console.error(error);
                alert('Something went wrong' );
            });
        }
    };

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

                <IconButton
                    className={classes.floatingButton}
                    color="primary"
                    aria-label="Add Note"
                    onClick={handleClickOpen}
                >
                    <AddCircleIcon style={{ fontSize: 60 }} />
                </IconButton>
                
                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {buttonType === 'Edit' ? 'Edit Note' : 'Create a new Note '}
                            </Typography>
                            <Button
                                autoFocus
                                color="inherit"
                                onClick={handleSubmit}
                                className={classes.submitButton}
                            >
                                {buttonType === 'Edit' ? 'Save' : 'Submit'}
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} key='title'>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="noteTitle"
                                    label="Note Title"
                                    name="title"
                                    autoComplete="noteTitle"
                                    helperText={errors.title}
                                    value={title}
                                    error={errors.title ? true : false}
                                    onChange={handleTitleChange}
                                />
                            </Grid>
                            <Grid item xs={12} key="chips">
                                <MultipleSelect allOptions={dataList} getList={activities => setNewActivities(activities)}></MultipleSelect>
                            </Grid>

                        </Grid>
                    </form>

                    <Grid item xs={12} sm={6}>
                        <Editor initText={rt} setRt={rt => setRt(rt)} setBody={body => setBody(body)}/>
                    </Grid>

                </Dialog>

                <ListCards notes={notes} handleEditOpen={handleEditOpen} handleViewOpen={handleViewOpen} deleteNoteHandler={deleteNoteHandler} canEdit={true}/>

                <ViewNotes handleViewClose={handleViewClose} viewOpen={viewOpen} title={title} author={author} created={created} avatar={avatar} comments={comments} rt={rt} classes={classes} handleSubmitComment={handleSubmitComment} setCommentBody={setCommentBody} setCommentRt={setCommentRt} commentRt={commentRt}/>

            </main>
        );
    }
}

export default withStyles(styles)(Note);
