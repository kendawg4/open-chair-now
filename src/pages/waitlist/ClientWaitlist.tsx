import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const serviceOptions = [
  "Haircuts / Fades", "Braids / Twists", "Locs", "Hair Color", "Blowout / Silk Press",
  "Nails", "Lashes", "Facials / Skincare", "Waxing / Brows", "Makeup", "Tattoos", "Piercings", "Other",
];

const referralSources = [
  "Social media", "Friend / family", "Google search", "Barbershop / salon", "Flyer / poster", "Other",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function ClientWaitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    services_interested: "",
    wants_realtime_availability: true,
    referral_source: "",
  });

  const set = (key: string, value: string | boolean) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.city || !form.state || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("client_waitlist").insert({
      full_name: form.full_name.trim(),
      city: form.city.trim(),
      state: form.state,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      services_interested: form.services_interested || null,
      wants_realtime_availability: form.wants_realtime_availability,
      referral_source: form.referral_source || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">You're in!</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Thanks for signing up for early access. We'll let you know as soon as OpenChair launches in your city.
          </p>
          <Button className="mt-6 rounded-full px-8" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-base">Get Early Access</h1>
        </div>
      </header>

      <div className="px-4 py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <Sparkles className="h-6 w-6 text-accent-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold">Be the first to know</h2>
          <p className="text-sm text-muted-foreground mt-1">Get notified when OpenChair launches near you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name *</Label>
            <Input id="full_name" value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Your full name" required maxLength={100} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">City *</Label>
              <Input id="city" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Brooklyn" required maxLength={50} />
            </div>
            <div className="space-y-1.5">
              <Label>State *</Label>
              <Select value={form.state} onValueChange={v => set("state", v)}>
                <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" required maxLength={255} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Optional" maxLength={20} />
          </div>

          <div className="space-y-1.5">
            <Label>What services do you usually look for?</Label>
            <Select value={form.services_interested} onValueChange={v => set("services_interested", v)}>
              <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>
                {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="realtime" className="text-sm font-normal cursor-pointer">Want real-time availability alerts?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Get notified when nearby pros have openings</p>
            </div>
            <Switch id="realtime" checked={form.wants_realtime_availability} onCheckedChange={v => set("wants_realtime_availability", v)} />
          </div>

          <div className="space-y-1.5">
            <Label>How did you hear about us?</Label>
            <Select value={form.referral_source} onValueChange={v => set("referral_source", v)}>
              <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
              <SelectContent>
                {referralSources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full rounded-full h-12 text-base" disabled={loading}>
            {loading ? "Submitting..." : "Get Early Access"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">We'll never spam you. Launching soon in select cities.</p>
        </form>
      </div>
    </div>
  );
}
