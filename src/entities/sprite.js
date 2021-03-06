import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
//An entity with a texture. Not rotate to always face the player (see BillboardSprite)
class Sprite extends Entity{
    constructor(n, x,y,z,texture,gl, health, triggerId){
        super(n, x,y,z, health, triggerId);
        if (texture instanceof Array){
            this.animated = true;
            this.numberOfFrames = texture.length;
            this.texture = texture[0];
            this.textureAnimation = texture;
            this.currentFrame = 0;
            this.frameCounter = 0;         
        }else{
            this.texture = texture;
            this.animated = false;
        }

        this.c = this.baseColor = [1,1,1,1];
        this.light = 0.7;
        this.hitCCountDown = 0;
        this.changeBackCAfterHit = false;
        //Sprite has a front facing mesh
        let r = MeshBuilder.start(gl,x,y,z);
        MeshBuilder.front(this.texture.getUVs(),r,0,0,0,this.light,1);
        this.mesh = MeshBuilder.build(r);
    }

    //Set color (aparently using the word color did increase the final zip with some bytes)
    setC(c){
        this.c = c;
        this.colorChanged = true;
    }
    //Set scale (aparently using the word scale did increase the final zip with some bytes)
    //Return the entity to allow chained functions to be used
    setS(scale){
        this.mesh.setS(scale);
        return this;
    }

    hit(level,hitByEntity, amount){
        //Flash the sprite in red when hit before calling Entity hit function
        if (this.hitCounter>= 0.3){
            this.setC([1,0,0,1]);
            this.hitCCountDown = 0.5;
            this.changeBackCAfterHit = true;

        }
        super.hit(level,hitByEntity,amount);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        //If item is red then change back to the normal color when the timer has reached zero (could probably used setTimeout here)
        if (this.changeBackCAfterHit && this.hitCCountDown > 0) this.hitCCountDown -= deltatime;
        if (this.changeBackCAfterHit && this.hitCCountDown <= 0){
            this.setC(this.baseColor);
            this.changeBackCAfterHit = false;
        }

        //If the sprite has moved sync the movement with the mesh
        this.mesh.setPos(this.p.x,this.p.y,this.p.z);

        //If animated make sure we swap the texture. Hard coded to every ~15th frame
        if (this.animated){
            this.frameCounter += deltatime;
            if (this.frameCounter >= 0.016*15){
                this.frameChanged = true;
                this.currentFrame++;
                if (this.currentFrame > this.numberOfFrames-1) this.currentFrame = 0;
                this.texture = this.textureAnimation[this.currentFrame];
                this.frameCounter = 0;
            }
        }
    }

    render(gl,shaderprogram,perspectiveMatrix,playerHurt){
        if (this.dispose) return;
        //If animated update the mesh UVs for the new texture to display
        if (this.frameChanged){
            this.mesh.render(gl,shaderprogram,perspectiveMatrix,this.texture.texture, playerHurt, this.texture.getUVs());
            this.frameChanged = false;
        }else{
            //If the color has changed include the new color in the render call.
            this.mesh.render(gl,shaderprogram,perspectiveMatrix,this.texture.texture,playerHurt,null,this.colorChanged?[this.c, this.c, this.c, this.c]:null);
            this.colorChanged = false;
        }
    }
}
export default Sprite;