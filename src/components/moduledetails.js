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


export default function ModuleDetails() {

    const { moduleId } = useParams()
    const { currentUser, isAdmin } = useContext(UserContext)
    const [ moduleDetails, setModuleDetails ] = useState({})
    const [ updateModule, setUpdateModule ] = useState(false)
    const [ refresh, setRefresh ] = useState(false)
    const [ previousModuleSummary, setPreviousModuleSummary ] = useState()
    const [ uiLoading, setUiLoading ] = useState(true)
    const [ moduleAddDialog, setAddModuleDialog ] = useState(false)

    const history = useHistory()


    
    useEffect(() => {
        setUiLoading(true)
        if(moduleId){
            return db.collection("modules").doc(moduleId).get()
            .then((doc)=> {
                if(doc.exists){
                    let moduleData = doc.data()
                    setModuleDetails({...moduleData, moduleId: moduleId})
                    console.log('moduleData title is '+moduleData.modulename)
                    const previous = {
                        modulename: doc.data().modulename,
                        id: moduleId,
                        description: doc.data().description,
                        imageUrl: doc.data().imageUrl,
                        modulelevel: parseInt(doc.data().modulelevel),
                        totalcrits: parseInt(doc.data().totalcrits),
                        status: doc.data().status
                    }
                    setPreviousModuleSummary(previous)
                    setUiLoading(false)
                } else {
                    alert("I can't find that document")
                }
                setUiLoading(false)
            })
        }

    }, [moduleId]);

    useEffect(() => {
        if(updateModule){ return db.collection('users').doc(currentUser.uid)
            .collection('myModules').add({...moduleDetails,uid: currentUser.uid, progress:0})
            .then((doc)=>{
                console.log('New module aspiration added')
                const newModule = {
                    modulename:moduleDetails.modulename,
                    myModuleId:doc.id,
                    crits:moduleDetails.totalcrits,
                    critsAwarded: 0,
                    progress: 0,
                    evidence: []
                  }
                db.collection('users').doc(currentUser.uid).update({
                    [`myModulesMap.${moduleId}`]:newModule
                })
                setUpdateModule(false)
                setAddModuleDialog(false)
                history.push('/myModules')
            })
        }
    },[updateModule, currentUser.uid, moduleDetails, moduleId, history])

    const handleViewClose = () => setAddModuleDialog(false);


    const handleAddModule = (e) => {
        e.preventDefault()
        if(moduleDetails.status && moduleDetails.status === "Published"){
            let document = db.collection('users').doc(currentUser.uid)
            document.collection('myModules').where("uid","==",currentUser.uid)
            .where("modulename","==",moduleDetails.modulename).get()
            .then((snapshot) => {
                console.log('number of docs in snapshot is '+snapshot.size)
                if(snapshot.size === 0){
                    setUpdateModule(true)
                } else {
                    setUpdateModule(false)
                    setAddModuleDialog(false)
                    alert('Maybe you already have this module?')
                }
            })
        }else{
            alert('This module is still under development! Check with your teacher about when it might be published.')
        }

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
        db.collection("modules").doc(moduleId).update({
            imageUrl: await downloadUrl
        })
        .then(doc => {
            alert("check to see if module updated correctly")
            db.collection("adminDocs").doc("moduleList").update({
                modules: firebase.firestore.FieldValue.arrayRemove(previousModuleSummary)
            })
            .then(() => {
                const updatedModuleListItem = {
                    ...previousModuleSummary,
                    imageUrl: downloadUrl
                }
                db.collection("adminDocs").doc("moduleList").update({
                    modules: firebase.firestore.FieldValue.arrayUnion(updatedModuleListItem)
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

    console.log('reached the ModuleDetails component with id of '+moduleId)
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
                aria-label="Add Module"
                onClick={() => setAddModuleDialog(true)}
                >
                    <AddCircleIcon sx={{ fontSize: 60 }} />
                </IconButton>
            }


            <Dialog
                onClose={handleViewClose}
                aria-labelledby="customized-dialog-title"
                open={moduleAddDialog}
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
                        Do you want to add this as a "Module Aspiration"? Once it is added, only the teacher will be able to remove it! But if you are ready to go for it, click "Add" and enjoy the challenge!
                    </DialogContent>
                    <Button variant='contained' onClick={handleAddModule}>Add Module</Button>
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
                    <Typography variant='h4' >{moduleDetails.modulename}</Typography>
                </Box>
                <Box sx={{mx:'auto', width:280}}>
                    <Card sx={{ maxWidth: 280 }}>
                        <CardMedia
                            sx={{ p:1 }}
                            image={moduleDetails.imageUrl}
                            title="Module Image"
                            component="img"
                        />
                    </Card>
                </Box>
                <Box sx={{m:2, width:140}}>
                    <Typography variant='h6' >Level: {moduleDetails.modulelevel}</Typography>
                    <Typography variant='h6' >Total Crits: {moduleDetails.totalcrits}</Typography>
                </Box>
                </Box>
                <Typography sx={{m:2, p:2}} variant='body1' >Description: {moduleDetails.description}</Typography>
                {moduleId && moduleDetails.activities && 
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Activity</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Level</TableCell>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Description</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Hours</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {moduleDetails.activities.map((row) => (
                            <TableRow
                            key={row.label}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.label}
                            </TableCell>
                            <TableCell align="right">{row.level}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold'}}>{row.hrs_estimate}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                }
                {!isAdmin &&
                    <Button onClick={() => setAddModuleDialog(true)}>Add Module?</Button>
                }
            </Box>

        </>
    )}
}
