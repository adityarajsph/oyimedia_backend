import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    slug: "brief-a-creator",
    title: "How to brief a creator without killing the vibe",
    excerpt:
      "The best collabs look effortless. That is usually the result of a tight brief and a loose grip.",
    body: "We write briefs in one page: who it’s for, the one line that cannot change, and three references. Everything else is the creator’s job. Dummy note: this is sample studio writing for the OYI Media site.",
    tag: "Collaboration",
    author: "Mira Patel",
    coverImage:
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    publishedAt: new Date("2026-08-04"),
  },
  {
    slug: "collab-playbook",
    title: "The 2026 brand collaboration playbook",
    excerpt:
      "One-off posts are fading. Here’s how we structure partnerships that actually compound.",
    body: "Retainers beat one-offs. We plan three beats: seed, story, and proof. Dummy content for layout — swap with real essays later.",
    tag: "Strategy",
    author: "Aria Chen",
    coverImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: new Date("2026-07-18"),
  },
  {
    slug: "analytics-lying",
    title: "Why your social analytics are lying to you",
    excerpt:
      "Vanity metrics feel good and hide the leak. A simpler dashboard, and what to ignore.",
    body: "If a metric does not change next week’s content, it does not belong on the dashboard. Sample copy for the blogs grid.",
    tag: "Growth",
    author: "Theo Lang",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: new Date("2026-06-29"),
  },
  {
    slug: "brand-voice",
    title: "A brand voice that the intern can actually use",
    excerpt:
      "If the guidelines live in a 40-page PDF, they don’t live. We write voice as a kit.",
    body: "Do / don’t, three sample captions, and a banned-words list. Dummy article body for OYI Media.",
    tag: "Brand",
    author: "Jules Okonkwo",
    coverImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: new Date("2026-05-12"),
  },
  {
    slug: "tiktok-for-quiet-brands",
    title: "TikTok for quiet brands that hate dancing",
    excerpt:
      "You do not need a trend. You need a repeating format people recognize in 1.5 seconds.",
    body: "Process films, voiceover explainers, and a weekly expert. Sample blog for the journal.",
    tag: "Social",
    author: "Jules Okonkwo",
    coverImage:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: new Date("2026-04-02"),
  },
  {
    slug: "first-90-days",
    title: "What we actually do in the first 90 days",
    excerpt:
      "Audit, voice, calendar, two experiments. No mystery. Dummy onboarding narrative for new clients.",
    body: "Week 1–2 listen, week 3–6 ship, week 7–12 raise the ceiling. Placeholder copy.",
    tag: "Studio",
    author: "Aria Chen",
    coverImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    publishedAt: new Date("2026-03-11"),
  },
];

