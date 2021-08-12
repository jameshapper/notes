import React, { useState, useContext } from 'react';
import { db, storage } from '../firebase';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../userContext';
import Toolbar from '@material-ui/core/Toolbar';

//in styles = (theme) => etc. we had padding: theme.spacing(3). I don't know how to do this now.
//I probably want this const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
//see here https://next.material-ui.com/components/app-bar/
//Note that this is for the divs that are meant to shift content below the appbar

function Account(props) {

    const { currentUser, avatar, loading } = useContext(UserContext)

	const [ fileUpload, setFileUpload ] = useState(null)
  
    const onFileChange = async (e) => {
	  setFileUpload(e.target.files[0])
    };

	const Filevalidation = (file) => {
        // Check if any file is selected.
        if (file) {  
			const fsize = file.size;
			const fileKb = Math.round((fsize / 1024));
			// The size of the file.
			if (fileKb >= 1024) {
				alert(
					"File too Big, please reduce file size to less than 1mb");
			} else {return true}
		} else {return false}
    }
  
    const onSubmit = async () => {

	  console.log('file upload name is '+fileUpload.name)

	  if (Filevalidation(fileUpload)) {
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
	  }
    };

    if (loading === true) {
        return (
            <main sx={{flexGrow:1, p:3}}>
                <Toolbar />
                {loading && <CircularProgress size={150} sx={{
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
            <main sx={{flexGrow:1,p:3}}>
                <Toolbar />
				<Grid container direction='column' align='center' spacing={2}>
					<Grid item xs={12}>
						<Avatar alt="User Avatar" src={avatar} sx={{
							height: 330,
							width: 300,
							flexShrink: 0,
							flexGrow: 0,
							marginTop: 2
						}} />
						<p>
							{' '}
							{currentUser && currentUser.displayName ? currentUser.displayName : "Welcome!"}
						</p>
					</Grid>
					<Grid item xs={12}>

						<ButtonGroup orientation='vertical'>
							<Button variant='contained' component='label' sx={{m:1}}>
								Upload New Image
								<input type="file" hidden onChange={onFileChange} />
							</Button>
							
							<Button variant='outlined' sx={{m:1}} onClick = {onSubmit}> Submit New Image </Button>
						</ButtonGroup>

					</Grid>

				</Grid>


            </main>
        );
    }
}

export default Account;
