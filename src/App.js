import React from 'react';
import './App.css';
import { Cards, Chart, CountryPicker, Table } from './components'
import styles from './App.module.css'
import { fetchData, fetchPastYesterdayData } from './api'
import coronaImage from './image/image.png'

class App extends React.Component {

  state = {
    data: {},
    country: '',
    nepalYesterdayData: {},
    loading: true,
  }

  async componentDidMount() {
    const data  = await fetchData()
    this.setState({ data: data})
    const e = await fetchPastYesterdayData()
    console.log(e)
    console.log(e[0])
    this.setState({ nepalYesterdayData: e[0], loading: false}) 
  }

  handleCountryChange = async (country) => {
    const fetchedData = await fetchData(country)
    this.setState({ data: fetchedData, country: country})
  }
  render(){

    const { data, country, nepalYesterdayData, loading } = this.state
    return (
      <div>
        <div className={styles.container}>
            <img className={styles.image} alt="COVID-19" src={coronaImage}/>
            <Cards data={data} nepalOldData={nepalYesterdayData} country={country}/>
            <CountryPicker handleCountryChange={this.handleCountryChange} loading={loading}/>
            <Chart data={data} country={country} />
        </div>
      </div>
    )
}
}

export default App;
