import React, { useEffect, useState } from "react"
import { auth, db } from "./firebase"

export const UserContext = React.createContext()

export default function UserProvider({ children }) {

  const [ currentUser, setCurrentUser ] = useState()
  const [ loading, setLoading ] = useState(true)
  const [ isAdmin, setIsAdmin ] = useState(false)
  const [ avatar, setAvatar ] = useState("https://i.pravatar.cc/300")
  const [ myBadges, setMyBadges ] = useState({})
  const [ userName, setUserName ] = useState("")

  function logout() {
    setIsAdmin(false)

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
                setAvatar(doc.data().avatar)
              }
              if(doc.data().hasOwnProperty("myBadgesMap")) {
                setMyBadges(doc.data().myBadgesMap)
              }
              if(doc.data().hasOwnProperty("firstName")) {
                setUserName(doc.data().firstName)
              }
            }
          }) 

        }
    })

    return unsubscribe
    }, [])
  
  const value = {
    currentUser,
    userName,
    isAdmin,
    avatar,
    myBadges,
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