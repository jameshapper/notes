import React, { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import { useHistory } from 'react-router-dom'

export default function MyBadgesRedirect() {

    const { currentUser } = useContext(UserContext)

    const history = useHistory()

    useEffect(() => {
        history.push(`/students/${currentUser.uid}/myBadges`)
    })

    return (
        <div>
            Just temporary
        </div>
    )
}
