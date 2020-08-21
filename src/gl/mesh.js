import Vector3 from "./vector3.js";
import Texture from "./texture.js";
import * as matrix4 from "./matrix4.js";

class Mesh{
    constructor(gl, position){
        this.verticies = [];
        this.colors = [];
        this.uvs = [];
        this.modelViewMatrix = matrix4.create();
        this.position = position;
        //console.log(verticies);
        this.gl = gl;

        this.positionBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.indiciesBuffer = gl.createBuffer();

        this.verticiesBuffer32 = new Float32Array(6400);
        this.colorArrayBuffer32 =  new Float32Array(6400*20);
        this.uvArrayBuffer32 = new Float32Array(6400*20);
        this.indiciesBuffer16 = new Uint16Array(6400*20);

        matrix4.fromTranslation(this.modelViewMatrix, [this.position.x, this.position.y, this.position.z]);
    }

    addVerticies(verticies, colors, uvs){
        verticies.forEach(vertex => { this.verticies.push(vertex); });
        colors.forEach(color => { this.colors.push(color);});
        uvs.forEach(uv => { this.uvs.push(uv);});
    }


    updateMesh(){
        var gl = this.gl;
        
        var indiciesNeeded = this.verticies.length/4;
        var vertexCounter = 0;

        this.verticiesBuffer32

        var counter = 0;
        this.verticies.forEach(vertex => { 
            this.verticiesBuffer32[counter] = vertex.x;
            this.verticiesBuffer32[counter+1] = vertex.y;
            this.verticiesBuffer32[counter+2] = vertex.z;
            counter += 3;
        });

        counter = 0;
        this.colors.forEach(color => {
            this.colorArrayBuffer32[counter] = color.r;
            this.colorArrayBuffer32[counter+1] = color.g;
            this.colorArrayBuffer32[counter+2] = color.b;
            this.colorArrayBuffer32[counter+3] = color.a;
            counter += 4;
        });

        counter = 0;
        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv.x;
            this.uvArrayBuffer32[counter+1] = uv.y;
            counter += 2;
        });

        counter = 0;
        //console.log(this.verticiesBuffer32);
        for (let i = 0; i < indiciesNeeded; i++){
            this.indiciesBuffer16[counter] = 0 + vertexCounter;
            this.indiciesBuffer16[counter+1] = 1 + vertexCounter;
            this.indiciesBuffer16[counter+2] = 2 + vertexCounter;
            this.indiciesBuffer16[counter+3] = 0 + vertexCounter;
            this.indiciesBuffer16[counter+4] = 2 + vertexCounter;
            this.indiciesBuffer16[counter+5] = 3 + vertexCounter;
            vertexCounter += 4;
            counter += 6;
        }

        //console.log(this.indiciesBuffer16);

        this.numberOfIndicies = counter;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticiesBuffer32, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorArrayBuffer32, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvArrayBuffer32, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer16, gl.DYNAMIC_DRAW);
    }

    update(gl){

    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    translate(x, y, z){
        mat4.translate(this.modelViewMatrix,
            this.modelViewMatrix,
            [x,y,z]);
    }

    rotateX(r){
        mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, r);
    }

    rotateY(r){
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, r);
    }

    rotateZ(r){
        mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, r);
    }

    render(gl, shaderProgram, projectionMatrix, viewMatrix, texture){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.uv);

        gl.useProgram(shaderProgram.shaderProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.tex);
        gl.uniform1i(shaderProgram.locations.uniformLocations.uSampler, 0);

        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.viewMatrix, false, viewMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        gl.drawElements(gl.TRIANGLES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
    }
}

export default Mesh;