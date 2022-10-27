// getting places from APIs
//var a ;
function loadPlaces() {
    const params = {
        method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'fsq3inu1DSxaT3PlOa4b4+0wwomoDd7FuDMKuGDmJAmkK2Y='
          }
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `https://api.foursquare.com/v3/places/search?ll=26.2774271%2C50.1935569&radius=300&limit=30`;
    
    console.log(endpoint)
    
    return fetch(endpoint, params)
        .then((res) => {
            return res.json()
                .then((resp) => {
                //a = resp;
                return resp.results;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
    
    
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {
//        console.log("bbb"+position.coords);
        // than use it to load from remote APIs some places nearby
        loadPlaces()
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;
                    
                    // add place name
                    const placeText = document.createElement('a-link');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', place.name);
                    placeText.setAttribute('scale', '15 15 15');
                    
                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
