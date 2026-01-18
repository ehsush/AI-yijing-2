// Particle FX Engine
// Optimized for performance with Object Pooling

export interface ParticleTheme {
  colors: string[];
  baseSize: number;
  glowStrength: number;
}

export const DEFAULT_THEME: ParticleTheme = {
  colors: ['#D6B36A', '#C9A45C', '#E7D3A2', '#ffffff'],
  baseSize: 2,
  glowStrength: 10,
};

class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  life: number = 0;
  maxLife: number = 0;
  size: number = 0;
  alpha: number = 0;
  color: string = '#fff';
  active: boolean = false;
  drag: number = 0.95; // Air resistance
  growth: number = 0;

  reset(x: number, y: number, theme: ParticleTheme) {
    this.x = x;
    this.y = y;
    this.active = true;
    this.color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
  }
}

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pool: Particle[] = [];
  private maxParticles: number = 400; // Cap for performance
  private theme: ParticleTheme;
  private width: number = 0;
  private height: number = 0;
  private animationId: number = 0;
  private lastTime: number = 0;
  private reducedMotion: boolean = false;

  constructor(canvas: HTMLCanvasElement, theme: ParticleTheme = DEFAULT_THEME) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.theme = theme;
    
    // Check reduced motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      this.maxParticles = 50;
    }

    // Initialize Pool
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool.push(new Particle());
    }

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
    this.loop = this.loop.bind(this);
    this.lastTime = performance.now();
    this.loop();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.width = parent.clientWidth;
      this.height = parent.clientHeight;
      // Handle DPR
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }
  }

  private getParticle(): Particle | null {
    for (const p of this.pool) {
      if (!p.active) return p;
    }
    return null;
  }

  // --- Emitters ---

  // 1. Ambient Dust (Always running, low cost)
  emitAmbient() {
    if (Math.random() > 0.1) return; // Throttle
    const p = this.getParticle();
    if (p) {
      p.reset(Math.random() * this.width, Math.random() * this.height, this.theme);
      p.vx = (Math.random() - 0.5) * 0.5;
      p.vy = (Math.random() - 0.5) * 0.5;
      p.life = 0;
      p.maxLife = 200 + Math.random() * 100;
      p.size = Math.random() * 1.5;
      p.alpha = 0;
      p.drag = 1;
    }
  }

  // 2. Burst (Impact)
  emitBurst(x: number, y: number, intensity: number = 1) {
    if (this.reducedMotion) return;
    const count = 30 * intensity;
    for (let i = 0; i < count; i++) {
      const p = this.getParticle();
      if (p) {
        p.reset(x, y, this.theme);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.life = 0;
        p.maxLife = 40 + Math.random() * 20;
        p.size = Math.random() * 3 + 1;
        p.alpha = 1;
        p.drag = 0.92;
        p.growth = -0.02; // Shrink
      }
    }
  }

  // 3. Swirl (Gathering Qi)
  emitSwirl(x: number, y: number) {
    if (this.reducedMotion) return;
    for (let i = 0; i < 3; i++) {
        const p = this.getParticle();
        if (p) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 80 + Math.random() * 40;
            p.reset(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, this.theme);
            
            // Velocity towards center + tangent for swirl
            const dx = x - p.x;
            const dy = y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            p.vx = (dx / dist) * 2 - (dy / dist) * 1; // Inward + Tangent
            p.vy = (dy / dist) * 2 + (dx / dist) * 1;

            p.life = 0;
            p.maxLife = 60;
            p.size = Math.random() * 2;
            p.alpha = 0;
            p.drag = 0.98;
        }
    }
  }

  // 4. Sweep (Line Generation)
  emitSweep(rect: {top: number, bottom: number, left: number, right: number}) {
      if (this.reducedMotion) return;
      // Create a horizontal or vertical sweep effect
      const count = 20;
      const centerY = (rect.top + rect.bottom) / 2;
      const width = rect.right - rect.left;
      
      for(let i=0; i<count; i++) {
          const p = this.getParticle();
          if(p) {
              const startX = rect.left + Math.random() * width;
              p.reset(startX, centerY + (Math.random() - 0.5) * 10, this.theme);
              p.vx = (Math.random() - 0.5) * 2; // Slight horizontal spread
              p.vy = (Math.random() - 0.5) * 2;
              p.life = 0;
              p.maxLife = 30;
              p.size = Math.random() * 2 + 2;
              p.alpha = 1;
              p.color = '#fff'; // Bright for sweep
              p.drag = 0.9;
          }
      }
  }

  // --- Loop ---

  loop() {
    this.animationId = requestAnimationFrame(this.loop);
    
    // FPS Throttling / Delta time could go here, staying simple for now
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render Particles
    this.ctx.globalCompositeOperation = 'lighter'; // Additive blending for glow

    for (const p of this.pool) {
      if (!p.active) continue;

      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.life++;
      p.size += p.growth;

      // Fade in/out logic
      if (p.life < 10) {
          p.alpha = p.life / 10;
      } else if (p.life > p.maxLife - 20) {
          p.alpha = (p.maxLife - p.life) / 20;
      }

      // Kill
      if (p.life >= p.maxLife || p.size <= 0) {
        p.active = false;
        continue;
      }

      // Draw
      this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1;
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
  }
}