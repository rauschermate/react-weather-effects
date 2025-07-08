// import * as WebGL from "./webgl.jsx";
import GL from "./gl-obj.jsx";
// import loadImages from "./image-loader.jsx";
import createCanvas from "./create-canvas.jsx";
// let requireShaderScript = require("glslify");

// let vertShader = requireShaderScript('./shaders/simple.vert');
// let fragShader = requireShaderScript('./shaders/water.frag');

let vertShader =
  'precision mediump float;\n' +
  'attribute vec2 a_position;\n' +
  'void main() {\n' +
  '  gl_Position = vec4(a_position,0.0,1.0);\n' +
  '}\n' ;

let fragShader = 
'   precision mediump float;\n  '  + 
'     \n'  + 
'   // textures  \n'  + 
'   uniform sampler2D u_waterMap;\n  '  + 
'   uniform sampler2D u_textureShine;\n  '  + 
'   uniform sampler2D u_textureFg;\n  '  + 
'   uniform sampler2D u_textureBg;\n  '  + 
'     '  + 
'   // the texCoords passed in from the vertex shader.  \n'  + 
'   varying vec2 v_texCoord;\n  '  + 
'   uniform vec2 u_resolution;\n  '  + 
'   uniform vec2 u_parallax;\n  '  + 
'   uniform float u_parallaxFg;\n  '  + 
'   uniform float u_parallaxBg;\n  '  + 
'   uniform float u_textureRatio;\n  '  + 
'   uniform bool u_renderShine;\n  '  + 
'   uniform bool u_renderShadow;\n  '  + 
'   uniform float u_minRefraction;\n  '  + 
'   uniform float u_refractionDelta;\n  '  + 
'   uniform float u_brightness;\n  '  + 
'   uniform float u_alphaMultiply;\n  '  + 
'   uniform float u_alphaSubtract;\n  '  + 
'   uniform float u_lightningFlash;\n  '  + 
'     '  + 
'   // alpha-blends two colors  \n'  + 
'   vec4 blend(vec4 bg,vec4 fg){  \n'  + 
'     vec3 bgm=bg.rgb*bg.a;\n  '  + 
'     vec3 fgm=fg.rgb*fg.a;\n  '  + 
'     float ia=1.0-fg.a;\n  '  + 
'     float a=(fg.a + bg.a * ia);\n  '  + 
'     vec3 rgb;\n  '  + 
'     if(a!=0.0){  \n'  + 
'       rgb=(fgm + bgm * ia) / a;\n  '  + 
'     }else{  \n'  + 
'       rgb=vec3(0.0,0.0,0.0);\n  '  + 
'     }  \n'  + 
'     return vec4(rgb,a);\n  '  + 
'   }  \n'  + 
'     \n'  + 
'   vec2 pixel(){  \n'  + 
'     return vec2(1.0,1.0)/u_resolution;\n  '  + 
'   }  \n'  + 
'     \n'  + 
'   vec2 parallax(float v){  \n'  + 
'     return u_parallax*pixel()*v;\n  '  + 
'   }  \n'  + 
'     \n'  + 
'   vec2 texCoord(){  \n'  + 
'     return vec2(gl_FragCoord.x, u_resolution.y-gl_FragCoord.y)/u_resolution;\n  '  + 
'   }  \n'  + 
'     \n'  + 
'   // scales the bg up and proportionally to fill the container  \n'  + 
'   vec2 scaledTexCoord(){  \n'  + 
'     float ratio=u_resolution.x/u_resolution.y;\n  '  + 
'     vec2 scale=vec2(1.0,1.0);\n  '  + 
'     vec2 offset=vec2(0.0,0.0);\n  '  + 
'     float ratioDelta=ratio-u_textureRatio;\n  '  + 
'     if(ratioDelta>=0.0){  \n'  + 
'       scale.y=(1.0+ratioDelta);\n  '  + 
'       offset.y=ratioDelta/2.0;\n  '  + 
'     }else{  \n'  + 
'       scale.x=(1.0-ratioDelta);\n  '  + 
'       offset.x=-ratioDelta/2.0;\n  '  + 
'     }  \n'  + 
'     return (texCoord()+offset)/scale;\n  '  + 
'   }  \n'  + 
'     \n'  + 
'   // get color from fg  \n'  + 
'   vec4 fgColor(float x, float y){  \n'  + 
'     float p2=u_parallaxFg*2.0;\n  '  + 
'     vec2 scale=vec2(  \n'  + 
'       (u_resolution.x+p2)/u_resolution.x,  \n'  + 
'       (u_resolution.y+p2)/u_resolution.y  \n'  + 
'     );\n  '  + 
'     \n'  + 
'     vec2 scaledTexCoord=texCoord()/scale;\n  '  + 
'     vec2 offset=vec2(  \n'  + 
'       (1.0-(1.0/scale.x))/2.0,  \n'  + 
'       (1.0-(1.0/scale.y))/2.0  \n'  + 
'     );\n  '  + 
'     \n'  + 
'     return texture2D(u_waterMap,  \n'  + 
'       (scaledTexCoord+offset)+(pixel()*vec2(x,y))+parallax(u_parallaxFg)  \n'  + 
'     );\n  '  + 
'   }  \n'  + 
'     \n'  + 
'   void main() {  \n'  + 
'     vec4 bg=texture2D(u_textureBg,scaledTexCoord()+parallax(u_parallaxBg));\n  '  + 
'     bg.rgb *= (1.0 + 0.5 * u_lightningFlash);\n  '  + 
'     \n'  + 
'     vec4 cur = fgColor(0.0,0.0);\n  '  + 
'     '  + 
'     float d=cur.b;\n // "thickness"  \n'  + 
'     float x=cur.g;\n  '  + 
'     float y=cur.r;\n  '  + 
'     \n'  + 
'     float a=clamp(cur.a*u_alphaMultiply-u_alphaSubtract, 0.0,1.0);\n  '  + 
'      \n'  + 
'     vec2 refraction = (vec2(x,y)-0.5)*2.0;\n  '  + 
'     vec2 refractionParallax=parallax(u_parallaxBg-u_parallaxFg);\n  '  + 
'     vec2 refractionPos = scaledTexCoord()  \n'  + 
'       + (pixel()*refraction*(u_minRefraction+(d*u_refractionDelta)))  \n'  + 
'       + refractionParallax;\n  '  + 
'     \n'  + 
'     vec4 tex=texture2D(u_textureFg,refractionPos);\n  '  + 
'     \n'  + 
'     if(u_renderShine){  \n'  + 
'       float maxShine=490.0;\n  '  + 
'       float minShine=maxShine*0.18;\n  '  + 
'       vec2 shinePos=vec2(0.5,0.5) + ((1.0/512.0)*refraction)* -(minShine+((maxShine-minShine)*d));\n  '  + 
'       vec4 shine=texture2D(u_textureShine,shinePos);\n  '  + 
'       tex=blend(tex,shine);\n  '  + 
'     }  \n'  + 
'     \n'  + 
'     vec4 fg=vec4(tex.rgb*u_brightness*a*(1.0 + 0.5 * u_lightningFlash),a);\n  '  + 
'     \n'  + 
'     if(u_renderShadow){  \n'  + 
'       float borderAlpha = fgColor(0.,0.-(d*6.0)).a;\n  '  + 
'       borderAlpha=borderAlpha*u_alphaMultiply-(u_alphaSubtract+0.5);\n  '  + 
'       borderAlpha=clamp(borderAlpha,0.,1.);\n  '  + 
'       borderAlpha*=0.2;\n  '  + 
'       vec4 border=vec4(0.,0.,0.,borderAlpha);\n  '  + 
'       fg=blend(border,fg);\n  '  + 
'     }  \n'  + 
'     \n'  + 
'     gl_FragColor = blend(bg,fg);\n  '  + 
'   }  \n';

