import { motion } from "framer-motion";
import { Users, Home, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard } from "../comman/api";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import Card from "../components/ui/Card";

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
      color: "blue",
    },
    {
      title: "Dealers",
      value: data?.counts?.dealers || 0,
      icon: Building2,
      color: "emerald",
    },
    {
      title: "Users",
      value: data?.counts?.users || 0,
      icon: Users,
      color: "amber",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white p-6  backdrop-blur-sm">
      {/* <Toaster position="right-top" /> */}
      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 gap-6 mt-14 mb-10 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item, i) => {
          const Icon = item.icon;

          const colors = {
            blue: {
              bg: "bg-blue-600/15",
              icon: "text-blue-500",
            },
            emerald: {
              bg: "bg-emerald-500/15",
              icon: "text-emerald-400",
            },
            amber: {
              bg: "bg-amber-500/15",
              icon: "text-amber-400",
            },
          };

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.45,
              }}
              whileHover={{
                y: -6,
                scale: 1.01,
              }}
              className=" ">
              <Card>
                {/* Background Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative flex items-center justify-between">

                  {/* Left */}
                  <div
                    className={`
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              ${colors[item.color].bg}
            `}
                  >
                    <Icon
                      size={28}
                      className={colors[item.color].icon}
                    />
                  </div>

                  {/* Right */}
                  <div className="text-right">

                    <h2 className="text-4xl font-semibold tracking-tight text-white">
                      {item.value}
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                      {item.title}
                    </p>

                  </div>

                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 LISTS */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Properties */}
        <Card showHeader title="Properties" >
          {/* <h2 className="text-xl font-semibold mb-4">Properties</h2> */}
          {data?.latest?.properties?.map((p) => (
            <div key={p.id} className="p-3 bg-gray-700/50 rounded-xl mb-2">
              <p>{p.city}</p>
              <p className="text-xs text-gray-400">
                {p.category || "N/A"}
              </p>
            </div>
          ))}
        </Card>

        {/* Dealers */}
        <Card showHeader title=" Dealers">



          {/* Rows */}
          <div>
            {data?.latest?.dealers?.length ? (
              data.latest.dealers.map((d) => (
                <div
                  key={d.id}
                  className="
            items-center
            border-b
            border-[#2A3052]
            py-4
            transition-all
            duration-200
            hover:bg-[#202540]
            px-2
          "
                >
                  <div>
                    <p className="font-medium text-white transition hover:text-blue-400 cursor-pointer text-sm">
                      {d.name}
                    </p>


                  </div>


                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500">
                No dealers found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-5 text-center">
            <button className="text-sm font-medium text-gray-300 transition hover:text-blue-500">
              View All →
            </button>
          </div>

        </Card>

        {/* Users */}
        <Card showHeader title="Users">

          {/* Rows */}
          <div>
            {data?.latest?.users?.length ? (
              data.latest.users.map((u) => (
                <div
                  key={u.id}
                  className="
            border-b
            border-[#2A3052]
            px-2
            py-2
            transition-all
            duration-200
            hover:bg-[#202540]
            last:border-b-0
          "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">

                      <p className="cursor-pointer text-sm font-medium text-white transition hover:text-blue-400">
                        {u.name || u.phone}
                      </p>

                      {u.role && (
                        <span className=" inline-flex rounded-full bg-blue-600/10 px-2 py-1 text-[11px] font-medium text-blue-400">
                          {u.role}
                        </span>
                      )}

                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {u.phone}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500">
                No users found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-5 text-center">
            <button className="text-sm font-medium text-gray-300 transition hover:text-blue-500">
              View All →
            </button>
          </div>

        </Card>

      </div>
    </div>
  );
};

export default DashboardHome;