// Background layers: markup identical to the original index.html #bg block.
// The engine fills #gm (gaming mountains + embers) and drives the videos.
export default function Background() {
  return (
    <div id="bg">
      <div className="L l-def"></div>
      <div className="L l-game" id="gm">
        <video className="bgv" data-dur="14.81" muted loop playsInline preload="none" aria-hidden="true" data-src="/videos/game.mp4"></video>
        <div className="sun"></div>
      </div>
      <div className="L l-ai">
        <video className="bgv" muted playsInline preload="none" aria-hidden="true" data-dur="10.0" data-src="/videos/tech1.mp4"></video>
        <video className="bgv" muted playsInline preload="none" aria-hidden="true" data-dur="20.02" data-src="/videos/tech2.mp4"></video>
      </div>
      <div className="L l-cyber">
        <div className="csun"></div>
        <div className="grid"></div>
        <video className="bgv" muted loop playsInline preload="none" aria-hidden="true" data-dur="10.0" data-src="/videos/cyber.mp4"></video>
      </div>
      <div className="L l-simple">
        <i></i><i></i><i></i>
        <video className="bgv" data-dur="22.82" muted loop playsInline preload="none" aria-hidden="true" data-src="/videos/calm.mp4"></video>
      </div>
    </div>
  );
}
