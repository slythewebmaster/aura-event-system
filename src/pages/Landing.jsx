import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auraLogo from '../assets/aura_logo.png';
import heroImage from '../assets/hero.webp';
import heroAltImage from '../assets/hero1.png';
import aboutImage from '../assets/about.webp';
import experienceImage from '../assets/experience.webp';
import ticketingImage from '../assets/ticketing.webp';
import discoverImage from '../assets/discover.webp';
import whyImage from '../assets/why.webp';
import googleLogo from '../assets/google.png';
import stripeLogo from '../assets/stripe.png';
import youtubeLogo from '../assets/youtube.png';
import microsoftLogo from '../assets/microsoft.png';
import grabLogo from '../assets/grab.png';
import mediumLogo from '../assets/medium.png';
import socialLogo from '../assets/il.png';

function Landing() {
  const navigate = useNavigate();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Placeholder – in future, send to backend
    alert(`Thanks ${contactName || 'there'}! We will get in touch at ${contactEmail} about Aura Events.`);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="aura-landing">
      {/* Hero Section */}
      <section id="hero" className="aura-landing-hero">
        <div className="aura-landing-hero-grid">
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <img
              src={auraLogo}
              alt="Aura Events Logo"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '999px',
                  objectFit: 'cover',
                  boxShadow: '0 12px 32px rgba(129, 140, 248, 0.9)',
                }}
            />
            <div>
                <div
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.26em',
                    opacity: 0.9,
                    color: 'rgba(226, 232, 240, 0.86)',
                  }}
                >
                Aura Events
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(226, 232, 240, 0.8)' }}>Premium guest journeys, from invite to check‑in.</div>
              </div>
            </div>

            <div className="aura-hero-badge">
              <span
            style={{
                  width: 8,
                  height: 8,
                  borderRadius: '999px',
                  background: 'radial-gradient(circle at center, #22c55e 0%, #166534 70%)',
                  boxShadow: '0 0 12px rgba(34, 197, 94, 0.8)',
                }}
              />
              <span>Live check‑ins · Secure QR tickets · VIP ready</span>
            </div>

            <h1 className="aura-hero-title">Elevate your events with Aura ticketing.</h1>

            <p className="aura-hero-subtitle">
              Aura is the innovative event ticketing platform that revolutionizes the way you organize and track your events – combining
              streamlined ticketing, QR code check‑in, and real‑time insights in one powerful interface.
          </p>

            <div className="aura-hero-ctas">
            <button
              type="button"
              onClick={() => {
                  const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
                className="aura-btn aura-btn-primary aura-glow"
            >
                Get Tickets
            </button>
            <button
              type="button"
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              className="aura-btn aura-btn-secondary"
            >
                Learn more
            </button>
            </div>

            <div className="aura-hero-footnotes">
              <div>✓ Streamlined ticketing and registration</div>
              <div>✓ QR code tracking and live attendance</div>
              <div>✓ Data‑driven insights to grow every event</div>
            </div>
          </div>

          <div className="aura-hero-visual">
            <div className="aura-hero-orbit" />
            <div className="aura-hero-phone">
              <img src={heroImage} alt="Aura event experience" />
            </div>

            <div className="aura-hero-pill">
              <strong style={{ fontWeight: 600 }}>Tonight: Soho House Launch</strong>
              <div style={{ opacity: 0.8 }}>132 registered · 97 checked‑in live</div>
            </div>

            <div className="aura-hero-metrics">
              <div className="aura-hero-metric-card">
                <div>Average check‑in time</div>
                <div className="aura-hero-metric-value" style={{ color: '#22c55e' }}>
                  4.2s
                </div>
                <div>From QR scan to welcome</div>
              </div>
              <div className="aura-hero-metric-card" style={{ animationDelay: '0.8s' }}>
                <div>Invite conversion</div>
                <div className="aura-hero-metric-value" style={{ color: '#38bdf8' }}>
                  68%
                </div>
                <div>See who&apos;s coming in real‑time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar strip like Eventick */}
        <div
          style={{
            marginTop: '28px',
            borderRadius: '18px',
            background: 'rgba(15, 23, 42, 0.98)',
            padding: '14px 18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            border: '1px solid rgba(148, 163, 184, 0.4)',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--aura-text-muted)', marginBottom: '4px' }}>Search event</div>
            <input className="aura-input" placeholder="Concert, conference, launch..." />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--aura-text-muted)', marginBottom: '4px' }}>Place</div>
            <input className="aura-input" placeholder="City or venue" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--aura-text-muted)', marginBottom: '4px' }}>Date</div>
            <input className="aura-input" placeholder="Any date" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="aura-btn aura-btn-primary" type="button" style={{ width: '100%', justifyContent: 'center' }}>
              Find tickets
            </button>
          </div>
        </div>

        <div className="aura-hero-strip">
          <div className="aura-hero-strip-item">
            <img src={aboutImage} alt="About Aura" />
            <span>Designed for hosts that obsess over first impressions.</span>
          </div>
          <div className="aura-hero-strip-item">
            <img src={ticketingImage} alt="Ticketing" />
            <span>Beautiful, branded QR tickets that feel premium on mobile.</span>
          </div>
          <div className="aura-hero-strip-item">
            <img src={experienceImage} alt="Experience" />
            <span>Quick views for door staff, producers, and VIP teams.</span>
          </div>
          <div className="aura-hero-strip-item">
            <img src={discoverImage} alt="Discover insights" />
            <span>Understand arrivals, no‑shows, and dwell time at a glance.</span>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="aura-section">
        <div className="aura-section-header">
          <div>
            <h2 className="aura-section-title">Upcoming events</h2>
            <div className="aura-section-subtitle">Discover what&apos;s next with Aura‑powered experiences.</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className="aura-btn aura-btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              Weekdays
            </button>
            <button type="button" className="aura-btn aura-btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              Event type
            </button>
            <button type="button" className="aura-btn aura-btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              Any category
            </button>
          </div>
        </div>

        <div className="aura-events-grid">
          <div className="aura-event-card">
            <img src={heroImage} alt="Aura live show" className="aura-event-image" />
            <div className="aura-event-body">
              <div className="aura-event-date">
                <span>APR</span>
                <strong>14</strong>
              </div>
              <div>
                <div className="aura-event-meta-title">Aura Live: Launch Night</div>
                <div className="aura-event-meta-location">Soho House · London</div>
                <div className="aura-event-meta-desc">Directly seated and scanned via Aura for a seamless premium arrival.</div>
              </div>
            </div>
            <div className="aura-event-footer">
              <button type="button" className="aura-btn aura-btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                Get ticket
              </button>
            </div>
          </div>

          <div className="aura-event-card">
            <img src={experienceImage} alt="Brand experience" className="aura-event-image" />
            <div className="aura-event-body">
              <div className="aura-event-date">
                <span>AUG</span>
                <strong>20</strong>
              </div>
              <div>
                <div className="aura-event-meta-title">Summer Brand Experience</div>
                <div className="aura-event-meta-location">Barcelona</div>
                <div className="aura-event-meta-desc">Use QR‑only access to keep queues short and guest data accurate.</div>
              </div>
            </div>
            <div className="aura-event-footer">
              <button type="button" className="aura-btn aura-btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                Get ticket
              </button>
            </div>
          </div>

          <div className="aura-event-card">
            <img src={ticketingImage} alt="Conference" className="aura-event-image" />
            <div className="aura-event-body">
              <div className="aura-event-date">
                <span>SEP</span>
                <strong>18</strong>
              </div>
              <div>
                <div className="aura-event-meta-title">Future of Events Summit</div>
                <div className="aura-event-meta-location">New York City</div>
                <div className="aura-event-meta-desc">Combine ticketing, check‑in, and analytics in one Aura dashboard.</div>
              </div>
            </div>
            <div className="aura-event-footer">
              <button type="button" className="aura-btn aura-btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                Get ticket
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button type="button" className="aura-btn aura-btn-secondary">
            Load more
          </button>
        </div>
      </section>

      {/* Make your own event CTA */}
      <section className="aura-section">
        <div className="aura-cta-banner">
          <div>
            <div className="aura-cta-banner-title">Make your own Aura event</div>
            <p className="aura-cta-banner-text">
              Create an event, set up ticket types, and start scanning guests with QR codes in minutes. Aura gives you everything you need to launch
              and track events from one place.
            </p>
            <button
              type="button"
              className="aura-btn aura-btn-gold"
              style={{ marginTop: '14px', paddingInline: '20px', paddingBlock: '10px', fontSize: '14px' }}
            >
              Create event
            </button>
          </div>
          <div className="aura-cta-banner-illustration">
            <img src={aboutImage} alt="Create your Aura event" />
          </div>
        </div>
      </section>

      {/* Join these brands */}
      <section className="aura-section">
        <div style={{ textAlign: 'center' }}>
          <h2 className="aura-section-title">Join these brands</h2>
          <div className="aura-section-subtitle">Trusted by organizers who care about seamless, data‑driven events.</div>
        </div>
        <div className="aura-brands-strip">
          <img src={googleLogo} alt="Google" style={{ height: 26 }} />
          <img src={stripeLogo} alt="Stripe" style={{ height: 26 }} />
          <img src={youtubeLogo} alt="YouTube" style={{ height: 26 }} />
          <img src={microsoftLogo} alt="Microsoft" style={{ height: 26 }} />
          <img src={grabLogo} alt="Grab" style={{ height: 26 }} />
          <img src={mediumLogo} alt="Medium" style={{ height: 26 }} />
          <img src={socialLogo} alt="Social icons" style={{ height: 26 }} />
        </div>
      </section>

      {/* Blog section */}
      <section className="aura-section">
        <div style={{ textAlign: 'center' }}>
          <h2 className="aura-section-title">Blog</h2>
          <div className="aura-section-subtitle">Learn how teams use Aura to create better ticketing and check‑in experiences.</div>
        </div>
        <div className="aura-blog-grid">
          <article className="aura-blog-card">
            <img src={heroImage} alt="Blog 1" className="aura-blog-image" />
            <div className="aura-blog-body">
              <div className="aura-blog-title">6 strategies to streamline event check‑in with Aura</div>
              <div className="aura-blog-meta">12 Mar · Event ops</div>
              <p>
                Discover practical ways to shorten queues, keep your team aligned, and still deliver a warm welcome at the door using Aura&apos;s QR
                tracking.
              </p>
            </div>
          </article>
          <article className="aura-blog-card">
            <img src={experienceImage} alt="Blog 2" className="aura-blog-image" />
            <div className="aura-blog-body">
              <div className="aura-blog-title">Using ticket data to design better experiences</div>
              <div className="aura-blog-meta">12 Mar · Insights</div>
              <p>
                Turn registration and attendance data into decisions about programming, capacity, and guest journeys for your next event.
              </p>
            </div>
          </article>
          <article className="aura-blog-card">
            <img src={discoverImage} alt="Blog 3" className="aura-blog-image" />
            <div className="aura-blog-body">
              <div className="aura-blog-title">Why QR‑first events are here to stay</div>
              <div className="aura-blog-meta">12 Mar · Product</div>
              <p>
                Learn how QR‑first ticketing reduces fraud, speeds up check‑in, and gives you clearer insight into who actually attends.
              </p>
            </div>
          </article>
          <article className="aura-blog-card">
            <img src={whyImage} alt="Why Aura" className="aura-blog-image" />
            <div className="aura-blog-body">
              <div className="aura-blog-title">Why leading brands choose Aura</div>
              <div className="aura-blog-meta">12 Mar · Customers</div>
              <p>
                See how organizers pair beautiful invites with rock‑solid QR tracking and seat allocation to deliver premium experiences.
              </p>
            </div>
          </article>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button type="button" className="aura-btn aura-btn-secondary">
            Load more
          </button>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        id="contact"
        className="aura-landing-forms"
        style={{
          alignItems: 'stretch',
        }}
      >
        <div className="aura-card aura-glow-gold">
          <h2 style={{ marginBottom: '12px', fontSize: '20px' }}>Contact us</h2>
          <p style={{ color: 'var(--aura-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
            Tell us about your upcoming event and we&apos;ll show you how Aura can simplify arrivals, guest lists, and on‑site check‑in.
          </p>
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>Name *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="aura-input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>Work email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="aura-input"
                placeholder="you@brand.com"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>How can we help?</label>
              <textarea
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="aura-input"
                rows={4}
                placeholder="Share a few details about your event, dates, and guest volume."
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="aura-btn aura-btn-primary">
              Send message
            </button>
            <div style={{ fontSize: '12px', color: 'var(--aura-text-muted)' }}>
              We aim to respond within 1–2 business days for new event inquiries.
            </div>
          </form>
        </div>

        <div className="aura-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>A better arrival for every guest</h3>
            <p style={{ color: 'var(--aura-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
              Aura is ideal for invite‑only launches, gallery openings, executive dinners, and brand experiences where a smooth door means
              everything.
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--aura-text-muted)', fontSize: '14px', lineHeight: 1.6, marginTop: '10px' }}>
              <li>Support for multiple events and lists.</li>
              <li>Simple onboarding for your team.</li>
              <li>Live dashboards for producers and clients.</li>
            </ul>
          </div>
          <img
            src={experienceImage}
            alt="Aura contact"
            style={{ width: '100%', borderRadius: '14px', objectFit: 'cover', maxHeight: '220px' }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="aura-footer">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <img
              src={auraLogo}
              alt="Aura Events Logo"
              style={{ width: '28px', height: '28px', borderRadius: '999px', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 700 }}>Aura</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--aura-text-muted)', maxWidth: '320px' }}>
            Aura is the all‑in‑one event ticketing and QR code tracking solution designed to simplify your events and delight every guest.
          </p>
        </div>

            <div>
          <div className="aura-footer-heading">Plan events</div>
          <ul className="aura-footer-links">
            <li>Create and set up</li>
            <li>Sell tickets</li>
            <li>Online RSVP</li>
          </ul>
            </div>

            <div>
          <div className="aura-footer-heading">Aura</div>
          <ul className="aura-footer-links">
            <li>About</li>
            <li>Contact</li>
            <li>Help center</li>
            <li>Privacy · Terms</li>
          </ul>
            </div>

        <div className="aura-footer-newsletter">
          <div className="aura-footer-heading">Stay in the loop</div>
          <p style={{ color: 'var(--aura-text-muted)' }}>
            Join our mailing list to get updates on the latest Aura features and event tips.
          </p>
          <div className="aura-footer-input-row">
            <input type="email" placeholder="Enter your email" />
            <button type="button" className="aura-btn aura-btn-primary" style={{ paddingInline: '16px', fontSize: '13px' }}>
              Subscribe
            </button>
          </div>
            </div>

        <div className="aura-footer-bottom">
          <span>© {new Date().getFullYear()} Aura, Inc. All rights reserved.</span>
          <span>Built for modern, data‑driven event teams.</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

