import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
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

import { countryDailyData } from '../../api'

const Ttable = () => {

  const [allNepalData, setAllNepalData] = useState([])
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loadingStatus, setLoadingStatus] = useState(true)
  useEffect(() => {
    const fetchAPI = async() => {
        const alNepalData  = await countryDailyData()
        setAllNepalData(alNepalData)
        setLoadingStatus(false)
    }
    fetchAPI()
}, [])

  function createData(date, confirmed, active, recovered, deaths, lastUpdate) {
    return { date, confirmed, active, recovered, deaths, lastUpdate };
  }

  const rows = []
  allNepalData.map((value, key) => {
    const date = new Date()
    var defaultDate = date - 1000 * 60 * 60 * 24 * (key+1)
    defaultDate = new Date(defaultDate).toLocaleDateString()
    var datearray = defaultDate.split("/")
    if(datearray[0] < 10){
        datearray[0] ='0' + datearray[0] 
    }
    if(datearray[1] < 10){
        datearray[1] ='0' + datearray[1] 
    }
    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    var yesterdayDate = newdate.split("/").reverse().join("-");
    rows.push(createData( yesterdayDate, value.confirmed, value.active, value.recovered, value.deaths, value.lastUpdate))
  })

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
    { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
    { id: 'confirmed', numeric: true, disablePadding: false, label: 'Confirmed' },
    { id: 'active', numeric: true, disablePadding: false, label: 'Active' },
    { id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered' },
    { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths' },
    { id: 'lastUpdate', numeric: true, disablePadding: false, label: 'Last Updated On' },
  ]

  function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox"> S.N </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
      textAlign: 'center'
    },
  }));

  function EnhancedTableToolbar () {
    const classes = useToolbarStyles();
    return (
      <Toolbar className={clsx(classes.root)}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          STATISTICS
        </Typography>
      </Toolbar>
    );
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }));

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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            {
              loadingStatus ? 
                <Typography>Fetching..</Typography>
              : 
                <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (                 
                      <TableRow>
                        <TableCell padding="checkbox">{index + 1 }</TableCell>       
                        <TableCell component="th" id={labelId} scope="row" padding="none">{row.date}</TableCell>
                        <TableCell >{row.confirmed}</TableCell>
                        <TableCell >{row.active}</TableCell>
                        <TableCell >{row.recovered}</TableCell>
                        <TableCell >{row.deaths}</TableCell>
                        <TableCell >{row.lastUpdate}</TableCell>
                      </TableRow>
                    );                  
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            } 
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
export default Ttable