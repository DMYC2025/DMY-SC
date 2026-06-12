// Supabase Configuration
// මෙම ෆයිල් එක Admin සහ User පිටු සියල්ලටම පොදු වේ.

const supabaseUrl = 'https://tnrqasiiywcvtwkwytqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnFhc2lpeXdjdnR3a3d5dHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDIxMTEsImV4cCI6MjA4MjkxODExMX0.rd9aKmLa687zMxg8FV5AllgnYkz7wpdXBRi3a5NyXc4';

// Create a single supabase client for interacting with your database
// Configure auth for persistent sessions (prevents frequent logouts)
// සිංහල: ලොග් වූ පසු දින ගණනක් යනතුරු Login වී තිබීමට (Persistent Session) සකසා ඇත.
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // Stores the session in local storage (Browser) -> ඕනෑම දවසක නැවත එන විට Login වී ඇත.
        autoRefreshToken: true, // Automatically refreshes the token -> Token එක කල් ඉකුත් වීම වලකයි.
        detectSessionInUrl: true // Detects if the session is in the URL (for OAuth/Magic Links)
    }
});

// Supabase Connected!

// ── NEXT-LEVEL GLASSMORPHISM VISUAL EFFECTS INJECTION ──
(function() {
    function initVisualEffects() {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        // Add visual effects styles to document head if not present
        if (!document.getElementById('visual-effects-style')) {
            const style = document.createElement('style');
            style.id = 'visual-effects-style';
            style.textContent = `
                @keyframes float-slow {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(4%, -4%) scale(1.05); }
                    100% { transform: translate(-2%, 2%) scale(0.95); }
                }
            `;
            document.head.appendChild(style);
        }

        // 1. Inject particle canvas if not present
        if (!document.getElementById('particleCanvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'particleCanvas';
            canvas.style.position = 'fixed';
            canvas.style.inset = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '-1';
            document.body.prepend(canvas);
            
            // Start particle animation loop
            initParticles(canvas);
        }
        
        // 2. Inject floating background glowing orbs if not present
        if (!document.getElementById('bg-orb-top-left')) {
            const orb1 = document.createElement('div');
            orb1.id = 'bg-orb-top-left';
            orb1.style.position = 'fixed';
            orb1.style.top = '-15%';
            orb1.style.left = '-15%';
            orb1.style.width = '60vw';
            orb1.style.height = '60vh';
            orb1.style.borderRadius = '50%';
            orb1.style.background = 'radial-gradient(circle, rgba(30, 215, 96, 0.12) 0%, rgba(30, 215, 96, 0) 70%)';
            orb1.style.filter = 'blur(80px)';
            orb1.style.pointerEvents = 'none';
            orb1.style.zIndex = '-1';
            orb1.style.animation = 'float-slow 20s ease-in-out infinite alternate';
            document.body.appendChild(orb1);
        }
        if (!document.getElementById('bg-orb-bottom-right')) {
            const orb2 = document.createElement('div');
            orb2.id = 'bg-orb-bottom-right';
            orb2.style.position = 'fixed';
            orb2.style.bottom = '-15%';
            orb2.style.right = '-15%';
            orb2.style.width = '60vw';
            orb2.style.height = '60vh';
            orb2.style.borderRadius = '50%';
            orb2.style.background = 'radial-gradient(circle, rgba(160, 207, 208, 0.1) 0%, rgba(160, 207, 208, 0) 70%)';
            orb2.style.filter = 'blur(80px)';
            orb2.style.pointerEvents = 'none';
            orb2.style.zIndex = '-1';
            orb2.style.animation = 'float-slow 25s ease-in-out infinite alternate-reverse';
            document.body.appendChild(orb2);
        }
    }

    function initParticles(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.3 + 0.05,
                life: 0,
                maxLife: Math.random() * 400 + 200
            };
        }
        
        const count = window.innerWidth > 768 ? 40 : 20;
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life++;
                
                // Keep inside screen
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                const fade = p.life < 40 ? p.life / 40 : p.life > p.maxLife - 40 ? (p.maxLife - p.life) / 40 : 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(30, 215, 96, ${p.opacity * fade})`;
                ctx.fill();
                
                if (p.life >= p.maxLife) {
                    particles[i] = createParticle();
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisualEffects);
    } else {
        initVisualEffects();
    }
})();
