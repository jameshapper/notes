import React, { useState } from 'react'
/** @jsxImportSource @emotion/react */

import ViewNotes from './viewnotes4'
import NewNote from './newnote4'

import dayjs from 'dayjs';

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
//import Typography from '@material-ui/core/Typography'

import { Box } from '@material-ui/core'
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit'
//import ShieldIcon from '@material-ui/icons/Shield';

//https://firebasestorage.googleapis.com/v0/b/progressnotes-b6fc9.appspot.com/o/GoalTargetEditted.png?alt=media&token=59a794c9-225a-49c9-949e-6ffa4bb7c188
//https://firebasestorage.googleapis.com/v0/b/progressnotes-b6fc9.appspot.com/o/GoalToInkscapeEditted.svg?alt=media&token=e935e1c8-46fb-4015-bb76-9437294546fc


export default function ListGoals({notes, canEdit, classes, badges}) {

    const PlansIcon = "https://firebasestorage.googleapis.com/v0/b/progressnotes-b6fc9.appspot.com/o/GoalTargetEditted.png?alt=media&token=59a794c9-225a-49c9-949e-6ffa4bb7c188"
    const GoalsIcon = "https://firebasestorage.googleapis.com/v0/b/progressnotes-b6fc9.appspot.com/o/GoalToInkscapeEditted.svg?alt=media&token=e935e1c8-46fb-4015-bb76-9437294546fc"

    const [ viewOpen, setViewOpen ] = useState(false)
    const [ open, setOpen ] = useState(false)
    const [ note, setNote ] = useState({})

    const handleEditOpen = (note) => {
        setNote(note)
        setOpen(true)
	}

    const handleClose = () => {
        setOpen(false)
    }

    const handleViewOpen = (note) => {
        setNote(note)
        setViewOpen(true)
	}

    const handleViewClose = () => {
        setViewOpen(false)
    }
    
    return (
        <div>
            <Grid container spacing={{ xs: 2, md: 2, lg:2 }}>
                {notes.map((note) => (
                    <Grid item xs={12} md={12} lg={12} key = {note.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left',
                                bgcolor: 'background.paper',
                                overflow: 'hidden',
                                borderRadius: '12px',
                                boxShadow: 1,
                                fontWeight: 'bold',
                                justifyContent: 'space-between',
                                maxWidth:250,
                                minWidth:200
                            }}
                        >
                            <Box
                                sx={{
                                    display:'flex',
                                    flexDirection: 'row',
                                    alignItems: 'left',
                                    justifyContent:'left',
                                    p: 1
                                }}
                            >
                                <Box
                                    sx={{
                                    height: 75,
                                    width: 100,
                                    maxHeight: 75,
                                    maxWidth: 100,
                                    ml:1
                                    }}
                                >
                                    {note.noteType === "TermGoals" ? 
                                        <Avatar aria-label="recipe" sx={{height: 75, width: 75}} src={GoalsIcon} /> :
                                        <Avatar aria-label="recipe" sx={{height: 75, width: 75}} src={PlansIcon} />
                                    }
                                    <Box sx={{ ml:0, width: 5 }}>
                                        <List sx={{display:'flex', flexDirection: 'row'}}>
                                            <ListItem 
                                            button
                                            key="viewNoteFromLC"
                                            onClick={() => handleViewOpen( note )}
                                            >
                                                <ListItemIcon ><VisibilityIcon fontSize='small'/></ListItemIcon>
                                            </ListItem>
                                        {canEdit && <>
                                            <ListItem 
                                            button
                                            key="editNoteFromLC"
                                            onClick={() => handleEditOpen( note )}
                                            >
                                                <ListItemIcon ><EditIcon fontSize='small'/></ListItemIcon>
                                            </ListItem>
                                        </>}

                                        </List>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                    m: 1,
                                    minWidth: { md: 125, lg: 125 },
                                    width:125
                                    }}
                                >
                                    <Box component="span" sx={{ fontSize: 10, mt:0 }}>
                                        {note.title}
                                    </Box>
                                    <Box color="text.secondary" component="span" sx={{ fontSize: 10, mt:0 }}>
                                        {dayjs(note.createdAt).fromNow()+" by "+note.author}
                                    </Box>
                                    <Box color="text.secondary" component="span" sx={{ ml:1, fontSize: 10 }}>
                                        {note.body.substring(0, 65)+"..."}
                                    </Box>
                                </Box>


                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <ViewNotes note={note} handleViewClose={handleViewClose} viewOpen={viewOpen}/>

            {open && 
                <NewNote open={open} handleClose={handleClose} buttonType={"Edit"} noteForEdit={note} classes={classes} badges={badges}/>
            }

        </div>
    )
}
