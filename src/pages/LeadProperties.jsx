import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { getPostProperties } from "../comman/api";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function LeadPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getPostProperties();
      setProperties(res?.data || []);
    } catch (err) {
      toast.error("Failed to load post properties ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white p-6">

      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Lead Properties
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase">
              <tr>
                <th className="p-3">City</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Plot</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3">Status</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Phone</th>
        
              </tr>
            </thead>

            <tbody>
              {properties.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-t border-gray-800 hover:bg-gray-900 ${
                    i % 2 === 0 ? "bg-gray-950/50" : ""
                  }`}
                >
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{p.sector}</td>
                  <td className="p-3">{p.plot_number}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.plot_size}</td>
                  <td className="p-3">{p.property_status}</td>
                  <td className="p-3">{p.owner_name}</td>

                  {/* 🔥 Phone logic */}
                  <td className="p-3">
                    {p.isUnlocked ? (
                      <span className="text-green-400 font-medium">
                        {p.ownerPhone}
                      </span>
                    ) : (
                      <span className="text-gray-500">Locked</span>
                    )}
                  </td>

                  {/* 🔥 Unlock status */}
                 
                </tr>
              ))}
            </tbody>
          </table>

          {properties.length === 0 && (
            <p className="text-center p-6 text-gray-400">
              No post properties found
            </p>
          )}
        </div>
      )}
    </div>
  );
}