/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase F: vertical 4-step "How it works" for mobile.
 * Replaces the desktop 4-card grid.
 */

const STEPS = [
  {
    n: "01",
    title: "Aggregate",
    body: "We collect data from official .gov.in portals, NDSAP, and verified research sources.",
  },
  {
    n: "02",
    title: "Process",
    body: "An automated pipeline classifies, deduplicates, and structures every data point.",
  },
  {
    n: "03",
    title: "Surface",
    body: "32 modules per district expose the data in plain English (and 22 Indian languages soon).",
  },
  {
    n: "04",
    title: "Sustain",
    body: "Citizen-funded — no ads, no corporate sponsors, no data sale. Open source.",
  },
];

export function MobileHowItWorks() {
  return (
    <section
      className="ftp-m-section ftp-m-how-section"
      aria-labelledby="m-how-heading"
    >
      <header className="ftp-m-section-head">
        <h2 id="m-how-heading">🛠 HOW IT WORKS</h2>
      </header>
      <ol className="ftp-m-how-list">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span className="ftp-m-how-num">{s.n}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
