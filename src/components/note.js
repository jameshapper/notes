import React, { useState, useEffect, useContext } from 'react';
import firebase, { db } from '../firebase';
import Chips from './chips';
import "react-quill/dist/quill.snow.css";
import "./styles.css";
import Editor from "./editortest2"
import MultipleSelect from './select';
import { UserContext } from '../userContext';

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
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper'
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

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
		minWidth: 470
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

function Note(props) {

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ noteId, setNoteId ] = useState('')
    const [ noteUid, setNoteUid ] = useState('')

    const [ todoId, setTodoId ] = useState('')
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

    const { currentUser, avatar } = useContext(UserContext)

    const dataList = [
        {label:'Hands-on',value: 'Hands-on'},
        {label:'App-IT', value: 'App-IT'},
        {label:'Study', value: 'Study'},
        {label:'Problems', value: 'Problems'},
        {label:'Sharing', value: 'Sharing'},
        {label:'Connect', value: 'Connect'}
      ];

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
    }, []);

    const handleTitleChange = (event) => setTitle(event.target.value);
    //const handleBodyChange = (event) => setBody(event.target.value);

	const deleteTodoHandler = (data) => {
        const document = db.collection('users').doc(currentUser.uid).collection('notes').doc(data.todo.id)
        document.delete()
        .then(() => alert("Document deleted"))
        .then(() => setTodoId(''))
        .catch((error) => console.error("Error deleting document", error));
    }

	const handleEditClickOpen = (data) => {
        setTitle(data.todo.title)
        setBody(data.todo.body)
        setTodoId(data.todo.id)
        setRt(data.todo.rt)
        setButtonType('Edit')
        setOpen(true)
	}

	const handleViewOpen = (data) => {
        setTitle(data.todo.title)
        setBody(data.todo.body)
        setNoteId(data.todo.id)
        setRt(data.todo.rt)
        setViewOpen(true)
        setCreated(data.todo.createdAt)
        setAuthor(data.todo.author)
        setNoteUid(data.todo.uid)
	}

    useEffect(() => {
        
        if(noteId && noteUid){
            return db.collectionGroup("comments")
            .where("studentId", "==", noteUid)
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

    }, [noteId, noteUid]);

    dayjs.extend(relativeTime);

    const { classes } = props;

    const handleClickOpen = () => {
        setTitle('')
        setBody('')
        setTodoId('')
        setButtonType('')
        setRt('')
        setOpen(true)
    };

    const handleViewClose = () => setViewOpen(false);
    const handleClose = (event) => setOpen(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (buttonType === 'Edit') {
            let document = db.collection('users').doc(currentUser.uid).collection('notes').doc(todoId);
            document.update( {title : title, body : body, activities: newActivities, rt:rt} )
            .then((doc)=>{
                console.log("Note edited")
                setOpen(false);
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
            })
            .catch((error) => {
                setErrors(error)
                setOpen(true)
                console.error(error);
                alert('Something went wrong' );
            });
        }
    };

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
                    aria-label="Add Todo"
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
                                {buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
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
                                    label="Todo Title"
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

                <Grid container spacing={2}>
                    {notes.map((todo) => (
                        <Grid item xs={12} sm={6} key = {todo.id}>
                            <Card className={classes.root} variant="outlined">
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" className={classes.avatar} src={todo.avatar} />
                                    }
                                    title={todo.title}
                                    subheader= {dayjs(todo.createdAt).fromNow()+" by "+todo.author}
                                />
                                <CardContent>
                                    {todo.activities && todo.activities.length > 0 && <Chips activities={todo.activities}></Chips>}
                                    <Typography variant="body2" component="p">
                                        {todo.body.substring(0, 65)+"..."}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => handleViewOpen({ todo })}>
                                        {' '}
                                        View{' '}
                                    </Button>
                                    <Button size="small" color="primary" onClick={() => handleEditClickOpen({ todo })}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="primary" onClick={() => deleteTodoHandler({ todo })}>
                                        Delete
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
                    <Paper   elevation={2}
                        style={{
                            padding: 8,
                            backgroundColor: "#e0e0e0",
                            border: "1px solid black",
                            margin: "2px 2px 8px 2px"
                        }}>
                    <Grid container >
                        <Grid item xs={1}>
                            <Avatar aria-label="recipe" className={classes.avatar} src={avatar} />
                        </Grid>
                        <Grid item xs={11}>
                            <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                            {title}
                            </DialogTitle>
                            <div>{dayjs(created).fromNow()+" by "+author}</div>
                        </Grid>
                        <Grid item>
                            <DialogContent>
                                <div dangerouslySetInnerHTML={{__html:rt}}/>
                            </DialogContent>
                        </Grid>
                    </Grid>
                    </Paper>


                    {comments && comments.length > 0 && 
                      <div>
                          {comments.map((comment) => (
                            <Grid container>
                                <Grid item xs={1}>
                                <Avatar aria-label="recipe" className={classes.avatar} src={comment.avatar} />
                                </Grid>
                                <Grid item xs={11}>
                                    <Paper>
                                    {dayjs(comment.createdAt).fromNow()+" by "+comment.author}
                                        <DialogContent>
                                            <div dangerouslySetInnerHTML={{__html:comment.rt}}/>
                                        </DialogContent>
                                    </Paper>

                                </Grid>
                                <hr/>
                            </Grid>
                          ))}
                      </div>
                    }

                </Dialog>
            </main>
        );
    }
}

export default withStyles(styles)(Note);
