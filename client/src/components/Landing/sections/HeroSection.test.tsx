import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from './HeroSection';

// Smoke test focusing on accessibility wiring and presence of key elements.
// No external a11y libs needed; keeps CI light.
describe('HeroSection', () => {
  const renderHero = () =>
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );

  test('renders a section with data-section="hero" and aria-labelledby', () => {
    renderHero();
    const section = screen.getByRole('region', { hidden: true }) || document.querySelector('section[data-section="hero"]');
    // Fallback: query by data attribute when role mapping differs
    const sectionEl = (section as HTMLElement) ?? (document.querySelector('section[data-section="hero"]') as HTMLElement);
    expect(sectionEl).toBeInTheDocument();
    expect(sectionEl).toHaveAttribute('data-section', 'hero');
    expect(sectionEl).toHaveAttribute('aria-labelledby', 'hero-heading');
  });

  test('contains an element with id="hero-heading"', () => {
    renderHero();
    const heading = document.getElementById('hero-heading');
    expect(heading).toBeInTheDocument();
  });
});
