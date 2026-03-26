import { useRef, useState, useEffect, useCallback } from "react";

export interface ExcavationGameProps {
  dinoName: string;
  skeletonImageUrl: string;
  biome?: string;
  onComplete: () => void;
  onClose?: () => void;
}

const BRUSH_RADIUS = 44;
const COMPLETE_THRESHOLD = 0.9;
const PROGRESS_CHECK_MS = 250;
const CELEBRATE_MS = 2600;
const CANVAS_SIZE = 640;

function drawDirt(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;

  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, "#7a4a20");
  g.addColorStop(0.3, "#5c3310");
  g.addColorStop(0.7, "#6b3e1a");
  g.addColorStop(1, "#4a2608");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 600; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 4 + 1;
    ctx.fillStyle =
      Math.random() > 0.5
        ? `rgba(200,160,80,${Math.random() * 0.3 + 0.05})`
        : `rgba(30,10,0,${Math.random() * 0.3 + 0.05})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    for (let j = 0; j < 4; j++) {
      ctx.lineTo(Math.random() * width, Math.random() * height);
    }
    ctx.stroke();
  }
}

export function ExcavationGame({
  dinoName,
  skeletonImageUrl,
  biome = "Wueste",
  onComplete,
  onClose,
}: ExcavationGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckRef = useRef(0);
  const isDrawingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"digging" | "celebrating" | "complete">("digging");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawDirt(canvas);
  }, []);

  const checkProgress = useCallback(() => {
    const now = Date.now();
    if (now - lastCheckRef.current < PROGRESS_CHECK_MS) return;
    lastCheckRef.current = now;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    const total = data.length / 16;
    for (let i = 3; i < data.length; i += 16) {
      if (data[i]! < 128) transparent++;
    }
    const pct = transparent / total;
    setProgress(pct);
    if (pct >= COMPLETE_THRESHOLD) {
      setPhase("celebrating");
      onComplete();
      setTimeout(() => setPhase("complete"), CELEBRATE_MS);
    }
  }, [onComplete]);

  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      if (lastPosRef.current) {
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      lastPosRef.current = { x, y };
      checkProgress();
    },
    [checkProgress],
  );

  function getCanvasXY(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasRef.current!.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current!.height / rect.height),
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "digging") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPosRef.current = null;
    scratch(...Object.values(getCanvasXY(e)) as [number, number]);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || phase !== "digging") return;
    scratch(...Object.values(getCanvasXY(e)) as [number, number]);
  }

  function onPointerUp() {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }

  const pct = Math.min(Math.round((progress * 100) / COMPLETE_THRESHOLD), 100);

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 px-5 py-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #2a1505 0%, #1a0c02 60%, #0d0600 100%)",
        backgroundImage: "linear-gradient(180deg, #2a1505 0%, #1a0c02 60%, #0d0600 100%)",
      }}
    >
      {/* Confetti */}
      {phase !== "digging" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              className="absolute -top-6 w-2.5 h-3.5 rounded-sm"
              style={{
                left: `${7 + (i * 4.5) % 90}%`,
                background: i % 3 === 0 ? "#ffb347" : i % 3 === 1 ? "#e8f8ff" : "#84c75d",
                animation: `confetti-fall 2.4s linear ${(i * 0.12) % 1.5}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Overlay */}
      {phase === "celebrating" && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(255,211,80,0.96), rgba(255,160,50,0.97) 55%, rgba(242,95,113,0.95))",
            animation: "celebrate-in 0.35s cubic-bezier(0.22,1.4,0.36,1) both",
          }}
        >
          <span className="text-7xl" style={{ animation: "star-spin 2.4s linear infinite", filter: "drop-shadow(0 0 24px rgba(255,255,255,0.9))" }}>⭐</span>
          <p
            className="text-4xl md:text-6xl font-black text-white tracking-wider"
            style={{ textShadow: "0 4px 0 rgba(180,80,0,0.5), 0 0 40px rgba(255,255,255,0.7)", animation: "title-bounce 0.6s cubic-bezier(0.22,1.5,0.36,1) 0.2s both" }}
          >
            GESCHAFFT!
          </p>
          <p
            className="text-lg md:text-xl text-white/90"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)", animation: "title-bounce 0.6s cubic-bezier(0.22,1.5,0.36,1) 0.4s both" }}
          >
            {dinoName} gefunden! 🦕
          </p>
        </div>
      )}

      {/* Header */}
      <div className="relative w-full max-w-[420px] text-center z-10">
        {onClose && phase === "digging" && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 font-black grid place-items-center transition-colors"
          >
            ✕
          </button>
        )}
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#ffc850]/85 mb-1">
          {phase === "complete" ? "🎉 Fossil freigelegt!" : `🦴 ${biome}`}
        </p>
        <h2 className="text-xl md:text-2xl font-black text-[#fff8ec]" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          {phase === "complete" ? dinoName : "Wisch den Dreck weg!"}
        </h2>
      </div>

      {/* Dig Stage */}
      <div
        className="relative rounded-3xl overflow-hidden z-10"
        style={{
          width: "min(360px, 88vw)",
          aspectRatio: "1",
          boxShadow: "0 0 0 3px rgba(180,120,40,0.4), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Skeleton bg */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "radial-gradient(circle at center, #f5e8c5 0%, #e8d5a0 100%)" }}
        >
          <img
            src={skeletonImageUrl}
            alt={`${dinoName} Skelett`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Dirt canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`absolute inset-0 w-full h-full touch-none z-10 ${
            phase !== "digging" ? "pointer-events-none opacity-0 transition-opacity duration-500" : "cursor-crosshair"
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {/* Swipe hint */}
        {phase === "digging" && pct < 5 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none z-20">
            <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>swipe</span>
            <span className="text-white text-[10px] font-black uppercase tracking-wider drop-shadow-lg bg-black/50 px-2 py-0.5 rounded-full">
              Mit dem Finger wischen!
            </span>
          </div>
        )}

        {/* Glow on complete */}
        {phase !== "digging" && (
          <div className="absolute inset-0 z-10 pointer-events-none" style={{
            background: "radial-gradient(circle at center, rgba(255,220,100,0.3) 0%, transparent 70%)",
            animation: "glow-pulse 2s ease-in-out infinite",
          }} />
        )}
      </div>

      {/* Progress */}
      {phase === "digging" && (
        <div className="w-full max-w-[360px] z-10">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #84c75d, #ffc850)" }}
            />
          </div>
          <p className="text-[10px] font-bold text-white/50 text-center mt-1">{pct}% freigelegt</p>
        </div>
      )}

      {/* Complete CTA */}
      {phase === "complete" && (
        <div className="w-full max-w-[360px] z-10 flex flex-col gap-2">
          <p className="text-sm font-bold text-[#fff8ec]/80 text-center">
            Du hast das Skelett eines {dinoName} ausgegraben!
          </p>
          <button
            onClick={onClose ?? onComplete}
            className="w-full py-3 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-xl sticker-shadow-primary font-bold uppercase tracking-wider active-press-primary flex items-center justify-center gap-1.5 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            Weiter!
          </button>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebrate-in {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes star-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes title-bounce {
          from { opacity: 0; transform: scale(0.4) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
