"use client";

import { useGameStore } from "@/stores/game";
import { useEffect, useMemo, useRef, useState } from "react";

const CURVE_POINTS_COUNT = 80;
const COUNTDOWN_SERVER_DRIFT_MS = 4000;

function getPhaseColor(phase: string, crashed: boolean) {
  if (crashed) {
    return "#EF4444";
  }

  if (phase === "waiting" || phase === "start") {
    return "#FBBF24";
  }

  return "#22C55E";
}

export function CurveDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useGameStore((state) => state.phase);
  const endsAt = useGameStore((state) => state.endsAt);
  const currentMultiplier = useGameStore((state) => state.multiplier);
  const [now, setNow] = useState(() => Date.now());
  const crashed = phase === "crash";
  const phaseColor = getPhaseColor(phase, crashed);
  const countdownSeconds =
    phase === "waiting" && endsAt
      ? Math.max(
          0,
          Math.ceil(
            (endsAt.getTime() - COUNTDOWN_SERVER_DRIFT_MS - now) / 1000,
          ),
        )
      : 0;
  const curvePoints = useMemo(
    () =>
      Array.from({ length: CURVE_POINTS_COUNT }, (_, index) => {
        const progress = index / (CURVE_POINTS_COUNT - 1);
        const x = progress * 10;
        const y = 1 + (currentMultiplier - 1) * progress ** 2;

        return { x, y };
      }),
    [currentMultiplier],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (phase === "waiting" || phase === "start") {
      return;
    }

    const maxX = Math.max(...curvePoints.map((point) => point.x));
    const maxY = Math.max(...curvePoints.map((point) => point.y));
    const scaleX = (width - 40) / Math.max(maxX, 1);
    const scaleY = (height - 40) / Math.max(maxY, 1.5);

    ctx.strokeStyle = crashed ? "#EF4444" : "#22C55E";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    curvePoints.forEach((point, index) => {
      const x = 20 + point.x * scaleX;
      const y = height - 20 - point.y * scaleY;

      if (index === 0) {
        ctx.moveTo(x, y);
        return;
      }

      ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = crashed
      ? "rgba(239, 68, 68, 0.15)"
      : "rgba(34, 197, 94, 0.15)";
    ctx.beginPath();
    curvePoints.forEach((point, index) => {
      const x = 20 + point.x * scaleX;
      const y = height - 20 - point.y * scaleY;

      if (index === 0) {
        ctx.moveTo(x, y);
        return;
      }

      ctx.lineTo(x, y);
    });
    ctx.lineTo(20 + maxX * scaleX, height - 20);
    ctx.lineTo(20, height - 20);
    ctx.closePath();
    ctx.fill();
  }, [curvePoints, crashed, phase]);

  return (
    <section className="relative flex min-h-90 flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#1A1F2E] bg-[#0E1119] p-6">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at bottom left, ${phaseColor} 0%, transparent 60%)`,
        }}
      />

      <div className="absolute left-6 top-6 rounded-full border border-[#1A1F2E] bg-[#111620] px-3 py-1">
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: phaseColor }}
        >
          {phase}
        </span>
      </div>

      {phase === "waiting" || phase === "start" ? (
        <div className="relative z-10 text-center">
          <div
            className="font-mono text-6xl tracking-tighter"
            style={{ color: phaseColor }}
          >
            {phase === "waiting" ? `${countdownSeconds}s` : "1.00x"}
          </div>
          <div className="mt-2 text-[#7A8599]">Next round starting...</div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="absolute inset-0 size-full"
          />
          <div className="relative z-10 text-center">
            <div
              className={`font-mono text-8xl tracking-tighter transition-all ${
                crashed ? "animate-pulse" : ""
              }`}
              style={{
                color: phaseColor,
                textShadow: `0 0 30px ${phaseColor}`,
              }}
            >
              {currentMultiplier.toFixed(2)}x
            </div>
            {crashed ? (
              <div className="mt-4 text-2xl text-[#EF4444] animate-pulse">
                CRASHED
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
