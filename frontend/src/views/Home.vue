<template>
  <div>
    <login-form />
    <ul>
      <li v-for="sensor in sensors" :key="sensor.id"> <a :href="sensorUrl(sensor)">{{ sensor.name }}</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/LoginForm.vue';

@Component({
  components: {
    LoginForm
  },
})
export default class Home extends Vue {

  mounted() {
    this.$store.dispatch('getSensors')
  }

  get sensors() {
    return this.$store.state.sensors
  }

  sensorUrl(sensor: any) {
    return `/sensor/${sensor._id}`
  }
  
}
</script>
