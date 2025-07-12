import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formVariants = {
  initial: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: 'relative',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
    transition: { duration: 0.3 },
  }),
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleSwitch = () => {
    setDirection(isLogin ? 1 : -1);
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isLogin ? 'Logged in!' : 'Account created!');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-navy rounded-xl shadow-lg relative overflow-hidden">
      <AnimatePresence custom={direction} mode="wait">
        {isLogin ? (
          <motion.form
            key="login"
            custom={direction}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-navy dark:text-offwhite mb-2">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
            <button
              type="submit"
              className="bg-blue text-white py-2 rounded hover:bg-navy transition-colors font-semibold flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Don't have an account?{' '}
              <span
                className="text-blue cursor-pointer hover:underline"
                onClick={handleSwitch}
              >
                Sign up
              </span>
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="signup"
            custom={direction}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-navy dark:text-offwhite mb-2">Sign Up</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
            <button
              type="submit"
              className="bg-blue text-white py-2 rounded hover:bg-navy transition-colors font-semibold flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : 'Sign Up'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Already have an account?{' '}
              <span
                className="text-blue cursor-pointer hover:underline"
                onClick={handleSwitch}
              >
                Login
              </span>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
} 