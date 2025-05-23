import type { ARDUINO_PINS } from "./selectBoard";

export enum MicroControllerType {
  ARDUINO_UNO = "uno",
  ARDUINO_MEGA = "mega",
  ARDUINO_SALEM = "salem"
}

export interface BreadBoardArea {
  holes: number[];
  taken: boolean;
  isDown: boolean;
}

export interface PinConnection {
  /**
   * The connection id for the pin
   */
  id: string;
  /**
   * The hex color to use for the wire
   */
  color: string;


  gnd?: string;

  power?: string;
}

export interface Breadboard {
  areas: BreadBoardArea[];
  order: number[];
}

export interface MicroController {
  digitalPins: string[];
  analonPins: string[];
  serial_baud_rate: number;
  pwmPins: string[];
  pwmNonAnalogPins: string[];
  sdaPins: string[];
  sclPins: string[];
  mosiPins: string[];
  misoPins: string[];
  sckPins: string[];
  ssPins: string[];
  type: string;
  breadboard?: Breadboard;
  skipHoles: number[];
  pinConnections: { [key: string]: PinConnection };
  bluetooth: string[];
  digitalDisplay: string[];
  lcdScreen: string[];
  ledMatrix: string[];
  servo: string[];
  stepperMotor: string[];
  writePin: string;
}

export interface MicroControllerBlocks {
  digitalPins: [string, string][];
  analogPins: [string, string][];
  serial_baud_rate: number;
  pwmPins: [string, string][];
  pwmNonAnalogPins: [string, string][];
  sdaPins: [string, string][];
  sclPins: [string, string][];
  mosiPins: [string, string][];
  misoPins: [string, string][];
  sckPins: [string, string][];
  ssPins: [string, string][];
  type: MicroControllerType;
}
