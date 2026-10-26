// Fixed UI chrome: canvas, progress bar, side dots, section HUD, marquee, preloader.
export function Chrome({ count }) {
  return (
    <>
      <canvas id="c"></canvas>
      <div id="bar"></div>
      <nav id="nav">
        {Array.from({ length: count }, (_, i) => (
          <a key={i} href={'#s' + i}></a>
        ))}
      </nav>
      <div id="hud"><b id="hn">01</b><span id="ht">Intro</span></div>
      <div id="mq"><span></span></div>
    </>
  );
}

export function Preloader() {
  return (
    <div id="pre"><b id="pn">000</b><i></i></div>
  );
}

export function Controls() {
  return (
    <div id="sw">
      <button id="aub" aria-label="Auto scroll tour">⏸ Auto tour</button>
      <button id="swb" aria-label="Change background">🎨 Background</button>
      <div id="swm">
        <button data-b="def">🌈 Colorful (default)</button>
        <button data-b="game">🎮 Gaming</button>
        <button data-b="ai">🤖 AI Tech</button>
        <button data-b="cyber">🌆 Cyberpunk</button>
        <button data-b="simple">☁️ Simple &amp; calm</button>
      </div>
    </div>
  );
}