const influencers = [
  {
    slug: "brinda-sharma",
    name: "Brinda Sharma",
    bio: "Delhi-based travel creator known for cinematic mountain stories and brand films.",
    category: "Travel",
    region: "india",
    location: "Delhi NCR",
    followers: "820K",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    rating: "5.0",
    featured: true,
  },
  {
    slug: "harsh-rane",
    name: "Harsh Rane",
    bio: "Mumbai actor-creator making cinematic skits that brands actually want to be in.",
    category: "Entertainment",
    region: "india",
    location: "Mumbai",
    followers: "1.2M",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    rating: "5.0",
    featured: true,
  },
  {
    slug: "yashika-khatri",
    name: "Yashika Khatri",
    bio: "Fashion, beauty and luxury fitness — daily outfits that convert lookbooks into sales.",
    category: "Fashion",
    region: "india",
    location: "Delhi NCR",
    followers: "640K",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
    rating: "4.8",
    featured: true,
  },
  {
    slug: "anuj-dhingra",
    name: "Anuj Dhingra",
    bio: "Honest gadget reviews and unboxings for India’s next phone drop.",
    category: "Tech",
    region: "india",
    location: "Pan India",
    followers: "910K",
    platform: "YouTube",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    rating: "4.9",
    featured: false,
  },
  {
    slug: "parvati-nair",
    name: "Parvati Nair",
    bio: "South Indian fashion and lifestyle creator with a strong Bangalore bench.",
    category: "Lifestyle",
    region: "india",
    location: "Bangalore",
    followers: "530K",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    rating: "4.9",
    featured: false,
  },
  {
    slug: "karthik-murali",
    name: "Karthik Murali",
    bio: "Travel itineraries, costs, and real trips — not hotel foyers.",
    category: "Travel",
    region: "india",
    location: "Chennai",
    followers: "410K",
    platform: "YouTube",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80",
    rating: "4.8",
    featured: false,
  },
  {
    slug: "amira-khalid",
    name: "Amira Khalid",
    bio: "Dubai-based luxury and beauty creator for GCC launches.",
    category: "Beauty",
    region: "international",
    location: "Dubai",
    followers: "1.4M",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    rating: "5.0",
    featured: true,
  },
  {
    slug: "leo-park",
    name: "Leo Park",
    bio: "Seoul tech and street fashion — K-culture collabs that travel.",
    category: "Fashion",
    region: "international",
    location: "Seoul",
    followers: "2.1M",
    platform: "YouTube",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    rating: "4.9",
    featured: true,
  },
  {
    slug: "sofia-mendes",
    name: "Sofia Mendes",
    bio: "Lisbon travel films and slow-luxury stays for European campaigns.",
    category: "Travel",
    region: "international",
    location: "Lisbon",
    followers: "780K",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    rating: "4.8",
    featured: true,
  },
  {
    slug: "jordan-blake",
    name: "Jordan Blake",
    bio: "NYC fitness and performance — athlete-led drops, not gym selfies.",
    category: "Fitness",
    region: "international",
    location: "New York",
    followers: "1.1M",
    platform: "TikTok",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    rating: "4.9",
    featured: false,
  },
  {
    slug: "mei-lin",
    name: "Mei Lin",
    bio: "Singapore food and lifestyle — city-state campaigns with real tables.",
    category: "Food",
    region: "international",
    location: "Singapore",
    followers: "620K",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80",
    rating: "4.8",
    featured: false,
  },
  {
    slug: "noah-okonkwo",
    name: "Noah Okonkwo",
    bio: "London music and culture — creator collabs that sound like the city.",
    category: "Entertainment",
    region: "international",
    location: "London",
    followers: "890K",
    platform: "YouTube",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    rating: "5.0",
    featured: false,
  },
];

type ServiceDeskCopy = {
  title?: string;
  tagline: string;
  excerpt: string;
  body: string;
  video?: string;
};

type ServiceCatalogItem = {
  slug: string;
  title: string;
  sortOrder: number;
  image: string;
  video: string;
  brand?: ServiceDeskCopy;
  creators?: ServiceDeskCopy;
};

