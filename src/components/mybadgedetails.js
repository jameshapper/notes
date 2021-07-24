import React, { useContext, useState, useEffect } from 'react'
import { db } from '../firebase'
import { UserContext } from '../userContext'
import { useParams } from 'react-router-dom'
import { Paper, Toolbar, Box, Card, CardMedia, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

export default function MyBadgeDetails() {

    const { myBadgeId } = useParams()
    const { currentUser } = useContext(UserContext)
    const [ badgeDetails, setBadgeDetails ] = useState({})
    const [ updateBadge, setUpdateBadge ] = useState(false)
    
    useEffect(() => {
        
        if(myBadgeId){
            return db.collection("users").doc(currentUser.uid).collection("myBadges").doc(myBadgeId).get()
            .then((doc)=> {
                if(doc.exists){
                    let badgeData = doc.data()
                    setBadgeDetails({...badgeData, badgeId: myBadgeId})
                    console.log('badgeData title is '+badgeData.badgename)
                } else {
                    alert("I can't find that document")
                }
            })
        }

    }, [myBadgeId, currentUser.uid]);
    return (
        <>
            <Toolbar />

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
                {myBadgeId && badgeDetails.criteria && 
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
