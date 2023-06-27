// import type { MeasurementSample } from '../../../types/measurement_sample';

import { Measurement } from "../../measurements/measurements.schema";

export abstract class Converter {

  abstract convert_value(input: Measurement): Measurement
  abstract convert_values(input: Measurement[]): Measurement[]

}