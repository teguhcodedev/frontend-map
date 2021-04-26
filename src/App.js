import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import axios from "axios"
import "./app.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { API_URL } from "./config/api";
import { PIN_URL } from "./config/prod";

function App() {
  const myLocalStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myLocalStorage.getItem("user") ||null);
  const [pins, setPins] = useState([])
  const [newPlace, setNewPlace] = useState([])
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentPlaceId, setCurrentPlaceId] = useState(null)

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: -6.32674,
    longitude: 106.730042,
    zoom: 9
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(PIN_URL)
        setPins(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPins()
  }, []);

  const handleMarkerClick = async (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = async (e) => {
    const [lang, lat] = e.lngLat;
    await setNewPlace({
      lat,
      lang
    })
    console.log(e)
    console.log("long", lang)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = JSON.stringify({
      username: currentUser,
      title,
      desc,
      rating: parseInt(rating),
      lat: newPlace.lat,
      lang: newPlace.lang
    })

    console.log('dbbaru', newPin)

    try {
      const res = await axios.post(PIN_URL, newPin, { headers: { "Content-Type": "application/json" } })
      setPins([...pins, res.data]);
      setNewPlace([])
    } catch (error) {
      console.log(error)
    }
  }
  console.log(currentUser, 'user llogin')
   
console.log('storga',myLocalStorage.user)

const handleLogout =()=>{
  myLocalStorage.removeItem('user');
  setCurrentUser(null)
}

const _showingLogin=()=>{
  setShowLogin(true)
  setShowRegister(false)
}

const _showingRegister=()=>{
  setShowLogin(false)
  setShowRegister(true)
}

  return (
    <div>

      <ReactMapGL
        {...viewport}
        onDblClick={handleAddClick}
        mapboxApiAccessToken="pk.eyJ1IjoidGVndWhhcmlzMjEiLCJhIjoiY2tudGZmaGc4MDFxeTJ2cmsyaDRtcnA2cSJ9.-1iC_oO6SGfM8RMLBxISWw"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/teguharis21/ckntgd3pr00ll17mkgb9by3oq"
        transitionDuration="200"

      >
        {pins.map(p => (
          <>
            <Marker
              key={p._id}
              latitude={p.lat}
              longitude={p.lang}
              offseLeft={-viewport.zoom * 7}
              offsetTop={-viewport.zoom * 7}>
              <Room
                style={{
                  fontSize: viewport.zoom * 3.8,
                  cursor: 'pointer',
                  color: p.username === currentUser ? "tomato" : "#03AC0E"
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.lang)}
              />
            </Marker>
            {
              p._id === currentPlaceId && <Popup
                latitude={p.lat}
                longitude={p.lang}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="bottom"
                style={{ top: '-20px', right: '-55px', zIndex: '999' }}
              >
                <div className="card">
                  <label style={{ marginRight: '33px' }}>Judul</label>
                  <h4 className="place">{p.title}</h4>
                  <label className="review">Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                    {/* {Array(p.rating).fill(<Star className="star" />)} */}
                  </div>
                  <label>Information</label>
                  <div className="username">Created By <b>{p.username}</b></div>
                  <span className="date">{p.createdAt}</span>
                </div>
              </Popup>

            }
          </>
        ))}


        {newPlace.length !== 0 && (<Popup
          latitude={newPlace.lat}
          longitude={newPlace.lang}
          closeButton={true}
          closeOnClick={false}
          anchor="bottom"
          onClose={() => setNewPlace([])}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Judul</label>
              <input
                onChange={(e) => setTitle(e.target.value)}

                placeholder="masukan judul"
              />
              <label>Deskripsi</label>
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                placeholder="katakan sesuatu mengenail tempat ini" />
              <label>Rating</label>
              <select
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit" >
                Kirim
                </button>
            </form>
          </div>

        </Popup>)}
        {currentUser ? (<>
        <div>{currentUser}</div>
        <button onClick={handleLogout} className="button logout">Logout</button>
        </>) : (<div className="buttons">
          <button className="button login" onClick={_showingLogin}>Login</button>
          <button className="button register" onClick={_showingRegister}>Register</button>

        </div>)}
        {showRegister && <Register setShowLogin={setShowLogin} setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
        setCurrentUser={setCurrentUser}
         myStorage={myLocalStorage} />}

      </ReactMapGL>
    </div >
  );
}

export default App;
