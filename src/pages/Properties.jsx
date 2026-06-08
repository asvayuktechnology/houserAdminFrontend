import { useEffect, useState } from "react";
import { Trash2, Pencil, Download } from "lucide-react";
import {
  getProperties,
  deleteProperty,
  updateProperty,
} from "../comman/api";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-gray-800 hover:bg-gray-700 flex items-center gap-1 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await getProperties();
      setProperties(res?.data || []);
    } catch {
      toast.error("Failed to load properties ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success("Property deleted ✅");
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // ✅ EDIT
  const handleEdit = (property) => setSelected(property);

  // ✅ UPDATE
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateProperty(selected.id, selected);

      setProperties((prev) =>
        prev.map((p) => (p.id === selected.id ? res.data : p))
      );

      toast.success("Property updated ✅");
      setSelected(null);
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EXPORT CSV
  const handleExport = () => {
    if (!properties.length) {
      toast.error("No data to export ❌");
      return;
    }

    const headers = [
      "city",
      "sector",
      "plotNumber",
      "category",
      "plotSize",
      "propertyStatus",
      "ownerName",
      "ownerPhone",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    properties.forEach((p) => {
      const row = headers.map((field) => `"${p[field] || ""}"`);
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "properties.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      {/* HEADER + EXPORT */}
      <div className="flex justify-between items-center mb-6 mt-14">
        <h1 className="text-3xl font-bold">Properties</h1>

        <Button
          className="bg-green-600 hover:bg-green-500"
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-800 text-left text-sm uppercase text-gray-400">
              <tr>
                <th className="p-3">City</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Plot</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3">Status</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Phone</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties?.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-t border-gray-800 hover:bg-gray-900 ${
                    i % 2 === 0 ? "bg-gray-950/50" : ""
                  }`}
                >
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{p.sector}</td>
                  <td className="p-3">{p.plotNumber}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.plotSize}</td>
                  <td className="p-3">{p.propertyStatus}</td>
                  <td className="p-3">{p.ownerName}</td>
                  <td className="p-3">{p.ownerPhone}</td>

                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button onClick={() => handleEdit(p)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit Property</h2>

            {[
              "city",
              "sector",
              "plotNumber",
              "category",
              "plotSize",
              "propertyStatus",
              "ownerName",
              "ownerPhone",
            ].map((field) => (
              <Input
                key={field}
                placeholder={field}
                value={selected[field] || ""}
                onChange={(e) =>
                  setSelected({ ...selected, [field]: e.target.value })
                }
              />
            ))}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>

              <Button
                className="bg-gray-700"
                onClick={() => setSelected(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}