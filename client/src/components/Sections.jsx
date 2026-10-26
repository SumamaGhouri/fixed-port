// Every section's markup is the same as the original template strings in js/main.js.
// Direct children of .box get class "c" and --i = their index (as the original add() did).
const ci = (i) => ({ '--i': i });
const Chips = ({ items, i }) => (
  <div className="chips c" style={ci(i)}>
    {items.map((x, k) => (
      <span key={k} className="pop" style={ci(k)}>{x}</span>
    ))}
  </div>
);

function Section({ id, side, children }) {
  return (
    <section id={id} className={side < 0 ? 'r' : undefined}>
      <div className="box">{children}</div>
    </section>
  );
}

export default function Sections({ data }) {
  const D = data;
  const C = D.contact;
  let n = 0;
  const secs = [];

  secs.push(
    <Section key="hero" id={'s' + n++} side={1}>
      <div className="tag c" style={ci(0)}>👋 Hello, I’m</div>
      <h1 className="grad c" style={ci(1)}>{D.name}</h1>
      <p className="role c" style={ci(2)}>I’m a <b id="role"></b><i className="cur"></i></p>
      <p className="c" style={{ ...ci(3), minHeight: '3.4em' }}><span id="tl" className="tl"></span></p>
      <div className="c" style={ci(4)}>
        <a className="btn" href="#s1">Start the tour 🚀</a>
        <a className="btn o" href="#s8">Say hi</a>
      </div>
      <p className="hint c" style={ci(5)}>↓ Scroll, it’s free, I promise</p>
    </Section>
  );

  secs.push(
    <Section key="about" id={'s' + n++} side={-1}>
      <div className="tag c" style={ci(0)}>✨ About me</div>
      <h2 className="c" style={ci(1)}>Nice to meet you</h2>
      <p className="c" style={ci(2)}>{D.about}</p>
      <Chips items={D.strengths} i={3} />
    </Section>
  );

  D.companies.forEach((c, k) => {
    secs.push(
      <Section key={'co' + k} id={'s' + n++} side={k === 1 ? -1 : 1}>
        <div className="tag c" style={ci(0)}>💼 Experience {k + 1} / {D.companies.length}</div>
        <h2 className="c" style={ci(1)}>{c.name}</h2>
        <div className="card pop c" style={ci(2)}>
          <small>{c.when}</small>
          <h3>{c.role}</h3>
          <ul>{c.pts.map((x, j) => <li key={j}>{x}</li>)}</ul>
        </div>
      </Section>
    );
  });

  secs.push(
    <Section key="skills" id={'s' + n++} side={-1}>
      <div className="tag c" style={ci(0)}>🎓 Education &amp; skills</div>
      <h2 className="c" style={ci(1)}>Always learning</h2>
      {D.edu.map((e, i) => (
        <div key={i} className="card pop c" style={ci(2 + i)}>
          <small>{e.w}</small>
          <h3>{e.n}</h3>
          <p>{e.d}</p>
        </div>
      ))}
      <Chips items={D.skills} i={2 + D.edu.length} />
    </Section>
  );

  secs.push(
    <Section key="certs" id={'s' + n++} side={1}>
      <div className="tag c" style={ci(0)}>🏆 Certificates</div>
      <h2 className="c" style={ci(1)}>Proof I do my homework</h2>
      {D.certs.map((c, i) => (
        <div key={i} className="card pop c" style={ci(2 + i)}>
          <h3>{c.name}</h3>
          <small>{c.by}</small>
        </div>
      ))}
    </Section>
  );

  secs.push(
    <Section key="projects" id={'s' + n++} side={-1}>
      <div className="tag c" style={ci(0)}>🛠 Projects</div>
      <h2 className="c" style={ci(1)}>Selected work</h2>
      {D.projects.map((p, i) => (
        <div key={i} className="card pop c" style={ci(2 + i)}>
          <h3>{p.name}</h3>
          <p>{p.text}</p>
          <small><a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>View ↗</a></small>
        </div>
      ))}
    </Section>
  );

  secs.push(
    <Section key="contact" id={'s' + n++} side={1}>
      <div className="tag c" style={ci(0)}>📬 Contact</div>
      <h2 className="c" style={ci(1)}>Let’s build something awesome</h2>
      <p className="c" style={ci(2)}>{C.email}<br />{C.phone}<br />{C.loc}</p>
      <div className="c" style={ci(3)}>
        <a className="btn" href={'mailto:' + C.email}>Email me</a>
        <a className="btn o" href={'tel:' + C.phone.replace(/\D/g, '')}>Call</a>
        <a className="btn o" href="/Sumama_Ghouri_CV.pdf">Download CV</a>
      </div>
      <p className="foot c" style={ci(4)}>Designed &amp; coded by Sumama Ghouri · built with three.js</p>
    </Section>
  );

  return <main>{secs}</main>;
}
