import { Component, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** Last line of defense: never show a white screen, always offer a way out. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    console.error('[app] crashed', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash">
        <h1>Hollowbloom</h1>
        <p>Something went wrong. Your save is kept on this device. / Etwas ist schiefgelaufen. Dein Spielstand bleibt erhalten.</p>
        <button className="btn primary" onClick={() => location.reload()}>
          Reload / Neu laden
        </button>
      </div>
    );
  }
}
