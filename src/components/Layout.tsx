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
      const offset = 80; // Header height
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
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3 group">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-muted shrink-0">
              <img src="/images/logo.jpeg" alt="Frames by Ushani Logo" className="h-full w-full object-cover scale-[1.8] group-hover:scale-[1.9] transition-transform duration-300" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-primary">
              Frames by Ushani
            </span>
          </a>

          <nav className="hidden md:flex space-x-8">
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

          <div className="md:hidden">
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
          <div className="md:hidden bg-card absolute left-0 top-20 w-full border-b border-primary/20 px-4 py-6 z-50 shadow-md">
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
