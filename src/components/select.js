import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper'
import MultiSelect from "react-multi-select-component";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
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

function getStyles(name, selectedOptions, theme) {
  return {
    fontWeight:
      selectedOptions.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect(props) {
  const allOptions = props.allOptions

  const classes = useStyles();
  const theme = useTheme();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selected, setSelected] = useState([])

  useEffect(() => {
    let selectArray = selected.map(a => a.value)
    console.log(`array of selected ids ${selectArray}`)
  })

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
            //renderValue={(selected) => selected.join(', ')}
            renderValue={(selected) => ''}
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
    </div>
  );
}
