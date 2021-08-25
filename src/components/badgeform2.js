import React, { useEffect, useState } from 'react'
import firebase, { db } from '../firebase';
import { useHistory, useParams } from 'react-router';

import Toolbar from '@material-ui/core/Toolbar'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Box, Typography, Grid, TextField, Button } from '@material-ui/core';

export default function BadgeForm() {

    const [ previousBadgeSummary, setPreviousBadgeSummary ] = useState()

    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
        }
      });

    const { fields, append, remove } = useFieldArray(
    {
        control,
        name: "criteria"
    }
    );

    const history = useHistory()
    const { badgeId } = useParams()
    const isAddMode = !badgeId

    console.log("isAddMode is "+isAddMode)
    console.log("and badgeId is "+badgeId)

    useEffect(() => {
        if(!isAddMode) {
            db.collection("badges").doc(badgeId).get()
            .then(badge => {
                const fields = ['badgename', 'badgelevel', 'description', 'issuer', 'totalcrits','criteria']
                fields.forEach(field => {
                    setValue(field, badge.data()[field]);
                    console.log("value of a field is "+JSON.stringify(badge.data()[field]))
                })
                const previous = {
                    badgename: badge.data().badgename,
                    id: badgeId,
                    description: badge.data().description,
                    imageUrl: badge.data().imageUrl
                }
                setPreviousBadgeSummary(previous)
                console.log('previous is '+JSON.stringify(previous))
            })
        }
    },[badgeId, isAddMode, setValue])

    function onSubmit(data) {
        return isAddMode
            ? newBadge(data)
            : updateBadge(badgeId, data);
    }

    const newBadge = data => {

        data.criteria.forEach(function(criterion) {criterion.critsAwarded=0})
        console.log(data);

        db.collection("badges").add({imageUrl:"https://via.placeholder.com/150",...data})
        .then(doc => {
            console.log("check to see if new badge added correctly")
            const newBadgeListItem = {
                badgename: data.badgename,
                imageUrl: "https://via.placeholder.com/150",
                description: data.description,
                badgelevel: parseInt(data.badgelevel),
                totalcrits: parseInt(data.totalcrits),
                id: doc.id
            }
            db.collection("adminDocs").doc("badgeList").update({
                badges: firebase.firestore.FieldValue.arrayUnion(newBadgeListItem)
            })
        })
        .then(() => {
            history.push('/badges')
        })
        .catch(error => {
            console.log("error loading new badge", +error)
        })
    };

    const updateBadge = (docId, data) => {

        console.log("update badge data is "+JSON.stringify(data));

        db.collection("badges").doc(badgeId).update({...data})
        .then(doc => {
            alert("check to see if badge updated correctly")
            db.collection("adminDocs").doc("badgeList").update({
                badges: firebase.firestore.FieldValue.arrayRemove(previousBadgeSummary)
            })
            .then(() => {
                const updatedBadgeListItem = {
                    badgename: data.badgename,
                    description: data.description,
                    id: docId,
                    badgelevel: parseInt(data.badgelevel),
                    totalcrits: parseInt(data.totalcrits),
                    imageUrl: previousBadgeSummary.imageUrl
                }
                db.collection("adminDocs").doc("badgeList").update({
                    badges: firebase.firestore.FieldValue.arrayUnion(updatedBadgeListItem)
                })
            })
        })
        .then(() => {
            history.push('/badges')
        })
        .catch(error => {
            console.log("error updating badge", +error)
        })
    };

    return (
        <div>
            <Toolbar/>

            <Typography>New Badge Form</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{px:2}}>
                    <Button onClick={() => history.push('/badges')} variant="contained" sx={{m:2}}>
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
                            type="number"
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
                            type="number"
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
                        defaultValue={item.criterion} // make sure to set up defaultValue
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
