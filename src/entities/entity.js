class Entity{
    constructor(name,x,y,z) {
        this.name = name;
        this.position = {x,y,z};
        this.tempVector = {x:0,y:0,z:0};
        this.movement = {x:0,y:0,z:0};
        this.knockBack = {x:0,z:0};
        this.radius = 0.4;
        this.currentTileX = Math.round(this.position.x);
        this.currentTileZ = Math.round(this.position.z);
        this.hitCounter = 0;
    }

    getPosition(){
        return this.position;
    }

    tick(deltaTime,level){
        if (this.knockBack.x > -0.2 && this.knockBack.x < 0.2) this.knockBack.x = 0;
        if (this.knockBack.z > -0.2 && this.knockBack.z < 0.2) this.knockBack.z = 0;
        if (this.knockBack.x !=0 || this.knockBack.z !=0){
            let knockX = this.position.x - this.knockBack.x * 15 * deltaTime;
            let knockZ = this.position.z - this.knockBack.z * 15 *deltaTime;
            if (this.canMove(level, knockX, this.position.z))this.position.x = knockX;
            if (this.canMove(level, this.position.x, knockZ))this.position.z = knockZ;
            
            this.knockBack.x /= 68*deltaTime;
            this.knockBack.z /= 68*deltaTime;
        }
        
        this.hitCounter +=deltaTime;
        let tileX = Math.round(this.position.x);
        let tileZ = Math.round(this.position.z);
        if (this.currentTileX != tileX){
            this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
            this.currentTileX = tileX;
            this.addToCollision(level,this.currentTileX, this.currentTileZ);
        } 
        if (this.currentTileZ != tileZ){
            this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
            this.currentTileZ = tileZ;
            this.addToCollision(level,this.currentTileX, this.currentTileZ);
        }

        for (let x = this.currentTileX-1; x < this.currentTileX+1; x++){
            for (let z = this.currentTileZ-1; z < this.currentTileZ+1; z++){
                let tile = level.getCollisionTile(x,z);
                if (tile!=null){
                    tile.getEntities().forEach(e => {
                        if (e == this)return;
                        e.collidedBy(this, level);
                    });
                }
            }
        }

    }

    collidedBy(entity, level){
    }

    addToCollision(level,x,z){
        level.getCollisionTile(x, z).addEntityToTile(this);
    }

    removeFromCollision(level,x,z){
        level.getCollisionTile(x, z).removeEntityFromTile(this);
    }

    knockBack(x,z){
        if (this.knockBack.x !=0 || this.knockBack.z !=0) return;
        this.knockBack.x = x;
        this.knockBack.z = z;
        this.normalize(this.knockBack);
    }

    render(gl,shaderprogram,pm,vm){
        
    }

    canMove(level,x,z){
        var x1 = Math.round(x + this.radius);
        var z1 = Math.round(z + this.radius);
		var x2 = Math.round(x - this.radius);
        var z2 = Math.round(z - this.radius);
        if (level.getTile(x1, z1).b(this)) return false;
        if (level.getTile(x2, z1).b(this)) return false;
        if (level.getTile(x1, z2).b(this)) return false;
        if (level.getTile(x2, z2).b(this)) return false;
        return true;
    }

    normalize(v) {
        let len = v.x * v.x + v.z * v.z;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }
        v.x *= len;
        v.z *= len;
    }
    distance(v1, v2) {
        let x = v1.x - v2.x
        let z = v1.z - v2.z;
        return Math.hypot(x, z);
      }
    
}

export default Entity;