
import LevelRender from "../level/levelrender.js";
import Billboardsprite from "./billboardsprite.js";
import Particle from "./particle.js";
class Pot extends Billboardsprite{
    constructor(x,y,z,gl, triggerId) {
        super("po", x,y-0.2,z,LevelRender.pot,gl, 2, triggerId);
        this.mesh.setS(0.6);
    }
    removeThisEntity(level){
        if (this.getRand() < 0.4)this.drop(level,level.getApple());
        for (let i = 0; i < 20; i++){
            level.addEntity(new Particle(this.p.x-0.2+this.getRand()/3,-0.2,this.p.z-0.2+this.getRand()/3,LevelRender.lava,level.gl,this.getRand(),0,this.getRand(),0,this.getRand()/7,
            this.getRand()<0.5?[0.6,0.5,0.4,1]:[0.4,0.3,0.2,1]));
        }
        super.removeThisEntity(level);
    }
    collidedBy(entity, level){
        super.collidedBy(entity,level);
            if(entity.n == "pp" && this.distanceToOtherEntity(entity) < 0.8 && this.hitCounter>= 0.5)this.hit(level,entity,entity.damage);
    }
}

export default Pot;