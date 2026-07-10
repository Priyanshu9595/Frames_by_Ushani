import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const offset = 100; // Header height + top margin for floating nav
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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      <div className="fixed inset-0 bg-waves pointer-events-none z-0"></div>

      <header className="fixed top-0 sm:top-4 md:top-6 left-1/2 z-50 w-full sm:w-[95%] max-w-[90rem] -translate-x-1/2 sm:rounded-full border-b sm:border border-primary/20 bg-background/70 backdrop-blur-xl shadow-lg transition-all duration-300">
        <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
          <div className="flex-1 flex justify-start">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-4 group"
              aria-label="Frames by Ushani home"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary bg-primary/10 shadow-[0_0_15px_rgba(200,155,44,0.15)] group-hover:bg-primary transition-colors duration-300">
                <span className="font-serif text-[1.2rem] font-bold leading-none tracking-[-0.02em] text-primary group-hover:text-white transition-colors duration-300">
                  FU
                </span>
              </div>
              <span className="hidden md:block font-serif text-[1.3rem] font-semibold tracking-wide text-primary transition-colors group-hover:text-foreground whitespace-nowrap">
                Frames by Ushani
              </span>
            </a>
          </div>

          {/* Mobile Center Title */}
          <span className="absolute left-1/2 -translate-x-1/2 md:hidden font-serif text-[15px] sm:text-lg font-semibold tracking-wide text-primary pointer-events-none whitespace-nowrap">
            Frames by Ushani
          </span>

          <nav className="hidden lg:flex items-center justify-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`relative text-[13px] uppercase tracking-widest transition-colors hover:text-primary ${
                  activeSection === link.path.replace('#', '') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.name}
                {activeSection === link.path.replace('#', '') && (
                  <span className="absolute -bottom-2 left-1/2 h-[2px] w-1/2 -translate-x-1/2 bg-primary rounded-full transition-all" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex flex-1 items-center justify-end gap-6">
             {mounted && (
               <button
                 onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                 className="p-2 text-primary hover:text-foreground transition-colors rounded-full hover:bg-primary/10"
                 aria-label="Toggle theme"
               >
                 {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
               </button>
             )}
             <button 
               onClick={(e) => handleNavClick(e, '#contact')}
               className="rounded-full bg-gradient-to-r from-primary to-[#c9a84c] px-7 py-3 text-sm uppercase tracking-widest text-white shadow-md transition-all hover:scale-105 hover:shadow-lg whitespace-nowrap"
             >
               Book Now
             </button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            {mounted && (
               <button
                 onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                 className="p-2 text-primary hover:text-foreground transition-colors rounded-full hover:bg-primary/10"
                 aria-label="Toggle theme"
               >
                 {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
               </button>
            )}
            <button
              onClick={toggleMenu}
              className="text-primary hover:text-foreground transition-colors focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden absolute left-0 top-[110%] w-full rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-300 origin-top overflow-hidden ${
            isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
        >
          <nav className="flex flex-col p-6 space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`text-sm uppercase tracking-widest transition-colors text-center ${
                  activeSection === link.path.replace('#', '') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button 
               onClick={(e) => handleNavClick(e, '#contact')}
               className="w-full rounded-full bg-gradient-to-r from-primary to-[#c9a84c] px-6 py-3.5 text-sm uppercase tracking-widest text-white shadow-md transition-all mt-2"
             >
               Book Now
             </button>
          </nav>
        </div>
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

