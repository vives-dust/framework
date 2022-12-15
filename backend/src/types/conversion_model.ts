import type { ConversionSample } from './conversion_sample';

export interface ConversionModel {
  _id?: string,
  name: string,
  description: string,
  input_unit: string,
  output_unit: string,
  samples: Array<ConversionSample>,
}