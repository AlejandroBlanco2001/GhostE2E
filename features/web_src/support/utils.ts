import fs from 'fs';
import { VERSION } from '../../../shared/config';

export interface ScenarioInformation {
  name: string,
  path: string,
  step: number,
  report: string,
}

export function getCurrentScenario(): ScenarioInformation {
  let args = process.argv
  // Feature file path is number 6 and the json reoprt is number 5
  return {
    name: args[6]?.match(/features\/(?<name>.*)\.feature/)?.groups?.name!,
    path: args[6]!,
    step: 0,
    report: args[5]?.split(':', 2)[1]!
  }
}