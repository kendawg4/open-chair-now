import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { MapPin, Zap, Star, Clock, Scissors, Users, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Open<span className="text-primary">Chair</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/home">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div
          className="relative mx-auto max-w-lg text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
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
              <Link to="/home">
                <MapPin className="h-5 w-5 mr-1" />
                Find a Pro
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base px-8" asChild>
              <Link to="/pro/dashboard">
                <Scissors className="h-5 w-5 mr-1" />
                Join as a Pro
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Mock status cards */}
        <motion.div
          className="relative mt-12 mx-auto max-w-sm flex flex-col gap-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } } }}
        >
          {[
            { name: "Marcus J.", cat: "Barber · Brooklyn", status: "open-chair" as const, note: "Walk-ins welcome — open 2 hrs", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
            { name: "Aisha W.", cat: "Braider · Atlanta", status: "last-minute" as const, note: "Cancellation at 2:15 PM — 10% off", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face" },
            { name: "Tony R.", cat: "Barber · Brooklyn", status: "available-now" as const, note: "Ready now — no wait", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 shadow-sm"
            >
              <img src={item.img} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-sm">{item.name}</span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.cat}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{item.note}</p>
              </div>
            </motion.div>
          ))}
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
            <Link to="/pro/dashboard">Join as a Professional</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 text-center">
        <p className="font-display text-lg font-bold">Open<span className="text-primary">Chair</span></p>
        <p className="text-xs text-muted-foreground mt-1">Real-time booking for barbers and beauty pros</p>
        <p className="text-xs text-muted-foreground mt-4">© 2026 OpenChair. All rights reserved.</p>
      </footer>
    </div>
  );
}
