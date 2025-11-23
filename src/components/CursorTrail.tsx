import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Keep only recent points (last 1 second)
      const now = Date.now();
      pointsRef.current = pointsRef.current.filter(
        point => now - point.timestamp < 1000
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear canvas completely for full disappearance
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      if (points.length < 2) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Draw scribble trail
      const now = Date.now();

      for (let i = 0; i < points.length - 1; i++) {
        const point = points[i];
        const nextPoint = points[i + 1];
        const age = now - point.timestamp;
        const opacity = Math.max(0, 1 - age / 1000);

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);

        // Pen-like stroke with #1e3f66 color
        ctx.strokeStyle = `rgba(30, 63, 102, ${opacity * 0.6})`;
        ctx.lineWidth = 2 + Math.random() * 1.5; // Varying width for pen effect
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Add small dots for texture
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(30, 63, 102, ${opacity * 0.4})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[10000]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
