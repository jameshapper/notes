import React from 'react'
import { useParams } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import { Typography } from '@material-ui/core'

export default function BadgeDetails() {

    const { badgeId } = useParams()

    console.log('reached the BadgeDetails component with id of '+badgeId)
    return (
        <>
            <Toolbar />
            <Box sx={{flexGrow:1, p:3}} >
                <Typography>Check console for badgeId object</Typography>
            </Box>
        </>
    )
}
