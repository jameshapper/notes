import React, { useState, useEffect, useContext } from 'react';
import firebase, { db } from '../firebase';
import "react-quill/dist/quill.snow.css";
import "./styles.css";
import Editor from "./editortest2"
import MultipleSelect from './select';
import { Link } from 'react-router-dom'

import { UserContext } from '../userContext';
import ListCards from './listcards3'
import ListGoals from './listgoals'
import ViewNotes from './viewnotes'
import MyBadges from './mybadges'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DatePicker from '@mui/lab/DatePicker';

import Box from '@material-ui/core/Box'
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
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { InputLabel, TableContainer, TableBody, TableCell, Table, TableHead, TableRow, Paper } from '@material-ui/core';
import Divider from '@material-ui/core/Divider'

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function Note(props) {

    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ noteId, setNoteId ] = useState('')
    const [ studentId, setStudentId ] = useState('')

    const [ newActivities, setNewActivities ] = useState([])
    const [ newEvidence, setNewEvidence ] = useState([])
    const [ summaryEvidence, setSummaryEvidence ] = useState([])

    const [ created, setCreated ] = useState("")
    const [ author, setAuthor ] = useState("")

    const [ errors, setErrors ] = useState([])
    const [ open, setOpen ] = useState(false)
    const [ uiLoading, setUiLoading ] = useState(true)
    const [ buttonType, setButtonType ] = useState('')
    const [ viewOpen, setViewOpen ] = useState(false)

    const [ notes, setNotes ] = useState([]);
    const [ pausedItems, setPausedItems ] = useState([]);
    const [ termGoals, setTermGoals ] = useState([]);
    const [ currentPlans, setCurrentPlans ] = useState([]);


    const [ rt, setRt ] = useState("")
    const [ commentRt, setCommentRt ] = useState("")
    const [ comments, setComments ] = useState([])
    const [ commentBody, setCommentBody ] = useState("")

    const [ status, setStatus ] = useState("Active")
    const [ noteType, setNoteType ] = useState("ActionItem")
    const [ targetDate, setTargetDate ] = useState(new Date(Date.now() - 604800000))
    const [ actionType, setActionType ] = useState("ProblemSolving")
    const [ plannedHrs, setPlannedHrs ] = useState("2")
    const [ hrs, setHrs ] = useState("0")
    const [ crits, setCrits ] = useState("0")


    const { currentUser, avatar } = useContext(UserContext)

    const dataList = [
        {label:'Arduino_101',value: 'Arduino_101'},
        {label:'IGCSE_Bio', value: 'IGCSE_Bio'},
        {label:'IGCSE_Phys', value: 'IGCSE_Phys'}
      ];

    const evidenceList = [
        {label:'Notebook-Notes',value: 'Notebook-Notes'},
        {label:'Video', value: 'Video'},
        {label:'Report', value: 'Report'},
        {label:'TestQuiz', value: 'Test/Quiz'}
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

        let recentDate = new Date('2021-04-29')
        
        console.log("user from firebase auth", currentUser)
        return db.collectionGroup("notes").where("uid", "==", currentUser.uid)
        .where("timestamp", ">=", recentDate)
        .where("status", "==","Active")
        .where("noteType","==","ActionItem")
        .orderBy("timestamp","desc")
        .onSnapshot(snapshot => {
            const notesData = [];
            snapshot.forEach(doc => notesData.push({ ...doc.data(), id: doc.id }));
            setNotes(notesData)
            setUiLoading(false)
        })
    }, [currentUser]);

    useEffect(() => {

        let recentDate = new Date('2021-04-29')
        
        return db.collectionGroup("notes").where("uid", "==", currentUser.uid)
        .where("timestamp", ">=", recentDate)
        .where("status", "==","Paused")
        .orderBy("timestamp","desc")
        .onSnapshot(snapshot => {
            const notesData = [];
            snapshot.forEach(doc => notesData.push({ ...doc.data(), id: doc.id }));
            setPausedItems(notesData)
            setUiLoading(false)
        })
    }, [currentUser]);

    useEffect(() => {

        let recentDate = new Date('2021-04-29')
        
        return db.collectionGroup("notes").where("uid", "==", currentUser.uid)
        .where("timestamp", ">=", recentDate)
        .where("status", "==","Active")
        .where("noteType","==","TermGoals")
        .orderBy("timestamp","desc")
        .onSnapshot(snapshot => {
            const notesData = [];
            snapshot.forEach(doc => notesData.push({ ...doc.data(), id: doc.id }));
            setTermGoals(notesData)
            setUiLoading(false)
        })
    }, [currentUser]);

    useEffect(() => {

        let recentDate = new Date('2021-04-29')
        
        return db.collectionGroup("notes").where("uid", "==", currentUser.uid)
        .where("timestamp", ">=", recentDate)
        .where("status", "==","Active")
        .where("noteType","==","Plan")
        .orderBy("timestamp","desc")
        .onSnapshot(snapshot => {
            const notesData = [];
            snapshot.forEach(doc => notesData.push({ ...doc.data(), id: doc.id }));
            setCurrentPlans(notesData)
            setUiLoading(false)
        })
    }, [currentUser]);

    useEffect(() => {
        console.log('status changed to '+status)
    }, [status])

    useEffect(() => {
        db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            setSummaryEvidence(doc.data().evidence)
            //console.log("summary evidence max crits for first item is "+doc.data().evidence[0].sumCritsMax)
        })
    }, [currentUser])

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
        setStatus(note.status)
        setNewActivities(note.activities)
        setNewEvidence(note.evidence)
        setPlannedHrs(note.plannedHrs)
        setHrs(note.completedHrs)
        setActionType(note.actionType)
        setNoteType(note.noteType)
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
        setStatus(note.status)
        setNewActivities(note.activities)
        setNewEvidence(note.evidence)
        setPlannedHrs(note.plannedHrs)
        setHrs(note.hrs)
        setActionType(note.actionType)
        setNoteType(note.noteType)
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
            document.update( {title : title, body : body, activities: newActivities, rt:rt, status:status, evidence:newEvidence, plannedHrs:plannedHrs, completedHrs:hrs, actionType:actionType, noteType:noteType} )
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
                rt: rt,
                status: status,
                evidence:newEvidence,
                plannedHrs:plannedHrs,
                completedHrs:hrs,
                actionType:actionType,
                noteType:noteType
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
            <main sx={{flexGrow:1, p:3}}>
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
            <main sx={{p:3}} >
                <Toolbar />

                <Box sx={{
                        width: '98%',
                        marginLeft: 2,
                        marginTop: 3
                    }} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={11}>
                            <Typography variant='h6' sx={{mb:0}}>Student Dashboard</Typography>
                        </Grid>
                        
                        <Grid item xs={1} key="addNoteIcon">
                            <IconButton
                                sx={{
                                }}
                                color="primary"
                                aria-label="Add Note"
                                onClick={handleClickOpen}
                                size='small'
                            >
                                <AddCircleIcon sx={{ fontSize: 30 }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
                
                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar sx={{position: 'relative'}} >
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ml:2, flex:1}} >
                                {buttonType === 'Edit' ? 'Edit Note' : 'Create a new Note '}
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
                                {buttonType === 'Edit' ? 'Save' : 'Submit'}
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <Box sx={{
                        width: '98%',
                        marginLeft: 2,
                        marginTop: 3
                    }} noValidate>
                        <Grid container spacing={2}>
                            
                            <Grid item xs={4} key="status">
                                <InputLabel id="status">Status</InputLabel>
                                <Select
                                    labelId="status"
                                    id="status"
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value={"Active"}>Active</MenuItem>
                                    <MenuItem value={"Archived"}>Archived</MenuItem>
                                    <MenuItem value={"Paused"}>Paused</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={4} key="noteType">
                                <InputLabel id="noteType label">Note Type</InputLabel>
                                <Select
                                    labelId="noteType label"
                                    id="noteType"
                                    value={noteType}
                                    label="Note Type"
                                    onChange={(e) => setNoteType(e.target.value)}
                                >
                                    <MenuItem value={"ActionItem"}>Action Item</MenuItem>
                                    <MenuItem value={"Assessment"}>Assessment</MenuItem>
                                    <MenuItem value={"Plan"}>Current Plans</MenuItem>
                                    <MenuItem value={"TermGoals"}>Term Goals</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={4} sm={4} key='date' sx={{mt:1}}>
                                <InputLabel id="date label">Target Date</InputLabel>
                                <DatePicker
                                    value={targetDate}
                                    onChange={(newValue) => {
                                    setTargetDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Grid>
                            <Grid item xs={4} key='planned-hrs'>
                                <Box sx={{display: noteType === 'ActionItem' || noteType === 'Plan' ? 'block' : 'none'}}>

                                    <TextField
                                        variant="outlined"
                                        required
                                        id="plannedHrs"
                                        label="Planned Hours"
                                        name="plannedHrs"
                                        autoComplete="plannedHrs"
                                        value={plannedHrs}
                                        onChange={(e) => setPlannedHrs(e.target.value)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4} key='hrs'>
                                <Box sx={{display: noteType === 'ActionItem' || noteType === 'Plan' ? 'block' : 'none'}}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        id="hrs"
                                        label="Completed Hours"
                                        name="hrs"
                                        autoComplete="hrs"
                                        value={hrs}
                                        onChange={(e) => setHrs(e.target.value)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4} key='crits'>
                                <Box sx={{display: noteType === 'TermGoals' || noteType === 'Assessment' ? 'block' : 'none'}}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        id="crits"
                                        label="crits Target"
                                        name="crits"
                                        autoComplete="crits"
                                        value={crits}
                                        onChange={(e) => setCrits(e.target.value)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4} key="actionType">
                                <Box sx={{display: noteType === 'ActionItem' ? 'block' : 'none'}}>
                                    <InputLabel id="action-type-label">Action Type</InputLabel>
                                    <Select
                                        labelId="action-type-label"
                                        id="action-type"
                                        value={actionType}
                                        label="Action Type"
                                        onChange={(e) => setActionType(e.target.value)}
                                    >
                                        <MenuItem value={"ProblemSolving"}>Problem Solving</MenuItem>
                                        <MenuItem value={"ResearchStudy"}>Research Study</MenuItem>
                                        <MenuItem value={"HandsOn"}>Hands On</MenuItem>
                                        <MenuItem value={"DataAnalysis"}>Data Analysis</MenuItem>
                                        <MenuItem value={"Communicating"}>Communicating</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>

                            <Grid item xs={4} key="chipsBadges">
                                <MultipleSelect itemsTitle="Badges" allOptions={dataList} getList={activities => setNewActivities(activities)} currentActivities={newActivities}></MultipleSelect>
                            </Grid>

                            <Grid item xs={4} key="chipsEvidence">
                                <Box sx={{display: noteType === 'ActionItem' || noteType === 'Assessment' ? 'block' : 'none'}}>
                                    <MultipleSelect itemsTitle="Evidence" allOptions={evidenceList} getList={evidence => setNewEvidence(evidence)} currentActivities={newEvidence}></MultipleSelect>
                                </Box>
                            </Grid>

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

                            <Grid item xs={12} sm={6}>
                                <Editor initText={rt} setRt={rt => setRt(rt)} setBody={body => setBody(body)}/>
                            </Grid>

                        </Grid>
                    </Box>
                </Dialog>

                <Divider sx={{mt:1}}/>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    p:1
                    }}>

                    <Box sx={{mr:1}}>

                        <Box sx={{
                            bgcolor: '#eeeeee',
                            boxShadow: 1,
                            borderRadius: 1,
                            p: 1,
                            minWidth: 300,
                            maxWidth: 500
                            }}>
                            <Typography variant='h6' sx={{mb:0}}>Active Items</Typography>
                            <Divider sx={{mb:1}}/>
                            <ListCards notes={notes} handleEditOpen={handleEditOpen} handleViewOpen={handleViewOpen} deleteNoteHandler={deleteNoteHandler} canEdit={true}/>
                        </Box>

                        <Divider sx={{mt:1}}/>

                        <Box sx={{
                            bgcolor: '#eeeeee',
                            boxShadow: 1,
                            borderRadius: 1,
                            p: 1,
                            minWidth: 300,
                            maxWidth: 500
                            }}>
                            <Typography variant='h6' sx={{mb:0}}>Paused Items</Typography>
                            <Divider sx={{mb:1}}/>
                            <ListCards notes={pausedItems} handleEditOpen={handleEditOpen} handleViewOpen={handleViewOpen} deleteNoteHandler={deleteNoteHandler} canEdit={true}/>
                        </Box>

                        <Divider sx={{mt:1}}/>

                        <Box sx={{
                            bgcolor: '#eeeeee',
                            boxShadow: 1,
                            borderRadius: 1,
                            p: 1,
                            minWidth: 300,
                            maxWidth: 500
                            }}>

                            <Typography variant="h6" sx={{mb:0}}>Evidence and Feedback</Typography>

                            <Box sx={{flexGrow:1}} >
                                <>
                                <TableContainer component={Paper} sx={{borderRadius:2, m:0, maxWidth:550}}>
                                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Date</TableCell>
                                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Badge</TableCell>
                                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Max Available</TableCell>
                                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Crits Awarded</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {summaryEvidence && summaryEvidence.map(evidenceItem => (
                                            <TableRow key={evidenceItem.feedbackId}>
                                            <TableCell>
                                                {evidenceItem.createdAt.slice(0,10)}
                                            </TableCell>
                                            <TableCell>
                                                {evidenceItem.badgeName}
                                            </TableCell>
                                            <TableCell>
                                                {evidenceItem.sumCritsMax}
                                            </TableCell>
                                            <TableCell>
                                                {evidenceItem.sumCritsForAssessment}
                                            </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                </>
                            </Box>
                        </Box>

                    </Box>

                    <Box>
                        <Box sx={{
                            bgcolor: '#eeeeee',
                            boxShadow: 1,
                            borderRadius: 1,
                            p:1,
                            minWidth: 300,
                            maxWidth: 500
                            }}>
                            <Typography variant='h6' sx={{mb:0}}>Current Goals</Typography>
                            <Divider sx={{mb:1}}/>
                            <ListGoals notes={termGoals.concat(currentPlans)} handleEditOpen={handleEditOpen} handleViewOpen={handleViewOpen} deleteNoteHandler={deleteNoteHandler} canEdit={true}/>
                        </Box>
                        <Divider sx={{mt:1}}/>

                        <Box sx={{
                            bgcolor: '#eeeeee',
                            boxShadow: 1,
                            borderRadius: 1,
                            p: 1,
                            minWidth: 300,
                            maxWidth: 500
                            }}>
                            <MyBadges toolbar='false'/>
                        </Box>
                    </Box>

                </Box>

                <ViewNotes handleViewClose={handleViewClose} viewOpen={viewOpen} title={title} author={author} created={created} avatar={avatar} comments={comments} rt={rt} classes={classes} handleSubmitComment={handleSubmitComment} setCommentBody={setCommentBody} setCommentRt={setCommentRt} commentRt={commentRt}/>

            </main>
        );
    }
}

export default Note;
