import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { MapPin, Zap, Star, Clock, Scissors, Users, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Landing() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Open<span className="text-primary">Chair</span>
          </Link>
          <div className="flex gap-2">
            {user ? (
              <Button size="sm" asChild>
                <Link to={role === "professional" ? "/pro/dashboard" : "/home"}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div className="relative mx-auto max-w-lg text-center" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} custom={0} className="mb-4 inline-flex">
            <StatusBadge status="open-chair" size="md" pulse />
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl">
            Find beauty pros nearby — <span className="text-primary">available now</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            See live availability, browse portfolios, compare reviews, and book instantly. No more waiting.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full text-base px-8" asChild>
              <Link to={user ? "/home" : "/signup"}>
                <MapPin className="h-5 w-5 mr-1" /> Find a Pro
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base px-8" asChild>
              <Link to={user ? "/pro/dashboard" : "/signup"}>
                <Scissors className="h-5 w-5 mr-1" /> Join as a Pro
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-secondary/50">
        <div className="mx-auto max-w-lg">
          <h2 className="font-display text-2xl font-bold text-center mb-2">How OpenChair works</h2>
          <p className="text-center text-muted-foreground text-sm mb-10">For clients and beauty professionals</p>
          <div className="grid gap-4">
            {[
              { icon: Zap, title: "Real-time availability", desc: "See who's free right now. No calls, no guessing." },
              { icon: MapPin, title: "Nearby discovery", desc: "Map-based search finds quality pros in your area." },
              { icon: Star, title: "Portfolios & reviews", desc: "Browse work samples and verified reviews before booking." },
              { icon: Clock, title: "Last-minute openings", desc: "Get alerts when cancellations create surprise openings." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex gap-4 rounded-2xl bg-card border border-border p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Pros */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-2xl font-bold mb-2">For beauty professionals</h2>
          <p className="text-muted-foreground text-sm mb-8">Turn downtime into revenue</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: "Attract local clients" },
              { icon: TrendingUp, label: "Fill empty chairs" },
              { icon: Shield, label: "Build trust & reviews" },
              { icon: Scissors, label: "Showcase your work" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">{label}</span>
              </div>
            ))}
          </div>
          <Button className="mt-8 rounded-full px-8" asChild>
            <Link to="/waitlist/pro">Join the Professional Waitlist</Link>
          </Button>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="px-4 py-16 bg-primary/5">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Launching soon in select cities</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            OpenChair is rolling out city by city. Join the waitlist to get early access and help shape the future of beauty booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full text-base px-8" asChild>
              <Link to="/waitlist/client">
                <Sparkles className="h-5 w-5 mr-1" /> Get Early Access
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base px-8" asChild>
              <Link to="/waitlist/pro">
                <Scissors className="h-5 w-5 mr-1" /> Join as a Pro
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 text-center">
        <p className="font-display text-lg font-bold">Open<span className="text-primary">Chair</span></p>
        <p className="text-xs text-muted-foreground mt-1">Real-time booking for barbers and beauty pros</p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">© 2026 OpenChair. All rights reserved.</p>
      </footer>
    </div>
  );
}
