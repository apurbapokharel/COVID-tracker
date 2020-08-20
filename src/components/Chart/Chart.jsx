import React, { useState, useEffect } from 'react'
import { fetchDailyData, countryDailyData } from '../../api'
import { Line, Bar } from 'react-chartjs-2'
import styles from './Chart.module.css'
import Table from './Table'
import Table2 from './Table2'

  const Chart = ({ data: {confirmed, deaths, recovered}, country}) => {
    const [dailyData, setDailyData] = useState([])
    const [allNepalData, setAllNepalData] = useState([])
    useEffect(() => {
        const fetchAPI = async() => {
            const initialDailyData = await fetchDailyData()
            setDailyData(initialDailyData);

            const alNepalData  = await countryDailyData()
            setAllNepalData(alNepalData)
        }
        fetchAPI()
    }, [])
    //the empty array ensures that the useEffect behaves like a component did mount and runs only once

    const lineChart = (
        dailyData[0]
        ? (
            <Line
                data={{
                    labels: dailyData.map(({ date }) => date),
                    datasets: [{
                      data: dailyData.map((dataa) => dataa.confirmed),
                      label: 'Infected',
                      borderColor: '#3333ff',
                      fill: true,
                    }, {
                      data: dailyData.map((dataa) => dataa.deaths),
                      label: 'Deaths',
                      borderColor: 'red',
                      backgroundColor: 'rgba(255, 0, 0, 0.5)',
                      fill: true,
                    },
                    ],
                  }}
                />
            ) : null
    )

    const barChart = (
        confirmed
        ? (
            <Bar 
            data={{
                labels: ['Infected', 'Recovered', 'Deaths'],
                datasets: [
                  {
                    label: 'People',
                    backgroundColor: ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
                    data: [confirmed.value, recovered.value, deaths.value],
                  },
                ],
              }}
                options={{
                    legend: {display: false},
                    title: {display: true, text: 'Current state'}
                }}
            />
        ) : null
    )
      
    return (
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          {country ? barChart : lineChart}
        </div>
        <div className={styles.container}>
          <br/>
          {country ==="Nepal" ? <Table2/> : null}
        </div>
      </div> 
    )
}

export default Chart