const defaultOptions={
  renderShadow:false,
  minRefraction:256,
  maxRefraction:512,
  brightness:1,
  alphaMultiply:20,
  alphaSubtract:5,
  parallaxBg:5,
  parallaxFg:20
}
function RainRenderer(canvas,canvasLiquid, imageFg, imageBg, imageShine=null,options={}){
  this.canvas=canvas;
  this.canvasLiquid=canvasLiquid;
  this.imageShine=imageShine;
  this.imageFg=imageFg;
  this.imageBg=imageBg;
  this.options=Object.assign({},defaultOptions, options);
  this.init();
}

RainRenderer.prototype={
  canvas:null,
  gl:null,
  canvasLiquid:null,
  width:0,
  height:0,
  imageShine:"",
  imageFg:"",
  imageBg:"",
  textures:null,
  programWater:null,
  programBlurX:null,
  programBlurY:null,
  parallaxX:0,
  parallaxY:0,
  renderShadow:false,
  options:null,
  init(){
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.gl=new GL(this.canvas, {alpha:false},vertShader,fragShader);
    let gl=this.gl;
    this.programWater=gl.program;

    gl.createUniform("2f","resolution",this.width,this.height);
    gl.createUniform("1f","textureRatio",this.imageBg.width/this.imageBg.height);
    gl.createUniform("1i","renderShine",this.imageShine==null?false:true);
    gl.createUniform("1i","renderShadow",this.options.renderShadow);
    gl.createUniform("1f","minRefraction",this.options.minRefraction);
    gl.createUniform("1f","refractionDelta",this.options.maxRefraction-this.options.minRefraction);
    gl.createUniform("1f","brightness",this.options.brightness);
    gl.createUniform("1f","alphaMultiply",this.options.alphaMultiply);
    gl.createUniform("1f","alphaSubtract",this.options.alphaSubtract);
    gl.createUniform("1f","parallaxBg",this.options.parallaxBg);
    gl.createUniform("1f","parallaxFg",this.options.parallaxFg);
    gl.createUniform("1f","lightningFlash",0.0);


    gl.createTexture(null,0);

    this.textures=[
      {name:'textureShine', img:this.imageShine==null?createCanvas(2,2):this.imageShine},
      {name:'textureFg', img:this.imageFg},
      {name:'textureBg', img:this.imageBg}
    ];

    this.textures.forEach((texture,i)=>{
      gl.createTexture(texture.img,i+1);
      gl.createUniform("1i",texture.name,i+1);
    });

    this.draw();
  },
  draw(){
    this.gl.useProgram(this.programWater);
    this.gl.createUniform("2f", "parallax", this.parallaxX,this.parallaxY);
    this.updateTexture();
    this.gl.draw();

    requestAnimationFrame(this.draw.bind(this));
  },
  updateTextures(){
    this.textures.forEach((texture,i)=>{
      this.gl.activeTexture(i+1);
      this.gl.updateTexture(texture.img);
    })
  },
  updateTexture(){
    this.gl.activeTexture(0);
    this.gl.updateTexture(this.canvasLiquid);
  },
  resize(){

  },
  // get overlayTexture(){

  // },
  // set overlayTexture(v){

  // }
}

export default RainRenderer;