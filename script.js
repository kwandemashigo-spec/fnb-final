/* Advanced interactions and animations - GSAP + Canvas gradient + Parallax */

/* Preloader handling */
window.addEventListener('load', ()=>{
  const pre = document.getElementById('preloader');
  if(pre){ pre.style.opacity = '0'; setTimeout(()=>pre.remove(), 700); }
});

// Canvas animated gradient (siri-like)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, time = 0;

function resizeCanvas(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function hslToRgb(h, s, l){
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if(s === 0){ r = g = b = l; }
  else{
    const hue2rgb = (p, q, t) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
}

function draw(){
  time += 0.005;
  // moving focal points
  const cx = W * (0.25 + 0.25 * Math.sin(time * 0.6));
  const cy = H * (0.35 + 0.18 * Math.cos(time * 0.7));
  const r1 = Math.max(W,H) * 0.8;

  // color stops
  const h1 = (Math.sin(time * 0.8) * 40) + 200; // 160-240
  const h2 = (Math.cos(time * 0.6) * 50) + 280; // 230-330

  const g = ctx.createLinearGradient(0,0,W,H);
  const c1 = 'rgba(' + hslToRgb(h1,80,60).join(',') + ',0.85)';
  const c2 = 'rgba(' + hslToRgb(h2,80,60).join(',') + ',0.75)';
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // soft radial highlight
  const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
  radial.addColorStop(0, 'rgba(255,255,255,0.06)');
  radial.addColorStop(0.4, 'rgba(255,255,255,0.02)');
  radial.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0,0,W,H);

  // subtle grain
  ctx.fillStyle = 'rgba(255,255,255,0.004)';
  for(let i=0;i<300;i++){
    ctx.fillRect(Math.random()*W, Math.random()*H, 1,1);
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Parallax for hero card
(function(){
  const card = document.querySelector('[data-parallax]');
  if(!card) return;
  window.addEventListener('mousemove', (e)=>{
    const gx = (e.clientX / window.innerWidth - 0.5) * 14;
    const gy = (e.clientY / window.innerHeight - 0.5) * 10;
    gsap.to(card, {x: gx, y: gy, rotationY: gx*0.15, rotationX: -gy*0.12, duration: 0.8, ease:'power3.out'});
  });
})();

// Scroll-trigger animations (cards, sections)
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.card, .project-card, .strategy-card, .glass-card, .hero-left').forEach((el, i)=>{
  gsap.from(el, {
    scrollTrigger: {trigger:el, start:'top 85%'},
    opacity:0, y:30, duration:0.8, delay: i*0.06, ease:'power3.out'
  });
});

// Smooth anchor scrolling for nav links
document.querySelectorAll('.nav-links a, .hero .btn').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      const target = document.querySelector(href);
      if(target){
        window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'});
      }
    }
  });
});

// Small accessibility: keyboard focus visible
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('user-tab');
});

document.addEventListener('DOMContentLoaded', () => {
  const bgLogo = document.querySelector('.bg-logo');
  if (bgLogo) {
    gsap.to(bgLogo, {
      filter: [
        "blur(0.2px) drop-shadow(0 0 60px #4EE0C2)",
        "blur(0.2px) drop-shadow(0 0 60px #7C5CFF)",
        "blur(0.2px) drop-shadow(0 0 60px #FF6B6B)",
        "blur(0.2px) drop-shadow(0 0 60px #4EE0C2)"
      ],
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }
});
const isMobile = window.innerWidth < 768;

if (!isMobile) {
  const card = document.querySelector('[data-parallax]');
  if (card) {
    window.addEventListener('mousemove', (e) => {
      const gx = (e.clientX / window.innerWidth - 0.5) * 14;
      const gy = (e.clientY / window.innerHeight - 0.5) * 10;
      gsap.to(card, { x: gx, y: gy, rotationY: gx * 0.15, rotationX: -gy * 0.12, duration: 0.8, ease: 'power3.out' });
    });
  }
}

