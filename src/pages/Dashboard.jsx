import { motion } from "framer-motion";
import { Users, Home, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard } from "../comman/api";
import toast, { ToastBar, Toaster } from "react-hot-toast";

const DashboardHome = () => {
  const [data, setData] = useState({
    counts: {},
    latest: {
      properties: [],
      dealers: [],
      users: [],
    },
  });

const fetchDashboard = async () => {
  try {
    const res = await getDashboard();
    setData(res.data);
  } catch (err) {
    toast.error(err.message);
  }
};

  useEffect(() => {
    fetchDashboard();
  }, []);

 
  const stats = [
    {
      title: "Properties",
      value: data?.counts?.properties || 0,
      icon: Home,
    },
    {
      title: "Dealers",
      value: data?.counts?.dealers || 0,
      icon: Building2,
    },
    {
      title: "Users",
      value: data?.counts?.users || 0,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      {/* <Toaster position="right-top" /> */}
      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 mt-14">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-gray-800/60 border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <Icon className="w-6 h-6 text-gray-300" />
                <span className="text-xs text-gray-400">{item.title}</span>
              </div>
              <h2 className="text-2xl font-semibold">{item.value}</h2>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 LISTS */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Properties */}
        <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>
          {data?.latest?.properties?.map((p) => (
            <div key={p.id} className="p-3 bg-gray-700/50 rounded-xl mb-2">
              <p>{p.city}</p>
              <p className="text-xs text-gray-400">
                {p.category || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Dealers */}
        <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Dealers</h2>
          {data?.latest?.dealers?.map((d) => (
            <div key={d.id} className="p-3 bg-gray-700/50 rounded-xl mb-2">
              <p>{d.name}</p>
              <p className="text-xs text-gray-400">{d.location}</p>
            </div>
          ))}
        </div>

        {/* Users */}
        <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          {data?.latest?.users?.map((u) => (
            <div key={u.id} className="p-3 bg-gray-700/50 rounded-xl mb-2">
              <p>{u.phone}</p>
              <p className="text-xs text-gray-400">{u.role}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;