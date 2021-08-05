import React, { useContext, useEffect, useState } from 'react'
import firebase, { db } from '../firebase';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../userContext';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

import { useForm, Controller } from 'react-hook-form'
import { Typography, Grid, TextField, Button } from '@material-ui/core';
import { Paper, Toolbar, Box, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

export default function Feedback() {

    const { currentUser } = useContext(UserContext)
    const [ previousFeedbackSummary, setPreviousFeedbackSummary ] = useState({})

    const { feedbackId } = useParams()
    const location = useLocation()
    const history = useHistory()
    const { selectedStudentId='', badgeDetails, selectedStudentName="A Student" } = location.state || ''

    console.log('selectedStudentId is '+selectedStudentId)
    //console.log('badgeDetails are '+JSON.stringify(badgeDetails))
    const modules = {
        toolbar: {
            container: [
              [{header: [1,2,3,false]}],
              ['bold', 'italic'],
              ['link'],
              [{ list: 'ordered' }, { list: 'bullet' }]
            ]
        }
    }
  
    const formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "list",
      "bullet",
      "link",
    ];

    const { handleSubmit, control, setValue } = useForm();

    const isAddMode = !feedbackId

    useEffect(() => {
        if(!isAddMode) {
            db.collection("users").doc(selectedStudentId).collection("myBadges").doc(badgeDetails.badgeId).collection("feedback").doc(feedbackId).get()
            .then(feedback => {
                const fields = ['artifactLinks','assessorComments','critsAwarded']
                fields.forEach(field => {
                    setValue(field, feedback.data()[field]);
                    console.log("value of a field is "+JSON.stringify(feedback.data()[field]))
                })
                const previous = {
                    critsAwarded: feedback.data().critsAwarded,
                    feedbackId: feedbackId,
                    createdAt: feedback.data().createdAt
                }
                setPreviousFeedbackSummary(previous)
                console.log('previous is '+JSON.stringify(previous))
            })
        }
    },[badgeDetails.badgeId, feedbackId, isAddMode, selectedStudentId, setValue])

    function onSubmit(data) {
        return isAddMode
            ? newFeedback(data)
            : updateFeedback(feedbackId, data);
    }

    const newFeedback = data => {

        const createdAt = new Date().toISOString()

        //const oldBadgeDetails = JSON.parse(JSON.stringify(badgeDetails.criteria))
        //console.log("original badgeDetails "+JSON.stringify(oldBadgeDetails))

/*         const newValues = badgeDetails.criteria.map(criterion => {
            const key = criterion.label
            return criterion.critsAwarded += parseInt(data.critsAwarded[key])
        })
        console.log("newValues "+newValues) */


        badgeDetails.criteria.map(criterion => {
            const key = criterion.label
            return criterion.critsAwarded += parseInt(data.critsAwarded[key])
        })
        //console.log("badgeDetails update? "+JSON.stringify(badgeDetails.criteria))

        const totalCrits = badgeDetails.criteria.map(criterion => {
            return criterion.critsAwarded
        })

        const sumCrits = totalCrits.reduce((a,b) => a + b, 0)
        badgeDetails.progress = parseInt(100 * ( sumCrits / parseInt(badgeDetails.totalcrits) ))

        const feedback = {
            studentId: selectedStudentId,
            studentName: selectedStudentName,
            artifactLinks: data.artifactLinks,
            assessorComments: data.assessorComments,
            createdAt: createdAt,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            studentBadgeId: badgeDetails.badgeId,
            badgeName: badgeDetails.badgename,
            assessorName: currentUser.displayName,
            assessorId: currentUser.uid,
            critsAwarded: data.critsAwarded
        }
        db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId).collection("feedback").add(feedback)
        .then((doc)=>{
            const feedbackSummary = {
                critsAwarded: data.critsAwarded,
                feedbackId: doc.id,
                createdAt: createdAt
            }
            console.log("New feedback added to db")
            db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId)
            .update({evidence: firebase.firestore.FieldValue.arrayUnion(feedbackSummary), progress: badgeDetails.progress, criteria: badgeDetails.criteria})
        })
        .then(() => {
            history.push(`/students/${selectedStudentId}/myBadges/${badgeDetails.badgeId}`)
        })
        .catch((error) => {
            console.error(error);
            alert('Something went wrong' );
        });
    };

    const updateFeedback = (docId, data) => {

        console.log('data is '+JSON.stringify(data))
        console.log('badgeDetails.criteria start as '+JSON.stringify(badgeDetails.criteria))

        const createdAt = new Date().toISOString()

        badgeDetails.criteria.map(criterion => {
            const key = criterion.label
            return (
                criterion.critsAwarded += (parseInt(data.critsAwarded[key]) - parseInt(previousFeedbackSummary.critsAwarded[key]))
        )})

        const totalCrits = badgeDetails.criteria.map(criterion => {
            return criterion.critsAwarded
        })

        const sumCrits = totalCrits.reduce((a,b) => a + b, 0)
        badgeDetails.progress = parseInt(100 * ( sumCrits / parseInt(badgeDetails.totalcrits) ))

        const feedback = {
            studentId: selectedStudentId,
            studentName: selectedStudentName,
            artifactLinks: data.artifactLinks,
            assessorComments: data.assessorComments,
            createdAt: createdAt,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            studentBadgeId: badgeDetails.badgeId,
            badgeName: badgeDetails.badgename,
            assessorName: currentUser.displayName,
            assessorId: currentUser.uid,
            critsAwarded: data.critsAwarded
        }

        db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId).collection("feedback").doc(feedbackId).update(feedback)
        .then((doc)=>{
            db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId)
            .update({evidence: firebase.firestore.FieldValue.arrayRemove(previousFeedbackSummary)})
            .then(() => {
                const feedbackSummary = {
                    critsAwarded: data.critsAwarded,
                    feedbackId: feedbackId,
                    createdAt: createdAt
                }
                db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId)
                .update({evidence: firebase.firestore.FieldValue.arrayUnion(feedbackSummary), progress: badgeDetails.progress, criteria: badgeDetails.criteria})
            })
            .then(() => console.log('badgeDetails.criteria are now '+JSON.stringify(badgeDetails.criteria)))
        })
        .then(() => {
            history.push(`/students/${selectedStudentId}/myBadges/${badgeDetails.badgeId}`)
        })
        .catch((error) => {
            console.error(error);
            alert('Something went wrong' );
        });
    };

    return (
        <div>
            <Toolbar/>

            <Typography variant="h6">
                New Feedback Form for: {selectedStudentName}
            </Typography>

            <Grid container sx={{m:2}}>
                <Grid item>
                    <Typography variant="h3">{badgeDetails.badgename} </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" align="justify" sx={{m:4}}>{badgeDetails.description} </Typography>
                </Grid>
            </Grid>

            <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{flexGrow:1, p:3}} >
                <Button type="submit" variant="contained" color="primary" sx={{m:2}}>
                    Submit Feedback Form
                </Button>

                <Grid item xs={12} sm={12}>
                    <Controller
                        name="artifactLinks"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <ReactQuill
                            theme="snow"
                            value={value}
                            onChange={onChange}
                            placeholder={"Add links to archived work here..."}
                            modules={modules}
                            formats={formats}
                        />
                        )}
                    />   
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Controller
                        name={"assessorComments"}
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Comments"
                            fullWidth
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                    />
                </Grid>

                {badgeDetails.criteria && 
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Criterion</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Level</TableCell>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Description</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Total Crits</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Current Crits</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Awarded Crits</TableCell>
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
                            <TableCell align="right" sx={{fontWeight:'bold'}}>{row.critsAwarded}</TableCell>
                            <TableCell align='right'>
                                <Controller
                                    name={`critsAwarded.${row.label}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextField
                                        label="Crits"
                                        variant="filled"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                    />
                                    )}
                                />
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                }
            </Box>

            </form>
        </div>
    )
}
