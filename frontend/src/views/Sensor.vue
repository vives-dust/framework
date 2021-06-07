<template>
  <div class="sensor">
    <v-container>
      <!-- <v-tabs v-model="tab" align-with-title> -->
      <!-- <v-tabs align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs> -->
      <h2 class="text-center ma-5"> {{ sensor.name }}</h2>

      <div v-if="values">
        <div class="text-h1 font-weight-bold text-center ma-10" >
            {{ values.temperature }}°
        </div>


        <div class="below ma-3">
            <v-icon class="rounded-circle pa-4 mr-5" style="border: 1px solid white;">mdi-water</v-icon>
            <span class="text-h5">{{ values.humidity }} %</span>
        </div>
        <div class="below ma-3">
            <v-icon class="rounded-circle pa-4 mr-5" style="border: 1px solid white;">mdi-weather-windy</v-icon>
            <span class="text-h5">{{ values.pressure }} hPa</span>
        </div>
        <div class="timestamp ma-3">
            <v-icon class="rounded-circle pa-4 mr-5" style="border: 1px solid white;">mdi-network-strength-3</v-icon>
            <span class="text-h5">{{ values.rssi }} dBm</span>
        </div>
        <div class="timestamp ma-3 mt-10 text-right">
            <span class="text-h6 text--disabled ">{{ timestamp }}</span>
        </div>
      </div>
      <div v-else class="text-center pa-15" >
      <v-progress-circular
        indeterminate
        color="primary"
        ></v-progress-circular>
      </div>

    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";

@Component({
  components: {},
})
export default class Sensor extends Vue {
  sensorId = this.$route.params.id;
  items = ["one", "two", "three"];

  mounted() {
    this.$store.dispatch('getSensorDetails', this.sensorId)
    this.$store.dispatch('getLastSensorValue', this.sensorId)
  }

  get sensor() {
      return this.$store.getters.sensorDetails(this.sensorId);
  }

  get values() {
      return this.$store.getters.lastSensorValues(this.sensorId);
  }

  get timestamp() {
      if(this.values) {
        return moment(this.values.time).fromNow();
      } else {
          return ''
      }
  }
}
</script>

<style lang="css">
body {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/img/background.jpeg");
  background-size: cover;
  background-position: 50%, 50%;
}

.theme--dark.v-application {
  background-color: transparent;
}

</style>
