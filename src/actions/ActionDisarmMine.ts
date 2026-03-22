import { GameState } from "../GameState";
import { ModuleTriggerType } from "../enums";
import { ActionParameterType } from "../enums/actions/ActionParameterType";
import { ActionStatus } from "../enums/actions/ActionStatus";
import { ActionType } from "../enums/actions/ActionType";
import { ModuleObjectType } from "../enums/module/ModuleObjectType";
import { SkillType } from "../enums/nwscript/SkillType";
import { ResourceLoader } from "../loaders/ResourceLoader";
import type { ModuleCreature } from "../module/ModuleCreature";
import type { ModuleObject } from "../module/ModuleObject";
import type { ModuleTrigger } from "../module/ModuleTrigger";
import { GFFObject } from "../resource/GFFObject";
import { ResourceTypes } from "../resource/ResourceTypes";
import { BitWise } from "../utility/BitWise";
import { Dice } from "../utility/Dice";
import { DiceType } from "../enums/utility/DiceType";
import { Utility } from "../utility/Utility";
import { Action } from "./Action";

/**
 * ActionDisarmMine class.
 * 
 * KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
 * 
 * @file ActionDisarmMine.ts
 * @author KobaltBlu <https://github.com/KobaltBlu>
 * @license {@link https://www.gnu.org/licenses/gpl-3.0.txt|GPLv3}
 */

export class ActionDisarmMine extends Action {

  constructor( actionId: number = -1, groupId: number = -1 ){
    super(actionId, groupId);
    this.type = ActionType.ActionDisarmMine;

    //PARAMS - unknown
    //0 - DWORD: oTarget
  }

  update(delta?: number): ActionStatus {

    this.target = this.getParameter<ModuleObject>(0);
    if(!this.target){
      return ActionStatus.FAILED;
    }

    if(BitWise.InstanceOfObject(this.owner, ModuleObjectType.ModuleCreature)){
      let distance = Utility.Distance2D(this.owner.position, this.target.position);
            
      if(distance > 3){
        // this.owner.openSpot = undefined;
        let actionMoveToTarget = new GameState.ActionFactory.ActionMoveToPoint();
        actionMoveToTarget.setParameter(0, ActionParameterType.FLOAT, this.target.position.x);
        actionMoveToTarget.setParameter(1, ActionParameterType.FLOAT, this.target.position.y);
        actionMoveToTarget.setParameter(2, ActionParameterType.FLOAT, this.target.position.z);
        actionMoveToTarget.setParameter(3, ActionParameterType.DWORD, (this.target.area ?? GameState.module?.area)?.id ?? 0);
        actionMoveToTarget.setParameter(4, ActionParameterType.DWORD, this.target.id);
        actionMoveToTarget.setParameter(5, ActionParameterType.INT, 1);
        actionMoveToTarget.setParameter(6, ActionParameterType.FLOAT, 3 );
        actionMoveToTarget.setParameter(7, ActionParameterType.INT, 0);
        actionMoveToTarget.setParameter(8, ActionParameterType.FLOAT, 30.0);
        this.owner.actionQueue.addFront(actionMoveToTarget);

        return ActionStatus.IN_PROGRESS;
      }

      if(BitWise.InstanceOfObject(this.target, ModuleObjectType.ModuleTrigger)){
        const trap: ModuleTrigger = this.target as any;
        if(trap.type != ModuleTriggerType.TRAP){
          return ActionStatus.FAILED;
        }

        //disarm skill check: demolitions vs trap's disarm DC
        const trapRow = GameState.TwoDAManager.datatables.get('traps')?.rows[trap.trapType];
        const disarmDC = trapRow ? parseInt(trapRow.disarm_dc ?? '15') : 15;
        const creature = this.owner as ModuleCreature;
        const demolitionsModifier = creature.getSkillModifier(SkillType.DEMOLITIONS);
        const d20Roll = Dice.roll(1, DiceType.d20);
        if(d20Roll + demolitionsModifier < disarmDC){
          return ActionStatus.FAILED;
        }

        trap.destroy();
      }

      return ActionStatus.COMPLETE;
    }
    
    return ActionStatus.FAILED;
  }

}