import React, { useContext } from 'react'
import { UserContext } from "./userContext"

export default function ContextChecker() {

    const currentUser = useContext(UserContext);
    if(currentUser){console.log('Login value '+currentUser.uid)}

    return (
        <div>

        </div>
    )
}
