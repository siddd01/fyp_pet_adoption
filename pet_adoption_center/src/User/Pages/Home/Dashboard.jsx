import { AlertTriangle, ArrowRight, HeartHandshake, PawPrint, ShoppingBag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import ScrollReveal from "../../Components/ScrollReveal";

const featuredJourneys = [
  {
    eyebrow: "Adopt Now",
    title: "Meet rescues waiting for a home, one soft step at a time.",
    description:
      "Scroll into a gallery of pets, calm filters, and detailed stories that feel more like an experience than a list.",
    action: "Explore Pets",
    to: "/adopt",
    icon: PawPrint,
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    tone: "from-amber-100 via-white to-rose-100",
  },
  {
    eyebrow: "Shop",
    title: "Browse essentials that support care beyond the cart.",
    description:
      "Food, accessories, and curated pet basics flow into view as you move down the page, with a softer editorial feel.",
    action: "Open Shop",
    to: "/shop",
    icon: ShoppingBag,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80",
    tone: "from-stone-100 via-white to-emerald-50",
  },
  {
    eyebrow: "Donate",
    title: "Turn compassion into rescue, treatment, and second chances.",
    description:
      "The donation page now fits naturally into the home journey so it feels like the next chapter instead of a disconnected screen.",
    action: "Support Now",
    to: "/donate",
    icon: HeartHandshake,
    image:
      "https://images.unsplash.com/photo-1444212477490-ca407925329e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBldCUyMGFkb3B0aW9ufGVufDB8fDB8fHww",
    tone: "from-emerald-100 via-white to-stone-100",
  },
  {
    eyebrow: "Community",
    title: "Keep scrolling into stories, updates, and people who care.",
    description:
      "A more connected home page makes the platform feel alive, so the community section arrives as part of the same flow.",
    action: "See Community",
    to: "/community",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80",
    tone: "from-sky-100 via-white to-stone-100",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  const features = [
    { emoji: "Paw", label: "Adopt a Pet", sub: "Find your companion", to: "/adopt" },
    { emoji: "Shop", label: "Pet Shop", sub: "Quality essentials", to: "/shop" },
    { emoji: "Care", label: "Charity", sub: "Support animals in need", to: "/donate" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,_#fcfaf6_0%,_#f7f4ee_52%,_#f4efe6_100%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-18 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
            <ScrollReveal className="space-y-8">
              {isLoggedIn && user ? (
                <div className="inline-flex items-center gap-2 bg-white/80 border border-stone-200 rounded-full px-4 py-1.5 text-sm text-stone-600 shadow-sm backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  Welcome back,
                  <span className="font-semibold text-stone-900">
                    {user.first_name}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-white/80 border border-stone-200 rounded-full px-4 py-1.5 text-sm text-stone-500 shadow-sm backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Trusted by 50,000+ pet lovers
                </div>
              )}

              <div className="space-y-4">
                <p className="text-xs tracking-[0.35em] uppercase text-stone-500">
                  Sano Ghar
                </p>
                <h1 className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.95] tracking-tight">
                  A scrolling home for
                  <span className="italic text-stone-500"> adoption, care, </span>
                  and rescue stories.
                </h1>
                <p className="max-w-2xl text-stone-600 text-sm md:text-lg leading-relaxed">
                  Instead of ending after the hero, your dashboard now keeps unfolding.
                  Scroll down and each next path appears like a chapter: adopt, shop,
                  donate, and community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <button
                  onClick={() => navigate("/adopt")}
                  className="w-full sm:w-auto px-7 py-3.5 bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold rounded-2xl transition"
                >
                  Adopt Now
                </button>

                <button
                  onClick={() => navigate("/shop")}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/85 border border-stone-200 hover:border-stone-400 text-stone-700 text-sm font-semibold rounded-2xl transition backdrop-blur"
                >
                  Open Shop
                </button>

                {isLoggedIn && (
                  <button
                    onClick={() => navigate("/report-issue")}
                    className="w-full sm:w-auto px-7 py-3.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-2xl transition flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Report Issue
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
                {features.map(({ emoji, label, sub, to }, index) => (
                  <ScrollReveal
                    key={label}
                    delay={index * 0.08}
                    className="bg-white/80 border border-stone-200 rounded-2xl p-5 shadow-sm backdrop-blur cursor-pointer hover:-translate-y-1 transition-transform"
                  >
                    <button
                      onClick={() => navigate(to)}
                      className="w-full text-left"
                    >
                      <p className="text-[10px] tracking-[0.24em] uppercase text-stone-400 mb-3">
                        {emoji}
                      </p>
                      <p className="font-semibold text-stone-900">{label}</p>
                      <p className="text-sm text-stone-500 mt-1">{sub}</p>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-white/50 blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/60 shadow-[0_30px_90px_-35px_rgba(28,25,23,0.45)]">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
                  alt="Happy pets"
                  className="w-full min-h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent" />

                <div className="absolute left-6 right-6 bottom-6 grid gap-3">
                  <div className="bg-white/88 backdrop-blur rounded-2xl border border-white/70 px-5 py-4 shadow-lg">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400 mb-2">
                      Scroll Journey
                    </p>
                    <p className="text-stone-900 font-semibold text-lg leading-snug">
                      Keep scrolling and the dashboard continues into your next action.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-20 md:pb-28">
        <ScrollReveal className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-stone-300" />
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500">
            Keep Scrolling
          </p>
          <div className="flex-1 h-px bg-stone-300" />
        </ScrollReveal>

        <div className="space-y-8 md:space-y-12">
          {featuredJourneys.map((item, index) => {
            const Icon = item.icon;

            return (
              <ScrollReveal
                key={item.title}
                delay={index * 0.06}
                className={`rounded-[2rem] overflow-hidden border border-stone-200 bg-gradient-to-br ${item.tone} shadow-[0_25px_80px_-45px_rgba(28,25,23,0.35)]`}
              >
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-stretch">
                  <div className="p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/80 border border-stone-200 flex items-center justify-center text-stone-800 mb-8 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] tracking-[0.34em] uppercase text-stone-500 mb-4">
                      {item.eyebrow}
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight tracking-tight max-w-2xl">
                      {item.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-stone-600 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-8">
                      <button
                        onClick={() => navigate(item.to)}
                        className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 transition"
                      >
                        {item.action}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative min-h-[320px] lg:min-h-full">
                    <img
                      src={item.image}
                      alt={item.eyebrow}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
