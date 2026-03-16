import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  return (
    <div className="bg-stone-50 text-stone-800">

      {/* Header (Shop Style) */}
      <div className="bg-white border-b border-stone-100">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 py-10"
        >
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Sano Ghar
          </p>
          <h1 className="text-4xl font-serif text-stone-900 mb-2">
            About Us
          </h1>
          <p className="text-stone-500 text-sm">
            A safe home for every rescued soul
          </p>
        </motion.div>
      </div>

      {/* Who We Are */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-stone-900">
            Who We Are
          </h2>
          <p className="leading-relaxed text-stone-600">
            <b>Sano Ghar</b> is a pet adoption and welfare center dedicated to
            rescuing abandoned and vulnerable animals and providing them with
            care, protection, and a second chance at life. We operate with a
            strong ethical foundation, combining compassion with technology to
            ensure transparency, trust, and efficiency in the adoption process.
          </p>
        </motion.div>
      </section>

      {/* Mission & Story */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3 text-stone-900">
              Our Mission
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Our mission is to create a responsible and humane adoption system
              where every pet receives proper medical care, shelter, and love.
              We promote adoption over purchasing pets and reinvest in animal
              welfare through our integrated charity model, where 20% of store
              profits are donated to animal welfare initiatives.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.9 }}
            className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3 text-stone-900">
              Our Story
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Sano Ghar was founded after witnessing the increasing number of
              stray and abandoned animals lacking proper care. What began as a
              small rescue effort evolved into a structured pet adoption
              platform designed to connect adopters, staff, and administrators
              through a secure and transparent system. Each successful adoption
              reinforces our belief that every animal deserves a loving home.
            </p>
          </motion.div>

        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold mb-8 text-stone-900">
            What We Do
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              "Ethical Pet Adoption Services",
              "Health & Care Management",
              "Role-Based System (Admin, Staff, Customer)",
              "Integrated Pet Store with Charity Support",
              "Transparency Reports for Donations",
              "Community Awareness & Welfare Programs",
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white border border-stone-100 rounded-2xl p-5 text-center shadow-sm"
              >
                <p className="text-sm text-stone-700">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section className="bg-white border-t border-stone-100 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-semibold mb-6 text-stone-900">
            Contact Us
          </h2>
          <p className="text-stone-600 text-sm mb-2">
            📞 Phone: +977 98XXXXXXXX
          </p>
          <p className="text-stone-600 text-sm mb-2">
            📧 Email: support@sanoghar.com
          </p>
          <p className="text-stone-600 text-sm">
            📍 Location: Kathmandu, Nepal
          </p>
        </motion.div>
      </section>

      {/* Footer Quote */}
      <section className="py-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="italic text-sm text-stone-500"
        >
          “A small home can create a big change.”
        </motion.p>
      </section>
    </div>
  );
};

export default AboutUs;