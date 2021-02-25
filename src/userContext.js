import React, { useEffect, useState } from "react"
import firebase from "./firebase"
import "firebase/auth"

export const UserContext = React.createContext()

export default function UserProvider({ children }) {

    const [ currentUser, setCurrentUser ] = useState()
    const [ loading, setLoading ] = useState(true)
    const [ isAdmin, setIsAdmin ] = useState(false)

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
            if(user){
              firebase.firestore().collection('users').doc(user.uid).get()
              .then((doc) => {
                setIsAdmin(doc.data().admin)
              })
            }
        })

        return unsubscribe
        }, [])
  
  const value = {
    currentUser,
    isAdmin,
    loading
  }

  if(currentUser){console.log('auth email and is admin '+value.currentUser.email + isAdmin)}

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  )
}