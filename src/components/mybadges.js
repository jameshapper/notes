import React, { useContext, useEffect, useState, useRef } from 'react'
import { db } from '../firebase'
import { UserContext } from '../userContext';
import { Link, useLocation } from 'react-router-dom';
import Progress from './progressbar';

import { Toolbar, Grid, CardActionArea, CardMedia, Card, CardContent, Typography } from '@material-ui/core';
import { StudentContext } from '../studentcontext';


export default function MyBadges() {

    const { currentUser, userName } = useContext(UserContext)
    const [ badgeData, setBadgeData ] = useState([])

    const { aStudentId, aStudentName } = useContext(StudentContext)

    console.log("aStudentId is "+aStudentId)
    console.log('aStudentName in myBages is '+aStudentName)

    const location = useLocation()

    const { selectedStudentId='', selectedStudentName='A Student!' } = location.state || ''
    //const lookupId = useRef(selectedStudentId)
    const lookupId = useRef(aStudentId)
    const studentNameRef = useRef(aStudentName)

    console.log('selectedStudentId is '+selectedStudentId)


    useEffect(() => {
        
        if(currentUser){
            if(aStudentId === '') {
                lookupId.current = currentUser.uid
                studentNameRef.current = userName
            }
            return db.collection("users").doc(lookupId.current).collection('myBadges').get()
            .then((snapshot) => {
                const badgeData = []
                snapshot.forEach((doc) => {
                    badgeData.push({...doc.data(), id: doc.id})
                })
                setBadgeData(badgeData)
            })
            .catch((error) => {
                console.log("My badges error: ", error);
            })
        }

    }, [aStudentId, currentUser, userName]);

    return (
        <div>
            <Toolbar />
            <Typography variant="h3">Badges for {studentNameRef.current}</Typography>
            <Grid container spacing={8} justify='center'>
                {badgeData.map((studentBadge) => (
                    <Grid item xs={8} sm={6} key = {studentBadge.badgename}>
                        <Card sx={{width:250, height:280}} variant="outlined">
                            <CardActionArea component={Link} to={{pathname: `/myBadges/${studentBadge.id}`, state: {selectedStudentId: selectedStudentId, selectedStudentName: selectedStudentName} }}>
                            <CardContent>
                                <Typography variant="h6" component="h4" align="center">
                                    {studentBadge.badgename}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                image={studentBadge.imageUrl}
                                sx={{ margin:'auto', width: 150, height: 150, alignItems:'center' }}
                            />
                            </CardActionArea>
                            <CardContent>
                                <Progress done={studentBadge.progress} />
                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
