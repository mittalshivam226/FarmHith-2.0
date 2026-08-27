const fs = require('fs');

// Read global CSS
let css = fs.readFileSync('apps/farmer/app/globals.css', 'utf-8');

// Add some cinematic agritech animations
const animations = 
/* Cinematic Agritech Animations */
@keyframes dataFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
  50% { opacity: 1; box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.data-flow-bg {
  background: linear-gradient(270deg, rgba(5,11,8,0.9), rgba(16,185,129,0.1), rgba(5,11,8,0.9));
  background-size: 400% 400%;
  animation: dataFlow 15s ease infinite;
}

.cyber-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
}

.digital-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, var(--color-bg) 100%);
  z-index: 1;
  pointer-events: none;
}

.hud-element {
  position: relative;
  overflow: hidden;
}
.hud-element::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(to right, transparent, var(--color-primary), transparent);
  animation: scanline 4s linear infinite;
  opacity: 0.5;
  pointer-events: none;
}
;

if (!css.includes('dataFlow')) {
  css += animations;
  fs.writeFileSync('apps/farmer/app/globals.css', css);
}

// Read page.tsx
let page = fs.readFileSync('apps/farmer/app/page.tsx', 'utf-8');

// Inject the cyber grid and data flow into the hero section
page = page.replace(
  /<section className="hero">/,
  '<section className="hero data-flow-bg relative overflow-hidden">\\n        <div className="cyber-grid" />\\n        <div className="digital-overlay" />\\n        <div className="relative z-10 w-full flex flex-col items-center">'
);

// Close the wrapper div at the end of the hero section
page = page.replace(
  /<\/section>/,
  '</div>\\n      </section>'
);

// Add HUD elements to step cards
page = page.replace(/className="step-card"/g, 'className="step-card hud-element"');
page = page.replace(/className="feature-card"/g, 'className="feature-card hud-element"');

fs.writeFileSync('apps/farmer/app/page.tsx', page);
console.log('Cinematic styles applied!');
