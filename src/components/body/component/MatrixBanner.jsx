import {useEffect, useRef, useState} from "react";

const FONT_SIZE = 16;
const COLORS = ["#f4eee0", "#f2abc2", "#ed9b65", "#9bb58b"];

const PHRASES = [
  ["There\u2019s a better way.", "Let\u2019s build it."],
  ["A smarter path exists.", "Let\u2019s create it."],
  ["There\u2019s a cleaner approach.", "Let\u2019s ship it."],
  ["Better ideas are out there.", "Let\u2019s make them real."],
  ["A faster route is possible.", "Let\u2019s engineer it."],
  ["There\u2019s a smarter solution.", "Let\u2019s bring it to life."]
];
const ROTATE_MS = 3000;

const MatrixBanner = () => {
  const canvasRef = useRef(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => setPhraseIndex((i) => (i + 1) % PHRASES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let drops = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      const {width, height} = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#132e29";
      ctx.fillRect(0, 0, width, height);
      drops = Array.from({length: Math.ceil(width / FONT_SIZE)}, () => ({
        y: Math.random() * -40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (time) => {
      raf = requestAnimationFrame(draw);
      if (time - last < 70) return;
      last = time;
      const {width, height} = canvas.getBoundingClientRect();
      // Translucent fill leaves a fading trail behind each falling digit.
      ctx.fillStyle = "rgba(19, 46, 41, 0.14)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `600 ${FONT_SIZE}px "SFMono-Regular", Menlo, Consolas, monospace`;
      drops.forEach((drop, i) => {
        ctx.fillStyle = drop.color;
        ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * FONT_SIZE, drop.y * FONT_SIZE);
        if (drop.y * FONT_SIZE > height && Math.random() > 0.96) {
          drop.y = 0;
          drop.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        drop.y += 1;
      });
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduceMotion) {
      for (let i = 0; i < 40; i += 1) draw(i * 100);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <section className="dp-banner" aria-label="Home banner">
    <canvas ref={canvasRef} className="dp-banner__canvas" aria-hidden="true"/>
    <div className="dp-banner__content">
      <h1 className="dp-banner__title" key={phraseIndex} aria-live="off">
        {PHRASES[phraseIndex][0]}
        <em> {PHRASES[phraseIndex][1]}</em>
      </h1>
      <p className="dp-banner__sub">
        Senior Staff Frontend Engineer, 19 years turning real problems into fast, maintainable web experiences.
      </p>
    </div>
  </section>;
};

export default MatrixBanner;
