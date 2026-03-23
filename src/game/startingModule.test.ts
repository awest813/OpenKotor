import { GameEngineType } from "../enums/engine";
import { getStartingModuleDestination } from "./startingModule";

describe('getStartingModuleDestination', () => {
  it('starts KotOR new games in the Dantooine enclave flow', () => {
    expect(getStartingModuleDestination(GameEngineType.KOTOR)).toEqual({
      module: 'danm14aa',
      waypoint: null,
    });
  });

  it('keeps TSL new games on the Peragus intro module', () => {
    expect(getStartingModuleDestination(GameEngineType.TSL)).toEqual({
      module: '001EBO',
      waypoint: null,
    });
  });
});
