import React, { useEffect, useState } from "react"
import { auth, db, storage } from "./firebase"

export const UserContext = React.createContext()

export default function UserProvider({ children }) {

  const [ currentUser, setCurrentUser ] = useState()
  const [ loading, setLoading ] = useState(true)
  const [ isAdmin, setIsAdmin ] = useState(false)
  const [ avatar, setAvatar ] = useState("https://i.pravatar.cc/300")

  function logout() {
    return auth.signOut()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setAvatar("https://i.pravatar.cc/300")
        setCurrentUser(user)
        setLoading(false)
        console.log("in userContext, user is ", user)
        if(user){
          db.collection('users').doc(user.uid).get()
          .then((doc) => {
            if(doc.exists) {
              if(doc.data().hasOwnProperty("admin")) {
                setIsAdmin(doc.data().admin)
              }
              if(doc.data().hasOwnProperty("avatar")) {
                let avatarUrl = doc.data().avatar
                //var storage = firebase.storage()
                var imageRef = storage.refFromURL(avatarUrl)
                console.log(imageRef)
                console.log(imageRef.fullPath)
                imageRef.getDownloadURL().then((url) => {
                  console.log(url)
                  setAvatar(url)
                })
              }
            }
          })

        }
    })

    return unsubscribe
    }, [])
  
  const value = {
    currentUser,
    isAdmin,
    avatar,
    loading,
    logout
  }

  if(currentUser){console.log('auth email and is admin '+value.currentUser.email + isAdmin)}

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  )
}