import { useEffect, useState } from "react";
import { Trash2, Pencil, Download, MapPin } from "lucide-react";
import {
  getDealers,
  deleteDealer,
  updateDealer,
} from "../comman/api";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

export default function DealersPage() {
  const [dealers, setDealers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mapDealer, setMapDealer] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH
  const fetchDealers = async () => {
    try {
      setLoading(true);
      const res = await getDealers();
      setDealers(res?.data || []);
    } catch (err) {
      toast.error(err?.message || "Failed to load dealers ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this dealer?")) return;

    try {
      await deleteDealer(id);
      setDealers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deleted successfully ✅");
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // ✅ EDIT
  const handleEdit = (dealer) => {
    setSelected(dealer);
  };

  // ✅ UPDATE
  const handleSave = async () => {
    try {
      const res = await updateDealer(selected.id, selected);

      setDealers((prev) =>
        prev.map((d) => (d.id === selected.id ? res.data : d))
      );

      toast.success("Updated successfully 🚀");
      setSelected(null);
    } catch {
      toast.error("Update failed ❌");
    }
  };

  // ✅ EXPORT CSV
  const handleExport = () => {
    if (!dealers.length) {
      toast.error("No data to export ❌");
      return;
    }

    const headers = [
      "name",
      "email",
      "contact",
      "area",
      "location",
      "address",
      "lat",
      "lng",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    dealers.forEach((d) => {
      const row = headers.map((field) => `"${d[field] || ""}"`);
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dealers.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 mt-14">
        <h1 className="text-3xl font-bold">Dealers Management</h1>

        <Button
          className="bg-green-600 hover:bg-green-500"
          onClick={handleExport}
        >
          <Download size={16} />
          Export
        </Button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Area</th>
                <th className="p-3">Location</th>
                <th className="p-3">Map</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {dealers.map((d, i) => (
                <tr
                  key={d.id}
                  className={`border-t border-gray-800 hover:bg-gray-900 transition ${
                    i % 2 === 0 ? "bg-gray-950/50" : ""
                  }`}
                >
                  {/* NAME */}
                  <td className="p-3 font-semibold">
                    {d.name}
                    <div className="text-xs text-gray-500">{d.email}</div>
                  </td>

                  {/* CONTACT */}
                  <td className="p-3">
                    <span className="bg-green-900 text-green-400 px-2 py-1 rounded-lg text-xs">
                      {d.contact}
                    </span>
                  </td>

                  {/* AREA */}
                  <td className="p-3">{d.area}</td>

                  {/* LOCATION */}
                  <td className="p-3">
                    {d.location ? (
                      <a
                        href={`https://www.google.com/maps?q=${d.lat},${d.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <MapPin size={14} />
                        {d.location}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* MAP BUTTON */}
                  <td className="p-3 text-center">
                    {d.lat && d.lng ? (
                      <Button
                        className="bg-purple-600 hover:bg-purple-500"
                        onClick={() => setMapDealer(d)}
                      >
                        View
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No Location
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => handleDelete(d.id)}
                    >
                      <Trash2 size={16} />
                    </Button>

                    <Button
                      className="bg-blue-600 hover:bg-blue-500"
                      onClick={() => handleEdit(d)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dealers.length === 0 && (
            <p className="text-center p-6 text-gray-400">
              No dealers found
            </p>
          )}
        </div>
      )}

      {/* 🗺️ MAP MODAL */}
      {mapDealer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-2xl w-full max-w-2xl border border-gray-800">
            <h2 className="text-lg font-semibold mb-3 text-center">
              {mapDealer.name} Location
            </h2>

            <iframe
              title="map"
              width="100%"
              height="350"
              className="rounded-xl"
              src={`https://www.google.com/maps?q=${mapDealer.lat},${mapDealer.lng}&output=embed`}
            />

            <div className="flex gap-3 mt-4">
              <Button
                className="w-full bg-blue-600"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${mapDealer.lat},${mapDealer.lng}`,
                    "_blank"
                  )
                }
              >
                Open in Maps 🌍
              </Button>

              <Button
                className="w-full bg-gray-700"
                onClick={() => setMapDealer(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-xl text-center font-semibold">
              Edit Dealer
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Input
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
              />
              <Input
                value={selected.email}
                onChange={(e) =>
                  setSelected({ ...selected, email: e.target.value })
                }
              />
              <Input
                value={selected.contact}
                onChange={(e) =>
                  setSelected({ ...selected, contact: e.target.value })
                }
              />
              <Input
                value={selected.area}
                onChange={(e) =>
                  setSelected({ ...selected, area: e.target.value })
                }
              />
              <Input
                value={selected.location}
                onChange={(e) =>
                  setSelected({ ...selected, location: e.target.value })
                }
              />
              <Input
                value={selected.address}
                onChange={(e) =>
                  setSelected({ ...selected, address: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                className="w-full bg-blue-600"
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                className="w-full bg-gray-700"
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