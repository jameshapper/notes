import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';

import { UserContext } from '../userContext';
import ListCards from './listcards4'
import ListGoals from './listgoals4'
import MyBadges from './mybadges'
import NewNote from './newnote4'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TableContainer, TableBody, TableCell, Table, TableHead, TableRow, Paper } from '@material-ui/core';
import Divider from '@material-ui/core/Divider'

function Note() {

    const [ noteForEdit, setNoteForEdit ] = useState({})

    const [ open, setOpen ] = useState(false)
    const [ uiLoading, setUiLoading ] = useState(true)
    const [ buttonType, setButtonType ] = useState('New')

    const [ notes, setNotes ] = useState([]);
    const [ pausedItems, setPausedItems ] = useState([]);
    const [ termGoals, setTermGoals ] = useState([]);
    const [ currentPlans, setCurrentPlans ] = useState([]);
    const [ summaryEvidence, setSummaryEvidence ] = useState([])

    const { currentUser } = useContext(UserContext)

    dayjs.extend(relativeTime);

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
        db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            setSummaryEvidence(doc.data().evidence)
            //console.log("summary evidence max crits for first item is "+doc.data().evidence[0].sumCritsMax)
        })
    }, [currentUser])

	const handleEditOpen = (note) => {
        setNoteForEdit(note)
        setButtonType("Edit")
        setOpen(true)
	}

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    }

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

                {open && <NewNote open={open} handleClose={handleClose} buttonType={buttonType} noteForEdit={noteForEdit}/>}
                
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
                            <ListCards notes={notes} handleEditOpen={handleEditOpen} canEdit={true}/>
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
                            <ListCards notes={pausedItems} handleEditOpen={handleEditOpen} canEdit={true}/>
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
                            <ListGoals notes={termGoals.concat(currentPlans)} handleEditOpen={handleEditOpen} canEdit={true}/>
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

            </main>
        );
    }
}

export default Note;
