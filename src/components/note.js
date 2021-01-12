import React, { useState, useEffect } from 'react';
import firebase from '../firebase';

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
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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

function Note(props) {

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ todoId, setTodoId ]= useState('')

    const [ errors, setErrors ] = useState([])
    const [ open, setOpen ] = useState(false)
    const [ uiLoading, setUiLoading ] = useState(true)
    const [ buttonType, setButtonType ] = useState('')
    const [ viewOpen, setViewOpen ] = useState(false)

    const [ notes, setNotes ] = useState([]);

    useEffect(() => {
        // const fetchData = async () => {
        //     const db = firebase.firestore();
        //     const data = await db.collection("notes").get();
        //     setNotes(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        //     setUiLoading(false);
        // };
        // fetchData();

        const db = firebase.firestore()
        return db.collection("notes").onSnapshot(snapshot => {
            const notesData = [];
            snapshot.forEach(doc => notesData.push({ ...doc.data(), id: doc.id }));
            setNotes(notesData)
            setUiLoading(false)
        })
    }, []);

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleBodyChange = (event) => setBody(event.target.value);

	const deleteTodoHandler = (data) => {
        //setTodoId(data.todo.id)
        console.log(todoId)
        console.log(data.todo.id)
        console.log(data)
        //for some reason using todoId does not work even though same value as data.todo.id--async problem?
        const db = firebase.firestore();
        const document = db.collection('notes').doc(data.todo.id)
        document.delete()
        .then(() => alert("Document deleted"))
        .then(() => setTodoId(''))
        .catch((error) => console.error("Error deleting document", error));
    }

	const handleEditClickOpen = (data) => {
        setTitle(data.todo.title)
        setBody(data.todo.body)
        setTodoId(data.todo.id)
        setButtonType('Edit')
        setOpen(true)
	}

	const handleViewOpen = (data) => {
        setTitle(data.todo.title)
        setBody(data.todo.body)
        setViewOpen(true)
	}

    const DialogTitle = withStyles(styles)((props) => {
        const { children, onClose, ...other } = props;
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

    const handleClickOpen = () => {
        setTitle('')
        setBody('')
        setTodoId('')
        setButtonType('')
        setOpen(true)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const db = firebase.firestore();

        if (buttonType === 'Edit') {
            let document = db.collection('notes').doc(todoId);
            document.update( {title : title, body : body}, )
        } else {
            const newNote = {
                title: title,
                body: body,
                createdAt: new Date().toISOString()
            }
            db.collection('notes').add(newNote)
            .then((doc)=>{
                console.log("New note added to db")
                setOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                setErrors(error)
                setOpen(true)
                console.error(error);
                alert('Something went wrong' );
            });
        }
    };

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
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="todoTitle"
                                    label="Todo Title"
                                    name="title"
                                    autoComplete="todoTitle"
                                    helperText={errors.title}
                                    value={title}
                                    error={errors.title ? true : false}
                                    onChange={handleTitleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="todoDetails"
                                    label="Todo Details"
                                    name="body"
                                    autoComplete="todoDetails"
                                    multiline
                                    rows={25}
                                    rowsMax={25}
                                    helperText={errors.body}
                                    error={errors.body ? true : false}
                                    onChange={handleBodyChange}
                                    value={body}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Dialog>

                <Grid container spacing={2}>
                    {notes.map((todo) => (
                        <Grid item xs={12} sm={6}>
                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {todo.title}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        {dayjs(todo.createdAt).fromNow()}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        {todo.body.substring(0, 65)}
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
            </main>
        );
    }
}

export default withStyles(styles)(Note);
