import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Check, MapPin, Phone, Mail, X, ChevronLeft, Camera, Briefcase, Film, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import imagesData from '../data/images.json';

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
  phone: z.string().regex(/^\d{10}$/, 'Valid 10-digit phone number required'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Event date is required').refine((date) => {
    const localToday = new Date();
    localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
    const todayStr = localToday.toISOString().split('T')[0];
    return date >= todayStr;
  }, {
    message: "Event date cannot be in the past"
  }),
  message: z.string().min(10, 'Please provide some details about your event'),
});

type MediaType = {
  id: number;
  type: 'image' | 'video';
  src: string;
  category: string;
  title: string;
};

const ALL_MEDIA: MediaType[] = [];
let mediaIdCounter = 1;

const mapCategory = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('teaser')) return 'Teasers';
  if (lowerKey.includes('corprate') || lowerKey.includes('corporate') || lowerKey.includes('corparate')) return 'Corporate';
  if (lowerKey.includes('reel')) return 'Reels';
  if (lowerKey.includes('wedding')) return 'Wedding';
  return 'All';
};

Object.entries(imagesData).forEach(([key, items]) => {
  items.forEach((item: any) => {
    ALL_MEDIA.push({
      id: mediaIdCounter++,
      type: item.url.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image',
      src: item.url,
      category: mapCategory(key),
      title: item.name.split('.')[0] || 'Media'
    });
  });
});

const CATEGORIES = ['All', 'Wedding', 'Teasers', 'Reels', 'Corporate'];

let HERO_IMAGES = ALL_MEDIA.filter(m => m.type === 'image' && m.category === 'Wedding').slice(0, 3).map(m => m.src);
if (HERO_IMAGES.length === 0) {
  HERO_IMAGES = ALL_MEDIA.filter(m => m.type === 'image').slice(0, 3).map(m => m.src);
}

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [showMore, setShowMore] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], ['0%', '30%']);
  const aboutImageY = useTransform(scrollY, [0, 1500], [50, -50]);

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
    ? (showMore ? ALL_MEDIA : ALL_MEDIA.slice(0, 15))
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
      const offset = 30;
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
      <section id="home" className="relative w-full h-[100dvh] md:h-auto md:aspect-[21/9] md:min-h-[60vh] md:max-h-[800px] xl:max-h-[900px] overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0">
          <video
            src="https://res.cloudinary.com/dhfyfbxiv/video/upload/v1783680401/frames_by_ushani/Background_Raw/lqpdzjggjotflguy3rif.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover object-center scale-[1.35] md:scale-[1.05]"
          />
        </div>
        
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="mb-2 text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-primary drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frames By Ushani
            </h1>
            <h2 className="mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-light leading-tight" style={{ fontFamily: "'Great Vibes', cursive" }}>
              Capturing Emotions Beyond <br className="sm:hidden" /> Frames
            </h2>
            
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
              <motion.div style={{ y: aboutImageY }} className="aspect-[4/5] overflow-hidden rounded-sm relative z-10 shadow-lg border border-primary/10">
                <img
                  src="/images/ushani-profile.jpeg"
                  alt="Ushani - Photographer & Filmmaker"
                  className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                />
              </motion.div>
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
              { title: "Weddings", desc: "Photography & cinematic films.", icon: Camera },
              { title: "Corporate Events", desc: "Meetings, launches, office events.", icon: Briefcase },
              { title: "Reels & Content", desc: "Instagram reels for brands/businesses.", icon: Film },
              { title: "Events", desc: "Birthdays, engagements, functions.", icon: Calendar }
            ].map((srv, i) => (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden bg-background p-8 text-center flex flex-col items-center justify-center shadow-lg rounded-2xl border border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-6 p-5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 relative z-10 border border-primary/10 group-hover:scale-110">
                  <srv.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-3 relative z-10 group-hover:text-primary transition-colors duration-300">{srv.title}</h3>
                <p className="text-sm text-muted-foreground relative z-10 leading-relaxed max-w-[200px]">{srv.desc}</p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
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
                onClick={() => {
                  setFilter(cat);
                  setShowMore(false);
                }}
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
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.pause();
                  }}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      poster={item.src.replace('.mp4', '.jpg').replace('.mov', '.jpg')}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-black/5"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filter === 'All' && ALL_MEDIA.length > 15 && (
            <div className="mt-12 flex justify-center w-full">
              <button
                onClick={() => setShowMore(!showMore)}
                className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-[#c9a84c] px-8 py-3 text-sm uppercase tracking-widest text-white shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                {showMore ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="transition-transform group-hover:-translate-y-1" size={18} />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <ChevronDown className="transition-transform group-hover:translate-y-1" size={18} />
                  </>
                )}
              </button>
            </div>
          )}
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
                            <Input 
                              type="date" 
                              min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                              className="bg-card border-primary/20 focus:border-primary text-foreground shadow-sm" 
                              {...field} 
                            />
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
