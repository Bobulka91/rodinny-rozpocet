/**
 * NEPOUŽÍVÁ SE - appka teď používá Sidebar navigaci (viz Sidebar.jsx, App.jsx)
 * místo tohohle "telefonního rámu". Ponecháno v projektu pro případné
 * budoucí využití (např. jako inspirace pro mobilní verzi).
 *
 * Původní účel: swipe carousel mezi 4 slidy, s tečkami a šipkami
 * pro navigaci, uvnitř vizuálně "telefonního" rámu.
 */
import { useState, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import PlanSelector from './PlanSelector';
import Dots from './Dots';
import Arrows from './Arrows';
import bgImage from '../assets/cosmic-bg.png';

function SlideContainer({ children }) {
  const [currentSlide, setCurrentSlide] = useState(0); // index aktuálně zobrazeného slidu
  const totalSlides = children.length; // kolik slidů container dostal jako children
  const frameRef = useRef(null); // reference na DOM element rámu (kvůli měření šířky)
  const trackX = useMotionValue('0%'); // framer-motion hodnota, řídí vodorovný posun tracku
  const dragStartPercent = useRef(0); // pozice tracku v momentě, kdy tažení začalo

  // Naanimuje track na pozici odpovídající danému indexu slidu
  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(totalSlides - 1, index)); // ať index nevyjede mimo rozsah 0..totalSlides-1
    setCurrentSlide(clamped);
    const targetPercent = -clamped * (100 / totalSlides); // o kolik % track posunout doleva
    animate(trackX, `${targetPercent}%`, { type: 'spring', stiffness: 300, damping: 30 });
  }

  // Zapamatuje si, odkud tažení začíná, aby handlePan mohl počítat relativně k němu
  function handlePanStart() {
    dragStartPercent.current = parseFloat(trackX.get()) || 0;
  }

  /**
   * Průběžně počítá novou pozici tracku během tažení.
   * Práh 5px zabraňuje, aby obyčejný klik (s minimálním neúmyslným
   * driftem myši) způsobil viditelný posun - řešilo se to jako bug,
   * kdy se appka "posunula" i při pouhém kliknutí na tlačítko.
   */
  function handlePan(event, info) {
    if (Math.abs(info.offset.x) < 5) return; // ignoruj mikro-pohyby pod 5px

    const frameWidth = frameRef.current.offsetWidth; // reálná šířka rámu v pixelech
    const percentPerPixel = (100 / totalSlides) / frameWidth; // kolik % odpovídá jednomu pixelu
    let newPercent = dragStartPercent.current + info.offset.x * percentPerPixel;

    // Track nesmí jet dál, než je první/poslední slide
    const minPercent = -(totalSlides - 1) * (100 / totalSlides);
    newPercent = Math.max(minPercent, Math.min(0, newPercent));

    trackX.set(`${newPercent}%`); // okamžitá aktualizace pozice (bez animace, sleduje prst/myš)
  }

  // Po puštění tažení rozhodne, jestli přepnout na další/předchozí slide,
  // nebo se vrátit na aktuální (pokud tažení nebylo dost daleko)
  function handlePanEnd(event, info) {
    const threshold = 60; // minimální posun v pixelech, aby se to počítalo jako "swipe"
    if (info.offset.x < -threshold && currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else if (info.offset.x > threshold && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(currentSlide); // vrátí se na místo, odkud táhnutí začalo
    }
  }

  return (
    <div className="frame" ref={frameRef} style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <PlanSelector />
      <motion.div
        className="track"
        style={{ x: trackX }} // pozice tracku řízená přes framer-motion motion value
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      >
        {children}
      </motion.div>
      <Arrows current={currentSlide} total={totalSlides} onChange={goToSlide} />
      <div className="dots-wrap">
        <Dots total={totalSlides} current={currentSlide} onChange={goToSlide} />
      </div>
    </div>
  );
}

export default SlideContainer;