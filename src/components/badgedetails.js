import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

import { useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import { Typography } from '@material-ui/core'
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Card, CardMedia } from '@material-ui/core'


export default function BadgeDetails() {

    const { badgeId } = useParams()
    const [ criteria, setCriteria ]  = useState([])
    const [ image, setImage ] = useState('')
    
    useEffect(() => {
        
        if(badgeId){
            return db.collection("badges").doc(badgeId).get()
            .then((doc)=> {
                if(doc.exists){
                    let badgeData = doc.data()
                    setCriteria(badgeData.Criteria)
                    setImage(badgeData.ImageUrl)
                    console.log('badgeData title is '+badgeData.Title)
                } else {
                    alert("I can't find that document")
                }
            })
        }

    }, [badgeId]);


    console.log('reached the BadgeDetails component with id of '+badgeId)
    return (
        <>
            <Toolbar />
            <Box sx={{flexGrow:1, p:3}} >
                <Box sx={{mx:'auto', width:180}}>
                    <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    justifyContent='center'
                                    image={image}
                                    title="Contemplative Reptile"
                                />
                    </Card>
                </Box>
                {badgeId && criteria && 
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
                        {criteria.map((row) => (
                            <TableRow
                            key={row.Label}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.Label}
                            </TableCell>
                            <TableCell align="right">{row.Level}</TableCell>
                            <TableCell align="left">{row.Description}</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold'}}>{row.Crits}</TableCell>
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
