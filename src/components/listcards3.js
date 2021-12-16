import React from 'react'
/** @jsxImportSource @emotion/react */

import dayjs from 'dayjs';

import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
//import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Message from '@material-ui/icons/Message'
import { Box, Chip } from '@material-ui/core'
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit'
//import ShieldIcon from '@material-ui/icons/Shield';

export default function ListCards({notes, handleEditOpen, handleViewOpen, deleteNoteHandler, canEdit}) {

    function colorForStatus(status) {
        switch (status) {
            case "Active":
                return "primary"
            case "Archived":
                return "secondary"
            case "Paused":
                return "info"
            default:
                return "info"
        }
    }
    
    return (
        <div>
            <Grid container spacing={{ xs: 2, md: 2, lg:2 }}>
                {notes.map((note) => (
                    <Grid item xs={12} md={6} lg={4} key = {note.id}>
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
                                maxWidth:400,
                                minWidth:300
                            }}
                        >
                            <Box
                                sx={{
                                    display:'flex',
                                    flexDirection: 'row',
                                    alignItems: 'left'
                                }}
                            >
                                <Box
                                    sx={{
                                    height: 50,
                                    width: 50,
                                    maxHeight: 50,
                                    maxWidth: 50,
                                    ml:1
                                    }}
                                >
                                    <Avatar aria-label="recipe" sx={{height: 38, width: 38}} src={note.avatar} />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                    m: 1,
                                    minWidth: { md: 150, lg: 150 },
                                    width:150
                                    }}
                                >
                                    <Box component="span" sx={{ fontSize: 10, mt:0 }}>
                                        {note.title}
                                    </Box>
                                    <Box color="text.secondary" component="span" sx={{ fontSize: 10, mt:0 }}>
                                        {dayjs(note.createdAt).fromNow()+" by "+note.author}
                                    </Box>

                                </Box>

                                <Box sx={{
                                    alignItems: 'left'
                                }}>
                                    <Box sx={{}}>
                                        {note.status &&
                                        <Chip size='small' label={note.status} color={colorForStatus(note.status)} /> 
                                        }
                                    </Box>
                                </Box>

                            </Box>
                            <Box color="text.secondary" component="span" sx={{ ml:1, fontSize: 10 }}>
                                {note.body.substring(0, 65)+"..."}
                            </Box>

                            <Box sx={{
                                display:'flex',
                                flexDirection: 'row'
                            }}>

                                <Box sx={{width: { xs: 200, md: 150, lg: 150}}}>
                                    <Box sx={{display:'flex', alignItems: 'left', flexDirection: { xs: 'row', md: 'column' }, ml:1, mt:1}}>
                                        {note.activities && note.activities.length > 0 && note.activities.map(activity => (
                                            <Box key={activity} color="text.secondary" component="span" sx={{m: {xs: 1, md:0}, fontSize: 10}}>{activity}</Box>
                                        ))}
                                    </Box>
                                </Box>

                                <Box sx={{ mr:2, width: 40 }}>
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
                                    {note.commentNum && 
                                        <ListItem 
                                        key="messagesCountFromLC"
                                        >
                                            <Badge badgeContent={note.commentNum} color="primary" variant='dot'>
                                                <Message fontSize='small'/>
                                            </Badge>
                                        </ListItem>
                                    }
                                    </List>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
