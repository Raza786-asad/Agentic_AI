import React, { useEffect, useRef } from 'react';

export default function RoadexHero3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 600;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    let mouse = { x: canvas.width / 2, y: canvas.height / 2, targetX: canvas.width / 2, targetY: canvas.height / 2 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Create 3D Nodes
    const nodeCount = 42;
    const nodes = [];
    const types = ['employee', 'skill', 'department', 'core'];

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Core central node
    nodes.push({
      x: 0, y: 0, z: 0,
      radius: 28,
      type: 'core',
      label: 'ROADEX AI CORE',
      color: '#06B6D4',
      glow: '#3B82F6',
      vx: 0, vy: 0, vz: 0
    });

    // Orbiting nodes
    for (let i = 1; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const dist = 160 + Math.random() * 120;

      const type = types[i % 3];
      let label = '';
      let color = '#3B82F6';

      if (type === 'employee') {
        label = `Emp #${100 + i}`;
        color = '#3B82F6';
      } else if (type === 'skill') {
        const skills = ['Python', 'GIS', 'Hydro', 'Leadership', 'AI/ML', 'Data', 'Emergency'];
        label = skills[i % skills.length];
        color = '#06B6D4';
      } else {
        const depts = ['Engineering', 'Emergency', 'IT', 'Public', 'Operations'];
        label = depts[i % depts.length];
        color = '#8B5CF6';
      }

      nodes.push({
        x: dist * Math.cos(theta) * Math.sin(phi),
        y: dist * Math.sin(theta) * Math.sin(phi),
        z: dist * Math.cos(phi),
        radius: 6 + Math.random() * 6,
        type,
        label,
        color,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Animation Loop
    let angleX = 0.002;
    let angleY = 0.003;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const rotX = (mouse.y - height / 2) * 0.00008 + angleX;
      const rotY = (mouse.x - width / 2) * 0.00008 + angleY;

      // Project & Render Nodes
      const projected = nodes.map((node, index) => {
        // Rotation math around 3D axes
        let x = node.x;
        let y = node.y;
        let z = node.z;

        if (index !== 0) {
          // Rotate around Y
          let cosY = Math.cos(rotY);
          let sinY = Math.sin(rotY);
          let x1 = x * cosY - z * sinY;
          let z1 = z * cosY + x * sinY;

          // Rotate around X
          let cosX = Math.cos(rotX);
          let sinX = Math.sin(rotX);
          let y1 = y * cosX - z1 * sinX;
          let z2 = z1 * cosX + y * sinX;

          node.x = x1;
          node.y = y1;
          node.z = z2;
        }

        // Perspective projection
        const fov = 400;
        const scale = fov / (fov + node.z + 250);
        const projX = centerX + node.x * scale;
        const projY = centerY + node.y * scale;

        return { ...node, projX, projY, scale, index };
      });

      // Sort by Z for proper depth sorting
      projected.sort((a, b) => b.z - a.z);

      // Draw Connecting Energy Lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        const n1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const n2 = projected[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dz = n1.z - n2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.35 * Math.min(n1.scale, n2.scale);
            const gradient = ctx.createLinearGradient(n1.projX, n1.projY, n2.projX, n2.projY);
            gradient.addColorStop(0, n1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, n2.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));

            ctx.beginPath();
            ctx.moveTo(n1.projX, n1.projY);
            ctx.lineTo(n2.projX, n2.projY);
            ctx.strokeStyle = gradient;
            ctx.stroke();
          }
        }
      }

      // Render 3D Nodes
      projected.forEach((node) => {
        const size = node.radius * node.scale;
        if (size <= 0) return;

        // Outer Glow Circle
        const glowRad = size * 2.5;
        const radialGrad = ctx.createRadialGradient(
          node.projX, node.projY, size * 0.2,
          node.projX, node.projY, glowRad
        );
        radialGrad.addColorStop(0, node.color);
        radialGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(node.projX, node.projY, glowRad, 0, Math.PI * 2);
        ctx.fillStyle = radialGrad;
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Solid Core Circle
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, size, 0, Math.PI * 2);
        ctx.fillStyle = node.index === 0 ? '#00F0FF' : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15 * node.scale;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label Text
        if (node.scale > 0.75) {
          ctx.fillStyle = '#E2E8F0';
          ctx.font = `${Math.max(9, Math.floor(10 * node.scale))}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.projX, node.projY + size + 14 * node.scale);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-slate-950/60 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center">
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 tracking-wider uppercase flex items-center gap-2 pointer-events-none backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        Interactive 3D Network Core &bull; Move Cursor to Rotate
      </div>
    </div>
  );
}
