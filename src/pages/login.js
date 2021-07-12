import React, { useEffect, useContext, useState } from "react";
import firebase, { auth, db } from "../firebase"
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import { UserContext } from "../userContext"
import { Redirect } from 'react-router-dom';
import { Box } from "@material-ui/core";

function Login() {

	const value = useContext(UserContext);

	if(value){console.log('Login value and loading '+value.currentUser +value.loading)}
	
	let history = useHistory()

	const [redirect, setredirect] = useState(null);

	useEffect(() => {
		if (!value.loading) {
			if (value.currentUser) {
				setredirect('/')
			}
		}
	}, [value.loading, value.currentUser])

	if (redirect) {
		return <Redirect to={redirect}/>
	}

	if (value.loading) {
		return <div>Loading!</div>
	}

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
	  auth.signInWithPopup(provider)
	  .then((user) => {
		//after we have the credential - lets check if the user exists in firestore
		console.log('user object ', user)
		console.log('user.user object ', user.user)
		console.log('user.user.uid ', user.user.uid)
		var docRef = db.collection('users').doc(user.user.uid);
		docRef.get().then(doc => {
		  if (doc.exists) {
			//user exists then just update the login time
			console.log("User exists already")
			return user
		  } else {
			//user doesn't exist - create a new user in firestore
			addNewUserToFirestore(user);
		  }
		})
	  })
	  .then(() => {
		history.push('/')});;
	}
	
    return (
		<Box sx={{minHeight: '100vh', backgroundImage: `url('/BaliSpace.jpeg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
			<Box sx={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
				<Button variant="contained" color="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
			</Box>
		</Box>
    )
  
  }

  function addNewUserToFirestore(user) {
	const collection = db.collection('users');
    const {profile} = user.additionalUserInfo;
    const details = {
      firstName: profile.hasOwnProperty("given_name") ? profile.given_name : '',
      lastName: profile.hasOwnProperty("family_name") ? profile.family_name : '',
      fullName: profile.hasOwnProperty("name") ? profile.name : '',
      email: profile.hasOwnProperty("email") ? profile.email : '',
    };
    collection.doc(user.user.uid).set(details);
	db.collection('adminDocs').doc('studentList').update({students: firebase.firestore.FieldValue.arrayUnion({'uid':user.user.uid, 'firstName':details.firstName})})
    return {user, details};
  }

export default Login;