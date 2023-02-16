import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import axios from 'axios'
import { useState } from 'react'
import {BsSearch} from "react-icons/bs"
import {AiFillHeart, AiOutlineCloud} from 'react-icons/ai'
import { AiOutlineHeart } from 'react-icons/ai'
import {WiDaySunny, WiSnow, WiRain, WiThunderstorm} from 'react-icons/wi'
 
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [city, setCity] = useState("lausanne");
  const [weather, setWeather] = useState({});
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
  const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Sep", "Aug", "Oct", "Nov", "Dec"]

  const today = new Date();
  let formatedDate = `${today.getHours()}:${today.getMinutes()} - ${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} '${(today.getFullYear())}`


  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
  
  const fetchWeather = (e) => {
    let input = document.getElementById('search-input').value

    if (input){
      e.preventDefault()
      setLoading(true)

    
      axios.get(url).then((response) => {
        setWeather(response.data)
        console.log(response.data)
      }).catch(err => {
        
      })

      setCity('')
      setLoading(false)
      document.getElementById('search-input').value = ""
    }
    
  }

  const renderWeather = (weather) => {
    switch(weather) {
      case "Clear":
        return <WiDaySunny />
      case "Clouds":
        return <AiOutlineCloud />
      case "Snow":
        return <WiSnow />
      case "Rain":
        return <WiRain />
      case "Drizzle": 
        return <WiRain />
      case "Thunderstorm":
        return <WiThunderstorm />
    }
  }

  function classNames(...args) {
    return args.filter(Boolean).join(' ')
  }

  const addFavorite = () => {
    setFavoritesList([
      ...favoritesList,
      {name:weather.name, temp:(weather.main.temp).toFixed(0), weath:weather.weather[0].main}
    ]);
  }

  const removeFavorite = () => {
    setFavoritesList((current) =>
      current.filter((favorite) => favorite.name !== weather.name)
    );
  }


  const checkInDict = () => {
    try {
      for (var i = 0; i < favoritesList.length; i++) {
        if (favoritesList[i].name === weather.name) {
          return true
        }
      }
      return false
    } catch (err) {
      return false
    }
    
  }

  return (
    <>
      <Head>
        <title>Weather Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className='card'>

        <div className='left-side'>
          <div className='left-top-container'>
            <p>weather.io</p>
          </div>
          <div className='left-bottom-container'>
            { Object.keys(weather).length === 0 ? "" : (<span className='temperature'>{(weather.main.temp).toFixed(0)}°</span>)}
            <div className='vertical-container second-block'>
            { Object.keys(weather).length === 0 ? "Search for a city" : (<span className='medium'>{weather.name}</span>)}
            { Object.keys(weather).length === 0 ? "" : (<span className='small'>{formatedDate}</span>)}
              
            </div>
            <div className='vertical-container third-block'>
              
              { Object.keys(weather).length === 0 ? "" : (<span className='weather-icon'>{renderWeather(weather.weather[0].main)}</span>) }
              <span className='small'>{Object.keys(weather).length === 0 ? "" : weather.weather[0].main}</span>

            </div>
          </div>
          {checkInDict() ? 
            <div className='favorite-button' onClick={removeFavorite}>
              <AiFillHeart/>
            </div>
          : 
            <div className='favorite-button' onClick={addFavorite}>
              <AiOutlineHeart/>
            </div>
          }
        </div>

        <div className='right-side'>
          <div className='right-container'>
            <form>
              <div>
                <input id="search-input" onChange={(e) => setCity(e.target.value)} className="search-input" type="text" placeholder='Search city' />
              </div>
              <button className='search-button' onClick={fetchWeather}><BsSearch /></button>
            </form>

            <div className='tiles-section'>

              {favoritesList.map((favorite) => (
                <div className={classNames('tile', weather.name === favorite.name && 'selected-tile')}>
                  <span className="tile-city">{favorite.name}</span>
                  <span className='tile-weather'>{renderWeather(favorite.weath)}</span>
                  <span className='tile-temp'>{favorite.temp}°</span>
                </div>
              ))}

            </div>



            <div className='line' ></div>

            <div className='details-title'>Weather Details</div>
            <div className='details-container'>
              <span className='details-legend'>Cloudy</span>
              { Object.keys(weather).length === 0 ? "" : (<span className='details-value'>{weather.clouds.all}%</span>)}
              
            </div>
            <div className='details-container'>
              <span className='details-legend'>Humidity</span>
              { Object.keys(weather).length === 0 ? "" : (<span className='details-value'>{weather.main.humidity}%</span>)}
            </div>
            <div className='details-container'>
              <span className='details-legend'>Wind</span>
              { Object.keys(weather).length === 0 ? "" : (<span className='details-value'>{(weather.wind.speed).toFixed(0)} km/h</span>)}
            </div>

            <div className='line' ></div>

            <div className='details-title'>Weather Details</div>
            <div className='details-container'>
              <span className='details-legend'>Cloudy</span>
              <span className='details-value'>86%</span>
            </div>
            <div className='details-container'>
              <span className='details-legend'>Humidity</span>
              <span className='details-value'>62%</span>
            </div>
            <div className='details-container'>
              <span className='details-legend'>Wind</span>
              <span className='details-value'>8km/h</span>
            </div>

          </div>





        </div>

      </div>

    </>
  )
}
