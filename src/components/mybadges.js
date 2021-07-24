import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';
import Progress from './progressbar';

import { Toolbar, Grid, Box, CardActionArea, CardMedia, Card, CardContent, Typography } from '@material-ui/core';


export default function MyBadges() {

    const { currentUser } = useContext(UserContext)
    const [ badgeData, setBadgeData ] = useState([])


    useEffect(() => {
        
        if(currentUser){
            return db.collection("users").doc(currentUser.uid).collection('myBadges').get()
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

    }, [currentUser]);

    return (
        <div>
            <Toolbar />
            <Grid container spacing={8} justify='center'>
                {badgeData.map((studentBadge) => (
                    <Grid item xs={8} sm={6} key = {studentBadge.badgename}>
                        <Card sx={{width:250, height:280}} variant="outlined">
                            <CardActionArea component={Link} to={`/myBadges/${studentBadge.id}`}>
                            <CardContent>
                                <Typography variant="h6" component="h4" align="center">
                                    {studentBadge.badgename}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                image="https://firebasestorage.googleapis.com/v0/b/progressnotes-b6fc9.appspot.com/o/ProfileCartoon100kb.png?alt=media&token=b7a9fbca-effb-49ba-8a18-361637132a11"
                                sx={{ margin:'auto', width: 150, height: 150, alignItems:'center' }}
                            />
                            </CardActionArea>
                            <CardContent>
                                <Progress done='80' />
                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
