import React, { useState } from 'react'
import firebase, { db } from '../firebase';

import Toolbar from '@material-ui/core/Toolbar'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Box, Typography, Grid, TextField, Button } from '@material-ui/core';

export default function BadgeForm() {

    const { handleSubmit, control, register } = useForm({
        defaultValues: {
          criteria: [{ label: "AMI_TTM1", crits: 10, level: 100, criterion:"what to do" }]
        }
      });

    const { fields, append, remove } = useFieldArray(
    {
        control,
        name: "criteria"
    }
    );

    const onSubmit = data => {

        data.criteria.forEach(function(criterion) {criterion.critsAwarded=0})
        console.log(data);

        db.collection("badges").add({imageUrl:"https://upload.wikimedia.org/wikipedia/commons/c/cf/Arduino_Logo_hi.svg",...data})
        .then(doc => {
            console.log("check to see if new badge added correctly")
        })
        .catch(error => {
            console.log("error loading new badge", +error)
        })


    };

    return (
        <div>
            <Toolbar/>

            <Typography>New Badge Form</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{px:2}}>
                    <Button variant="contained" sx={{m:2}}>
                    Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{m:2}}>
                    Submit Badge
                    </Button>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="badgename"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Badge Name"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Badge name required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="badgelevel"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Badge Level"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Bagde level required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="issuer"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Issuer"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Issuer required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="totalcrits"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Total Crits"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Total crits required' }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Description required' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Add Criteria Below as Needed</Typography>
                    </Grid>
                </Grid>
                
                <Box sx={{m:2}}>
                <Grid container spacing={2} >
                {fields.map((item, index) => {
                    console.log('item crits is '+item.crits)
                    console.log(`criteria.${index}.crits`)
                return (
                    <Box key={item.id} sx={{display:'flex'}} >
                    <Grid item md={2} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Criterion Label"
                            />}
                        name={`criteria.${index}.label`}
                        control={control}
                        defaultValue={item.label} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item md={1} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Level"
                            />}
                        name={`criteria.${index}.level`}
                        control={control}
                        defaultValue={item.level} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item md={1} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Crits"
                            />}
                        name={`criteria.${index}.crits`}
                        control={control}
                        defaultValue={item.crits} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item md={7} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Criterion Description"
                                fullWidth
                            />}
                        name={`criteria.${index}.criterion`}
                        control={control}
                        defaultValue=" " // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item md={1}>
                    <Button type="button" variant="outlined" onClick={() => remove(index)}>
                        Delete
                    </Button>
                    </Grid>
                    </Box>
                );
                })}
                </Grid>
                </Box>
                <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                        append({ label: "", crits: 10, level: 100, criterion:"what to do" });
                    }}
                    >
                    append
                </Button>

            </form>
        </div>
    )
}
