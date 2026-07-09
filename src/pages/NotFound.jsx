import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-[10rem] font-bold leading-none bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 cursor-pointer"
          >
            <Home size={18} />
            Go Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
