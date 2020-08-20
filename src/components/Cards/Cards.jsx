import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Grid, StylesProvider } from '@material-ui/core'
import styles from './Cards.module.css'
import { lastUpdateTime, fetchDailyData } from '../../api'
import CountUp from 'react-countup'
import cx from 'classnames'

const Cards = ({ data:  { confirmed, recovered, deaths, lastUpdate } , nepalOldData, country}) => {
    const [diffMin, setDiffMin] = useState(0)
    const [diffHr, setDiffHr] = useState(0)
    const [yesterdayGlobalData, setOldGlobalData] = useState(0)

    useEffect(() => {
        const fetchAPI = async() => {
            const timeDiff = await lastUpdateTime()
            setDiffHr(timeDiff.hr)
            setDiffMin(timeDiff.min)
            const initialDailyData = await fetchDailyData()
            var d = new Date()
            var defaultDate = d - 1000 * 60 * 60 * 24 * 2
            defaultDate = new Date(defaultDate)
            var ndate = defaultDate.toLocaleDateString()
            var datearray = ndate.split("/")
            if(datearray[0] < 10){
                datearray[0] ='0' + datearray[0] 
            }
            if(datearray[1] < 10){
                datearray[1] ='0' + datearray[1] 
            }
            var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
            var yesterdayDate = newdate.split("/").reverse().join("-");
            console.log('yesterday date',yesterdayDate )
            var yesterdayGlobalData = initialDailyData.find(x => x.date === yesterdayDate)
            setOldGlobalData(yesterdayGlobalData)
        }
        fetchAPI()       
    }, [])

    if(!confirmed){
        return 'Loading....'
    }

    return (
        <div className={styles.container}>

    <p>
        Last updated on {new Date(lastUpdate).toDateString()} at {new Date(lastUpdate).toLocaleTimeString()} 
        ({diffHr !== 0 ? diffHr: null } {diffHr !== 0 ?  <span> hour </span> : null }{diffMin} minutes ago) 
    </p>
            <Grid container spacing={3} justify="center" className={styles.grid}>
                <Grid item component={Card} xs={12} md={3 }className={cx(styles.card, styles.infected)}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>Infected</Typography>
                        <Typography variant="h5">
                            <CountUp start={0} end={confirmed.value} duration={1} separator=","/>
                        </Typography>
                        {country === "Nepal" 
                        ?
                            <Typography color="textSecondary">+{confirmed.value - nepalOldData.confirmed} people since past yesterday</Typography>
                        : 
                        null}
                        {country === ""
                        ? 
                        <Typography color="textSecondary">+{confirmed.value - yesterdayGlobalData.confirmed} people since past yesterday</Typography>
                        : 
                        null}
                    </CardContent>
                </Grid>

                <Grid item component={Card} xs={12} md={3 }className={cx(styles.card, styles.recovered)}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>Recovered</Typography>
                        <Typography variant="h5">
                            <CountUp start={0} end={recovered.value} duration={1} separator=","/>
                        </Typography>
                        {country === "Nepal" 
                        ?
                            <Typography color="textSecondary">+{recovered.value - nepalOldData.recovered} people since yesterday</Typography>
                        : 
                        null}
                    </CardContent>
                </Grid>

                <Grid item component={Card} xs={12} md={3 }className={cx(styles.card, styles.deaths)}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>Deaths</Typography>
                        <Typography variant="h5">
                            <CountUp start={0} end={deaths.value} duration={1} separator=","/>
                        </Typography>    
                        {country === "Nepal" 
                        ?
                            <Typography color="textSecondary">+{deaths.value - nepalOldData.deaths} people since past yesterday</Typography>
                        : 
                        null}
                        {country === ""
                        ? 
                        <Typography color="textSecondary">+{deaths.value - yesterdayGlobalData.deaths} people since past yesterday</Typography>
                        : 
                        null}                    
                    </CardContent>
                </Grid>
            </Grid>         
        </div>
    )
}

export default Cards