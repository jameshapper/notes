import React, { useEffect, useState, useContext } from 'react'
import firebase, { db } from '../firebase';
import { UserContext } from '../userContext';

import Editor from './editortest2'

import dayjs from 'dayjs';

import Dialog from '@material-ui/core/Dialog'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

const DialogTitle = ((props) => {
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle sx={{minWidth:220}} {...other}>
            <div><Typography variant="h6">{children}</Typography></div>
            {onClose ? (
                <IconButton aria-label="close" sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: '#9e9e9e'
                }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export default function ViewNotes({note, handleViewClose, viewOpen }) {
    
    const noteId = note.id
    const studentId = note.uid
    const created = note.createdAt

    const { currentUser, avatar } = useContext(UserContext)


    const [ comments, setComments ] = useState([])
    const [ commentBody, setCommentBody ] = useState("")
    const [ commentRt, setCommentRt ] = useState("")

    useEffect(() => {
        
        if(noteId && studentId){
            return db.collectionGroup("comments")
            .where("studentId", "==", studentId)
            .where("noteId","==",noteId)
            .get()
            .then((querySnapshot) => {
                const commentsData = [];
                querySnapshot.forEach((doc) => {
                    commentsData.push({ ...doc.data(), id: doc.id })
                    console.log("comment doc id is "+doc.id)
                })
                setComments(commentsData)
            })
            .catch((error) => {
                alert('something wrong while looking for comments')
                console.log(error)
            })
        }

    }, [noteId, studentId]);
    
    const handleSubmitComment = (event) => {
        event.preventDefault();

        if (false) {

        } else {
            const newComment = {
                body: commentBody,
                createdAt: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: currentUser.uid,
                author: currentUser.displayName,
                avatar: avatar,
                rt: commentRt,
                studentId: studentId,
                noteId: noteId
            }
            db.collection('users').doc(studentId).collection('notes').doc(noteId).collection('comments').add(newComment)
            .then((doc)=>{
                console.log("New comment added to db")
                handleViewClose()
                setCommentRt("")
            })
            .catch((error) => {
                handleViewClose()
                console.error(error);
                alert('Something went wrong' );
            });
        }
    };

    return (
    <Dialog
        onClose={handleViewClose}
        aria-labelledby="customized-dialog-title"
        open={viewOpen}
        fullWidth
        classes={{ paperFullWidth: {maxWidth: '75%'} }}
    >
        <Paper   elevation={2}
            sx={{
                padding: 1,
                backgroundColor: "#e0e0e0",
                border: "1px solid black",
                margin: "2px 2px 8px 2px"
            }}>
            <Grid container >
                <Grid item xs={1}>
                    <Avatar aria-label="recipe" sx={{
                        height: 55,
                        width: 50,
                        flexShrink: 0,
                        flexGrow: 0,
                        marginTop: 2}}
                        src={avatar} />
                </Grid>
                <Grid item xs={11}>
                    <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                    {note.title}
                    </DialogTitle>
                    <div>{dayjs(created).fromNow()+" by "+note.author}</div>
                </Grid>
                <Grid item>
                    <DialogContent>
                        <div dangerouslySetInnerHTML={{__html:note.rt}}/>
                    </DialogContent>
                </Grid>
            </Grid>
        </Paper>


        {comments && comments.length > 0 && 
          <div>
              {comments.map((comment) => (
                <Grid container key={comment.id}>
                    <Grid item xs={1}>
                    <Avatar aria-label="recipe" sx={{
                        height: 55,
                        width: 50,
                        flexShrink: 0,
                        flexGrow: 0,
                        marginTop: 2
                    }} src={comment.avatar} />
                    </Grid>
                    <Grid item xs={11}>
                        <Paper>
                        {dayjs(comment.createdAt).fromNow()+" by "+comment.author}
                            <DialogContent>
                                <div dangerouslySetInnerHTML={{__html:comment.rt}}/>
                            </DialogContent>
                        </Paper>

                    </Grid>
                    <hr/>
                </Grid>
              ))}
          </div>
        }
        <Grid item xs={12} sm={6}>
            <Editor initText={commentRt} setRt={rt => setCommentRt(rt)} setBody={body => setCommentBody(body)}/>
        </Grid>

        <Grid item xs={12} sm={6}>
            <Button variant="contained" onClick={handleSubmitComment}>Add Comment</Button>
        </Grid>

    </Dialog>
    )
}
