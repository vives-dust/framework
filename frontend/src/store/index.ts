import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import axios from 'axios'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const backend = axios.create({
  baseURL: "http://localhost:3030/"
})

Vue.use(Vuex)

interface User {
  name: string;
  email: string;
  id: string;
  accessToken: string;
}

export default new Vuex.Store({
  state: {
    user: null as User | null,
    sensors: [],
    lastValues: {} as {[k: string]: any},
    sensorDetails: {}
  },
  mutations: {
    authenticate(state, data){
      state.user = {
        name: 'foo bar',
        email: data.user.email,
        id: data.user._id,
        accessToken: data.accessToken
      }
    },  
    logout(state) {
      state.user = null
    },
    setSensors(state, data) {
      state.sensors = data
    },
    setSensorLastValues(state, { data, sensorId }) {
      console.log(data, sensorId)
      state.lastValues[(sensorId )] = data
    },
    setSensorDetails(state, data) {
      state.sensorDetails = data
    }
  },
  getters: {
    user: state => {
      return state.user
    },
    lastSensorValues: (state) => (sensorId: string) => {
      return state.lastValues[sensorId]
    },
    sensors: state => {
      return state.sensors
    },
    sensorDetails: state => (sensorId: string) => {
      return state.sensors.find( sensor => {
        return (sensor as any)._id == sensorId
      })
    }
  },
  actions: {
    getSensors ({commit, getters}) {
      axios({
        url: 'http://localhost:3030/sensors',
        headers: {
          'Authorization': `Bearer ${getters.user.accessToken}`
        }
      }).then( response => {
        commit('setSensors', response.data.data)
      })
      .catch( error => console.log(error))
    },
    getLastSensorValue ( {commit, getters}, sensorId) {
      axios({
        url: `http://localhost:3030/measurements/${sensorId}?period=last`,
        headers: {
          authorization: `Bearer ${getters.user.accessToken}`,
        },
      }).then((response) => {
        if(response.data.length !== 0){
          commit('setSensorLastValues',{ data: response.data[0], sensorId });
        }
      });
    },
    getSensorDetails ( {commit, getters}, sensorId) {
      axios({
        url: `http://localhost:3030/sensors/${sensorId}`,
        headers: {
          authorization: `Bearer ${getters.user.accessToken}`,
        },
      }).then((response) => {
        commit('setSensorDetails', { data: response.data, sensorId });
      });
    }
  },
  modules: {
  },
  plugins: [ vuexLocal.plugin ]
})
