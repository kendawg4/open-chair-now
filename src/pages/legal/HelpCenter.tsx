import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    items: [
      { q: "How do I create an account?", a: "Tap \"Get Started\" on the landing page, enter your email and password, then choose whether you're a client or a professional. You'll be guided through a quick onboarding flow." },
      { q: "Is OpenChair free to use?", a: "Yes! Creating an account and booking appointments is free for clients. Professionals can list their services at no cost during our launch period." },
    ],
  },
  {
    category: "Finding a Professional",
    items: [
      { q: "How do I find a pro near me?", a: "From the Discover page, enable location access to see nearby professionals. You can also search by city, category, or specialty. Use filters to narrow by availability, rating, price, and more." },
      { q: "What does \"Open Chair\" mean?", a: "Open Chair means a professional is available right now for walk-ins or immediate bookings. It's the signature feature of OpenChair — real-time availability so you can find someone good, nearby, and free today." },
      { q: "What's the difference between statuses?", a: "Open Chair = available now for walk-ins. Available Now = accepting immediate bookings. Last-Minute Opening = a cancellation slot just opened. Appointment Only = book ahead required. Busy = currently with a client." },
    ],
  },
  {
    category: "Bookings",
    items: [
      { q: "How do professionals receive booking requests?", a: "When a client submits a booking request, the professional sees it on their Bookings page and receives a notification. They can accept, decline, or suggest an alternative time." },
      { q: "Can I cancel a booking?", a: "Yes. From your Bookings page, you can cancel a pending or confirmed booking. Please cancel as early as possible so the professional can fill the slot." },
    ],
  },
  {
    category: "Reviews & Trust",
    items: [
      { q: "How do reviews work?", a: "After a booking is marked as completed, the client can leave a star rating and written review. Only verified bookings can generate reviews, ensuring authenticity." },
      { q: "Can I report a problem?", a: "Yes. You can report a profile or review from the professional's page, or contact our support team directly." },
    ],
  },
  {
    category: "For Professionals",
    items: [
      { q: "How do I update my profile?", a: "From your Pro Dashboard, tap the edit icon or go to Settings → Edit Profile. You can update your bio, services, portfolio, location, and social links." },
      { q: "How do I change my availability status?", a: "On your Pro Dashboard, use the status controls at the top to toggle between Open Chair, Available Now, Last-Minute Opening, Appointment Only, Busy, or Offline." },
    ],
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-base">Help Center</h1>
        </div>
      </header>

      <div className="px-4 py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-xl font-bold">How can we help?</h2>
          <p className="text-sm text-muted-foreground mt-1">Find answers to common questions below.</p>
        </div>

        {faqs.map(({ category, items }) => (
          <div key={category} className="mb-6">
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">{category}</h3>
            <Accordion type="single" collapsible className="space-y-1">
              {items.map(({ q, a }, i) => (
                <AccordionItem key={i} value={`${category}-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:bg-card">
                  <AccordionTrigger className="text-sm font-medium text-left py-3 hover:no-underline">{q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <div className="text-center pt-4 border-t border-border mt-8">
          <p className="text-sm text-muted-foreground mb-3">Still need help?</p>
          <Button className="rounded-full px-6" asChild>
            <Link to="/contact"><MessageCircle className="h-4 w-4 mr-1" /> Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
