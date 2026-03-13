import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  return (
    <div className="bg-stone-50 text-stone-800">

      {/* ── Hero ── */}
      <section className="bg-stone-900 text-white py-20 relative overflow-hidden">
        {/* subtle texture lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,white 39px,white 40px)' }} />
        <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500 absolute top-0 inset-x-0" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 text-center relative"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About Sano Ghar</h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-xl mx-auto">
            A safe home for every rescued soul
          </p>
        </motion.div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-4">Who We Are</p>
          <h2 className="text-3xl font-serif text-stone-900 mb-5">Built on compassion,<br />driven by purpose.</h2>
          <p className="leading-8 text-stone-600 max-w-3xl">
            <span className="font-semibold text-stone-800">Sano Ghar</span> is a pet adoption and welfare center dedicated to
            rescuing abandoned and vulnerable animals and providing them with
            care, protection, and a second chance at life. We operate with a
            strong ethical foundation, combining compassion with technology to
            ensure transparency, trust, and efficiency in the adoption process.
          </p>
        </motion.div>
      </section>

      {/* ── Mission & Story ── */}
      <section className="bg-white py-16 border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          {[
            {
              label: "Our Mission",
              body: "Our mission is to create a responsible and humane adoption system where every pet receives proper medical care, shelter, and love. We promote adoption over purchasing pets and reinvest in animal welfare through our integrated charity model, where 20% of store profits are donated to animal welfare initiatives.",
            },
            {
              label: "Our Story",
              body: "Sano Ghar was founded after witnessing the increasing number of stray and abandoned animals lacking proper care. What began as a small rescue effort evolved into a structured pet adoption platform designed to connect adopters, staff, and administrators through a secure and transparent system. Each successful adoption reinforces our belief that every animal deserves a loving home.",
            },
          ].map(({ label, body }, i) => (
            <motion.div
              key={label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-stone-50 rounded-2xl border border-stone-100 p-7"
            >
              <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">{label}</p>
              <p className="text-stone-600 leading-8">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-2">Our Services</p>
          <h2 className="text-3xl font-serif text-stone-900 mb-8">What We Do</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "🐾", text: "Ethical Pet Adoption Services" },
              { icon: "🏥", text: "Health & Care Management" },
              { icon: "🔐", text: "Role-Based System (Admin, Staff, Customer)" },
              { icon: "🛍️", text: "Integrated Pet Store with Charity Support" },
              { icon: "📊", text: "Transparency Reports for Donations" },
              { icon: "🤝", text: "Community Awareness & Welfare Programs" },
            ].map(({ icon, text }, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex items-start gap-4 group hover:border-stone-300 transition"
              >
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-medium text-stone-700 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Contact ── */}
      <section className="bg-stone-900 text-white py-16 relative overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500 absolute top-0 inset-x-0" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto px-6"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">Get In Touch</p>
              <h2 className="text-3xl font-serif mb-2">Contact Us</h2>
              <p className="text-stone-400 text-sm leading-relaxed">
                Have questions about adoption or want to support our mission? We'd love to hear from you.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: "📞", label: "Phone", value: "+977 98XXXXXXXX" },
                { icon: "📧", label: "Email", value: "support@sanoghar.com" },
                { icon: "📍", label: "Location", value: "Kathmandu, Nepal" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 bg-stone-800 rounded-xl px-5 py-4 border border-stone-700">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-white font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer Quote ── */}
      <section className="py-10 bg-white border-t border-stone-100 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="italic text-stone-500 text-lg font-serif"
        >
          "A small home can create a big change."
        </motion.p>
      </section>

    </div>
  );
};

export default AboutUs;