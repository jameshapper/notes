import React, { useEffect, useState } from 'react';

import { Input, InputLabel, MenuItem, FormControl, ListItemText, Select, Checkbox, Chip, Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box'

//in Paper we had  padding: theme.spacing(0.5),

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
    <Box component="form"
    sx={{
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'left',
    }} >
        <Box sx={{justifyContent: 'left'}}>
        <FormControl sx={{minWidth:120,maxWidth:300,m:1}} >
            <InputLabel id="demo-mutiple-checkbox-label">Add Badges</InputLabel>
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
      </Box>
      {paperView && 
      <Box sx={{justifyContent: 'center'}}>
        <Paper component="ul" sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          padding: 0.25,
          margin: 1,
          minHeight: 40,
        }} >
            {selectedOptions.map((data) => {
                return (
                <li key={data}>
                    <Chip label={data} sx={{m:1}}/>
                </li>
                );
            })}
        </Paper>
      </Box>
      }
    </Box>
  );
}
