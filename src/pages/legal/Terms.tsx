import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-base">Terms of Service</h1>
        </div>
      </header>
      <article className="px-4 py-8 max-w-lg mx-auto prose prose-sm prose-neutral dark:prose-invert">
        <p className="text-xs text-muted-foreground">Last updated: March 21, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using OpenChair ("Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>

        <h2>2. Use of Platform</h2>
        <p>OpenChair is a marketplace that connects beauty service clients with independent professionals. We facilitate discovery and booking but are not a party to any service agreement between clients and professionals.</p>

        <h2>3. Booking Disclaimer</h2>
        <p>All appointments booked through OpenChair are agreements between the client and the professional. OpenChair does not guarantee the quality, safety, or outcome of any service. Professionals are independent contractors, not employees of OpenChair.</p>

        <h2>4. User Responsibilities</h2>
        <p>You agree to provide accurate information, treat other users respectfully, show up for confirmed appointments or cancel in advance, and refrain from fraudulent or misleading activity.</p>

        <h2>5. Professional Responsibilities</h2>
        <p>Professionals agree to maintain accurate profiles, honor confirmed bookings, provide services safely and professionally, comply with local licensing and health regulations, and keep availability status current.</p>

        <h2>6. Content & Profile Conduct</h2>
        <p>Users are responsible for content they post. OpenChair reserves the right to remove content that violates our <Link to="/community-guidelines" className="text-primary">Community Guidelines</Link>, is misleading, infringes intellectual property, or is otherwise inappropriate.</p>

        <h2>7. Limitation of Liability</h2>
        <p>OpenChair is provided "as is." We are not liable for any damages arising from use of the Platform, interactions between users, service quality, missed appointments, or technical disruptions.</p>

        <h2>8. Changes to Terms</h2>
        <p>We may update these Terms at any time. Continued use of the Platform after changes constitutes acceptance. We will notify users of material changes via email or in-app notification.</p>

        <h2>9. Contact</h2>
        <p>Questions about these Terms? Reach us at <Link to="/contact" className="text-primary">our support page</Link> or email <span className="text-primary">legal@openchair.app</span>.</p>
      </article>
    </div>
  );
}
