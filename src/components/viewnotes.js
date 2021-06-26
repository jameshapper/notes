import React from 'react'

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
import withStyles from '@material-ui/core/styles/withStyles'
//import { grey500 } from 'material-ui/styles/colors';

/* const styles = (theme) => ({
	root: {
		minWidth: 220
	},
	dialogeStyle: {
		maxWidth: '75%'
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
}); */

const DialogTitle = ((props) => {
    const { children, onClose, classes, ...other } = props;
    return (
        <MuiDialogTitle disableTypography style={{minWidth:220}} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" style={{
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

export default function ViewNotes({handleViewClose, viewOpen, title, author, created, avatar, comments, rt, classes, handleSubmitComment, setCommentBody, setCommentRt, commentRt}) {
    
    return (
        <Dialog
        onClose={handleViewClose}
        aria-labelledby="customized-dialog-title"
        open={viewOpen}
        fullWidth
        classes={{ paperFullWidth: {maxWidth: '75%'} }}
    >
        <Paper   elevation={2}
            style={{
                padding: 8,
                backgroundColor: "#e0e0e0",
                border: "1px solid black",
                margin: "2px 2px 8px 2px"
            }}>
            <Grid container >
                <Grid item xs={1}>
                    <Avatar aria-label="recipe" style={{
                        height: 55,
                        width: 50,
                        flexShrink: 0,
                        flexGrow: 0,
                        marginTop: 20}}
                        src={avatar} />
                </Grid>
                <Grid item xs={11}>
                    <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                    {title}
                    </DialogTitle>
                    <div>{dayjs(created).fromNow()+" by "+author}</div>
                </Grid>
                <Grid item>
                    <DialogContent>
                        <div dangerouslySetInnerHTML={{__html:rt}}/>
                    </DialogContent>
                </Grid>
            </Grid>
        </Paper>


        {comments && comments.length > 0 && 
          <div>
              {comments.map((comment) => (
                <Grid container key={comment.id}>
                    <Grid item xs={1}>
                    <Avatar aria-label="recipe" style={{
                        height: 55,
                        width: 50,
                        flexShrink: 0,
                        flexGrow: 0,
                        marginTop: 20
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
