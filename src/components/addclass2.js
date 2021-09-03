import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase';
import { UserContext } from '../userContext';

import Toolbar from '@material-ui/core/Toolbar'
import { useForm, Controller } from 'react-hook-form'
import { Box, Typography, Grid, TextField, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

import { FormControlLabel, Checkbox, FormControl, FormHelperText } from '@material-ui/core';

export default function AddClass() {

    const defaultIds = [1, 3]

    const { handleSubmit, control, setValue, getValues, watch } = useForm({defaultValues: { item_ids: defaultIds }})
    const { currentUser } = useContext(UserContext)
    const history = useHistory()
    const classData = useLocation()

    const classId = classData.state ? classData.state.classId : null


    const items = [
        {
          id: 0,
          name: "Object 0"
        },
        {
          id: 1,
          name: "Object 1"
        },
        {
          id: 2,
          name: "Object 2"
        },
        {
          id: 3,
          name: "Object 3"
        },
        {
          id: 4,
          name: "Object 4"
        }
      ];

    const handleCheck = checkedId => {
        const { item_ids: ids } = getValues();
        const newIds = ids?.includes(checkedId)
            ? ids?.filter(id => id !== checkedId)
            : [...(ids ?? []), checkedId];
        return newIds;
    };

    useEffect(() => {
        if(classId) {
            db.collection("users").doc(currentUser.uid).collection("teacherClasses").doc(classId).get()
            .then(doc => {
                console.log("there is already a class of this id "+doc.data().name)
                setValue("classname",doc.data().name)
            })
        }
    })

    const onSubmit = data => {
/*         db.collection("users").doc(currentUser.uid).collection("teacherClasses")
        .add({name:data.classname, students:[]})
        .then(doc => {
            console.log("check to see if new class added correctly")
        })
        .then(() => {
            history.push('/classes')
        })
        .catch(error => {
            console.log("error loading new class", +error)
        }) */
        console.log("data is "+data.item_ids)
        console.log("and class name is "+data.classname)
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
                <FormControl >
                    <FormHelperText></FormHelperText>
                    <Controller
                    name="item_ids"
                    render={({field: { onChange, value }}) => (
                        items.map((item, index) => (
                        <FormControlLabel
                            control={
                            <Checkbox
                                onChange={() => onChange(handleCheck(item.id))}
                                defaultChecked={defaultIds.includes(item.id)}
                            />
                            }
                            key={item.id}
                            label={item.name}
                        />
                        ))
                    )}
                    control={control}
                    />
                </FormControl>
                <pre>SELECTED: {JSON.stringify(watch("item_ids"), null, 2)}</pre>
            </form>

        </div>
    )
}
