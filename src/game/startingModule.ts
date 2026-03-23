import { GameEngineType } from "../enums/engine";

export interface StartingModuleDestination {
  module: string;
  waypoint?: string | null;
}

export function getStartingModuleDestination(
  game: GameEngineType,
): StartingModuleDestination {
  switch (game) {
  case GameEngineType.KOTOR:
    return {
      module: 'danm14aa',
      waypoint: null,
    };
  case GameEngineType.TSL:
  default:
    return {
      module: '001EBO',
      waypoint: null,
    };
  }
}
