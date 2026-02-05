import { motion } from 'framer-motion';

export default function Card({ className = '', children, noHover = false }) {
  if (noHover) {
    return (
      <div className={`rounded-2xl border border-slate-100 bg-white shadow-soft ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl border border-slate-100 bg-white shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}
