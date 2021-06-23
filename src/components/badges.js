import React, { useState, useContext, useEffect } from 'react';
import { db, storage } from '../firebase';

import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../userContext';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	}
});

function Badges(props) {

    const { currentUser, loading } = useContext(UserContext)

    const { classes } = props;

	const [ fileUpload, setFileUpload ] = useState(null)
    const [ data, setData ] = useState([])
  
    const onFileChange = async (e) => {
	  setFileUpload(e.target.files[0])
    };

    const getData=()=>{
        fetch(fileUpload
        ,{
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        }
        )
          .then(function(response){
            console.log(response)
            return response.json();
          })
          .then(function(myJson) {
            console.log(myJson);
            setData(myJson)
          });
      }
      useEffect(()=>{
        getData()
      },[])
  
    const onSubmit = async () => {

	  console.log('file upload name is '+fileUpload.name)



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
                    <p>
                        {'Badges list table goes here '}
                    </p>
                </center>

                <center>
                    <div>
                        {data && data.length>0 && data.map((item)=><p>{item.about}</p>)}
                    </div>
                </center>

				<input type="file" onChange={onFileChange} />
				<button onClick = {onSubmit}> Submit New Badge </button>

            </main>
        );
    }
}

export default withStyles(styles)(Badges);