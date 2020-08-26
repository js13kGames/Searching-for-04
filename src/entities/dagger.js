import LevelRender from "../level/levelrender.js";
import Item from "./item.js";

class Dagger extends Item{
    constructor(x,y,z,gl,onGroundScale) {
        super("dagger",x,y,z,LevelRender.dagger,gl);
        this.onGroundScale = onGroundScale;
    }

   
}
export default Dagger;