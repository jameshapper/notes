import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Input, InputLabel, MenuItem, FormControl, ListItemText, Select, Checkbox, Chip, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chip: {
    margin: 2,
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    minHeight: 50,
  },
  row: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'left',
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left"
  },
  getContentAnchorEl: null
};

export default function MultipleSelect(props) {
  const allOptions = props.allOptions

  const classes = useStyles();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [ paperView, setPaperView ] = useState(false)

  useEffect(() => {
    selectedOptions.length ? setPaperView(true) : setPaperView(false)
  }, [ selectedOptions ])

  const handleChange = (event) => {
    console.log("selectedOptions are "+event.target.value)
    setSelectedOptions(event.target.value);
    props.getList(event.target.value)
  };

  return (
    <div className={classes.row}>
        <div style={{justifyContent: 'left'}}>
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">Add Aspirations</InputLabel>
            <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            value={selectedOptions}
            onChange={handleChange}
            input={<Input />}
            renderValue={() => ''}
            MenuProps={MenuProps}
            >
            {allOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={selectedOptions.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
      </div>
      {paperView && 
      <div style={{justifyContent: 'center'}}>
        <Paper component="ul" className = {classes.root}>
            {selectedOptions.map((data) => {
                return (
                <li key={data}>
                    <Chip label={data} className={classes.chip}/>
                </li>
                );
            })}
        </Paper>
      </div>
      }
    </div>
  );
}
