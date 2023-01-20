import type { MeasurementSample } from '../../../types/measurement_sample';

export abstract class Converter {

  abstract convert_single(input: MeasurementSample): MeasurementSample
  abstract convert_values(input: MeasurementSample[]): MeasurementSample[]

}