import { APP_VERSION, LEGAL } from '../../config/legal';
import { useT } from '../../i18n/useT';

export type LegalPage = 'privacy' | 'imprint' | 'credits';

/**
 * Legal texts. These are a sensible starting point for a hobby project without
 * tracking, NOT legal advice. Have them checked before monetizing.
 */
export function LegalContent({ page }: { page: LegalPage }) {
  const { lang } = useT();
  const de = lang === 'de';

  if (page === 'imprint') {
    if (!LEGAL.name) {
      return (
        <p>
          {de
            ? 'Das Impressum wurde noch nicht eingerichtet. Dies ist ein privates, nicht-kommerzielles Hobbyprojekt in Entwicklung.'
            : 'The imprint has not been set up yet. This is a private, non-commercial hobby project in development.'}
        </p>
      );
    }
    return (
      <address className="legal">
        <p>
          {de ? 'Angaben gemäß § 5 DDG' : 'Information according to § 5 DDG (German Digital Services Act)'}
        </p>
        <p>
          {LEGAL.name}
          <br />
          {LEGAL.street}
          <br />
          {LEGAL.city}
          <br />
          {LEGAL.country}
        </p>
        <p>
          {de ? 'Kontakt' : 'Contact'}: {LEGAL.email}
        </p>
      </address>
    );
  }

  if (page === 'credits') {
    return (
      <div className="legal">
        <p>Hollowbloom v{APP_VERSION}</p>
        <p>
          © 2026 {LEGAL.name || 'Hollowbloom'}. {de ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
        </p>
        <p>
          {de
            ? 'Alle Kreaturen, Grafiken und Texte sind Eigenentwicklungen. Die Platzhalter-Grafiken werden prozedural im Code erzeugt.'
            : 'All creatures, graphics and texts are original. Placeholder art is generated procedurally in code.'}
        </p>
        <p>{de ? 'Verwendete Open-Source-Software:' : 'Open-source software used:'}</p>
        <ul>
          <li>React (MIT) – Meta Platforms, Inc.</li>
          <li>Zod (MIT) – Colin McDonnell</li>
          <li>Workbox (MIT) – Google LLC</li>
          <li>Fredoka (SIL OFL 1.1) – The Fredoka Project Authors</li>
          <li>Nunito (SIL OFL 1.1) – The Nunito Project Authors</li>
        </ul>
      </div>
    );
  }

  return de ? (
    <div className="legal">
      <p>Stand: {LEGAL.lastUpdated}</p>
      <h3>Kurzfassung</h3>
      <p>
        Hollowbloom erhebt keine personenbezogenen Daten. Es gibt keine Accounts, kein Tracking, keine
        Werbung, keine Analyse-Tools und keine Cookies.
      </p>
      <h3>Speicherung auf deinem Gerät</h3>
      <p>
        Dein Spielstand wird ausschließlich lokal im Speicher deines Browsers (localStorage) abgelegt. Dies
        ist für die Funktion des Spiels unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG) und verlässt dein
        Gerät nicht. Du kannst die Daten jederzeit unter „Mehr → Gesamten Fortschritt löschen“ oder über die
        Browsereinstellungen entfernen.
      </p>
      <h3>Hosting</h3>
      <p>
        Die Seite wird über {LEGAL.hostingProvider} ausgeliefert. Beim Aufruf verarbeitet der Hoster technisch
        notwendige Verbindungsdaten (z. B. IP-Adresse, Zeitpunkt, abgerufene Datei) in Server-Logs, um die
        Seite auszuliefern und abzusichern (Art. 6 Abs. 1 lit. f DSGVO). Eine Übermittlung in die USA erfolgt
        auf Grundlage des EU-US Data Privacy Framework. Details: docs.github.com/site-policy/privacy-policies.
      </p>
      <h3>Deine Rechte</h3>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch
        und Beschwerde bei einer Datenschutz-Aufsichtsbehörde.
      </p>
      {LEGAL.email && <p>Kontakt: {LEGAL.email}</p>}
    </div>
  ) : (
    <div className="legal">
      <p>Last updated: {LEGAL.lastUpdated}</p>
      <h3>Summary</h3>
      <p>
        Hollowbloom does not collect personal data. There are no accounts, no tracking, no ads, no analytics
        and no cookies.
      </p>
      <h3>Storage on your device</h3>
      <p>
        Your save game is stored only in your browser's local storage. This is strictly necessary for the game
        to work and never leaves your device. You can delete it at any time via "More → Delete all progress"
        or your browser settings.
      </p>
      <h3>Hosting</h3>
      <p>
        The site is served by {LEGAL.hostingProvider}. When you visit, the host processes technically
        necessary connection data (e.g. IP address, time, requested file) in server logs to deliver and secure
        the site (Art. 6(1)(f) GDPR). Transfers to the USA are based on the EU-US Data Privacy Framework.
        Details: docs.github.com/site-policy/privacy-policies.
      </p>
      <h3>Your rights</h3>
      <p>
        You have the right to access, rectification, erasure, restriction, objection and to lodge a complaint
        with a data protection authority.
      </p>
      {LEGAL.email && <p>Contact: {LEGAL.email}</p>}
    </div>
  );
}
