import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-base">Privacy Policy</h1>
        </div>
      </header>
      <article className="px-4 py-8 max-w-lg mx-auto prose prose-sm prose-neutral dark:prose-invert">
        <p className="text-xs text-muted-foreground">Last updated: March 21, 2026</p>

        <h2>1. Information We Collect</h2>
        <h3>Account Information</h3>
        <p>When you create an account, we collect your name, email address, phone number, city, and role (client or professional).</p>
        <h3>Profile Information</h3>
        <p>Professionals may provide business name, service listings, portfolio images, social media links, and specialty details. Clients may provide service preferences.</p>
        <h3>Location Data</h3>
        <p>With your permission, we collect approximate location to show nearby professionals. You can disable location sharing at any time through your device settings.</p>
        <h3>Booking & Request Data</h3>
        <p>We store booking requests, confirmations, cancellations, and reviews to facilitate the marketplace.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to operate the Platform, match clients with nearby professionals, process bookings, send notifications, improve our services, and ensure safety and trust.</p>

        <h2>3. How Information Is Stored</h2>
        <p>Your data is stored securely using industry-standard encryption and cloud infrastructure. We retain your data as long as your account is active or as needed to provide services.</p>

        <h2>4. Notification Preferences</h2>
        <p>You can manage notification preferences in your account settings, including availability alerts, booking updates, and promotional communications.</p>

        <h2>5. Data Sharing</h2>
        <p>We do not sell your personal information. Professional profiles are publicly visible to facilitate discovery. We may share data with service providers who help operate the Platform.</p>

        <h2>6. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by contacting us. You may delete your account at any time through settings.</p>

        <h2>7. Contact</h2>
        <p>For privacy questions, contact us at <span className="text-primary">privacy@openchair.app</span> or visit our <Link to="/contact" className="text-primary">support page</Link>.</p>
      </article>
    </div>
  );
}
