import axios from 'axios'

const url  = "https://covid19.mathdro.id/api"

export const fetchData = async (country) => {
  let changeableUrl = url

  if (country) {
    changeableUrl = `${url}/countries/${country}`
  }
  try {
    const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(changeableUrl)
    return { confirmed, recovered, deaths, lastUpdate }
  } catch (error) {
    return error
  }
}

export const fetchDailyData = async () => {
    try {
      const { data } = await axios.get(`${url}/daily`);
  
      return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }))
    } catch (error) {
      return error
    }
}

export const fetchCountries = async () => {
    try {
      const { data: { countries } } = await axios.get(`${url}/countries`);
     
      return countries.map((country) => country.name)
    } catch (error) {
      return error
    }
  }

  export const lastUpdateTime = async () => {
    const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(url)
    function diff_hours(dt2, dt1) {
        var diff =(dt2 - dt1) / 1000;
        diff /= (60 * 60);
        if(isInt(diff)){
          var hr = Math.abs(Math.round(diff));
          var min = 0
          return {hr,min}
        }
        else{
          var hr = Math.floor(Math.abs(diff))
          var min = (hr - Math.abs(diff)) * 60
          min = Math.floor(Math.abs(min))
          return {hr, min}
        } 
      }

    function isInt(n) {
        return n % 1 === 0;
      }
      var currenttime = new Date()
      var dt1 = currenttime.getTime()
      var dt2 = new Date(lastUpdate).getTime()
      const  data = diff_hours(dt1,dt2)
      return data
  }

  //1.a problem i am facing is i want to be able to fetch only nepal data from each data but i am unable to so
  //i am fetching all data and then filtering and pushing only the nepal data to string array
  //2.i wanna be able to destructure the nepal ko data further so i have what i need from the getgo
  //3. in below compromisde solution i am unable to destructure as then i cant use data.find as data becomes unavailable after destructuring
  export const countryDailyData = async () => {
    const date1 = new Date('2020-07-27')
    const date2 = new Date()
    console.log('date2 is', date2)
    const dataa= []
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    for(var i=1; i< diffDays; i++){
      var defaultdate = date2 - 1000*60*60*24*i
      defaultdate= new Date(defaultdate).toLocaleDateString()
      var d = defaultdate.split("/").join("-")
      const {data}= await axios.get(`${url}/daily/${d}`)
      dataa.push(data.find(x => x.countryRegion==="Nepal"))
    }
    return dataa
}

export const fetchPastYesterdayData = async () => {
    const date2 = new Date()
    const dataa= []
    var defaultdate = date2 - 1000*60*60*24*2
    defaultdate= new Date(defaultdate).toLocaleDateString()
    var d = defaultdate.split("/").join("-")
    const {data}= await axios.get(`${url}/daily/${d}`)
    dataa.push(data.find(x => x.countryRegion==="Nepal"))
  return dataa
}
