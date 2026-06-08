import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  getBanners,
  addBanner,
  deleteBanner,
  updateBanner,
} from "../comman/api";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-gray-800 hover:bg-gray-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

const Select = ({ ...props }) => (
  <select
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none"
    {...props}
  />
);

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "homepage", // ✅ default
  });
  const [imageFile, setImageFile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getBanners();
      setBanners(res?.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load banners ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ================= ADD =================
  const handleAdd = async () => {
    if (!form.title || !imageFile) {
      toast.error("Title & Image required");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category); // ✅ added
      fd.append("images", imageFile);

      await addBanner(fd);

      setForm({ title: "", category: "homepage" });
      setImageFile(null);

      toast.success("Banner added ✅");
      fetchBanners();
    } catch (err) {
      toast.error(err.message || "Add failed ❌");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Deleted 🗑️");
    } catch (err) {
      toast.error(err.message || "Delete failed ❌");
    }
  };

  // ================= UPDATE =================
  const handleSave = async () => {
    try {
      setLoading(true);

      const { id, ...payload } = selected;

      const res = await updateBanner(id, payload);

      setBanners((prev) =>
        prev.map((b) => (b.id === id ? res.data : b))
      );

      toast.success("Updated ✨");
      setSelected(null);
    } catch (err) {
      toast.error(err.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 mt-14">Banners</h1>

      {/* ADD FORM */}
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 mb-6 space-y-3">
        <h2 className="text-lg font-semibold">Add Banner</h2>

        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* ✅ CATEGORY DROPDOWN */}
        <Select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="homepage">Homepage</option>
          <option value="properties">Properties</option>
          <option value="dealer">Dealer</option>
        </Select>

        <input
          type="file"
          accept="image/*"
          className="w-full text-white"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500">
          Add Banner
        </Button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <img
                src={b.imageUrl}
                className="w-full h-40 object-cover"
                alt={b.title}
              />

              <div className="p-3">
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-gray-400">
                  {b.category}
                </p>

                <div className="flex justify-end gap-2 mt-2">
                  <Button onClick={() => setSelected(b)}>
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    className="bg-red-600"
                    onClick={() => handleDelete(b.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit Banner</h2>

            <Input
              value={selected.title}
              onChange={(e) =>
                setSelected({ ...selected, title: e.target.value })
              }
            />

            {/* ✅ EDIT CATEGORY */}
            <Select
              value={selected.category}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  category: e.target.value,
                })
              }
            >
              <option value="homepage">Homepage</option>
              <option value="properties">Properties</option>
              <option value="dealer">Dealer</option>
            </Select>

            <div className="flex gap-2 pt-2">
              <Button className="w-full" onClick={handleSave}>
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