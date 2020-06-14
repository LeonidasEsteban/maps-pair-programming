const $map = document.getElementById('map');
const $controls = document.getElementById('controls');
const EUROPE_CENTER = {lat: 47.582798, lng: 9.707756};

const {ScatterplotLayer, GoogleMapsOverlay} = deck;

let GMAP , DECKGL_OVERLAY;

async function updateMap() {
  const $activeElement = document.querySelector(".is-active");
  if ($activeElement) {
    $activeElement.classList.remove('is-active')
  }
  this.classList.add('is-active')
  let country = this.textContent.replace(/ /g,'').toLowerCase();
  let layer = await getLayer(country);
  DECKGL_OVERLAY.setProps({layers: [layer]});
}

async function getLayer(country = 'austria'){
    const request_country =  await fetch(`./data/${country}.json`);
    const data_country = await request_country.json();

    return await new ScatterplotLayer({
        id : 'trees',
        data: data_country,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: d=> [d.lng, d.lat],
        getRadius : d => 50,
        getFillColor: d=> [0,155,115],
        getLineColor: d=> [30,30,30]
    });
}

function renderButtonElement(country) {
  const element = document.createElement('button')
  element.textContent = country
  element.addEventListener('click', updateMap)
  $controls.appendChild(element)
}
async function renderButtons() {
  const response = await fetch(`./catalogs/countries.json`)
  const countries = await response.json()
  countries.forEach(renderButtonElement);
}

async function initMap(){
    GMAP = new google.maps.Map($map , {
        zoom : 4,
        center: EUROPE_CENTER
    });

    DECKGL_OVERLAY = new GoogleMapsOverlay();
    DECKGL_OVERLAY.setMap(GMAP);
    DECKGL_OVERLAY.setProps({ layers: [ await getLayer()] })
    renderButtons()
}

google.maps.event.addDomListener(window,'load', initMap);