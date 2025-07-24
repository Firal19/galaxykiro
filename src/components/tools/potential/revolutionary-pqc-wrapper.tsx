"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the Revolutionary PQC with no SSR
const RevolutionaryPQCDynamic = dynamic(
  () => import('./revolutionary-pqc').then(mod => ({ default: mod.RevolutionaryPQC })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }
);

export function RevolutionaryPQCWrapper() {
  return <RevolutionaryPQCDynamic />;
}