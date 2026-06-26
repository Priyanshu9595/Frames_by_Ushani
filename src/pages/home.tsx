import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, MapPin, Phone, Mail, X, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Event date is required'),
  message: z.string().min(10, 'Please provide some details about your event'),
});

type MediaType = {
  id: number;
  type: 'image' | 'video';
  src: string;
  category: string;
  title: string;
};

const ALL_MEDIA: MediaType[] = [
  { id: 1, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0035.JPG', category: 'Wedding', title: 'The Vows' },
  { id: 2, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0036.JPG', category: 'Wedding', title: 'Golden Hour' },
  { id: 3, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0037.JPG', category: 'Wedding', title: 'First Dance' },
  { id: 4, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0038.JPG', category: 'Wedding', title: 'Celebration' },
  { id: 5, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0039.JPG', category: 'Wedding', title: 'Portrait' },
  { id: 6, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0040.JPG', category: 'Wedding', title: 'Smile' },
  { id: 7, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0041.JPG', category: 'Wedding', title: 'Joy' },
  { id: 8, type: 'image', src: '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0042.JPG', category: 'Wedding', title: 'Together' },
  { id: 9, type: 'video', src: '/videos/corporate-20260626T072032Z-3-001/corporate/mcain.mp4', category: 'Corporate', title: 'Annual Gala' },
  { id: 10, type: 'video', src: '/videos/corporate-20260626T072032Z-3-001/corporate/0523.mov', category: 'Corporate', title: 'Stage Ambience' },
  { id: 11, type: 'video', src: '/videos/reeels-20260626T071758Z-3-001/reeels/IMG_3216.mov', category: 'Reels', title: 'Instagram Reel' },
  { id: 12, type: 'video', src: '/videos/reeels-20260626T071758Z-3-001/reeels/0526 (1)(2).MOV', category: 'Reels', title: 'Behind the Scenes' },
  { id: 13, type: 'video', src: '/videos/teasers-20260626T070538Z-3-001/teasers/promo.mp4', category: 'Teasers', title: 'Editorial Teaser' },
  { id: 14, type: 'video', src: '/videos/teasers-20260626T070538Z-3-001/teasers/Short Teaser-.mp4', category: 'Teasers', title: 'Pre-wedding Teaser' },
  { id: 15, type: 'video', src: '/videos/teasers-20260626T070538Z-3-001/teasers/wedding.mp4', category: 'Teasers', title: 'Wedding Teaser' },
];

const CATEGORIES = ['All', 'Wedding', 'Teasers', 'Reels', 'Corporate'];

const HERO_IMAGES = [
  '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0035.JPG',
  '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0036.JPG',
  '/videos/wedding photos-20260626T070535Z-3-001/wedding photos/IMG_0039.JPG',
];

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    document.title = "Frames by Ushani | Luxury Photography in Hyderabad";
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      message: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xaqgerba", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Sent Successfully",
          description: "Thank you for reaching out. We will get back to you within 24 hours.",
        });
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMedia = filter === 'All' 
    ? ALL_MEDIA 
    : ALL_MEDIA.filter(item => item.category === filter);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMediaId === null) return;
    const currentIndex = filteredMedia.findIndex(item => item.id === selectedMediaId);
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    setSelectedMediaId(filteredMedia[nextIndex].id);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMediaId === null) return;
    const currentIndex = filteredMedia.findIndex(item => item.id === selectedMediaId);
    const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setSelectedMediaId(filteredMedia[prevIndex].id);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <video
            src="/videos/teasers-20260626T070538Z-3-001/teasers/promo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
        </div>
        
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Frames By Ushani</h2>
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-wide md:text-7xl lg:text-8xl text-white drop-shadow-lg">
              Capturing emotions <br />
              <span className="text-gradient-gold italic drop-shadow-md">beyond frames.</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => scrollTo('portfolio')}
                  className="group inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-sm bg-gradient-to-r from-[#e8c878] to-[#c9a84c] text-white px-8 py-4 uppercase tracking-widest backdrop-blur-sm transition-all hover:opacity-90 shadow-md"
                >
                View Portfolio
                <ChevronRight className="transition-transform group-hover:translate-x-1" size={18} />
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="group inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-sm bg-gradient-to-r from-[#e8c878] to-[#c9a84c] text-white px-8 py-4 uppercase tracking-widest backdrop-blur-sm transition-all hover:opacity-90 shadow-md"
              >
                Contact Me
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-md mx-auto lg:mx-0"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-sm relative z-10 shadow-lg border border-primary/10">
                <img
                  src="/images/ushani-profile.jpeg"
                  alt="Ushani - Photographer & Filmmaker"
                  className="h-full w-full object-cover transition-all duration-700"
                />
              </div>
              <div className="absolute -right-6 -bottom-6 -z-10 h-full w-full border border-primary/30" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <p className="text-sm uppercase tracking-widest text-primary mb-4">About Me</p>
                <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight">
                  Hi, I’m Ushani, a photographer & filmmaker capturing weddings, events, reels, and stories with a cinematic touch.
                </h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground font-light text-lg leading-relaxed">
                <p>
                  My style is rooted in capturing the authentic emotions of your most important days. I believe that your memories shouldn't just be documented; they should be crafted into a beautiful, cinematic story that you can relive forever.
                </p>
              </div>

              <div className="pt-8 border-t border-primary/20">
                <h4 className="font-serif text-2xl text-gradient-gold mb-2">My Style</h4>
                <p className="text-sm text-muted-foreground">Clean, Premium, Emotional, and deeply Cinematic.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 px-4 bg-card border-y border-primary/10 shadow-sm relative z-10">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">Services</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-primary/50" />
            <p className="mt-6 text-muted-foreground mx-auto max-w-2xl font-light text-lg">
              Premium coverage for the moments that matter most.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto items-stretch">
            {[
              { title: "Weddings", desc: "Photography & cinematic films." },
              { title: "Corporate Events", desc: "Meetings, launches, office events." },
              { title: "Reels & Content", desc: "Instagram reels for brands/businesses." },
              { title: "Events", desc: "Birthdays, engagements, functions." }
            ].map((srv, i) => (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-8 text-center flex flex-col items-center justify-center shadow-md rounded-sm border border-primary/10 hover:border-primary/40 transition-colors"
              >
                <h3 className="font-serif text-2xl text-foreground mb-4">{srv.title}</h3>
                <p className="text-sm text-muted-foreground">{srv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl">Portfolio</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-primary/50" />
            <p className="mt-6 text-muted-foreground mx-auto max-w-2xl font-light text-lg">
              A curated collection of my best work.
            </p>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-sm px-6 py-2 text-sm uppercase tracking-widest transition-all shadow-sm ${
                  filter === cat
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted-foreground border border-primary/10 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div 
            layout
            className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>div:not(:first-child)]:mt-6"
          >
            <AnimatePresence>
              {filteredMedia.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className="group relative mb-6 overflow-hidden rounded-sm cursor-pointer break-inside-avoid shadow-sm border border-primary/5"
                  onClick={() => setSelectedMediaId(item.id)}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className="w-full transition-transform duration-700 group-hover:scale-105 bg-black/5"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
                    <span className="text-xs uppercase tracking-widest text-primary drop-shadow-sm mb-2">{item.category}</span>
                    <h3 className="font-serif text-xl text-foreground drop-shadow-sm">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 5. REVIEWS SECTION */}
      <section id="reviews" className="py-24 px-4 bg-card/50 border-y border-primary/10 relative z-10 shadow-sm">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">Client Reviews</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-primary/50" />
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              { name: "Priya & Rahul", role: "Wedding", text: "Very professional and cinematic output. The moments captured were beyond our expectations." },
              { name: "Ananya S.", role: "Corporate Event", text: "Her understanding of light is unmatched. She brings a cinematic quality to every frame that elevates the entire project." },
              { name: "The Reddy Family", role: "Engagement", text: "Unobtrusive and incredibly talented. The moments she managed to capture while we weren't looking are our absolute favorites." }
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="glass-card p-8 flex flex-col justify-between shadow-md rounded-sm border border-primary/10"
              >
                <div className="mb-6">
                  <div className="flex text-primary mb-4">
                    {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                  </div>
                  <p className="text-muted-foreground font-light leading-relaxed italic">"{testimonial.text}"</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg text-foreground">{testimonial.name}</h4>
                  <p className="text-xs uppercase tracking-widest text-primary/70 mt-1">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid gap-16 lg:grid-cols-2 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div>
                <h2 className="font-serif text-4xl md:text-5xl text-gradient-gold mb-6">Contact Me</h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
                  I'd love to hear about your plans. Fill out the form, or reach out directly using the details below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg">Phone & WhatsApp</h4>
                    <p className="text-muted-foreground text-sm">6305718895</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg">Email Address</h4>
                    <p className="text-muted-foreground text-sm">ushanipurushotham7@gmail.com<br/>framesbyushani@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-foreground pt-4">
                  <a 
                    href="https://www.instagram.com/frames_by.ushani?igsh=MXhoMG5zeXpmYTVxZQ%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-sm border border-primary/50 bg-primary/10 px-6 py-3 uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-white text-xs"
                  >
                    Follow on Instagram
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 md:p-12 rounded-sm shadow-md border border-primary/10"
            >
              <h3 className="font-serif text-2xl text-primary mb-8">Booking Form</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" className="bg-card border-primary/20 focus:border-primary text-foreground shadow-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@example.com" className="bg-card border-primary/20 focus:border-primary text-foreground shadow-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="6305718895" className="bg-card border-primary/20 focus:border-primary text-foreground shadow-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Event Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-card border-primary/20 focus:border-primary text-foreground shadow-sm">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-primary/20 text-foreground">
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="corporate">Corporate Event</SelectItem>
                              <SelectItem value="reels">Reels / Content</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Event Date</FormLabel>
                          <FormControl>
                            <Input type="date" className="bg-card border-primary/20 focus:border-primary text-foreground shadow-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Tell us about your vision</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Locations, style preferences, guest count, etc..." 
                            className="bg-card border-primary/20 focus:border-primary min-h-[120px] shadow-sm" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#e8c878] to-[#c9a84c] text-white uppercase tracking-widest font-medium py-4 hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 shadow-md rounded-sm"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO LIGHTBOX */}
      <AnimatePresence>
        {selectedMediaId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMediaId(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 md:p-8"
          >
            <button 
              className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground px-5 py-2 transition-colors z-[110] backdrop-blur-md border border-black/5"
              onClick={() => setSelectedMediaId(null)}
            >
              <X size={20} />
              <span className="font-medium tracking-widest uppercase text-sm">Close</span>
            </button>
            
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-foreground/50 hover:text-foreground transition-colors hidden md:block z-[110]"
              onClick={handlePrev}
            >
              <ChevronLeft size={48} />
            </button>

            {(() => {
              const activeMedia = filteredMedia.find(i => i.id === selectedMediaId);
              if (!activeMedia) return null;
              return activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.src}
                  controls
                  autoPlay
                  className="max-h-[90vh] max-w-[90vw] shadow-2xl rounded-sm relative z-[105]"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-sm relative z-[105]"
                  onClick={(e) => e.stopPropagation()}
                />
              );
            })()}

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-foreground/50 hover:text-foreground transition-colors hidden md:block z-[110]"
              onClick={handleNext}
            >
              <ChevronRight size={48} />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 md:hidden z-[110]">
               <button onClick={handlePrev} className="p-2 text-foreground"><ChevronLeft size={32} /></button>
               <button onClick={handleNext} className="p-2 text-foreground"><ChevronRight size={32} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
