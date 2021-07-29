import React, { useContext, useState, useEffect, useRef } from 'react'
import { db } from '../firebase'
import { UserContext } from '../userContext'
import { StudentContext } from '../studentcontext'
import { useParams, useLocation, Link } from 'react-router-dom'
import { AssignmentInd } from '@material-ui/icons';
import { Typography, IconButton, Paper, Toolbar, Box, Card, CardMedia, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

export default function MyBadgeDetails() {

    const { myBadgeId } = useParams()
    const { currentUser, userName } = useContext(UserContext)
    const [ badgeDetails, setBadgeDetails ] = useState({})
    const { aStudentId, aStudentName } = useContext(StudentContext)

    console.log('context aStudentId is '+aStudentId)
    console.log('context aStudentName is '+aStudentName)

    const location = useLocation()
    const { selectedStudentId='', selectedStudentName='A Student' } = location.state || ''
    //const lookupId = useRef(selectedStudentId)
    const lookupId = useRef(aStudentId)
    const studentNameRef = useRef(aStudentName)



    console.log('selectedStudentId is '+selectedStudentId)
    
    useEffect(() => {
        if(aStudentId === '') {
            lookupId.current = currentUser.uid
            studentNameRef.current = userName
        }
        
        if(myBadgeId){
            return db.collection("users").doc(lookupId.current).collection("myBadges").doc(myBadgeId).get()
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

    }, [myBadgeId, currentUser.uid, aStudentId, userName]);
    return (
        <>
            <Toolbar />

            <Typography variant="h4">
                {badgeDetails.badgename}
            </Typography>
            <Typography variant="h6">
                Student: {studentNameRef.current}
            </Typography>

            <Box sx={{flexGrow:1, p:3}} >

                {myBadgeId && badgeDetails.criteria && 
                <>
                <IconButton component={Link} to={{pathname: '/feedback', state: {selectedStudentId: lookupId.current, badgeDetails: badgeDetails, selectedStudentName: selectedStudentName} }} >
                    <AssignmentInd />
                </IconButton>
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Criterion</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Level</TableCell>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Description</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Total Crits</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Awarded Crits</TableCell>
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
                            <TableCell align="right" sx={{fontWeight:'bold'}}>{row.critsAwarded}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </>
                }
            </Box>

        </>
    )
}
