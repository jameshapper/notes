import React, { useEffect, useState, useContext } from 'react'
import { db } from '../firebase';
import { UserContext } from '../userContext';

import { useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Card, CardMedia } from '@material-ui/core'


export default function BadgeDetails() {

    const { badgeId } = useParams()
    const { currentUser } = useContext(UserContext)
    const [ badgeDetails, setBadgeDetails ] = useState({})
    const [ updateBadge, setUpdateBadge ] = useState(false)
    
    useEffect(() => {
        
        if(badgeId){
            return db.collection("badges").doc(badgeId).get()
            .then((doc)=> {
                if(doc.exists){
                    let badgeData = doc.data()
                    setBadgeDetails({...badgeData, badgeId: badgeId})
                    console.log('badgeData title is '+badgeData.Title)
                } else {
                    alert("I can't find that document")
                }
            })
        }

    }, [badgeId]);

    useEffect(() => {
        if(updateBadge){ return db.collection('users').doc(currentUser.uid)
            .collection('myBadges').add({...badgeDetails,uid: currentUser.uid})
            .then((doc)=>{
                console.log('New badge aspiration added')
                setUpdateBadge(false)
            })
        }
    },[ updateBadge, currentUser.uid, badgeDetails ])

    const handleAddBadge = (e) => {
        e.preventDefault()
        console.log('badgeDetails submitted object is '+JSON.stringify(badgeDetails))
        let document = db.collection('users').doc(currentUser.uid)
        document.collection('myBadges').where("uid","==",currentUser.uid)
        .where("Title","==",badgeDetails.title).get()
        .then((snapshot) => {
            console.log('number of docs in snapshot is '+snapshot.size)
            if(snapshot.size === 0){
                setUpdateBadge(true)
            } else {
                setUpdateBadge(false)
            }
        })
    }

    console.log('reached the BadgeDetails component with id of '+badgeId)
    return (
        <>
            <Toolbar />
            <IconButton
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0
                }}
                color="primary"
                aria-label="Add Badge"
                onClick={handleAddBadge}
            >
                <AddCircleIcon sx={{ fontSize: 60 }} />
            </IconButton>

            <Box sx={{flexGrow:1, p:3}} >
                <Box sx={{mx:'auto', width:180}}>
                    <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={badgeDetails.imageUrl}
                                    title="Contemplative Reptile"
                                />
                    </Card>
                </Box>
                {badgeId && badgeDetails.criteria && 
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Criterion</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Level</TableCell>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Description</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Total Crits</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {badgeDetails.criteria.map((row) => (
                            <TableRow
                            key={row.label}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.label}
                            </TableCell>
                            <TableCell align="right">{row.level}</TableCell>
                            <TableCell align="left">{row.criterion}</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold'}}>{row.crits}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                }
            </Box>

        </>
    )
}
