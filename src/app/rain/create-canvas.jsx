export default function createCanvas(width, height) {
  if (typeof document === "undefined") {
    return null;
  }
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;  
  return canvas;
}