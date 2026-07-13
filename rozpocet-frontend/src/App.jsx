/**
 * Kořenová komponenta appky. Obaluje vše do AppProvider (sdílený stav),
 * drží info o aktivní sekci (activeTab) a podle ní vykresluje odpovídající slide.
 */
import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import PlanSelector from './components/PlanSelector';
import PrehledSlide from './slides/PrehledSlide';
import PrijemVydajSlide from './slides/PrijemVydajSlide';
import SporeniDluhSlide from './slides/SporeniDluhSlide';
import AnalyzaHistorieSlide from './slides/AnalyzaHistorieSlide';
import bgImage from './assets/cosmic-bg.png';

function App() {
  const [activeTab, setActiveTab] = useState('prehled');

  // Mapování klíče sekce na její JSX - views[activeTab] vybere správnou
  // komponentu, místo dlouhého if/else řetězce
  const views = {
    prehled: <PrehledSlide />,
    prijemVydaj: <PrijemVydajSlide />,
    sporeniDluh: <SporeniDluhSlide />,
    analyza: <AnalyzaHistorieSlide />,
  };

  return (
    <AppProvider>
      <div className="app-shell" style={{ backgroundImage: `url(${bgImage})` }}>
        <Sidebar active={activeTab} onChange={setActiveTab} />
        <main className="main-content">
          <PlanSelector />
          {views[activeTab]}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;