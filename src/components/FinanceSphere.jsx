import { useEffect, useRef } from 'react';

export default function FinanceSphere({ size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = size;
    const H = size;
    canvas.width = W;
    canvas.height = H;

    // Symboles Finance
    const SYMBOLS = [
      '€', '$', '£', '¥', '%', '+', '−',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'P&L', 'IRR', 'ROI', 'NPV', 'FCF', 'KPI',
      '▲', '▼', '◆', '∑', '×'
    ];

    const GOLD = '#C4A35A';
    const GREEN = '#2D7060';
    const GREEN_LIGHT = '#3D9080';
    const CENTER_X = W / 2;
    const CENTER_Y = H / 2;
    const RADIUS = W * 0.38;

    // Générer les particules sur une sphère
    const PARTICLE_COUNT = 38;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribution sphérique uniforme (Fibonacci sphere)
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      particles.push({
        phi,
        theta,
        speed: 0.003 + Math.random() * 0.002,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        isGold: i % 5 === 0,   // ~20% en or
        baseSize: 9 + Math.random() * 5,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }

    let angle = 0;
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      angle += 0.005;

      // Trier par profondeur Z pour le rendu correct
      const projected = particles.map((p, i) => {
        // Deux angles de rotation : horizontal + vertical lent
        const angleV = angle * 0.3; // rotation verticale 3x plus lente
        const thetaAnim = p.theta + angle * (0.6 + i * 0.01);

        // Rotation 3D combinée
        const x3d = Math.sin(p.phi) * Math.cos(thetaAnim);
        const y3d = Math.cos(p.phi) * Math.cos(angleV) - Math.sin(p.phi) * Math.sin(thetaAnim) * Math.sin(angleV);
        const z3d = Math.cos(p.phi) * Math.sin(angleV) + Math.sin(p.phi) * Math.sin(thetaAnim) * Math.cos(angleV);

        const screenX = CENTER_X + x3d * RADIUS;
        const screenY = CENTER_Y + y3d * RADIUS * 0.88;
        const depth = (z3d + 1) / 2;

        return { ...p, screenX, screenY, depth, z: z3d };
      });

      // Trier du plus loin au plus proche
      projected.sort((a, b) => a.depth - b.depth);

      // Dessiner les connexions entre particules proches (effet réseau)
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const pa = projected[i];
          const pb = projected[j];
          const dx = pa.screenX - pb.screenX;
          const dy = pa.screenY - pb.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS * 0.7) {
            const avgDepth = (pa.depth + pb.depth) / 2;
            const opacity = (1 - dist / (RADIUS * 0.7)) * avgDepth * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45,112,96,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pa.screenX, pa.screenY);
            ctx.lineTo(pb.screenX, pb.screenY);
            ctx.stroke();
          }
        }
      }

      // Dessiner les particules-texte
      projected.forEach(p => {
        const depth = p.depth;
        const opacity = 0.2 + depth * 0.8;
        const fontSize = Math.round((p.baseSize * 0.6 + depth * p.baseSize * 0.7));

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `${depth > 0.6 ? '700' : '400'} ${fontSize}px 'Sora', Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (p.isGold) {
          ctx.fillStyle = GOLD;
          // Léger glow pour les symboles or au premier plan
          if (depth > 0.7) {
            ctx.shadowColor = GOLD;
            ctx.shadowBlur = 6;
          }
        } else {
          ctx.fillStyle = depth > 0.5 ? GREEN_LIGHT : GREEN;
        }

        ctx.fillText(p.symbol, p.screenX, p.screenY);
        ctx.restore();

        if (depth > 0.85) {
          ctx.save();
          ctx.globalAlpha = (depth - 0.85) * 0.4;
          ctx.font = `800 ${fontSize + 3}px 'Sora', Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = p.isGold
            ? 'rgba(196,163,90,0.3)'
            : 'rgba(61,144,128,0.25)';
          ctx.filter = 'blur(3px)';
          ctx.fillText(p.symbol, p.screenX, p.screenY);
          ctx.filter = 'none';
          ctx.restore();
        }
      });

      // Pulse lent : oscille entre 0 et 1 sur ~4 secondes
      const pulse = (Math.sin(angle * 2) + 1) / 2;
      const glowRadius = RADIUS * (0.22 + pulse * 0.08);
      const glowOpacity = 0.05 + pulse * 0.06;

      const gradient = ctx.createRadialGradient(
        CENTER_X, CENTER_Y, 0,
        CENTER_X, CENTER_Y, glowRadius
      );
      gradient.addColorStop(0, `rgba(196,163,90,${glowOpacity * 1.5})`);
      gradient.addColorStop(0.4, `rgba(45,112,96,${glowOpacity})`);
      gradient.addColorStop(1, 'rgba(45,112,96,0)');
      ctx.beginPath();
      ctx.arc(CENTER_X, CENTER_Y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 0 20px rgba(45,112,96,0.3))',
      }}
    />
  );
}
