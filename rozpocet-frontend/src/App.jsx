/**
 * Kořenová komponenta appky. Po restrukturalizaci má 6 sekcí místo
 * původních 4 - Přehled je read-only, zbytek rozdělený podle skupin
 * (Příjem, Fixní náklady, Každodenní výdaje, Předplatné, Úspory/Dluh).
 */
import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import PlanSelector from './components/PlanSelector';
import PrehledSlide from './slides/PrehledSlide';
import PrijemSlide from './slides/PrijemSlide';
import FixniNakladySlide from './slides/FixniNakladySlide';
import DenniVydajeSlide from './slides/DenniVydajeSlide';
import UsporyDluhSlide from './slides/UsporyDluhSlide';
import bgImage from './assets/cosmic-bg.png';

function App() {
  const [activeTab, setActiveTab] = useState('prehled');

  const views = {
    prehled: <PrehledSlide />,
    prijem: <PrijemSlide />,
    fixni: <FixniNakladySlide />,
    denni: <DenniVydajeSlide />,
    usporyDluh: <UsporyDluhSlide />,
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