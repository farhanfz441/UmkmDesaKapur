import React from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import Hero from '../components/landing/Hero';
import CategoryGrid from '../components/landing/CategoryGrid';
import UmkmTerbaru from '../components/landing/UmkmTerbaru';
import MapSection from '../components/landing/MapSection';
import ProgramSection from '../components/landing/ProgramSection';
import BeritaSection from '../components/landing/BeritaSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-secondary">
      <LandingHeader />
      <Hero />
      <CategoryGrid />
      <UmkmTerbaru />
      <MapSection />
      <ProgramSection />
      <BeritaSection />
      <Footer />
    </div>
  );
}
