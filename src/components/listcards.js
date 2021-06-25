import React from 'react'
/** @jsxImportSource @emotion/react */

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
import Badge from '@material-ui/core/Badge'
import Message from '@material-ui/icons/Message'

export default function ListCards({notes, handleEditOpen, handleViewOpen, deleteNoteHandler, canEdit}) {
    
    return (
        <div>
            <Grid container spacing={2}>
                    {notes.map((note) => (
                        <Grid item xs={12} sm={6} key = {note.id}>
                            <Card css={{minWidth: 470}} variant="outlined">
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" css={{height: 58, width: 58}} src={note.avatar} />
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
                                    <Button size="small" color="primary" onClick={() => handleViewOpen( note )}>
                                        {' '}
                                        View{' '}
                                    </Button>
                                    {canEdit && <>
                                    <Button size="small" color="primary" onClick={() => handleEditOpen( note )}>
                                        Edit
                                    </Button>
                                    </>}
                                    {note.commentNum && 
                                    <Badge badgeContent={note.commentNum} color="primary">
                                        <Message />
                                    </Badge>}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
        </div>
    )
}
