import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const reasons = [
  "Account issue",
  "Booking problem",
  "Report a user",
  "Bug or technical issue",
  "Feature request",
  "Billing question",
  "Other",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });

  const set = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.reason || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    // Store in notifications table as a support ticket visible to admins
    const { error } = await supabase.from("notifications").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      type: "support_ticket",
      title: `[${form.reason}] from ${form.name}`,
      body: `Email: ${form.email}\n\n${form.message}`,
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
          <h1 className="font-display text-2xl font-bold">Message sent!</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Thanks for reaching out. Our team will get back to you within 24–48 hours.
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
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-base">Contact Support</h1>
        </div>
      </header>

      <div className="px-4 py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold">Get in touch</h2>
          <p className="text-sm text-muted-foreground mt-1">We're here to help. You can also email us at <span className="text-primary">support@openchair.app</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Your name *</Label>
            <Input id="name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name" required maxLength={100} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" required maxLength={255} />
          </div>

          <div className="space-y-1.5">
            <Label>Reason *</Label>
            <Select value={form.reason} onValueChange={v => set("reason", v)}>
              <SelectTrigger><SelectValue placeholder="What do you need help with?" /></SelectTrigger>
              <SelectContent>
                {reasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" value={form.message} onChange={e => set("message", e.target.value)} placeholder="Describe your issue or question..." required maxLength={2000} className="min-h-[120px]" />
          </div>

          <Button type="submit" className="w-full rounded-full h-12 text-base" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
