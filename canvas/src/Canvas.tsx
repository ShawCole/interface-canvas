import { useEffect, useRef, useState, type ReactNode } from 'react';

/** An infinite pan/zoom surface: wheel zooms about the pointer, drag on empty ground pans,
 *  trackpad two-finger scroll pans. The transform is one CSS matrix on a single layer. */
export function Canvas({ children, resetKey }: { children: ReactNode; resetKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 40, y: 60, k: 0.6 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  useEffect(() => { setT({ x: 40, y: 60, k: 0.6 }); }, [resetKey]);
  useEffect(() => {
    const el = ref.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        setT((s) => {
          const k = Math.min(3, Math.max(0.08, s.k * Math.exp(-e.deltaY * 0.0025)));
          return { k, x: px - (px - s.x) * (k / s.k), y: py - (py - s.y) * (k / s.k) };
        });
      } else {
        setT((s) => ({ ...s, x: s.x - e.deltaX, y: s.y - e.deltaY }));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  return (
    <div ref={ref} className="ic-canvas"
      // A mounted component that focuses itself scrolls the overflow:hidden container; the canvas moves by transform only.
      onScroll={(e) => { e.currentTarget.scrollTop = 0; e.currentTarget.scrollLeft = 0; }}
      onPointerDown={(e) => { if ((e.target as HTMLElement).closest('.ic-card')) return; drag.current = { x: e.clientX, y: e.clientY, ox: t.x, oy: t.y }; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (!drag.current) return; const d = drag.current; setT((s) => ({ ...s, x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y })); }}
      onPointerUp={() => { drag.current = null; }}>
      <div className="ic-layer" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})` }}>{children}</div>
      <div className="ic-zoom">{Math.round(t.k * 100)}%</div>
    </div>
  );
}
