import React, { useContext, useRef } from 'react'
import firebase, { db } from '../firebase';
import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../userContext';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

import { useForm, Controller } from 'react-hook-form'
import { Typography, Grid, TextField, Button } from '@material-ui/core';
import { Paper, Toolbar, Box, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

export default function Feedback() {

    const { currentUser } = useContext(UserContext)

    const location = useLocation()
    const history = useHistory()
    const { selectedStudentId='', badgeDetails, selectedStudentName="A Student" } = location.state || ''
    const lookupId = useRef(selectedStudentId)

    console.log('selectedStudentId is '+selectedStudentId)
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

    const { handleSubmit, control } = useForm();

    const onSubmit = data => {

        console.log(data);
        console.log(data.criteria)

        //const oldBadgeDetails = JSON.parse(JSON.stringify(badgeDetails.criteria))
        //console.log("original badgeDetails "+JSON.stringify(oldBadgeDetails))

        const newValues = badgeDetails.criteria.map(criterion => {
            const key = criterion.label
            return criterion.critsAwarded += parseInt(data.criteria[key])
        })
        console.log("newValues "+newValues)


        badgeDetails.criteria.map(criterion => {
            const key = criterion.label
            return badgeDetails.criteria.critsAwarded += parseInt(data.criteria[key])
        })
        //console.log("badgeDetails update? "+JSON.stringify(badgeDetails.criteria))

        const feedback = {
            studentId: selectedStudentId,
            studentName: selectedStudentName,
            artifactLinks: data.Quill,
            assessorComments: data.assessorComments,
            createdAt: new Date().toISOString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            studentBadgeId: badgeDetails.badgeId,
            badgeName: badgeDetails.badgename,
            assessorName: currentUser.displayName,
            assessorId: currentUser.uid,
            critsAwarded: data.criteria
        }
        db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId).collection("feedback").add(feedback)
        .then((doc)=>{
            console.log("New feedback added to db")
            //setUpdateBadgeDetails(true)
        })
        .then(()=> {
            db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId)
            .update(badgeDetails)
        })
        .then(() => {
            history.push(`/myBadges/${badgeDetails.badgeId}`)
        })
        .catch((error) => {
            console.error(error);
            alert('Something went wrong' );
        });
    };

/*     useEffect(() => {
        if(updateBadgeDetails){
            db.collection('users').doc(selectedStudentId).collection('myBadges').doc(badgeDetails.badgeId)
            .update(badgeDetails)
        }
    },[badgeDetails, badgeDetails.badgeId, selectedStudentId, updateBadgeDetails]) */

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
                        name="Quill"
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
                                    name={`criteria.${row.label}`}
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
