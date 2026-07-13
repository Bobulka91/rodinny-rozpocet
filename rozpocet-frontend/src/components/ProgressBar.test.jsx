/**
 * Testy pro ProgressBar.jsx - ověřují výpočet procenta naplnění
 * a vykreslení správných hodnot, včetně edge case dělení nulou.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('vykreslí správný label a částky', () => {
    render(<ProgressBar label="Dovolená" current={5000} target={10000} />);
    expect(screen.getByText('Dovolená')).toBeInTheDocument();
    expect(screen.getByText('5000 / 10000 Kč')).toBeInTheDocument();
  });

  it('spočítá procento naplnění a nastaví ho jako šířku pruhu', () => {
    // container.querySelector - hledáme podle CSS třídy, ne podle textu
    const { container } = render(<ProgressBar label="Test" current={25} target={100} />);
    const bar = container.querySelector('.bar-fill');
    expect(bar).toHaveStyle({ width: '25%' }); // 25/100 * 100 = 25%
  });

  it('nespadne, když je target 0 (dělení nulou)', () => {
    // V JS dělení nulou nevyhodí chybu jako v Javě, ale vrátí Infinity/NaN,
    // které prohlížeč u CSS width jen ignoruje - appka se nezasekne
    render(<ProgressBar label="Test" current={10} target={0} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});