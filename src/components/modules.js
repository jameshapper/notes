import React, { useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'

import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Tooltip } from '@material-ui/core';
import { UserContext } from '../userContext';

function Modules(props) {

    const { loading, isAdmin } = useContext(UserContext)

    const [ modules, setModules ] = useState([])
    const [ classesList, setClassesList ] = useState([])
    const [ selectedCourse, setSelectedCourse ] = useState("All Modules")
    const [ searchParam ] = useState(["modulename"]);
    const [ supportedModuleIds, setSupportedModuleIds ] = useState([])
    const [q, setQ] = useState("");

    const [ uiLoading, setUiLoading ] = useState(loading)

    useEffect(() => {
        setUiLoading(true)
        return db.collection("adminDocs").doc("moduleList")

        .onSnapshot(snapshot => {
            setModules(snapshot.data().modules)
            setUiLoading(false)
        })
    }, []);

    useEffect(() => {
        setUiLoading(true)
        return db.collection("adminDocs").doc("classesList").get()

        .then(doc => {
            setClassesList(doc.data().classes)
            setUiLoading(false)
        })
    }, []);

    function search(modules) {
        return modules.filter((module) => {
            if (supportedModuleIds.includes(module.id)) {
                return searchParam.some((newmodule) => {
                    return (
                        module[newmodule]
                            .toString()
                            .toLowerCase()
                            .indexOf(q.toLowerCase()) > -1
                    );
                });
                //return true
            } else if (selectedCourse === "All Modules") {
                 return searchParam.some((newmodule) => {
                    return (
                        module[newmodule]
                            .toString()
                            .toLowerCase()
                            .indexOf(q.toLowerCase()) > -1
                    );
                });
                //return true
            } else {return false}
        });
    }


    const handleCourseFilter = (event) => {

        if(event.target.value === "All Modules"){
            setSelectedCourse(event.target.value)
        } else {
            setSelectedCourse(event.target.value)
            const oneCourseObjectInArray = classesList.filter(course => {
                return course.classId === event.target.value
            })
            console.log(event.target.value)
            const supportedModuleArray = oneCourseObjectInArray[0].supportedModules
            setSupportedModuleIds(supportedModuleArray.map(moduleObj => {
                return moduleObj.value
            }))
            console.log("supported module ids are "+JSON.stringify(supportedModuleIds))
        }
    }

    if (uiLoading === true) {
        return (
            <main sx={{flexGrow:1, p:3}} >
                <Toolbar />
                {uiLoading && <CircularProgress size={150} sx={{
                    position: 'fixed',
                    zIndex: '1000',
                    height: '31px',
                    width: '31px',
                    left: '50%',
                    top: '35%'
                }} />}
            </main>
        );
    } else {
        return (
            <main sx={{flexGrow:1, p:3}}>
            <Toolbar />
            <Grid container pb={3}>
                <Grid item xs={12} pb={2}>
                {isAdmin &&
                    <Button component={Link} to={'/moduleForm'} size='small' variant='contained' >Add Module</Button>
                }
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <TextField
                            id="search-course"
                            label="module search"
                            type="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </FormControl> 
                </Grid>
                <Grid item xs={3}/>
                <Grid item xs={3}>

                    <FormControl fullWidth sx={{ m: 1, width: 300 }}>
                    <InputLabel id="course-label">Course</InputLabel>
                    <Select
                        labelId="course-select-label"
                        defaultValue="All Modules"
                        id="course-select"
                        value={selectedCourse ? selectedCourse : "All Modules"}
                        label="Course"
                        onChange={handleCourseFilter}
                    >
                            <MenuItem key={"all courses"} value={"All Modules"}>All Modules</MenuItem>    

                        {classesList && classesList.map((eachClass) => (
                            <MenuItem key={eachClass.name} value={eachClass.classId}>{eachClass.name}</MenuItem>    
                        ))}

                    </Select>
                    </FormControl>
                    </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent='space-around'>
                    {modules && modules.length>0 && search(modules).map((module) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key = {module.id} p={2}>
                            <Card sx={{ maxWidth: 250, minWidth: 200, backgroundColor:'#eeeeee', pt:1 }}>
                                <Tooltip title={module.description.substring(0, 200)+"..."}>
                                    <CardMedia
                                        sx={{ height: 100, width: 'auto', m:'auto' }}
                                        image={module.imageUrl}
                                        component='img'
                                    />
                                </Tooltip>
                            <CardContent sx={{width: 'auto'}}>
                                <Box sx={{display: 'flex', justifyContent:'center'}}>
                                    <Typography fontWeight='bold' align='center' gutterBottom variant="subtitle1" component={Link} to={`/modules/${module.id}`} >
                                    {module.modulename}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent:'center'}}>
                                    <Box padding={1}>
                                        <Typography variant='subtitle2'>Lvl: {module.modulelevel}</Typography>
                                    </Box>
                                    <Box padding={1}>
                                        <Typography variant='subtitle2'>Hours: {module.hrs}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent:'center'}}>
                                    {module.status === "Dev" ? 'Development' : 'Published'}
                                </Box>
                            </CardContent>
                                {isAdmin && 
                                    <Button sx={{display: 'flex', justifyContent:'center'}} component={Link} to={`/moduleForm/${module.id}`} size="small">Edit</Button>
                                }
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </main>
        );
    }
}

export default Modules;