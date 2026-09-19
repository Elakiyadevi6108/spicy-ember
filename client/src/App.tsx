import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { GallerySection } from './components/GallerySection';
import { ChefSection } from './components/ChefSection';
import { EventsSection } from './components/EventsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MyReservations } from './components/MyReservations';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { User } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    if (id === 'admin' || id === 'my-bookings') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0c0d] text-[#f8f5f0] flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#0e0c0d]">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={scrollToSection}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onOpenBooking={() => scrollToSection('reservations')}
      />

      {/* View Router / Sections */}
      <main className="flex-1">
        {activeTab === 'admin' ? (
          <AdminDashboard />
        ) : activeTab === 'my-bookings' ? (
          <MyReservations customerEmail={currentUser?.email || 'ananya@example.com'} />
        ) : (
          <>
            <Hero
              onReserveClick={() => scrollToSection('reservations')}
              onExploreMenuClick={() => scrollToSection('menu')}
            />
            <AboutSection />
            <MenuSection />
            <ReservationSection onViewMyBookings={() => scrollToSection('my-bookings')} />
            <GallerySection />
            <ChefSection />
            <EventsSection onBookEvent={(title) => scrollToSection('reservations')} />
            <ContactSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={scrollToSection} />

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin') {
              setActiveTab('admin');
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
