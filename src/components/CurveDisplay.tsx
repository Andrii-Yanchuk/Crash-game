"use client";

import { useGameStore } from "@/stores/game";
import { useMultiplierStore } from "@/stores/multiplier";
import { memo, useEffect, useRef } from "react";

const CURVE_POINTS_COUNT = 80;
const COUNTDOWN_SERVER_DRIFT_MS = 1000;

function getPhaseColor(phase: string, crashed: boolean) {
  if (crashed) {
    return "#EF4444";
  }

  if (phase === "waiting" || phase === "starting") {
    return "#FBBF24";
  }

  return "#22C55E";
}

function getCurvePoints(multiplier: number) {
  return Array.from({ length: CURVE_POINTS_COUNT }, (_, index) => {
    const progress = index / (CURVE_POINTS_COUNT - 1);
    const x = progress * 10;
    const y = 1 + (multiplier - 1) * progress ** 2;

    return { x, y };
  });
}

function drawCurve(
  canvas: HTMLCanvasElement,
  multiplier: number,
  phase: string,
  crashed: boolean,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (phase === "waiting" || phase === "starting") {
    return;
  }

  const curvePoints = getCurvePoints(multiplier);
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
}

function CurveDisplayComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const multiplierTextRef = useRef<HTMLDivElement>(null);
  const countdownTextRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef("waiting");
  const crashedRef = useRef(false);
  const phase = useGameStore((state) => state.phase);
  const endsAt = useGameStore((state) => state.endsAt);
  const crashed = phase === "crashed";
  const phaseColor = getPhaseColor(phase, crashed);
  const initialMultiplier = useMultiplierStore.getState().multiplier;

  useEffect(() => {
    if (phase !== "waiting" || !endsAt) {
      return;
    }

    const countdownEndsAt = endsAt;

    function updateCountdown() {
      const countdownSeconds = Math.max(
        0,
        Math.ceil(
          (countdownEndsAt.getTime() -
            COUNTDOWN_SERVER_DRIFT_MS -
            Date.now()) /
            1000,
        ),
      );

      if (countdownTextRef.current) {
        countdownTextRef.current.textContent = `${countdownSeconds}s`;
      }
    }

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 250);

    return () => window.clearInterval(intervalId);
  }, [endsAt, phase]);

  useEffect(() => {
    phaseRef.current = phase;
    crashedRef.current = crashed;

    const multiplier = useMultiplierStore.getState().multiplier;

    if (multiplierTextRef.current) {
      multiplierTextRef.current.textContent = `${multiplier.toFixed(2)}x`;
    }

    if (canvasRef.current) {
      drawCurve(canvasRef.current, multiplier, phase, crashed);
    }
  }, [crashed, phase]);

  useEffect(() => {
    return useMultiplierStore.subscribe((state) => {
      const multiplier = state.multiplier;

      if (multiplierTextRef.current) {
        multiplierTextRef.current.textContent = `${multiplier.toFixed(2)}x`;
      }

      if (canvasRef.current) {
        drawCurve(
          canvasRef.current,
          multiplier,
          phaseRef.current,
          crashedRef.current,
        );
      }
    });
  }, []);

  return (
    <section className="relative flex h-full max-h-263.5 min-h-90 w-full max-w-375 flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#1A1F2E] bg-[#0E1119] p-6">
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

      {phase === "waiting" || phase === "starting" ? (
        <div className="relative z-10 text-center">
          <div
            ref={countdownTextRef}
            className="font-mono text-6xl tracking-tighter"
            style={{ color: phaseColor }}
          >
            {phase === "waiting" ? "0s" : "1.00x"}
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
              ref={multiplierTextRef}
              className={`font-mono text-8xl tracking-tighter transition-all ${
                crashed ? "animate-pulse" : ""
              }`}
              style={{
                color: phaseColor,
                textShadow: `0 0 30px ${phaseColor}`,
              }}
            >
              {initialMultiplier.toFixed(2)}x
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

export const CurveDisplay = memo(CurveDisplayComponent);
