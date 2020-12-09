<template>
  <div>
    <div class="streetviewcontainer">
      <div id="streetview" ref="streetview"></div>
    </div>
    <div class="right">
      <div class="righttop">
        <div v-if="showActual">
          <template v-if="distanceOff && distanceOff > 1"
            >Close!</template
          >
          <template v-if="distanceOff && distanceOff <= 1 && distanceOff > 0"
            >You got it!</template
          >
          <template v-if="distanceOff && distanceOff > 0">
            You were
            <span class="highlight">{{ distanceOff.toFixed(2) }}km</span> away.
          </template>
        </div>
        <div v-else>Click where you think this is!</div>

        <button v-if="showActual" class="nextbutton" @click="nextLocation">
          Next
        </button>
      </div>
      <Map
        :actualCoords="{ lat, lng }"
        :showActual="showActual"
        :polygon="polygon"
        @showActual="showActual = true"
        @distanceOff="distance => (distanceOff = distance)"
      />
    </div>
  </div>
</template>

<script>
import Map from './Map'
const randomPointsOnPolygon = require('random-points-on-polygon')

export default {
  components: { Map },
  props: {
    polygon: { default: [] },
  },
  data() {
    return {
      lat: null,
      lng: null,
      showActual: false,
      distanceOff: null,
      panoObject: null,
      gk: require('../../gmapsApiKey.json').key,
      geoJsonPolygon: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [this.polygon],
        },
      },
    }
  },
  watch: {
    distanceOff(newDistance) {
      if (newDistance > 0 && newDistance < 1) {
        setTimeout(() => {
          console.log('Winner!!', new Date())
        }, 300)
      }
    },
  },
  created() {
    let mapsAPIScript = document.createElement('script')
    mapsAPIScript.setAttribute(
      'src',
      `https://maps.googleapis.com/maps/api/js?key=${this.gk}&callback=initializeGoogleMapsAPI`,
    )
    window.initializeGoogleMapsAPI = this.nextLocation
    document.head.appendChild(mapsAPIScript)
  },
  methods: {
    getRandomPoint() {
      return randomPointsOnPolygon(1, this.geoJsonPolygon)[0]
    },
    nextLocation() {
      this.showActual = false
      const point = this.getRandomPoint().geometry.coordinates
      const heading = Math.floor(Math.random() * 360)
      console.log(point[1], point[0], heading)
      this.lat = point[1]
      this.lng = point[0]
      // if (!this.panoObject)
      this.panoObject = new google.maps.StreetViewPanorama(
        this.$refs.streetview,
        {
          position: { lat: this.lat, lng: this.lng },
          pov: { heading, pitch: 0 },
          // clickToGo: false,
          showRoadLabels: false,
          zoom: 0,
        },
      )
      // else {
      //   console.log(this.panoObject)
      //   this.panoObject.setPosition({ lat: this.lat, lng: this.lng })
      //   this.panoObject.setPov({ heading, pitch: 0, zoom: 0 })
      // }

      setTimeout(() => {
        if (!this.panoObject.pano) {
          console.log('pano failed!')
          this.nextLocation()
        }
      }, 1500)
    },
  },
}
</script>

<style>
.streetviewcontainer {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  height: 100vh;
  width: 50vw;
}
#streetview {
  height: 100vh;
  width: 50vw;
}

.gm-control-active,
.gm-iv-address,
.gm-style-cc,
.gmnoprint,
#streetview img,
.gmnoscreen {
  display: none;
}

.right {
  height: 100vh;
  position: absolute;
  width: 50vw;
  left: 50%;
  top: 0;
  display: grid;
  grid-template-rows: 80px 1fr;
}

.right .righttop {
  background: floralwhite;
  color: #444;
  position: relative;
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: stretch;
  align-items: center;
  font-size: 1.8rem;
}
.right .righttop > * {
  flex-grow: 1;
}
.highlight {
  color: green;
  font-weight: 600;
}

button {
  height: 100%;
  border: none;
  font-size: 1em;
  padding: 0 30px;
  background: green;
  color: white;
  transition: all 0.2s;
  color: white;
  outline: 0;
}

button:hover {
  background: darkgreen;
  cursor: pointer;
}

button.secondary {
  background: gray;
}
</style>
