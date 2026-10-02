import Link from "next/link";
import Gallery from "@/components/Gallery";
import HeroDemo from "@/components/HeroDemo";

export default function Home() {
  return (
    <main className="landing">
      <section className="l-hero">
        <nav className="l-nav">
          <Link href="/" className="brand-sm">
            <span className="brand-mark">✦</span> Shubh Cards
          </Link>
          <Link href="#designs" className="btn-outline-light">
            Browse designs
          </Link>
        </nav>
        <div className="l-hero-inner">
          <div>
            <p className="l-kicker">Digital invitations · Business cards</p>
            <h1 className="l-title">
              Invitations that feel <em>real</em> in their hands
            </h1>
            <p className="l-sub">Velvet stock, hot-foil gold that catches the light as the phone tilts, a wax-sealed envelope that opens, pages that turn — with every ritual, a live countdown, maps and RSVPs built in.</p>
            <div className="l-ctas">
              <Link href="#designs" className="btn-gold">
                Create your card
              </Link>
              <Link href="/preview/royal-jharokha" className="btn-outline-light">
                Open a sample
              </Link>
            </div>
            <div className="l-feats">
              <span>Envelope & wax seal</span>
              <span>3D page turn</span>
              <span>Light-reactive foil</span>
              <span>Shri Ganesh & tradition symbols</span>
              <span>Countdown & maps</span>
              <span>RSVP tracking</span>
              <span>Name on every envelope</span>
              <span>MP4 for WhatsApp</span>
              <span>Print-ready PDF</span>
            </div>
          </div>
          <div className="l-hero-card">
            <HeroDemo />
          </div>
        </div>
      </section>

      <section className="l-section" id="designs">
        <h2 className="l-h2">Choose a design</h2>
        <p className="l-lead">Every design is built from real materials — paper, foil, wax — and can be recoloured to match your theme.</p>
        <Gallery />
      </section>

      <section className="l-section">
        <h2 className="l-h2">How it works</h2>
        <div className="l-how">
          <div className="l-step">
            <b>1</b>
            <h4>Pick a design</h4>
            <p>Wedding, engagement, griha pravesh, shop opening or a business card.</p>
          </div>
          <div className="l-step">
            <b>2</b>
            <h4>Add your details</h4>
            <p>Names, blessings, every event with its venue — see each page update live.</p>
          </div>
          <div className="l-step">
            <b>3</b>
            <h4>Share personally</h4>
            <p>One link, or a personal link per family with their name on the envelope.</p>
          </div>
          <div className="l-step">
            <b>4</b>
            <h4>Track RSVPs</h4>
            <p>Guests reply from the card. Download the video & PDF for anyone who wants them.</p>
          </div>
        </div>
      </section>
      <footer className="l-foot">Shubh Cards · Made with care in India</footer>
    </main>
  );
}
