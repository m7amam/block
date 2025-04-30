import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  AfterComponentCreateHook,
  CreateWire,
} from "../../core/virtual-circuit/svg-create";

import { findSvgElement } from "../../core/virtual-circuit/svg-helpers";
import type { Svg, Text, Element } from "@svgdotjs/svg.js";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type { ServoState } from "./state";
import {
  createComponentWire, createFromArduinoToComponent,
  createGroundOrPowerWire, createGroundOrPowerWireArduino,
} from "../../core/virtual-circuit/wire";
import {ARDUINO_PINS} from "../../core/microcontroller/selectBoard";

export const servoReset: ResetComponent = (servoEl) => {
  setDegrees(servoEl, 0);
  setText(servoEl, 0);
};

export const servoUpdate: SyncComponent = (state: ServoState, servoEl) => {
  setDegrees(servoEl, state.degree);

  setText(servoEl, state.degree);
};

export const servoCreate: AfterComponentCreateHook<ServoState> = (
  state,
  servoEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  setServoPinText(servoEl, state);
};

export const servoPosition: PositionComponent<ServoState> = (
  state,
  servoEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  if(area) {
    const {holes, isDown} = area;
    positionComponent(servoEl, arduinoEl, draw, holes[2], isDown, "PIN_POWER");
  } else {
    positionComponent(
        servoEl,
        arduinoEl,
        draw,
        "PIN_GND"
    );
  }
};

const setServoPinText = (servoEl: Element, servoState: ServoState) => {
  const servoName = servoEl.findOne("#servo_pin") as Text;
  servoName.node.textContent = servoState.pins[0].toString();
};

const setText = (servoEl: Element, degrees: number) => {
  const degreeText = servoEl.findOne("#degrees") as Text;

  degreeText.node.textContent = `${degrees.toFixed(1)}˚`;
  degreeText.cx(40);
};

const setDegrees = (servoEl: Element, degrees: number) => {
  // TODO FIX DEGREES
  const servoBoundBox = findSvgElement("CenterOfCicle", servoEl).bbox();
  const movingPart = findSvgElement("moving_part", servoEl);
  const currentDegrees = movingPart.transform().rotate;
  movingPart.rotate(-currentDegrees, servoBoundBox.x, servoBoundBox.y);
  movingPart.rotate(-1 * (degrees + 4), servoBoundBox.cx, servoBoundBox.cy);
};

export const createWiresServo: CreateWire<ServoState> = (
  state,
  draw,
  servoEl,
  arduino,
  id,
  board,
  area
) => {
  const pin = state.pins[0];
  if(area) {
    const {holes, isDown} = area;


    createGroundOrPowerWire(
        holes[0],
        isDown,
        servoEl,
        draw,
        arduino,
        id,
        "ground"
    );
    createGroundOrPowerWire(
        holes[1],
        isDown,
        servoEl,
        draw,
        arduino,
        id,
        "power"
    );

    createComponentWire(
        holes[3],
        isDown,
        servoEl,
        pin,
        draw,
        arduino,
        id,
        "PIN_DATA",
        board
    );
  } else {
    createFromArduinoToComponent(draw, arduino as Svg, pin, servoEl, "PIN_DATA", board );
    createGroundOrPowerWireArduino(draw, arduino as Svg, board.servo[0] as ARDUINO_PINS, servoEl, board, "ground")
    createGroundOrPowerWireArduino(draw, arduino as Svg, board.servo[1] as ARDUINO_PINS, servoEl, board, "power")
  }
};
