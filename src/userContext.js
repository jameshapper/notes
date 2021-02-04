import React, { useEffect, useState } from "react"
import firebase from "./firebase"
import "firebase/auth"

export const UserContext = React.createContext()

export default function UserProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
        }, [])
  
  const value = {
    currentUser,
    loading
  }

  if(currentUser){console.log('auth email '+value.currentUser.email)}

  return (
    <UserContext.Provider value={currentUser}>
      {!loading && children}
    </UserContext.Provider>
  )
}