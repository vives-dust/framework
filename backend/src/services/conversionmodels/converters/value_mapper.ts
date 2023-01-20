import { Converter } from './converter';
import type { MeasurementSample } from '../../../types/measurement_sample'
import type { ConversionSample } from '../../../types/conversion_sample';

export class ValueMapper extends Converter {

  samples: Array<ConversionSample>;

  constructor(modelSamples: Array<ConversionSample> ) {
    super();
    this.samples = modelSamples;
  }

  convert_single(input: MeasurementSample): MeasurementSample {
    // Sorting the model based on the distance from the input value.
    // Much cleaner approach than having to search for lower and upper value while taking extremities into consideration
    // Can't see impact of sorting to be much greater then couple of loop structures. At least not if model samples are relatively low.
    
    if (this.samples.length < 2) throw new Error('Soil Model should have at least 2 samples');

    this.samples.sort(
      (a : ConversionSample, b : ConversionSample) => (
        Math.abs(a.input_value - input.value) - Math.abs(b.input_value - input.value)
      )
    );
    const first = this.samples[0]; 
    const second = this.samples[1];

    // Linear interpolation
    const moisture = (((second.output_value - first.output_value) / (second.input_value - first.input_value)) * (input.value - second.input_value) + second.output_value);
    
    return {
      value: (Math.round((moisture + Number.EPSILON) * 100) / 100),
      time: input.time
    }
  }

  convert_values(input: MeasurementSample[]): MeasurementSample[] {
    const output = input.map(s => s = this.convert_single(s));
    return output;
  }

}
