import React, { useContext, useState, useEffect } from 'react'
import { db } from '../firebase'
import { UserContext } from '../userContext'
import Progress from './progressbar'
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams, Link } from 'react-router-dom'
//import { AssignmentInd } from '@material-ui/icons';
import { Typography, Button, Paper, Toolbar, Box, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

export default function MyBadgeDetails() {

    const { myBadgeId, studentId } = useParams()
    const { isAdmin } = useContext(UserContext)
    const [ uiLoading, setUiLoading ] = useState(true)

    const [ badgeDetails, setBadgeDetails ] = useState({})
    const [ studentName, setStudentName ] = useState("")

    //const { aStudentId, aStudentName } = useContext(StudentContext)

/*     console.log('context aStudentId is '+aStudentId)
    console.log('context aStudentName is '+aStudentName) */

/*     const location = useLocation()
    const { selectedStudentId='', selectedStudentName='A Student' } = location.state || ''
    //const lookupId = useRef(selectedStudentId)
    const lookupId = useRef(aStudentId)
    const studentNameRef = useRef(aStudentName) */

    //console.log('selectedStudentId is '+selectedStudentId)

/*     useEffect(() => {
        setUiLoading(true)
        db.collection("users").doc(studentId).get()
        .then(doc => {
            setStudentName(doc.data().firstName)
            setUiLoading(false)
        })

    },  [studentId]) */
    
    useEffect(() => {

        setUiLoading(true)
        db.collection("users").doc(studentId).get()
        .then(doc => {
            setStudentName(doc.data().firstName)
        })
        .then(() => {
            if(myBadgeId){

                return db.collection("users").doc(studentId).collection("myBadges").doc(myBadgeId).get()
                .then((doc)=> {
                    if(doc.exists){
                        let badgeData = doc.data()
                        setBadgeDetails({...badgeData, badgeId: myBadgeId})
                        console.log('badgeData title is '+badgeData.badgename)
                        setUiLoading(false)
                    } else {
                        alert("I can't find that document")
                    }
    
                })
            }
            setUiLoading(false)
        })


    }, [ myBadgeId, studentId ]);


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
        <>
            <Toolbar />

            <Box sx={{m:2, display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h4">
                {badgeDetails.badgename}
            </Typography>
            <Box>
                <Typography>Current Progress</Typography>
                <Progress done={badgeDetails.progress} />
            </Box>
            <Typography variant="h5">
                Student: {studentName}
            </Typography>
            </Box>
            <Box sx={{m:2}}>
            <Typography variant='h6' >Level: {badgeDetails.badgelevel}</Typography>
            <Typography variant='h6' >Total Crits: {badgeDetails.totalcrits}</Typography>
            <Typography variant='body1'>Description: {badgeDetails.description}</Typography>
            </Box>
            <Box sx={{flexGrow:1, p:3}} >

                {myBadgeId && badgeDetails.criteria && 
                <>
                {isAdmin &&
                <Button component={Link} to={{pathname: '/feedback', state: {selectedStudentId: studentId, badgeDetails: badgeDetails, selectedStudentName: studentName} }} >
                    Add Feedback
                </Button>
                }
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Criterion</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Level</TableCell>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Description</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Total Crits</TableCell>
                            <TableCell align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.primary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.primary.main)}}>Awarded Crits</TableCell>
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
                            <TableCell align="center" sx={{fontWeight:'bold', fontSize:24, color:(theme)=>theme.palette.primary.main}}>{row.critsAwarded}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </>
                }
            </Box>

            <Typography variant="h4">
                Evidence and Feedback
            </Typography>

           <Box sx={{flexGrow:1, p:3}} >

                {myBadgeId && badgeDetails.criteria && 
                <>
                <TableContainer component={Paper} sx={{borderRadius:2, m:1, maxWidth:950}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>Date</TableCell>

                            {badgeDetails.criteria.map(criterion => (
                                <TableCell key={criterion.label} align="right" sx={{fontWeight:'bold',backgroundColor:(theme)=>theme.palette.secondary.main, color: (theme)=>theme.palette.getContrastText(theme.palette.secondary.main)}}>{criterion.label}</TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {badgeDetails.evidence.map(evidence => (
                                <TableRow key={evidence.feedbackId}>
                                <TableCell>
                                    {evidence.createdAt.slice(0,10)}
                                </TableCell>
                                {badgeDetails.criteria.map(criterion => {
                                    const key = criterion.label
                                    return <TableCell key={criterion.label} align='center'>{evidence.critsAwarded[key]}</TableCell>
                                })}
                                <TableCell >
                                    <Link to={`/students/${studentId}/myBadges/${myBadgeId}/feedback/${evidence.feedbackId}`}>Details</Link>
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </>
                }
            </Box>
        </>
    )}
}
