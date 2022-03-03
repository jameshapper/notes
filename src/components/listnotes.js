import React, { useState, useContext, useEffect } from 'react';
import firebase, { db } from '../firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import NewNote from './newnote4';
import ViewNotes from './viewnotes4';

import { UserContext } from '../userContext';
import PropTypes from 'prop-types';
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
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit'

function ListNotes({classes, badges, studentClass} ) {

    const { loading, currentUser } = useContext(UserContext)

    const [ uiLoading ] = useState(loading)
    const [ rows, setRows ] = useState([])

    useEffect(() => {   
        return db.collection("users").doc(currentUser.uid).collection("userLists").doc("notesList")
        .onSnapshot((doc) => {
            setRows(doc.data().notes)
        })
    }, [currentUser.uid]);

    //Was getting a warning on the Select that was answered here https://stackoverflow.com/questions/55429442/material-ui-select-component-a-component-is-changing-a-controlled-input-of-type

    if (uiLoading === true) {
        return (
            <main sx={{flexGrow:1, p:3}} >
                <Toolbar />
                {uiLoading && <CircularProgress size={150} sx={{
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
            <>    
                <Box sx={{flexGrow:1, p:3}} >
                    <EnhancedTable rows={rows} headCells={headCells} userId={currentUser.uid} classes={classes} badges={badges} studentClass={studentClass}  />
                </Box>
            </>
        )
    }
}
export default ListNotes;

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
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Note Title',
  },
  {
    id: 'ts_msec',
    numeric: true,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'body',
    numeric: false,
    disablePadding: false,
    label: 'Description',
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
  rowCount: PropTypes.number.isRequired,
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
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [note, setNote] = useState({})
  const [ open, setOpen ] = useState(false)
  const [ viewOpen, setViewOpen ] = useState(false)

  const rows = props.rows
  const headCells = props.headCells
  const userId = props.userId
  const classes = props.classes
  const studentClass = props.studentClass
  const badges = props.badges

  const handleViewOpen = (note) => {
    console.log("Clicked a row!")
    db.collection("users").doc(userId).collection("notes").doc(note.noteId).get()
    .then(doc => {
      setNote(doc.data())
      setViewOpen(true)
    })
  };

  //this will be sent to the "EnhancedTableHead" component. It will toggle the order if we click on the most recently ordered header again.
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const handleEditOpen = (note) => {
    db.collection("users").doc(userId).collection("notes").doc(note.noteId).get()
    .then(doc => {
      setNote({...doc.data(),id:note.noteId})
      setOpen(true)
    })
  }

  const handleClose = () => {
      setOpen(false)
  }

  const handleViewClose = () => {
      setViewOpen(false)
  }

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
              headCells={headCells}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                return (
                    <ActionItemRow key={`ActionItemRow-${index}`} labelId={labelId} row={row} handleViewOpen={handleViewOpen} handleEditOpen={handleEditOpen} />
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

      <ViewNotes note={note} handleViewClose={handleViewClose} viewOpen={viewOpen}/>

      {open && 
          <NewNote open={open} handleClose={handleClose} buttonType={"Edit"} noteForEdit={note} classes={classes} badges={badges} studentClass={studentClass} />
      }

    </Box>
  );
}

function ActionItemRow(props) {
    const row = props.row
    const labelId = props.labelId
    const handleViewOpen = props.handleViewOpen
    const handleEditOpen = props.handleEditOpen

    return (
        <TableRow
        tabIndex={-1}
        key={row.noteId}
        >
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
        >
          {row.title}
        </TableCell>
        <TableCell align='left'>{(new Date(row.ts_msec).toString()).slice(0,15)}</TableCell>
        <TableCell align="left">{row.body}</TableCell>
        <TableCell align="left">
          <Box sx={{ ml:1, width: 15 }}>
              <List sx={{display:'flex', flexDirection: 'row'}}>
                  <ListItem 
                  button
                  key="viewNoteFromLC"
                  onClick={() => handleViewOpen(row)}
                  >
                      <ListItemIcon ><VisibilityIcon fontSize='small'/></ListItemIcon>
                  </ListItem>
              <>
                  <ListItem 
                  button
                  key="editNoteFromLC"
                  onClick={() => handleEditOpen(row)}
                  >
                      <ListItemIcon ><EditIcon fontSize='small'/></ListItemIcon>
                  </ListItem>
              </>
              </List>
          </Box>
        </TableCell>

      </TableRow>
    )
}