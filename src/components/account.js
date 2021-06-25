import React, { useState, useContext } from 'react';
import { db, storage } from '../firebase';

//import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../userContext';

//in styles = (theme) => etc. we had padding: theme.spacing(3). I don't know how to do this now.
//I probably want this const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
//see here https://next.material-ui.com/components/app-bar/
//Note that this is for the divs that are meant to shift content below the appbar

function Account(props) {

    const { currentUser, avatar, loading } = useContext(UserContext)

    //const { classes } = props;

	const [ fileUpload, setFileUpload ] = useState(null)
  
    const onFileChange = async (e) => {
	  setFileUpload(e.target.files[0])
    };
  
    const onSubmit = async () => {

	  console.log('file upload name is '+fileUpload.name)

 	  const storageRef = storage.ref();
      const fileRef = storageRef.child(fileUpload.name);
      await fileRef.put(fileUpload);
	  let downloadUrl = await fileRef.getDownloadURL()
	  console.log('waiting for download url '+await downloadUrl)
      db.collection("users").doc(currentUser.uid).update({
		  avatar: await downloadUrl
		});
  	  await currentUser.updateProfile({
		  photoURL: await downloadUrl
	  })
	  .then(function() {
		console.log("update appears successful")
	  }).catch(function(error) {
		console.log('problem updating image')
	  });

    };

    if (loading === true) {
        return (
            <main style={{flexGrow:1, p:3}}>
                <div style={{height:60}} />
                {loading && <CircularProgress size={150} style={{
					position: 'fixed',
					zIndex: '1000',
					height: '31px',
					width: '31px',
					left: '50%',
					top: '35%'
				}} />}
            </main>
        );
    } else {
        return (
            <main style={{flexGrow:1,p:3}}>
                <div style={{height:60}} />

                <center>
                    <Avatar alt="User Avatar" src={avatar} style={{
						height: 330,
						width: 300,
						flexShrink: 0,
						flexGrow: 0,
						marginTop: 20
					}} />
                    <p>
                        {' '}
                        {currentUser && currentUser.displayName ? currentUser.displayName : "Welcome!"}
                    </p>
                </center>

				<input type="file" onChange={onFileChange} />
				<button onClick = {onSubmit}> Submit New Image </button>

            </main>
        );
    }
}

export default Account;
