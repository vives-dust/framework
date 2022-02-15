import { SoilModelMoistureSample, SoilModelData } from './soilmodels.class';
import { SensorData } from '../sensors/sensors.class';

export const ModelMapper = {

  map_single_moisture_value_to_model(rawValue: number, model: SoilModelData): number {
    // Sorting the model based on the distance from the rawValue.
    // Much cleaner approach than having to search for lower and upper value take extremities into consideration
    // Can't see impact of sorting to be much greater then couple of loop structures. At least not if model samples are relatively low.
    
    if (model.samples.length < 2) throw new Error('Soil Model should have at least 2 samples');

    model.samples.sort((a : SoilModelMoistureSample, b : SoilModelMoistureSample) => (Math.abs(a.raw - rawValue) - Math.abs(b.raw - rawValue)));
    const first = model.samples[0]; 
    const second = model.samples[1];

    // Linear interpolation
    const moisture = (((second.moisture - first.moisture) / (second.raw - first.raw)) * (rawValue - second.raw) + second.moisture);
    return (Math.round((moisture + Number.EPSILON) * 100) / 100);
  },

  map_moisture_values_to_model(sensordata: SensorData[], model: SoilModelData) {
    sensordata.filter(sd => sd.type === 'moisture').forEach(
      m => m.value = this.map_single_moisture_value_to_model(m.value, model)
    );
  }

};