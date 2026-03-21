import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CheckCircle2, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const categories = [
  "Barber", "Hairstylist", "Braider", "Loc Specialist", "Nail Technician",
  "Esthetician", "Lash Technician", "Makeup Artist", "Tattoo Artist", "Piercer",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function ProWaitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    business_name: "",
    category: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    instagram: "",
    specialties: "",
    accepts_walk_ins: false,
    wants_open_chair_alerts: true,
    additional_notes: "",
  });

  const set = (key: string, value: string | boolean) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.category || !form.city || !form.state || !form.phone || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("pro_waitlist").insert({
      full_name: form.full_name.trim(),
      business_name: form.business_name.trim() || null,
      category: form.category,
      city: form.city.trim(),
      state: form.state,
      phone: form.phone.trim(),
      email: form.email.trim(),
      instagram: form.instagram.trim() || null,
      specialties: form.specialties.trim() || null,
      accepts_walk_ins: form.accepts_walk_ins,
      wants_open_chair_alerts: form.wants_open_chair_alerts,
      additional_notes: form.additional_notes.trim() || null,
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
          <h1 className="font-display text-2xl font-bold">You're on the list!</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Thanks for joining the OpenChair professional waitlist. We'll be in touch soon with early access details.
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
          <h1 className="font-display font-bold text-base">Join as a Professional</h1>
        </div>
      </header>

      <div className="px-4 py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Scissors className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">Get early access</h2>
          <p className="text-sm text-muted-foreground mt-1">Be one of the first professionals on OpenChair in your city.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name *</Label>
            <Input id="full_name" value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Your full name" required maxLength={100} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="business_name">Business / shop name</Label>
            <Input id="business_name" value={form.business_name} onChange={e => set("business_name", e.target.value)} placeholder="Optional" maxLength={100} />
          </div>

          <div className="space-y-1.5">
            <Label>Profession / category *</Label>
            <Select value={form.category} onValueChange={v => set("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select your profession" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
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
            <Label htmlFor="phone">Phone number *</Label>
            <Input id="phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 123-4567" required maxLength={20} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" required maxLength={255} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instagram">Instagram handle</Label>
            <Input id="instagram" value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@yourhandle" maxLength={50} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialties">Services / specialties</Label>
            <Textarea id="specialties" value={form.specialties} onChange={e => set("specialties", e.target.value)} placeholder="Fades, beard grooming, kids cuts..." maxLength={500} className="min-h-[70px]" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <Label htmlFor="walk_ins" className="text-sm font-normal cursor-pointer">Do you take walk-ins?</Label>
            <Switch id="walk_ins" checked={form.accepts_walk_ins} onCheckedChange={v => set("accepts_walk_ins", v)} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="alerts" className="text-sm font-normal cursor-pointer">Want "Open Chair" alerts?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Instantly notify nearby clients when you're free</p>
            </div>
            <Switch id="alerts" checked={form.wants_open_chair_alerts} onCheckedChange={v => set("wants_open_chair_alerts", v)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Anything else you'd want from the app?</Label>
            <Textarea id="notes" value={form.additional_notes} onChange={e => set("additional_notes", e.target.value)} placeholder="Tell us what features matter most to you..." maxLength={1000} className="min-h-[70px]" />
          </div>

          <Button type="submit" className="w-full rounded-full h-12 text-base" disabled={loading}>
            {loading ? "Submitting..." : "Join the Waitlist"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">We'll never share your info. Launching soon in select cities.</p>
        </form>
      </div>
    </div>
  );
}
