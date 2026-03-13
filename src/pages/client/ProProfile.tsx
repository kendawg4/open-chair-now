import { useParams, Link } from "react-router-dom";
import { mockProfessionals, mockReviews, categoryLabels, statusLabels } from "@/data/mock";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MapPin, Heart, Share2, Clock, MessageCircle, Instagram, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProProfile() {
  const { id } = useParams();
  const pro = mockProfessionals.find(p => p.id === id) || mockProfessionals[0];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cover */}
      <div className="relative h-52">
        <img src={pro.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link to="/home" className="h-9 w-9 rounded-full glass flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex gap-2">
            <button className="h-9 w-9 rounded-full glass flex items-center justify-center">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 rounded-full glass flex items-center justify-center">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 -mt-14 relative z-10">
        <div className="flex items-end gap-4">
          <img src={pro.avatar} alt={pro.name} className="h-20 w-20 rounded-2xl object-cover border-4 border-background shadow-lg" />
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold">{pro.name}</h1>
              {pro.verified && <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20" />}
            </div>
            <p className="text-sm text-muted-foreground">{categoryLabels[pro.category]}</p>
          </div>
        </div>

        {/* Status + stats */}
        <div className="mt-4 flex items-center gap-3">
          <StatusBadge status={pro.status} size="md" pulse />
          {pro.statusNote && <span className="text-xs text-primary font-medium">{pro.statusNote}</span>}
        </div>

        <div className="mt-4 flex gap-6">
          {[
            { label: "Rating", value: <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{pro.rating}</span> },
            { label: "Reviews", value: pro.reviewCount },
            { label: "Followers", value: pro.followerCount.toLocaleString() },
            { label: "Years", value: pro.yearsExperience },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-display font-bold text-sm">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{pro.bio}</p>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{pro.shopName} · {pro.address}, {pro.city}</span>
        </div>

        {pro.promo && (
          <div className="mt-4 rounded-xl bg-primary/10 border border-primary/20 p-3">
            <p className="text-sm font-medium text-primary">🔥 {pro.promo}</p>
          </div>
        )}

        {/* Specialties */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {pro.specialties.map(s => (
            <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{s}</span>
          ))}
        </div>

        {/* Portfolio */}
        <section className="mt-6">
          <h2 className="font-display font-bold text-base mb-3">Portfolio</h2>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
            {pro.portfolio.map((img, i) => (
              <img key={i} src={img} alt="" className="aspect-square object-cover" />
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mt-6">
          <h2 className="font-display font-bold text-base mb-3">Services & Pricing</h2>
          <div className="space-y-2">
            {pro.services.map(service => (
              <div key={service.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-3.5">
                <div>
                  <p className="font-semibold text-sm">{service.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{service.duration} min</span>
                    {service.instantBook && (
                      <span className="text-primary font-medium">⚡ Instant book</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">${service.price}</p>
                  <Button size="sm" variant="outline" className="mt-1 h-7 text-xs rounded-full">Book</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-6">
          <h2 className="font-display font-bold text-base mb-3">Reviews</h2>
          <div className="space-y-3">
            {mockReviews.map(review => (
              <div key={review.id} className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2.5">
                  <img src={review.clientAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm">{review.clientName}</span>
                      {review.verified && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                <div className="mt-2 flex gap-1.5">
                  {review.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky book bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-4 z-50">
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="rounded-full flex-shrink-0">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button size="lg" className="rounded-full flex-1 text-base font-semibold">
            {["open-chair", "available-now"].includes(pro.status) ? "⚡ Book Now" : "Request Appointment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
