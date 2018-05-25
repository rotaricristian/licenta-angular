export interface Prosumer {
  name: string;
  homeAddress: string;
  cnp: string;
  baselineConsumption: Array<number>;
}

export interface Value {
  value: number;
  generalIndex: number;
  cnp: string;
}

export interface ValueResponse {
  index: number;
  idealValue: number;
  realValue: number;
  deviationOccurred: boolean;
}
