import React, { useEffect, useState, useContext } from 'react'
import { db } from '../firebase';
import { UserContext } from '../userContext';

import { useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Card, CardMedia } from '@material-ui/core'


export default function StudentDetails() {

    const { studentId } = useParams()
    const { currentUser } = useContext(UserContext)
    const [ studentDetails, setStudentDetails ] = useState({})
    const [ updateStudent, setUpdateStudent ] = useState(false)
    
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

            <Box sx={{flexGrow:1, p:3}} >
                <p>Student Details</p>
            </Box>

        </>
    )
}
