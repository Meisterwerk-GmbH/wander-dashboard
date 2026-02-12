import { useState } from "react";

export default function DogToggle() {
  const [dogEnabled, setDogEnabled] = useState(false);

  return (
    <>
      <style>{`
        @keyframes dogRun {
          0% { transform: translateX(-10vw); }
          49.9% { transform: translateX(95vw); }
          50% { transform: translateX(-10vw); }
          100% { transform: translateX(95vw); }
        }
        @keyframes dogHop {
          0%, 100% { transform: scaleX(-1) translateY(0) rotate(0deg); }
          50% { transform: scaleX(-1) translateY(-24px) rotate(-8deg); }
        }
        @keyframes dogShadow {
          0%, 100% { transform: scaleX(1); opacity: 0.4; }
          50% { transform: scaleX(0.7); opacity: 0.2; }
        }
        @keyframes dogTrackBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setDogEnabled((current) => !current)}
        className="glass fixed bottom-24 left-4 z-30 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-100 transition hover:bg-white/10 sm:left-8 lg:left-16"
        aria-pressed={dogEnabled}
      >
        Tofu Toggle
      </button>

      {dogEnabled ? (
        <div
          className="pointer-events-none fixed bottom-[72px] left-0 z-[15] w-full max-w-[960px] animate-[dogTrackBob_3.6s_ease-in-out_infinite]"
          aria-hidden="true"
        >
          <div className="relative inline-flex items-center justify-center animate-[dogRun_10s_linear_infinite]">
            <span className="inline-block text-[clamp(3.4rem,4.4vw,4.8rem)] [filter:drop-shadow(0_10px_18px_rgba(0,0,0,0.45))] animate-[dogHop_0.7s_ease-in-out_infinite]">
              🐕
            </span>
            <span className="absolute top-full mt-1 h-[0.35rem] w-[2.2rem] rounded-full bg-black/40 blur-[1px] animate-[dogShadow_0.7s_ease-in-out_infinite]" />
          </div>
        </div>
      ) : null}
    </>
  );
}
