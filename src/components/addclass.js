import React, { useContext } from 'react'
import { db } from '../firebase';
import { UserContext } from '../userContext';

import Toolbar from '@material-ui/core/Toolbar'
import { useForm, Controller } from 'react-hook-form'
import { Box, Typography, Grid, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export default function AddClass() {

    const { handleSubmit, control } = useForm()
    const { currentUser } = useContext(UserContext)
    const history = useHistory()

    const onSubmit = data => {
        db.collection("users").doc(currentUser.uid).collection("teacherClasses")
        .add({name:data.classname})
        .then(doc => {
            console.log("check to see if new class added correctly")
        })
        .then(() => {
            history.push('/classes')
        })
        .catch(error => {
            console.log("error loading new class", +error)
        })
    }

    return (
        <div>
            <Toolbar />

            <Typography>Enter Class Details Below</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{px:2}}>
                    <Button type="submit" variant="contained" color="primary" sx={{m:2}}>
                    Submit New Class
                    </Button>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="classname"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Class Name"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Class name required' }}
                        />
                    </Grid>
                </Grid>
            </form>
            
        </div>
    )
}
