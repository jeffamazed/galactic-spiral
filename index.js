import { randomIntFromRange, randomColor, randomFloatFromRange } from './utilities.js';

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const h1 = document.querySelector("h1");
const bgm = new Audio("./audio/bgm.mp3");
bgm.volume = 0.1;
bgm.loop = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables

const colorsCollection = [
  "#FDF6E3",
  "#C0C0FF",
  "#FFDAB9",
  "#E0FFFF",
  "#FF69B4",
  "#B0E0E6"
];

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

// Event Listeners

let mouseDown = false;
window.addEventListener("mousedown", () => {
  mouseDown = true;
  h1.style.display = "none";

  bgm.play().catch(err => console.error("Autoplay blocked:", err));
});

window.addEventListener("mouseup", () =>{
  mouseDown = false;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

// Objects

class Particles {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  update() {
    this.draw();
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.shadowColor = this.color;
    c.shadowBlur = this.radius < 2 ? 10 : 15;
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}

// Implementation 

let particles;
function init() {
  particles = [];
  const particleCount = innerWidth < 768 ? 500 : 1000;
  for (let i = 0; i < particleCount; i++) {
    const offset = 80;
    const x = randomFloatFromRange(-canvas.width - offset, canvas.width + offset);
    const y = randomFloatFromRange(-canvas.height - offset, canvas.height + offset);
    const radius = randomIntFromRange(1, 2);
    const color = randomColor(colorsCollection);

    particles.push(
      new Particles(
        x,
        y,
        radius,
        color
      )
    );
  }
}

// Animation 

let radians = 0;
let radiansSpeed = 0.001;
let alpha = 1;
const radiansIncrement = 0.00003;

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.translate(canvas.width / 2, canvas.height / 2);
  c.rotate(radians);
  particles.forEach(particle => {
    particle.update();
  });
  c.restore(); 
  
  radiansSpeed = mouseDown 
    ? Math.min(0.007, radiansSpeed + radiansIncrement) 
    : Math.max(0.0003, radiansSpeed - radiansIncrement);

  radians += radiansSpeed;

  if (mouseDown && alpha >= 0.03) alpha -= 0.01;
  if (!mouseDown && alpha <= 1) alpha += 0.001;
}

init();
animate();
