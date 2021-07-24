import React, { useEffect, useState, useContext } from 'react'
import { db } from '../firebase';
import { UserContext } from '../userContext';

import { useParams } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";

import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Grid, Container, CssBaseline, Checkbox, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Card, CardMedia } from '@material-ui/core'


export default function StudentDetails() {

    const { studentId } = useParams()
    const { currentUser } = useContext(UserContext)
    const [ studentDetails, setStudentDetails ] = useState({})
    const [ updateStudent, setUpdateStudent ] = useState(false)
    const { handleSubmit, control, reset } = useForm();
    const onSubmit = data => console.log(data);
    
    useEffect(() => {
        
        if(studentId){
            return db.collection("users").doc(studentId).get()
            .then((doc)=> {
                if(doc.exists){
                    let studentData = doc.data()
                    setStudentDetails({...studentData, studentId: studentId})
                } else {
                    alert("I can't find that document")
                }
            })
        }

    }, [studentId]);


    console.log('reached the studentDetails component with id of '+studentId)
    return (
        <>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12} md={8} lg={9}>
                    <Paper
                        sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                        }}
                    >
                        I'm going to write a lot of text to see what happens to the grid
                    </Paper>
                    </Grid>
                    {/* Recent Deposits */}
                    <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                        }}
                    >
                        I'll write some more here to see what happens with this text in the corresponding paper
                    </Paper>
                    </Grid>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
