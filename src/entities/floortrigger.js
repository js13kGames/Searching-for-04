import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js"
class FloorTrigger extends Sprite{
    constructor(x,y,z,gl,triggerId) {
        super("floortrigger",x,y-0.98,z,LevelRender.floorTriggerNoActive,gl,0,triggerId);
        if (triggerId == 197) this.setColor([0.5,0.5,0.6,1]);
        else this.setColor([0.8,0.6,0.3,1]);
        this.mesh.setRotationX(-90);
        this.counter = 0;
        this.somethingTriggering = false;
        this.untriggerCounter = 0;
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.untriggerCounter += deltatime;
        if (!this.somethingTriggering && this.triggered){
            this.triggered = false;
            this.frameChanged = true;
            this.texture = LevelRender.floorTriggerNoActive;
            level.untrigger(this.triggerId, this);
        }
        if (this.untriggerCounter > 0.1){
            this.somethingTriggering = false;
        }
    }

    collidedBy(entity, level){
        if (entity.n == "bat" || entity.n == "projectile" || entity.n == "particle") return;
        if (this.triggerId == 197 && entity.n != "box") return;
        let d = this.distanceToOtherEntity(entity);
        if (d < 0.8){
            this.somethingTriggering = true;
            this.untriggerCounter = 0;
            if(!this.triggered){
                level.trigger(this.triggerId,this);
                this.frameChanged = true;
                this.texture = LevelRender.floorTriggerActive;
                this.triggered = true;
            }
        }
    }
}

export default FloorTrigger;