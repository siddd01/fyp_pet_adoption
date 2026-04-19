import { motion } from "framer-motion";

const defaultVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  amount = 0.2,
  once = true,
  variants = defaultVariants,
  as = "div",
  ...props
}) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
