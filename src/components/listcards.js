import React from 'react'

import Chips from './chips';

import dayjs from 'dayjs';

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 470
	},

}))

export default function ListCards({notes, handleEditClickOpen, handleViewOpen, deleteNoteHandler, canEdit}) {
    
    const classes = useStyles();

    return (
        <div>
            <Grid container spacing={2}>
                    {notes.map((note) => (
                        <Grid item xs={12} sm={6} key = {note.id}>
                            <Card className={classes.root} variant="outlined">
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" className={classes.avatar} src={note.avatar} />
                                    }
                                    title={note.title}
                                    subheader= {dayjs(note.createdAt).fromNow()+" by "+note.author}
                                />
                                <CardContent>
                                    {note.activities && note.activities.length > 0 && <Chips activities={note.activities}></Chips>}
                                    <Typography variant="body2" component="p">
                                        {note.body.substring(0, 65)+"..."}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => handleViewOpen({ note })}>
                                        {' '}
                                        View{' '}
                                    </Button>
                                    {canEdit && <>
                                    <Button size="small" color="primary" onClick={() => handleEditClickOpen({ note })}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="primary" onClick={() => deleteNoteHandler({ note })}>
                                        Delete
                                    </Button>
                                    </>}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
        </div>
    )
}
