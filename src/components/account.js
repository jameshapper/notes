import React, { useState, useContext } from 'react';
import { db, storage } from '../firebase';

import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../userContext';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
    avatar: {
		height: 330,
		width: 300,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	}
});

function Account(props) {

    const { currentUser, avatar, loading } = useContext(UserContext)

    const { classes } = props;

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
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {loading && <CircularProgress size={150} className={classes.uiProgess} />}
            </main>
        );
    } else {
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />

                <center>
                    <Avatar alt="User Avatar" src={avatar} className={classes.avatar} />
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

export default withStyles(styles)(Account);
