import React, { useEffect, useState } from 'react'
import firebase, { db } from '../firebase';
import { useHistory, useParams } from 'react-router';

import Toolbar from '@material-ui/core/Toolbar'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Grid, TextField, Button, ListItemText, Checkbox, Divider } from '@material-ui/core';

export default function ModuleForm() {

    const [ previousModuleSummary, setPreviousModuleSummary ] = useState()

    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
        }
      });

    const { fields, append, remove } = useFieldArray(
    {
        control,
        name: "activities"
    }
    );

    const history = useHistory()
    const { moduleId } = useParams()
    const isAddMode = !moduleId

    console.log("isAddMode is "+isAddMode)
    console.log("and moduleId is "+moduleId)

    const evidenceList = [
        {label:'Notebook-Notes',value: 'Notebook-Notes'},
        {label:'Video', value: 'Video'},
        {label:'Report', value: 'Report'},
        {label:'TestQuiz', value: 'Test/Quiz'}
    ];

    const dataList = [

    ]

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left"
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left"
        },
        //getContentAnchorEl: null
      };

    useEffect(() => {
        if(!isAddMode) {
            db.collection("modules").doc(moduleId).get()
            .then(module => {
                const fields = ['modulename', 'modulelevel', 'description', 'issuer', 'totalcrits','activities','status']
                fields.forEach(field => {
                    setValue(field, module.data()[field]);
                    console.log("value of a field is "+JSON.stringify(module.data()[field]))
                })
                const previous = {
                    modulename: module.data().modulename,
                    id: moduleId,
                    description: module.data().description,
                    imageUrl: module.data().imageUrl,
                    modulelevel: module.data().modulelevel,
                    totalcrits: module.data().totalcrits,
                    status: module.data().status
                }
                setPreviousModuleSummary(previous)
                console.log('previous is '+JSON.stringify(previous))
            })
        }
    },[moduleId, isAddMode, setValue])

    function onSubmit(data) {
        return isAddMode
            ? newModule(data)
            : updateModule(moduleId, data);
    }

    const newModule = data => {

        data.activities.forEach(function(activity) {activity.critsAwarded=0})
        console.log(data);

        db.collection("modules").add({imageUrl:"https://via.placeholder.com/150",...data})
        .then(doc => {
            console.log("check to see if new module added correctly")
            const newModuleListItem = {
                modulename: data.modulename,
                imageUrl: "https://via.placeholder.com/150",
                description: data.description,
                modulelevel: parseInt(data.modulelevel),
                totalcrits: parseInt(data.totalcrits),
                id: doc.id,
                status: data.status
            }
            db.collection("adminDocs").doc("moduleList").update({
                modules: firebase.firestore.FieldValue.arrayUnion(newModuleListItem)
            })
        })
        .then(() => {
            history.push('/modules')
        })
        .catch(error => {
            console.log("error loading new module", +error)
        })
    };

    const updateModule = (docId, data) => {

        console.log("update module data is "+JSON.stringify(data));

        db.collection("modules").doc(moduleId).update({...data})
        .then(doc => {
            alert("check to see if module updated correctly")
            db.collection("adminDocs").doc("moduleList").update({
                modules: firebase.firestore.FieldValue.arrayRemove(previousModuleSummary)
            })
            .then(() => {
                const updatedModuleListItem = {
                    modulename: data.modulename,
                    description: data.description,
                    id: docId,
                    modulelevel: parseInt(data.modulelevel),
                    totalcrits: parseInt(data.totalcrits),
                    imageUrl: previousModuleSummary.imageUrl,
                    status: data.status
                }
                db.collection("adminDocs").doc("moduleList").update({
                    modules: firebase.firestore.FieldValue.arrayUnion(updatedModuleListItem)
                })
            })
        })
        .then(() => {
            history.push('/modules')
        })
        .catch(error => {
            console.log("error updating module", +error)
        })
    };

    return (
        <div>
            <Toolbar/>

            <Typography>New Module Form</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{px:2}}>
                    <Button onClick={() => history.push('/modules')} variant="contained" sx={{m:2}}>
                    Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{m:2}}>
                    Submit Module
                    </Button>
                    <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl fullWidth sx={{ m: 1, width: 150 }}>
                            <InputLabel id="course-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status"
                                value={value}
                                label="Status"
                                onChange={onChange}
                            >
                                <MenuItem value={"Dev"}>Dev</MenuItem>
                                <MenuItem value={"Published"}>Published</MenuItem>
                            </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="modulename"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Module Name"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Module name required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="modulelevel"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Module Level"
                            type="number"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Module level required' }}
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
                        <Typography>Add Activities Below as Needed</Typography>
                    </Grid>
                </Grid>
                
                <Box sx={{m:2}}>
                <Grid container spacing={2} >
                {fields.map((item, index) => {
                    console.log('item hrs is '+item.hrs_estimate)
                    console.log(`activities.${index}.hrs_estimate`)
                return (
                    <Box key={item.id} sx={{display:'flex', mb:1}} >
                    <Grid item xs={12} sm container>

                    <Grid item xs={6} sm={3} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField fullWidth {...field} 
                                variant="filled"
                                label="Activity Label"
                            />}
                        name={`activities.${index}.label`}
                        control={control}
                        defaultValue={item.label} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item xs={2} sm={1} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Schedule"
                            />}
                        name={`activities.${index}.schedule`}
                        control={control}
                        defaultValue={1} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item xs={2} sm={1} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Level"
                            />}
                        name={`activities.${index}.level`}
                        control={control}
                        defaultValue={item.level} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item xs={2} sm={1} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Hrs"
                            />}
                        name={`activities.${index}.hrs_estimate`}
                        control={control}
                        defaultValue={item.hrs_estimate} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Activity Description"
                                fullWidth
                            />}
                        name={`activities.${index}.activity`}
                        control={control}
                        defaultValue={item.activity} // make sure to set up defaultValue
                    />
                    </Grid>

                    <Grid item xs={6} sm={3} key="chipsBadges" sx={{p:0.5}}>
                    <Box sx={{}}>
                        <FormControl variant='filled' fullWidth>
                        <InputLabel id="Badges">Badges</InputLabel>
                        <Controller
                            name={`activities.${index}.badges`}
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Select
                                labelId="chipsBadges"
                                id="chipsBadges"
                                multiple
                                value={value}
                                onChange={onChange}
                                defaultValue=""
                                renderValue={() => value + ' '}
                                MenuProps={MenuProps}
                                label="Badges"
                            >
                            {dataList && dataList.map((option) => (
                                <MenuItem key={option} value={option}>
                                    <Checkbox checked={value.indexOf(option) > -1} />
                                    <ListItemText primary={option} />
                                </MenuItem>
                            ))}
                            </Select>
                            )}
                            />
                        </FormControl>
                    </Box>                    
                    </Grid>    

                    <Grid item xs={6} sm={3} key="chipsEvidence" sx={{p:0.5}}>
                    <Box sx={{}}>
                    <FormControl variant='filled' fullWidth>

                        <InputLabel id="Badges">Evidence</InputLabel>
                        <Controller
                            name={`activities.${index}.evidence`}
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Select
                                labelId="evidence"
                                id="evidence"
                                multiple
                                value={value}
                                onChange={onChange}
                                defaultValue={[]}
                                renderValue={() => value + ' '}
                                MenuProps={MenuProps}
                                label="Badges"
                            >
                            {evidenceList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={value.indexOf(option.value) > -1} />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                            </Select>
                            )}
                            />
                        </FormControl>
                    </Box>                    
                    </Grid>  

                    <Grid item xs={12} sm={6} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Link/Url"
                                fullWidth
                            />}
                        name={`activities.${index}.link`}
                        control={control}
                        defaultValue={item.link} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item xs={6} sm={3} key="actionType" sx={{p:0.5}}>
                        <Box sx={{}}>
                        <FormControl variant='filled' fullWidth>

                            <InputLabel id="action-type-label">Action Type</InputLabel>
                            <Controller
                            name={`activities.${index}.actionType`}
                            control={control}
                            defaultValue="ProblemSolving"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Select
                                labelId="action-type-label"
                                id="action-type"
                                value={value}
                                defaultValue="ProblemSolving"
                                label="Action Type"
                                onChange={onChange}
                            >
                                <MenuItem value={"ProblemSolving"}>Problem Solving</MenuItem>
                                <MenuItem value={"ResearchStudy"}>Research Study</MenuItem>
                                <MenuItem value={"HandsOn"}>Hands On</MenuItem>
                                <MenuItem value={"DataAnalysis"}>Data Analysis</MenuItem>
                                <MenuItem value={"Communicating"}>Communicating</MenuItem>
                            </Select>
                            )}
                            />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={2} key="assessment" sx={{p:0.5}}>
                        <Box sx={{}}>
                        <FormControl variant='filled' fullWidth>

                            <InputLabel id="action-type-label">Assessment?</InputLabel>
                            <Controller
                            name={`activities.${index}.assessment`}
                            control={control}
                            defaultValue="No"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Select
                                labelId="assessment-label"
                                id="assessment"
                                value={value}
                                defaultValue="No"
                                label="Assessment"
                                onChange={onChange}
                            >
                                <MenuItem value={"No"}>No</MenuItem>
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                            </Select>
                            )}
                            />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={2} sm={1} sx={{p:0.5}}>
                    <Controller
                        render={({ field }) => 
                            <TextField {...field} 
                                variant="filled"
                                label="Crits?"
                            />}
                        name={`activities.${index}.crits`}
                        control={control}
                        defaultValue={item.crits} // make sure to set up defaultValue
                    />
                    </Grid>
                    <Grid item md={1}>
                    <Button type="button" variant="outlined" onClick={() => remove(index)}>
                        Delete
                    </Button>
                    </Grid>
                    <Grid item xs={12}><Divider sx={{mt:1}} /></Grid>

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
                        append({ label: "", schedule: 0, crits: 0, level: 100, hrs_estimate: 3, activity:"", link:"", badges:[], evidence: [], actionType:"ProblemSolving", assessment:"No" });
                    }}
                    >
                    append
                </Button>

            </form>
        </div>
    )
}