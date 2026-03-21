import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center h-14 px-4 gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-base">Community Guidelines</h1>
        </div>
      </header>
      <article className="px-4 py-8 max-w-lg mx-auto prose prose-sm prose-neutral dark:prose-invert">
        <p className="text-muted-foreground text-sm">OpenChair is built on trust between beauty professionals and their clients. These guidelines keep our community safe and welcoming.</p>

        <h2>Respectful Conduct</h2>
        <p>Treat every user with respect. Harassment, hate speech, discrimination, and threats are not tolerated. This applies to profiles, reviews, messages, and all interactions on the Platform.</p>

        <h2>No Spam or Fake Listings</h2>
        <p>Do not create fake profiles, post misleading availability, use bait-and-switch pricing, or spam other users with unsolicited messages. All professional profiles must represent real, active service providers.</p>

        <h2>Honest Reviews Only</h2>
        <p>Reviews must reflect genuine experiences from real bookings. Do not post fake reviews, solicit fraudulent positive reviews, or retaliate against honest feedback. Review manipulation will result in account suspension.</p>

        <h2>Prohibited Content</h2>
        <ul>
          <li>Explicit, violent, or illegal content</li>
          <li>Copyrighted material you don't own</li>
          <li>Misleading before/after photos</li>
          <li>Content promoting unsafe practices</li>
          <li>Personal information of others without consent</li>
        </ul>

        <h2>Reporting Abuse</h2>
        <p>If you encounter a violation, report it through the profile report feature or contact our <Link to="/contact" className="text-primary">support team</Link>. All reports are reviewed within 48 hours. Serious violations result in immediate account suspension.</p>

        <h2>Enforcement</h2>
        <p>Violations may result in content removal, temporary suspension, or permanent ban depending on severity. We reserve the right to take action at our discretion to protect the community.</p>
      </article>
    </div>
  );
}
