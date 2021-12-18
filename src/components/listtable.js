import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import firebase, { db } from '../firebase';
import { Link, useHistory } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

import { UserContext } from '../userContext';
import PropTypes from 'prop-types';
import { alpha } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import { AssignmentInd, CloudDownload, Edit } from '@material-ui/icons';
import { AppBar, TextField, Dialog, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@material-ui/core';


import dayjs from 'dayjs';

import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Message from '@material-ui/icons/Message'
import { Chip } from '@material-ui/core'
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit'
import ShieldIcon from '@material-ui/icons/Shield';

export default function ListTable({notes, handleViewOpen}) {

    const rows = notes
    
    return (
        <div>
            <Box sx={{flexGrow:1, p:3}} >
                <EnhancedTable rows={rows} />
            </Box>            
        </div>
    )
}

//The comparator functions below allow the same functions to be used for sorting objects by different columns (different fields within the objects)

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'avatar',
    numeric: false,
    disablePadding: true,
    label: 'Avatar',    
  },
  {
    id: 'author',
    numeric: false,
    disablePadding: true,
    label: 'Author',
  },
  {
    id: 'noteType',
    numeric: false,
    disablePadding: false,
    label: 'Note Type',
  },
  {
    id: 'actionType',
    numeric: false,
    disablePadding: false,
    label: 'Action Type',
  },
  {
    id: 'plannedHrs',
    numeric: false,
    disablePadding: false,
    label: 'Hrs Planned',
  },
  {
    id: 'completedHrs',
    numeric: false,
    disablePadding: false,
    label: 'Hrs Completed',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  //an appropriate "sortHandler" will be created for each column (with the "property" being the "id" of the particular column header)
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{fontWeight:"bold"}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
    </Toolbar>
  );
};


export function EnhancedTable(props) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('noteType');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const rows = props.rows

  //this will be sent to the "EnhancedTableHead" component. It will toggle the order if we click on the most recently ordered header again.
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    console.log("Clicked a row!")
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell>
                        <Avatar aria-label="recipe" sx={{height: 30, width: 30}} src={row.avatar} />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.author}
                      </TableCell>
                      <TableCell align="left">{row.noteType}</TableCell>
                      <TableCell align="left">{row.actionType}</TableCell>
                      <TableCell align="left">{row.plannedHrs}</TableCell>
                      <TableCell align="left">{row.completedHrs}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
