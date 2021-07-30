import React from 'react'
/** @jsxImportSource @emotion/react */

import dayjs from 'dayjs';

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Message from '@material-ui/icons/Message'
import { Box, Chip } from '@material-ui/core'
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit'
import ShieldIcon from '@material-ui/icons/Shield';

export default function ListCards({notes, handleEditOpen, handleViewOpen, deleteNoteHandler, canEdit}) {
    
    return (
        <div>
            <Grid container spacing={2}>
                {notes.map((note) => (
                    <Grid item xs={12} sm={12} key = {note.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                bgcolor: 'background.paper',
                                overflow: 'hidden',
                                borderRadius: '12px',
                                boxShadow: 1,
                                fontWeight: 'bold',
                                justifyContent: 'space-between',
                                maxWidth:800
                            }}
                        >
                            <Box
                                sx={{
                                height: 70,
                                width: 70,
                                maxHeight: { xs: 70, md: 70 },
                                maxWidth: { xs: 70, md: 70 },
                                ml:1
                                }}
                            >
                                <Avatar aria-label="recipe" sx={{height: 58, width: 58}} src={note.avatar} />
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'center', md: 'flex-start' },
                                m: 3,
                                minWidth: { md: 250 },
                                width:350
                                }}
                            >
                                <Typography component="div" variant="h5" sx={{ mt:0 }}>
                                    {note.title}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                    {dayjs(note.createdAt).fromNow()+" by "+note.author}
                                </Typography>
                                <Box component="span" sx={{ fontSize: 12 }}>
                                    <Typography variant="body2" component="p">
                                        {note.body.substring(0, 65)+"..."}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{width: { xs: 200, md: 150}}}>
                                <Box sx={{display:'flex', alignItems: 'center', flexDirection: { xs: 'row', md: 'column' }}}>
                                    {note.activities && note.activities.length > 0 && <ShieldIcon />}
                                    {note.activities && note.activities.length > 0 && note.activities.map(activity => (
                                        <Typography sx={{m: {xs: 1, md:0}}}>{activity}</Typography>
                                    ))}
                                </Box>
                            </Box>
                            <Box sx={{display:'flex', flexDirection: { xs: 'row', md: 'column' }}}>
                                <Chip label="Active" color="primary" /> 
                            </Box>
                            <Box sx={{ mr:2, width: 40 }}>
                                <List sx={{display:'flex', flexDirection: { xs: 'row', md: 'column' }}}>
                                    <ListItem 
                                    button
                                    key="viewNoteFromLC"
                                    onClick={() => handleViewOpen( note )}
                                    >
                                        <ListItemIcon ><VisibilityIcon /></ListItemIcon>
                                    </ListItem>
                                {canEdit && <>
                                    <ListItem 
                                    button
                                    key="editNoteFromLC"
                                    onClick={() => handleEditOpen( note )}
                                    >
                                        <ListItemIcon ><EditIcon /></ListItemIcon>
                                    </ListItem>
                                </>}
                                {note.commentNum && 
                                    <ListItem 
                                    key="messagesCountFromLC"
                                    >
                                        <Badge badgeContent={note.commentNum} color="primary">
                                            <Message />
                                        </Badge>
                                    </ListItem>
                                }
                                </List>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
