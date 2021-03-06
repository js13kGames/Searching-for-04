import Item from "./item.js";
import LevelRender from "../level/levelrender.js";
class Apple extends Item{
    constructor(x,y,z,gl,onGroundScale) {
        super("Apple",x,y,z,LevelRender.apple,gl,onGroundScale);
        this.respawn = false;
    }
    use(entity){
        entity.heal(1);
    }
}
export default Apple