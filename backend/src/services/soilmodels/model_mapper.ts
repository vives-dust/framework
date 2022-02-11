import { SoilModelMoistureSample, SoilModelData } from './soilmodels.class';
import { MeasurementDataArray } from '../measurements/measurements.class';

export const ModelMapper = {

  map_single_value_to_model(rawValue: number, model: SoilModelData): number {
    // Sorting the model based on the distance from the rawValue.
    // Much cleaner approach than having to search for lower and upper value take extremities into consideration
    // Can't see impact of sorting to be much greater then couple of loop structures. At least not if model samples are relatively low.
    
    if (model.samples.length < 2) throw new Error('Soil Model should have at least 2 samples');

    model.samples.sort((a : SoilModelMoistureSample, b : SoilModelMoistureSample) => (Math.abs(a.raw - rawValue) - Math.abs(b.raw - rawValue)));
    const first = model.samples[0]; 
    const second = model.samples[1];

    // Linear interpolation
    return ((second.moisture - first.moisture) / (second.raw - first.raw)) * (rawValue - second.raw) + second.moisture;
  },

  map_raw_values_to_model(measurements: MeasurementDataArray, model: SoilModelData) {
    return measurements.forEach(m => {
      m.level_1.moisture = this.map_single_value_to_model(m.level_1.raw, model);
      m.level_2.moisture = this.map_single_value_to_model(m.level_2.raw, model);
      m.level_3.moisture = this.map_single_value_to_model(m.level_3.raw, model);
      m.level_4.moisture = this.map_single_value_to_model(m.level_4.raw, model);
    });
  }

};