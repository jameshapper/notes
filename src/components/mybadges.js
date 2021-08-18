import React, { useEffect, useState, useContext } from 'react'
import { db } from '../firebase'
import { UserContext } from '../userContext';
import { Link, useParams } from 'react-router-dom';
import Progress from './progressbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Toolbar, Grid, CardActionArea, CardMedia, Card, CardContent, Typography } from '@material-ui/core';
//import { StudentContext } from '../studentcontext';


export default function MyBadges() {

    const [ badgeData, setBadgeData ] = useState([])
    const { studentId } = useParams()
    const [ studentName, setStudentName ] = useState("")
    const [ studentUid, setStudentUid ] = useState("")

    const { loading, currentUser, isAdmin } = useContext(UserContext)
    const [ uiLoading, setUiLoading ] = useState(loading)

/*     const { aStudentId, aStudentName } = useContext(StudentContext)

    console.log("aStudentId is "+aStudentId)
    console.log('aStudentName in myBages is '+aStudentName)

    const location = useLocation() */

/*     const { selectedStudentId='', selectedStudentName='A Student!' } = location.state || ''
    //const lookupId = useRef(selectedStudentId)
    const lookupId = useRef(aStudentId)
    const studentNameRef = useRef(aStudentName) */

    //console.log('selectedStudentId is '+selectedStudentId)

    useEffect(() => {
        if(currentUser && !isAdmin){
            setStudentUid(currentUser.uid)
            console.log("there is a student user in myBadges")
        } else {
            setStudentUid(studentId)
        }
    },[currentUser, isAdmin, studentId])


    useEffect(() => {

        if(studentUid){
            setUiLoading(true)
            db.collection("users").doc(studentUid).get()
            .then(doc => {
                setStudentName(doc.data().firstName)
                setUiLoading(false)
                console.log("studentName is "+doc.data().firstName)
    
            })

        }


    },  [studentUid])

    useEffect(() => {

        if(studentUid){
            setUiLoading(true)
            console.log("studentUid is "+studentUid)

            db.collection("users").doc(studentUid).collection('myBadges').where("uid","==",studentUid).get()
            .then((snapshot) => {
                const badgeData = []
                snapshot.forEach((doc) => {
                    badgeData.push({...doc.data(), id: doc.id})
                })
                setBadgeData(badgeData)
                setUiLoading(false)
    
            })
            .catch((error) => {
                console.log("My badges error: ", error);
            })
        }


    }, [studentUid]);

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
        <div>
            <Toolbar />
            <Typography variant="h3">Badges for {studentName}</Typography>
            <Grid container spacing={8} justify='center'>
                {badgeData.map((studentBadge) => (
                    <Grid item xs={8} sm={6} key = {studentBadge.badgename}>
                        <Card sx={{width:250, height:280}} variant="outlined">
                            <CardActionArea component={Link} to={`/students/${studentUid}/myBadges/${studentBadge.id}`}>
                            <CardContent>
                                <Typography variant="h6" component="h4" align="center">
                                    {studentBadge.badgename}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                image={studentBadge.imageUrl}
                                sx={{ margin:'auto', width: 'auto', height: 150, alignItems:'center' }}
                                component='img'
                                title='Badge Image'
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
    )}
}
