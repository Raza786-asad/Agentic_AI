import React, { useEffect, useRef } from 'react';

export default function SkillConstellation3D({ employee }) {
  const canvasRef = useRef(null);

  const skills = [
    { name: 'Communication', current: 94, required: 90, gap: 0, status: 'Strong', color: '#10B981' },
    { name: 'Leadership', current: 78, required: 85, gap: 7, status: 'Moderate', color: '#F59E0B' },
    { name: 'Data Analysis', current: 72, required: 90, gap: 18, status: 'Critical Gap', color: '#EF4444' },
    { name: 'Technical Skills', current: 88, required: 85, gap: 0, status: 'Strong', color: '#10B981' },
    { name: 'Problem Solving', current: 91, required: 90, gap: 0, status: 'Strong', color: '#10B981' },
    { name: 'Emergency Response', current: 54, required: 88, gap: 34, status: 'Critical Gap', color: '#EF4444' },
    { name: 'Digital Skills', current: 65, required: 85, gap: 20, status: 'Critical Gap', color: '#EF4444' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
      canvas.height = 420;
    };
    handleResize();

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const orbitRadius = Math.min(centerX, centerY) - 80;

      angle += 0.008;

      // Draw Center Avatar Node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 36, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((employee?.name || 'Rahul Sharma').split(' ')[0], centerX, centerY - 6);
      ctx.fillStyle = '#06B6D4';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('EMPLOYEE', centerX, centerY + 8);

      // Draw Orbiting Skill Nodes
      const totalSkills = skills.length;
      skills.forEach((skill, idx) => {
        const theta = angle + (idx * Math.PI * 2) / totalSkills;
        const x = centerX + orbitRadius * Math.cos(theta);
        const y = centerY + orbitRadius * Math.sin(theta) * 0.75; // Isometric tilt

        // Draw connecting line to center
        const lineGrad = ctx.createLinearGradient(centerX, centerY, x, y);
        lineGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        lineGrad.addColorStop(1, skill.color + '88');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Skill Outer Ring
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#0B0F19';
        ctx.shadowColor = skill.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = skill.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Score percentage inside node
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText(`${skill.current}%`, x, y);

        // Skill Label Text
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(skill.name, x, y + 32);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [employee]);

  return (
    <div className="relative w-full h-[420px] rounded-3xl bg-slate-950/50 border border-cyan-500/20 backdrop-blur-xl p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center z-10">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-cyan-400 font-mono tracking-wider">
            3D SKILL CONSTELLATION MAP
          </span>
          <h3 className="text-sm font-black text-white">Interactive Competency Network</h3>
        </div>
        <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold rounded-full">
          Real-Time Orbit
        </span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0" />
    </div>
  );
}
