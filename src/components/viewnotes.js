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

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 220
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '75%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, onClose, classes, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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
        classes={{ paperFullWidth: classes.dialogeStyle }}
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
                    <Avatar aria-label="recipe" className={classes.avatar} src={avatar} />
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
                <Grid container>
                    <Grid item xs={1}>
                    <Avatar aria-label="recipe" className={classes.avatar} src={comment.avatar} />
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
