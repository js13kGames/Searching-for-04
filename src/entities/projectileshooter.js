import Sprite from "./sprite.js";
import LevelRender from "../level/levelrender.js";
import Projectile from "./projectile.js";
import Tiles from "../tiles/tiles.js";

//An entity attched to the wall shooting particles.
class ProjectileShooter extends Sprite{
    constructor(x,y,z,level,triggerId){
        super("", x,y+0.3,z,LevelRender.floorTriggerActive,level.gl,0, triggerId);
        this.counter = 3.5;
        this.triggered = false;
        this.initialized = false;
        this.mesh.setS(0.2);
        //static shoot interval unless triggerId is 192
        this.delay = this.triggerId==192?(1+this.getRand()):3.5;
    }

    setDirectionAndRotation(r,d,xOffset,zOffset){
        this.mesh.setRotationY(r);
        this.dir = d;
        this.p.x += xOffset;
        this.p.z += zOffset;
        this.mesh.t(xOffset,0,zOffset);
    }

    tick(deltatime,level){
        if (!this.initialized){
            //Rotate and offset the shooter depending on which direction it's facing based on closet wall.
            //Hard coded to stoneWalls so a grassy stonewall can't be used.(Easy to fix but saving precious bytes ;))
            let leftTile = level.getTile(this.p.x-1,this.p.z) == Tiles.stoneWallTile;
            let rightTile = level.getTile(this.p.x+1,this.p.z) == Tiles.stoneWallTile;
            let frontTile = level.getTile(this.p.x,this.p.z+1) == Tiles.stoneWallTile;
            let backTile = level.getTile(this.p.x,this.p.z-1) == Tiles.stoneWallTile;
            if (frontTile) this.setDirectionAndRotation(180,{x:0,z:-3},0,0.5);
            if (leftTile) this.setDirectionAndRotation(90,{x:3,z:0},-0.5,0);
            if (rightTile) this.setDirectionAndRotation(270,{x:-3,z:0},0.5,0);
            if (backTile) this.setDirectionAndRotation(0,{x:0,z:3},0.5,-0.5);
            this.initialized = true;
        }
        super.tick(deltatime,level);
        //Don't shoot anything until player has walked on the connected floortrigger
        if (!this.triggered) return;
        this.counter += deltatime;

        //Shoot a new projectile if ready. Could probably use setInternal for this
        if (this.counter >= this.delay){
            level.addEntity(new Projectile(this.p.x+(this.dir.x/10) , 0.3, this.p.z+(this.dir.z/10), level.gl, this.dir.x, this.dir.z,0,this,[1,1,1,1]));
            this.counter = 0;
        }
    }

    trigger(level, source){
        if (source == this) return;
        this.triggered = true;
    }

}
export default ProjectileShooter;