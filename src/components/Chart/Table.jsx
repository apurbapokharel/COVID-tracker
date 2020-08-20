//This is a test UI for table but remains unsed in this project
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Collapse from '@material-ui/core/Collapse'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { countryDailyData } from '../../api'

const TTable = () => {

  const [allNepalData, setAllNepalData] = useState([])
  useEffect(() => {
    const fetchAPI = async() => {
        const alNepalData  = await countryDailyData()
        setAllNepalData(alNepalData)
    }
    fetchAPI()
}, [])

  function createData(date, confirmed, active, recovered, deaths, lastUpdate, history) {
    return { date, confirmed, active, recovered, deaths, lastUpdate, history };
  }
  const rows2 =[]
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
      var history = [{ date: '2020-01-05', customerId: '11091700', amount: 3 }, { date: '2020-01-02', customerId: 'Anonymous', amount: 1 }]
      rows2.push(createData( yesterdayDate, value.confirmed, value.active, value.recovered, value.deaths, value.lastUpdate, history))
    })
  console.log(rows2)

  function Row(props){
    const {row} = props
    const [open, setOpen] = useState(false)

    return(
      <>
        <TableRow>
            <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.date}</TableCell>
          <TableCell>{row.confirmed}</TableCell>
          <TableCell>{row.active}</TableCell>
          <TableCell>{row.recovered}</TableCell>
          <TableCell>{row.deaths}</TableCell>
          <TableCell>{row.lastUpdate}</TableCell>
        </TableRow>  
          
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">History</Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((val) => (
                          <TableRow key={val.date}>
                            <TableCell component="th" scope="row">{val.date}</TableCell>
                            <TableCell>{val.customerId}</TableCell>
                            <TableCell align="right">{val.amount}</TableCell>
                          </TableRow>                      
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>      
      </>
    )
  }
  return (
    <TableContainer component={Paper}>
      <Table  aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell/>
            <TableCell>Date</TableCell>
            <TableCell>Confirmed</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Recovered</TableCell>
            <TableCell>Deaths</TableCell>
            <TableCell>Last Updated On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows2.map((row, key) => (
            <Row key={row.date} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TTable


