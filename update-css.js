const fs = require('fs');
const path = require('path');

const files = [
  'apps/admin/app/globals.css',
  'apps/biopellet/app/globals.css',
  'apps/farmer/app/globals.css',
  'apps/lab/app/globals.css',
  'apps/soilmitra/app/globals.css'
];

const newRoot = :root {
  /* Cinematic Agritech Theme */
  --color-primary:       #10b981;
  --color-primary-dark:  #059669;
  --color-primary-light: #34d399;
  --color-secondary:       #f59e0b;
  --color-secondary-light: #fef3c7;
  --color-bg:            #050B08;
  --color-surface:       #0A140F;
  --color-border:        #12221A;
  --color-border-strong: #223D2E;
  --color-text:          #f8fafc;
  --color-text-secondary:#94a3b8;
  --color-text-muted:    #64748b;
  --color-success:  #10b981;
  --color-warning:  #f59e0b;
  --color-error:    #ef4444;
  --color-info:     #3b82f6;
  --radius-sm:  4px;
  --radius:     6px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --shadow-sm: 0 0 10px rgba(16, 185, 129, 0.05);
  --shadow:    0 0 15px rgba(16, 185, 129, 0.1);
  --shadow-md: 0 0 20px rgba(16, 185, 129, 0.15);
  --shadow-lg: 0 0 25px rgba(16, 185, 129, 0.2);
  --transition-fast: 150ms ease;
  --transition:      200ms ease;
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  // Replace everything from :root { to the closing } of :root
  content = content.replace(/:root\s*\{[\s\S]*?\n\}/, newRoot);
  
  // Standardize body background
  content = content.replace(/body\s*\{\s*@apply[^;]+;/g, 'body { background-color: var(--color-bg); color: var(--color-text);');
  
  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
