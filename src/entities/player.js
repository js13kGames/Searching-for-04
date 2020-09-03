import Game from "../game.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js";
import Inventory from "./inventory.js";
import ItemSprite from "./itemsprite.js";
import Projectile from "./projectile.js";

class Player extends Entity{
    constructor(x,y,z) {
        super("player",x,y,z,5);
        this.isAttacking = false;
        this.inventory = new Inventory();
        this.showAttack = false;
        this.attackCounter = 0;
        this.eatDelay = 0;
        this.daggerItemLevel = 0;
        this.wandItemLevel = 0;
    }

    spawnAtCheckpoint(level){
        level.displayMessage("Respawned","",2);
        this.currentHealth = this.health;
        this.p.x = this.checkpoint.x;
        this.p.z = this.checkpoint.z;
    }

    tick(deltaTime, level){
        super.tick(deltaTime,level);
        if (this.currentHealth <= 0){
            if (Game.inputHandler.isKeyDown(32)) Game.restart();
            return;
        }
        this.inventory.tick(deltaTime,level);
        this.i = this.inventory.getItemInSlot(this.inventory.selectedSlot);
        if (this.showAttack && this.attackCounter > 0) this.attackCounter -= deltaTime;
        if (this.attackCounter <= 0) this.showAttack = false;
        if (this.eatDelay >0) this.eatDelay -= deltaTime;

        if (this.knockBack.x == 0 || this.knockBack.z == 0){
            let tv = this.tempVector;
            let pos = this.p;
            let inputHandler = Game.inputHandler;
            this.counter += deltaTime;
            let v = {x:0,y:0,z:0};
            let cameraDirection = LevelRender.camera.getDirection();
            LevelRender.camera.rotate((inputHandler.getMouseX()/8) * deltaTime);
            if (inputHandler.isKeyDown(87))v.z = -2.5;
            if (inputHandler.isKeyDown(83))v.z = 2.5;
            if (inputHandler.getClicked() && this.attackCounter <= 0){
                this.isAttacking = this.showAttack = true;
                this.attackCounter = 0.3;
                this.attack(level);
            }else{
                this.isAttacking = false;
            }
            if (inputHandler.isKeyDown(69))this.eat();

            if (inputHandler.isKeyDown(81)) this.dropCurrentItem(level);
            
            if (v.x !=0 || v.z != 0){
                tv.x = cameraDirection.x * v.z * deltaTime;
                tv.y = cameraDirection.y * v.z * deltaTime;
                tv.z = cameraDirection.z * v.z * deltaTime;
    
                tv.x += pos.x;
                tv.z += pos.z;
            
                if (this.canMove(level,tv.x,pos.z)) pos.x += tv.x-pos.x;
                if (this.canMove(level,pos.x,tv.z)) pos.z += tv.z-pos.z;
            }
        }
        
        if (this.i != null){
            let itemPos = {x:this.p.x - LevelRender.camera.getDirection().x/4,y:0,z:this.p.z - LevelRender.camera.getDirection().z/4};
            if (!this.showAttack){
                this.i.renderPlayerHolding(itemPos,0.11);
            }else{
                this.i.renderPlayerAttack(itemPos,0.10);
            }
        }
        LevelRender.camera.setPos(this.p.x, 0.3, this.p.z);

    }

    removeThisEntity(level){
        level.displayMessage("You have died.","Press space to try again");
    }
    
    dropCurrentItem(level){
        if (this.i != null){
            let itemSprite = new ItemSprite(this.i,this.p.x-LevelRender.camera.getDirection().x/2,-0.2,this.p.z-LevelRender.camera.getDirection().z/2,this.i.texture,level.gl);
            itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
            level.addEntity(itemSprite); 
            this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
        }
    }

    removeCurrentItem(){
        this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
    }

    pickup(level,i){
        this.inventory.addItemToFirstAvailableSlot(level,i);
        if (i.n == "dagger") if (this.daggerItemLevel < i.level) this.daggerItemLevel = i.level;
        if (i.n == "wand") if (this.wandItemLevel < i.level) this.wandItemLevel = i.level;
    }

    eat(){
        if (this.currentHealth < this.health && this.eatDelay <= 0){
            this.inventory.eat(this);
            this.eatDelay = 0.2;
        } 
    }

    hasSpace(){
       return this.inventory.hasSpace();
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        let d = this.distanceToOtherEntity(entity);
        if (entity.n == "bat" || entity.n == "projectile"){
            if(d < 0.4){
                if (this.hitCounter>= 0.5){
                    super.knockback(entity.p.x - this.p.x*2, entity.p.z - this.p.z*2);
                    this.hit(level,entity,1);
                }
            }
        }
    }
    setCheckpoint(x,z){
        this.checkpoint = {x,z};
    }
    attack(level){
        if (this.i == null) return;
        if (this.i.n == "wand"){
            let cameraDirection = LevelRender.camera.getDirection();
            level.addEntity(new Projectile(this.p.x - cameraDirection.x, 0.3, this.p.z - cameraDirection.z,level.gl, -cameraDirection.x*5, -cameraDirection.z*5,this.i.getDamage()));
        }else{
            let cameraDirection = LevelRender.camera.getDirection();
            if (!this.findEnemyAndAttack(level,level.getCollisionTile(Math.round(this.p.x - cameraDirection.x), Math.round(this.p.z - cameraDirection.z)))){
                this.findEnemyAndAttack(level,level.getCollisionTile(Math.round(this.p.x - cameraDirection.x*1.5), Math.round(this.p.z - cameraDirection.z*1.5)));
            }
        }
    }
    findEnemyAndAttack(level,ct){
        ct.getEntities().forEach(e => {
            if (e == this) return;
            if (e.n == "bat" || e.n == "pot" || e.n == "box"){
                e.hit(level,this,this.i.getDamage());
                return true;
            }
        });
        return false;
    }
}

export default Player;