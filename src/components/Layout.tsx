import React, { useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaPinterest } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'portfolio', 'reviews', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Services', path: '#services' },
    { name: 'Portfolio', path: '#portfolio' },
    { name: 'Reviews', path: '#reviews' },
    { name: 'Contact', path: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    closeMenu();
    const id = path.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 56; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Decorative corners removed */}
      
      {/* Subtle abstract wave overlay */}
      <div className="fixed inset-0 bg-waves pointer-events-none z-0"></div>

      <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur-md">
        <div className="container relative mx-auto flex h-[56px] items-center justify-between px-4 md:px-8">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="relative z-10 flex shrink-0 items-center"
            aria-label="Frames by Ushani home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c89b2c] bg-white shadow-[0_4px_12px_rgba(200,155,44,0.14)]">
              <span className="font-serif text-[1.1rem] font-bold leading-none tracking-[-0.02em] text-[#c89b2c]">
                FU
              </span>
            </div>
          </a>

          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="absolute left-1/2 top-1/2 z-0 max-w-[52vw] -translate-x-1/2 -translate-y-1/2 truncate text-center font-serif text-base font-semibold leading-none tracking-wide text-[#c89b2c] transition-colors hover:text-[#b68922] sm:text-xl md:max-w-[28vw]"
            aria-label="Frames by Ushani home"
          >
            Frames by Ushani
          </a>

          <nav className="relative z-10 hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                  activeSection === link.path.replace('#', '') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="relative z-10 md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-card absolute left-0 top-[56px] w-full border-b border-primary/20 px-4 py-6 z-50 shadow-md">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`text-sm uppercase tracking-widest transition-colors ${
                    activeSection === link.path.replace('#', '') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>

      <footer className="border-t border-primary/20 bg-card py-12 md:py-16 relative z-10">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 sm:grid-cols-2 md:grid-cols-3 md:px-8 text-center sm:text-left">
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h3 className="font-serif text-2xl text-primary">Frames by Ushani</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Capturing emotions beyond frames. A luxury photography studio capturing unhurried, cinematic, and deeply personal moments.
            </p>
          </div>
          
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h3 className="font-serif text-xl tracking-widest text-primary">Quick Links</h3>
            <nav className="flex flex-col space-y-3 items-center sm:items-start">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary w-fit"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h3 className="font-serif text-xl tracking-widest text-primary">Connect</h3>
            <p className="text-sm text-muted-foreground">Phone: 6305718895</p>
            <p className="text-sm text-muted-foreground break-all sm:break-normal">ushanipurushotham7@gmail.com</p>
            <div className="flex space-x-6 pt-2">
              <a href="https://www.instagram.com/frames_by.ushani?igsh=MXhoMG5zeXpmYTVxZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform hover:scale-110"><FaInstagram size={22} /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform hover:scale-110"><FaFacebook size={22} /></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform hover:scale-110"><FaYoutube size={22} /></a>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto mt-12 px-4 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            © {new Date().getFullYear()} Frames by Ushani. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/916305718895"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#e8c878] to-[#c9a84c] text-white shadow-lg shadow-primary/20 transition-transform hover:scale-110"
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
}
