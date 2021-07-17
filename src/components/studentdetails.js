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
import { Checkbox, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Card, CardMedia } from '@material-ui/core'


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

            <Box sx={{flexGrow:1, p:3}} >
                <p>Student Details</p>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="MyCheckbox"
                control={control}
                defaultValue={false}
                rules={{ required: true }}
                render={({ field }) => <Checkbox {...field} />}
            />
            <section>
            <label>MUI Checkbox</label>
            <Controller
            name="Checkbox"
            control={control}
            defaultValue={""}
            render={({ field }) => (
                <Checkbox
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value}
                />
            )}
            />
            </section>
            <input type="submit" />
            </form>

        </>
    )
}
