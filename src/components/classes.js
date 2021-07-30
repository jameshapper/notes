import React, { useState, useEffect, useContext } from 'react';
import firebase, { db, auth } from '../firebase';
import { UserContext } from '../userContext';
import ListCards from './listcards'
import ViewNotes from './viewnotes'
import { Link } from "react-router-dom";

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MultiSelect from "react-multi-select-component";

import Box from '@material-ui/core/Box'
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

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function TeacherClasses(props) {

    const [ user ] = useState(auth.currentUser)

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ noteId, setNoteId ] = useState('')
    const [ studentId, setStudentId ] = useState('')

    const [ students10, setStudents10 ] = useState([])
    const [ students20, setStudents20 ] = useState([])
    const [ students30, setStudents30 ] = useState([])

    const [ currentClass, setCurrentClass ] = useState([])
    const [ created, setCreated ] = useState("")
    const [ author, setAuthor ] = useState("")
    const [ noteAvatar, setNoteAvatar ] = useState("")
    const [ classForSelect, setClassForSelect ] = useState([])

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

    //get class data (if stored in teacherClasses collection?)
    useEffect(() => {
        
        if(user){
            return db.collection("users").doc(user.uid).collection('teacherClasses').get()
            .then((snapshot) => {
                const teacherData = []
                snapshot.forEach((doc) => {
                    teacherData.push({...doc.data(), id: doc.id})
                })
                setTeacherClasses(teacherData)
                setUiLoading(false)
            })
            .catch((error) => {
                console.log("No classes error: ", error);
            })
        }

    }, [user]);

    useEffect(() => {
        //console.log('selected ids are '+selected.map((student) => student.value))
        //setSelectedStudents(selected.map(a => a.value))
        setStudents10(selected.map(a=>a.value).slice(0,10))
        setStudents20(selected.map(a=>a.value).slice(10,20))
        setStudents30(selected.map(a=>a.value).slice(20,30))

    },[selected])

    const DialogTitle = ((props) => {
        const { children, onClose, classes, ...other } = props;
        return (
            <MuiDialogTitle disableTypography sx={{minWidth:220}} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" sx={{
                        position: 'absolute',
                        right: 8,
                        top: 9,
                        color: '#e0e0e0'
                    }} onClick={onClose}>
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        let notes10 = []
        let notes20 = []
        let notes30 = []

        let recentDate = selectedDate
        console.log('students in array groups lengths '+students10.length+students20.length+students30.length)

        if(students10.length>0){
            let first10 = await
            db.collectionGroup('notes')
            .where('uid','in', students10)
            .where("timestamp", ">=", recentDate)
            .orderBy("timestamp","desc")
            .get()

            first10.forEach((doc) => {
                notes10.push({ ...doc.data(), id: doc.id })
            })
        }

        if(students20.length>0){
            let second10 = await
            db.collectionGroup('notes')
            .where('uid','in', students20)
            .where("timestamp", ">=", recentDate)
            .orderBy("timestamp","desc")
            .get()

            second10.forEach((doc) => {
            notes20.push({ ...doc.data(), id: doc.id })
            })
        }

        if(students30.length>0){
            let third10 = await
            db.collectionGroup('notes')
            .where('uid','in', students30)
            .where("timestamp", ">=", recentDate)
            .orderBy("timestamp","desc")
            .get()

            third10.forEach((doc) => {
            notes30.push({ ...doc.data(), id: doc.id })
            })
        }

        setNotes(notes10.concat(notes20,notes30))
        setOpen(false)
        //console.log("notes10 is "+notes10.length+" notes20 is "+notes20.length+" and notes30 is "+notes30.length)

    };

    const handleSubmitComment = (event) => {
        event.preventDefault();

        if (commentBody) {
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
        } else {
            alert("No empty comments")
        }

    };

    const handleViewOpen = (note) => {
        setTitle(note.title)
        setBody(note.body)
        setNoteId(note.id)
        setStudentId(note.uid)
        setCreated(note.createdAt)
        setAuthor(note.author)
        setRt(note.rt)
        setNoteAvatar(note.avatar)
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

    useEffect(() => {
        const toLabelValue = currentClass.map((student) => {
            return {
                label: student.firstName,
                value: student.uid
            }
        })
        setClassForSelect(toLabelValue)
    },[currentClass])

    const handleViewClose = () => setViewOpen(false);

    const handleClose = (event) => setOpen(false);

    if (uiLoading === true) {
        return (
            <main sx={{flexGrow:1, p:3}} >
                <Toolbar />
                {uiLoading && <CircularProgress size={150} sx={{
                    position: 'fixed',
                    zIndex: '1000',
                    height: '31px',
                    width: '31px',
                    left: '50%',
                    top: '35%'
                }} />}
            </main>
        );
    } else {
        return (
            <main sx={{flexGrow:1, p: 3}}>
                <Toolbar />

                <Button variant="contained" component={Link} to='/addclass'>Add new class</Button>

                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar sx={{position: 'relative'}} >
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ml:2, flex:1}} >
                                Select students to view recent notes
                            </Typography>
                            <Button
                                autoFocus
                                color="inherit"
                                onClick={handleSubmit}
                                sx={{
                                    display: 'block',
                                    color: 'white',
                                    textAlign: 'center',
                                    position: 'absolute',
                                    top: 14,
                                    right: 10
                                }}
                            >
                                Submit
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <Box component="form"
                    sx={{
                        width: '98%',
                        marginLeft: 2,
                        marginTop: 3
                    }} noValidate>
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
                                    options={classForSelect}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy={"Select"}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>

                <Grid container spacing={8} justify='center'>
                    {teacherClasses.map((teacherClass) => (
                        <Grid item xs={8} sm={6} key = {teacherClass.name}>
                            <Card sx={{minWidth:220}} variant="outlined">
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
                    <ListCards notes={notes} handleEditOpen={()=>alert('permission denied')} handleViewOpen={handleViewOpen} deleteNoteHandler={()=>alert('permission denied')} canEdit={false}/>
                }
  
                <ViewNotes handleViewClose={handleViewClose} viewOpen={viewOpen} title={title} author={author} created={created} avatar={noteAvatar} comments={comments} rt={rt} classes={classes} handleSubmitComment={handleSubmitComment} setCommentBody={setCommentBody} setCommentRt={setCommentRt} commentRt={commentRt}/>

            </main>
        );
    }
}

export default TeacherClasses;
