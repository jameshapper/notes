import React, { useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { Box, Typography } from '@material-ui/core';
import { UserContext } from '../userContext';

function Badges(props) {

    const { loading, isAdmin } = useContext(UserContext)

    const [ badges, setBadges ] = useState([])
    const [ uiLoading, setUiLoading ] = useState(loading)

/*     useEffect(() => {
        
        return db.collection("badges")

        .onSnapshot(snapshot => {
            const badgesData = [];
            snapshot.forEach(doc => badgesData.push({ ...doc.data(), id: doc.id }));
            setBadges(badgesData)
            setUiLoading(false)
            console.log('badges are '+badgesData)
        })
    }, []); */

    useEffect(() => {
        setUiLoading(true)
        return db.collection("adminDocs").doc("badgeList")

        .onSnapshot(snapshot => {
            setBadges(snapshot.data().badges)
            setUiLoading(false)
        })
    }, []);

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
            {isAdmin &&
                <Button component={Link} to={'/badgeForm'} size='small' variant='contained' >Add Badge</Button>
            }

            <Grid container spacing={2}>
                    {badges && badges.length>0 && badges.map((badge) => (
                        <Grid item xs={12} sm={6} key = {badge.id}>
                            <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                sx={{ height: 140, width: 'auto', m:'auto' }}
                                image={badge.imageUrl}
                                title="Badge Image"
                                component='img'
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {badge.badgename}
                                </Typography>
                                <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                    <Box>
                                        <Typography variant='h6'>Level: {badge.badgelevel}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant='h6'>Crits: {badge.totalcrits}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                {badge.description.substring(0, 200)+"..."}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to={`/badges/${badge.id}`} size="small">See Details</Button>
                                {isAdmin && 
                                    <Button component={Link} to={`/badgeForm/${badge.id}`} size="small">Edit</Button>
                                }
                            </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </main>
        );
    }
}

export default Badges;