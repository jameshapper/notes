import React, { useEffect, useContext, useState } from "react";
import 'firebase/auth';
import firebase from "../firebase"
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import { UserContext } from "../userContext"
import { Redirect } from 'react-router-dom';

const auth = firebase.auth();
const firestore = firebase.firestore();

function Login() {

	const currentUser = useContext(UserContext);
	if(currentUser){console.log('Login value '+currentUser)}
	
	let history = useHistory()

	const [redirect, setredirect] = useState(null);

	useEffect(() => {
		if (currentUser) {
		  setredirect('/')
		}
	  }, [currentUser])

	if (redirect) {
	return <Redirect to={redirect}/>
	}

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
	  auth.signInWithPopup(provider)
	  .then((user) => {
		//after we have the credential - lets check if the user exists in firestore
		var docRef = firestore.collection('users').doc(auth.currentUser.uid);
		docRef.get().then(doc => {
		  if (doc.exists) {
			//user exists then just update the login time
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
		<div style={{minHeight: '100vh', backgroundImage: `url('/BaliSpace.jpeg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
			<div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
				<Button variant="contained" color="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
			</div>
		</div>
    )
  
  }

  function addNewUserToFirestore(user) {
	const collection = firestore.collection('users');
    const {profile} = user.additionalUserInfo;
    const details = {
      firstName: profile.given_name,
      lastName: profile.family_name,
      fullName: profile.name,
      email: profile.email,
    };
    collection.doc(auth.currentUser.uid).set(details);
    return {user, details};
  }

export default Login;