const serviceCatalog: ServiceCatalogItem[] = [
  {
    slug: "hire-youtubers",
    title: "Hire YouTubers",
    sortOrder: 1,
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-hire-youtubers.mp4",
    brand: {
      tagline: "Hire YouTubers in India for reviews, Shorts and creator campaigns.",
      excerpt:
        "Discover relevant YouTubers, plan the campaign and run collabs around your objective — not subscriber count alone.",
      body: "We map the right YouTube voices against your product, budget and geography — then handle outreach, the brief, and the drop. From mid-tier reviewers to long-form storytellers, the bench is verified and campaign-ready.",
    },
  },
  {
    slug: "youtube-video-promotion",
    title: "YouTube video promotion",
    sortOrder: 2,
    image:
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-yt-promo.mp4",
    brand: {
      tagline: "SEO, creators, paid and social — not a view hack.",
      excerpt:
        "Put the film in front of people who actually match the audience, then measure retention and watch time.",
      body: "We take the video that matters — launch film, founder story, product demo — and push it with creator amplification, media and sequencing so it actually lands. Views with the wrong audience are vanity. We buy and earn the right ones.",
    },
  },
  {
    slug: "hire-creators",
    title: "Hire creators",
    sortOrder: 3,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-hire-creators.mp4",
    brand: {
      tagline: "Influencers, UGC, YouTube and Instagram — matched to the brief.",
      excerpt:
        "Campaign fit over follower count. Discovery, strategy, coordination and tracking in one desk.",
      body: "Need faces for a drop, a always-on retainer, or a regional language campaign? We pull from a verified bench, structure the deal, and keep the work on-brief without killing the vibe.",
    },
    creators: {
      title: "Get hired for campaigns",
      tagline: "Get hired for campaigns that match your niche.",
      excerpt:
        "Brands brief us. We brief you. Fair rates, clear usage, and work you can stand next to.",
      body: "Join the OYI roster and we put you in front of brands looking for your niche, city and platform. No spray lists. You see the brief, you take the job, we handle the paper.",
    },
  },
  {
    slug: "product-launch",
    title: "Product launch",
    sortOrder: 4,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-product-launch.mp4",
    brand: {
      tagline: "Conversation before, peak on launch day, interest after.",
      excerpt:
        "Strategy, creators, seeding, social and tracking — not a single announcement.",
      body: "A launch needs a story, a first circle, and a proof beat. We staff the creators, write the brief, and time the content so the product shows up in feeds that already care.",
    },
  },
  {
    slug: "user-generated",
    title: "User Generated",
    sortOrder: 5,
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-ugc.mp4",
    brand: {
      tagline: "Authentic-looking assets for ads, PDPs and always-on social.",
      excerpt:
        "UGC creators, briefs, usage rights and a library you can test — not follower count.",
      body: "We brief a UGC bench, collect usage-ready assets, and cut for paid and organic. Real hands, real rooms, real voice — not a commercial pretending to be a reel.",
    },
  },
  {
    slug: "meme-marketing",
    title: "Meme Marketing",
    sortOrder: 6,
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-meme.mp4",
    brand: {
      tagline: "Trend + audience + timing + brand — not a logo on a template.",
      excerpt:
        "Meme strategy, creation, trendjacking and distribution with brand-safety checks.",
      body: "We pair brands with meme desks and creators who already have the room. The joke is theirs. The banned-words list is ours. The result should feel stolen from the timeline, not issued by legal.",
    },
  },
  {
    slug: "barter-collaboration",
    title: "Barter collaboration",
    sortOrder: 7,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-barter.mp4",
    brand: {
      tagline: "Product, stay or experience — for agreed content, not a cash fee.",
      excerpt:
        "The right creators, terms in writing, disclosure and tracking. Barter is not free marketing.",
      body: "Not every brief needs a celebrity invoice. We run barter and hybrid deals with creators who want the product, with usage and posting dates in writing so both sides leave clean.",
    },
  },
  {
    slug: "video-production",
    title: "Video production",
    sortOrder: 8,
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/service-production.mp4",
    brand: {
      tagline: "Concept to delivery — brand films, product, social, UGC and explainers.",
      excerpt:
        "Pre-production, production and post, cut for the platform it will live on.",
      body: "From a one-day studio to a multi-city campaign, we produce the films the rest of the engine needs. Creators in frame when it helps. A crew when it has to look like a brand film. Always cut for the platform it will live on.",
    },
  },
  {
    slug: "brand-collaboration",
    title: "Brand Collaboration",
    sortOrder: 4,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-brand-collaboration.mp4",
    creators: {
      title: "Brand Collaboration",
      tagline: "Partnerships with a purpose — not two names on a post.",
      excerpt:
        "Land brand collabs, UGC, launches and long-term deals that fit your audience and come with a brief you can shoot.",
      body: "OYI Media matches creators with brands that need your niche, format and room — then runs the collab from concept to measurement.",
      video: "/videos/creator-brand-collaboration.mp4",
    },
  },
  {
    slug: "brand-opportunity",
    title: "Brand Opportunity",
    sortOrder: 6,
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-brand-opportunity.mp4",
    creators: {
      title: "Brand Opportunity",
      tagline: "The next opening — collabs, launches, UGC and retainers.",
      excerpt:
        "We find brand opportunities that reach your people, fit your channel, and have a goal you can measure.",
      body: "Not every trend is an opportunity. OYI Media opens the campaigns that belong on your roster.",
      video: "/videos/creator-brand-opportunity.mp4",
    },
  },
  {
    slug: "growth-strategy",
    title: "Growth Strategy",
    sortOrder: 7,
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-growth-strategy.mp4",
    creators: {
      title: "Growth Strategy",
      tagline: "Audience, content, collabs and measurement — as one plan.",
      excerpt:
        "Stop posting in isolation. A growth strategy ties platforms, partnerships and KPIs to the creator brand you are building.",
      body: "OYI Media maps who you serve, what to publish, which brands to take, and how to know it is working.",
      video: "/videos/creator-growth-strategy.mp4",
    },
  },
  {
    slug: "video-strategy",
    title: "Video Strategy",
    sortOrder: 8,
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-video-strategy.mp4",
    creators: {
      title: "Video Strategy",
      tagline: "What to film, where it lives, how it gets seen.",
      excerpt:
        "A slate with a purpose — YouTube, Reels, Shorts, product and proof — plus distribution, not just a camera day.",
      body: "OYI Media plans pillars, formats, platforms and promotion so the work compounds.",
      video: "/videos/creator-video-strategy.mp4",
    },
  },
  {
    slug: "video-shooting",
    title: "Video Shooting",
    sortOrder: 1,
    image:
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-video-shooting.mp4",
    creators: {
      title: "Video Shooting",
      tagline: "When the story is worth watching — plan the camera day.",
      excerpt:
        "Brand films, product, social, YouTube, ads and creator shoots planned around the purpose — not just the record button.",
      body: "OYI Media runs concept, lighting, camera, sound and post so the film is something people actually stop for.",
      video: "/videos/creator-video-shooting.mp4",
    },
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    sortOrder: 2,
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-social-media.mp4",
    creators: {
      title: "Social Media Management",
      tagline: "Don’t go silent after posting.",
      excerpt:
        "Strategy, content, community, creator collabs and analytics — a presence worth following, not only a full calendar.",
      body: "OYI Media answers what to say, who to say it to, and why anyone should care — then runs the feed.",
      video: "/videos/creator-social-media.mp4",
    },
  },
  {
    slug: "competitor-analysis",
    title: "Competitor Analysis",
    sortOrder: 5,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    video: "/videos/creator-competitor-analysis.mp4",
    creators: {
      title: "Competitor Analysis",
      tagline: "Don’t just watch them — learn, then differentiate.",
      excerpt:
        "Content, social, creators, positioning and gaps — market intelligence that becomes a smarter brief, not a clone.",
      body: "OYI Media maps what competitors do well, what they miss, and where your next campaign should spend.",
      video: "/videos/creator-competitor-analysis.mp4",
    },
  },
];

