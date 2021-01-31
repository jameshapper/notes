import React from 'react';
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

const names = [
  'Hands-on',
  'App-IT',
  'Study',
  'Problems',
  'Sharing',
  'Connect',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect() {
  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
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
            value={personName}
            onChange={handleChange}
            input={<Input />}
            //renderValue={(selected) => selected.join(', ')}
            renderValue={(selected) => ''}
            MenuProps={MenuProps}
            >
            {names.map((name) => (
                <MenuItem key={name} value={name}>
                <Checkbox checked={personName.indexOf(name) > -1} />
                <ListItemText primary={name} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
      </div>
      <div style={{justifyContent: 'center'}}>
        <Paper component="ul" className = {classes.root}>
            {personName.map((data) => {
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
