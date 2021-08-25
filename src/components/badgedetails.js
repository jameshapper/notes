import React, { useEffect, useState, useContext } from 'react'
import firebase, { db, storage } from '../firebase';
import { UserContext } from '../userContext';

import { useHistory, useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Dialog, Typography, Button, ButtonGroup, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Card, CardMedia, DialogContent } from '@material-ui/core'


export default function BadgeDetails() {

    const { badgeId } = useParams()
    const { currentUser, isAdmin } = useContext(UserContext)
    const [ badgeDetails, setBadgeDetails ] = useState({})
    const [ updateBadge, setUpdateBadge ] = useState(false)
    const [ refresh, setRefresh ] = useState(false)
    const [ previousBadgeSummary, setPreviousBadgeSummary ] = useState()
    const [ uiLoading, setUiLoading ] = useState(true)
    const [ badgeAddDialog, setAddBadgeDialog ] = useState(false)

    const history = useHistory()


    
    useEffect(() => {
        setUiLoading(true)
        if(badgeId){
            return db.collection("badges").doc(badgeId).get()
            .then((doc)=> {
                if(doc.exists){
                    let badgeData = doc.data()
                    setBadgeDetails({...badgeData, badgeId: badgeId})
                    console.log('badgeData title is '+badgeData.badgename)
                    const previous = {
                        badgename: doc.data().badgename,
                        id: badgeId,
                        description: doc.data().description,
                        imageUrl: doc.data().imageUrl,
                        badgelevel: parseInt(doc.data().badgelevel),
                        totalcrits: parseInt(doc.data().totalcrits)
                    }
                    setPreviousBadgeSummary(previous)
                    setUiLoading(false)
                } else {
                    alert("I can't find that document")
                }
                setUiLoading(false)
            })
        }

    }, [badgeId]);

    useEffect(() => {
        if(updateBadge){ return db.collection('users').doc(currentUser.uid)
            .collection('myBadges').add({...badgeDetails,uid: currentUser.uid, progress:0})
            .then((doc)=>{
                console.log('New badge aspiration added')
                const newBadge = {
                    badgename:badgeDetails.badgename,
                    myBadgeId:doc.id,
                    crits:badgeDetails.totalcrits,
                    critsAwarded: 0,
                    progress: 0,
                    evidence: []
                  }
                db.collection('users').doc(currentUser.uid).update({
                    [`myBadgesMap.${badgeId}`]:newBadge
                })
                setUpdateBadge(false)
                setAddBadgeDialog(false)
                history.push('/myBadges')
            })
        }
    },[updateBadge, currentUser.uid, badgeDetails, badgeId, history])

    const handleViewClose = () => setAddBadgeDialog(false);


    const handleAddBadge = (e) => {
        e.preventDefault()
        let document = db.collection('users').doc(currentUser.uid)
        document.collection('myBadges').where("uid","==",currentUser.uid)
        .where("badgename","==",badgeDetails.badgename).get()
        .then((snapshot) => {
            console.log('number of docs in snapshot is '+snapshot.size)
            if(snapshot.size === 0){
                setUpdateBadge(true)
            } else {
                setUpdateBadge(false)
                setAddBadgeDialog(false)
                alert('Maybe you already have this badge?')
            }
        })
    }

    const [ fileUpload, setFileUpload ] = useState(null)
  
    const onFileChange = async (e) => {
	  setFileUpload(e.target.files[0])
    };

    const onSubmit = async () => {

        console.log('file upload name is '+fileUpload.name)
  
        const storageRef = storage.ref();
        const fileRef = storageRef.child(fileUpload.name);
        await fileRef.put(fileUpload);
        let downloadUrl = await fileRef.getDownloadURL()
        console.log('waiting for download url '+await downloadUrl)
        db.collection("badges").doc(badgeId).update({
            imageUrl: await downloadUrl
        })
        .then(doc => {
            alert("check to see if badge updated correctly")
            db.collection("adminDocs").doc("badgeList").update({
                badges: firebase.firestore.FieldValue.arrayRemove(previousBadgeSummary)
            })
            .then(() => {
                const updatedBadgeListItem = {
                    ...previousBadgeSummary,
                    imageUrl: downloadUrl
                }
                db.collection("adminDocs").doc("badgeList").update({
                    badges: firebase.firestore.FieldValue.arrayUnion(updatedBadgeListItem)
                })
            })
        })
        .then(function() {
          console.log("update appears successful")
          setRefresh(!refresh)
        }).catch(function(error) {
          console.log('problem updating image')
        });
  
    };

    console.log('reached the BadgeDetails component with id of '+badgeId)
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
        <>
            <Toolbar />
            {!isAdmin &&
                <IconButton
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0
                }}
                color="primary"
                aria-label="Add Badge"
                onClick={() => setAddBadgeDialog(true)}
                >
                    <AddCircleIcon sx={{ fontSize: 60 }} />
                </IconButton>
            }


            <Dialog
                onClose={handleViewClose}
                aria-labelledby="customized-dialog-title"
                open={badgeAddDialog}
                fullWidth
                classes={{ paperFullWidth: {maxWidth: '75%'} }}
            >
                <Paper elevation={2}
                sx={{
                    padding: 1,
                    backgroundColor: "#e0e0e0",
                    border: "1px solid black",
                    margin: "2px 2px 8px 2px"
                }}>
                    <DialogContent>
                        Do you want to add this as a "Badge Aspiration"? Once it is added, only the teacher will be able to remove it! But if you are ready to go for it, click "Add" and enjoy the challenge!
                    </DialogContent>
                    <Button variant='contained' onClick={handleAddBadge}>Add Badge</Button>
                </Paper>
            </Dialog>

            {isAdmin && 
            <ButtonGroup orientation='vertical'>
                <Button variant='contained' component='label' sx={{m:1}}>
                    Upload New Image
                    <input type="file" hidden onChange={onFileChange} />
                </Button>
                
                <Button variant='outlined' sx={{m:1}} onClick = {onSubmit}> Submit New Image </Button>
            </ButtonGroup>
            }

            <Box sx={{ flexGrow:1, p:3}} >
                <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                <Box sx={{m:2, width:140}}>
                    <Typography variant='h4' >{badgeDetails.badgename}</Typography>
                </Box>
                <Box sx={{mx:'auto', width:280}}>
                    <Card sx={{ maxWidth: 280 }}>
                        <CardMedia
                            sx={{ p:1 }}
                            image={badgeDetails.imageUrl}
                            title="Badge Image"
                            component="img"
                        />
                    </Card>
                </Box>
                <Box sx={{m:2, width:140}}>
                    <Typography variant='h6' >Level: {badgeDetails.badgelevel}</Typography>
                    <Typography variant='h6' >Total Crits: {badgeDetails.totalcrits}</Typography>
                </Box>
                </Box>
                <Typography sx={{m:2, p:2}} variant='body1' >Description: {badgeDetails.description}</Typography>
                {badgeId && badgeDetails.criteria && 
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Criterion</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Level</TableCell>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Description</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Total Crits</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {badgeDetails.criteria.map((row) => (
                            <TableRow
                            key={row.label}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.label}
                            </TableCell>
                            <TableCell align="right">{row.level}</TableCell>
                            <TableCell align="left">{row.criterion}</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold'}}>{row.crits}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                }
                {!isAdmin &&
                    <Button onClick={() => setAddBadgeDialog(true)}>Add Badge?</Button>
                }
            </Box>

        </>
    )}
}
