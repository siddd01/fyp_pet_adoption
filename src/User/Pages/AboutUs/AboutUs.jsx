import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800 mt-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Sano Ghar
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            A safe home for every rescued soul
          </p>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold mb-6">Who We Are</h2>
          <p className="leading-relaxed text-gray-700">
            <b>Sano Ghar</b> is a pet adoption and welfare center dedicated to
            rescuing abandoned and vulnerable animals and providing them with
            care, protection, and a second chance at life. We operate with a
            strong ethical foundation, combining compassion with technology to
            ensure transparency, trust, and efficiency in the adoption process.
          </p>
        </motion.div>
      </section>

      {/* Mission & Story */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
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
          >
            <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
            <p className="text-gray-700 leading-relaxed">
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
          <h2 className="text-3xl font-semibold mb-8">What We Do</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <p className="font-medium text-gray-700">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 text-white py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
          <p className="mb-2">📞 Phone: +977 98XXXXXXXX</p>
          <p className="mb-2">📧 Email: support@sanoghar.com</p>
          <p>📍 Location: Kathmandu, Nepal</p>
        </motion.div>
      </section>

      {/* Footer Quote */}
      <section className="py-10 bg-emerald-600 text-white text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="italic text-lg"
        >
          “A small home can create a big change.”
        </motion.p>
      </section>
    </div>
  );
};

export default AboutUs;