async function main() {
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        published: true,
      },
    });
  }

  for (const influencer of influencers) {
    await prisma.influencer.upsert({
      where: { slug: influencer.slug },
      update: {},
      create: {
        ...influencer,
        published: true,
      },
    });
  }

  let serviceCount = 0;
  const keepCreatorSlugs: string[] = [];

  for (const item of serviceCatalog) {
    for (const audience of ["brand", "creators"] as const) {
      const copy = item[audience];
      if (!copy) continue;
      if (audience === "creators") keepCreatorSlugs.push(item.slug);
      serviceCount += 1;
      await prisma.service.upsert({
        where: {
          audience_slug: { audience, slug: item.slug },
        },
        update: {
          title:
            audience === "creators" && "title" in copy && copy.title
              ? String(copy.title)
              : item.title,
          video:
            audience === "creators" && "video" in copy && copy.video
              ? String(copy.video)
              : item.video,
          tagline: copy.tagline,
          excerpt: copy.excerpt,
          body: copy.body,
          image: item.image,
          sortOrder: item.sortOrder,
          published: true,
        },
        create: {
          slug: item.slug,
          audience,
          title:
            audience === "creators" && "title" in copy && copy.title
              ? String(copy.title)
              : item.title,
          tagline: copy.tagline,
          excerpt: copy.excerpt,
          body: copy.body,
          image: item.image,
          video:
            audience === "creators" && "video" in copy && copy.video
              ? String(copy.video)
              : item.video,
          sortOrder: item.sortOrder,
          published: true,
        },
      });
    }
  }

  await prisma.service.deleteMany({
    where: {
      audience: "creators",
      slug: { notIn: keepCreatorSlugs },
    },
  });

  console.log(
    `Seeded ${posts.length} posts, ${influencers.length} influencers, and ${serviceCount} services.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
