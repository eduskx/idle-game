import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gameStore } from './store/gameStore';
import { App } from './ui/App';
import { ErrorBoundary } from './ui/components/ErrorBoundary';
import './styles.css';

const root = createRoot(document.getElementById('root')!);

void gameStore.init().then(() => {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
});
