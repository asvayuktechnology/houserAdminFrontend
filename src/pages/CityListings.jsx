import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Pencil, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  getCities,
  addCity,
  deleteCity,
  updateCity,
  allDeleteCities,
} from "../comman/api";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import FormModal from "../components/ui/modal/FormModal";
import ConfirmModal from "../components/ui/modal/ConfirmModal";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-md text-sm font-medium transition bg-gray-800 hover:bg-gray-700 flex items-center gap-1 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

export default function CityListingsPage() {
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [newCity, setNewCity] = useState("");

  // Search state
  const [searchCity, setSearchCity] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const searchRef = useRef({ city: "" });

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      const { city } = searchRef.current;
      const params = { page, limit, city };
      const res = await getCities(params);
      setCities(res?.data ?? []);
      setTotalCount(res?.totalCount ?? 0);
      setCurrentCount(res?.currentCount ?? 0);
    } catch {
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  }, [page, limit, refreshKey]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Refetch when search input becomes empty after a previous search
  useEffect(() => {
    const hasInputValues = searchCity;
    const hasRefValues = searchRef.current.city;

    if (!hasInputValues && hasRefValues) {
      searchRef.current = { city: "" };
      setPage(1);
      setRefreshKey((k) => k + 1);
    }
  }, [searchCity]);

  const handleSearch = () => {
    searchRef.current = { city: searchCity };
    if (page !== 1) {
      setPage(1);
    } else {
      fetchCities();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deleteCity(deleteId);
      toast.success("City deleted");
      setDeleteId(null);
      fetchCities();
    } catch {
      toast.error("Delete failed");
    }
  };

  const confirmDeleteAll = async () => {
    try {
      setLoading(true);
      await allDeleteCities();
      toast.success("All cities deleted");
      setDeleteAll(false);
      fetchCities();
    } catch {
      toast.error("Delete all failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city) => setSelected(city);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { id, createdAt, ...payload } = selected;
      const res = await updateCity(selected.id, payload);

      setCities((prev) =>
        prev.map((c) => (c.id === selected.id ? res.data : c))
      );

      toast.success("City updated");
      setSelected(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) {
      toast.error("City name is required");
      return;
    }

    try {
      setLoading(true);
      await addCity({ city: newCity.trim() });
      toast.success("City added");
      setNewCity("");
      setAddModal(false);
      fetchCities();
    } catch (err) {
      toast.error(err?.message || "Failed to add city");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/90 text-white p-6">
      <Card title="City Listings">
        {/* HEADER + ACTIONS */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-6 mt-4 md:gap-0 gap-4">
          <div className="flex items-center gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
              onClick={() => setAddModal(true)}
            >
              <Plus className="w-4 h-4 cursor-pointer" />
              Add City
            </Button>
          </div>
        </div>

        {/* SEARCH INPUT */}
        <div className="flex md:flex-row flex-col flex-wrap md:items-end gap-3 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">City</label>
            <Input
              placeholder="Search City"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 h-[42px] cursor-pointer" onClick={handleSearch}>
            <Search className="w-4 h-4 cursor-pointer" />
            Search
          </Button>
          <Button className="bg-red-700 hover:bg-red-600 h-[42px] cursor-pointer" onClick={() => setDeleteAll(true)}>
            <Trash2 className="w-4 h-4 cursor-pointer" />
            All Delete
          </Button>
        </div>

        {/* COUNT INFO */}
        <div className="text-sm text-gray-400 mb-3">
          {cities.length > 0
            ? `Showing ${(page - 1) * limit + 1} - ${(page - 1) * limit + cities.length} of ${totalCount} cities`
            : "No cities found"}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="rounded-2xl border border-[#2A3052] bg-[#1B2038] overflow-x-scroll shadow-xl">
            <table className="w-full border border-gray-800 rounded-md overflow-hidden">
              <thead className="border-b border-[#2A3052]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">#</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">City Name</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Created At</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!cities?.length ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No cities found
                    </td>
                  </tr>
                ) : cities?.map((c, i) => (
                  <motion.tr
                    layout
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.18 }}
                    key={c.id}
                    className={`group text-sm border-b border-[#2A3052] transition-all duration-200 hover:bg-[#232A47]/70 ${i % 2 === 0 ? "bg-gray-950/50" : ""}`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-gray-400">{(page - 1) * limit + i + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{c.city}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <Button
                        className="bg-red-600 hover:bg-red-500"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="w-4 h-4 cursor-pointer" />
                      </Button>
                      <Button onClick={() => handleEdit(c)}>
                        <Pencil className="w-4 h-4 cursor-pointer" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 cursor-pointer">
            <Button
              className="bg-gray-700 hover:bg-gray-600 cursor-pointer"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>

            <span className="text-sm text-gray-400 px-3">
              Page {page} of {totalPages}
            </span>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span>
              ) : (
                <Button
                  key={p}
                  className={`${p === page
                    ? "bg-indigo-500 hover:bg-indigo-500"
                    : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              className="bg-gray-700 hover:bg-gray-600 cursor-pointer"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* ADD CITY MODAL */}
      <FormModal
        open={addModal}
        title="Add City"
        loading={loading}
        onClose={() => { setAddModal(false); setNewCity(""); }}
        onSubmit={handleAddCity}
      >
        <Input
          placeholder="City Name *"
          required
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
      </FormModal>

      {/* EDIT CITY MODAL */}
      <FormModal
        open={!!selected}
        title="Edit City"
        loading={loading}
        onClose={() => setSelected(null)}
        onSubmit={handleSave}
      >
        <Input
          placeholder="City Name"
          value={selected?.city || ""}
          onChange={(e) =>
            setSelected((prev) => ({
              ...prev,
              city: e.target.value,
            }))
          }
        />
      </FormModal>

      {/* DELETE ALL CONFIRM MODAL */}
      <ConfirmModal
        open={deleteAll}
        onClose={() => setDeleteAll(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Cities"
        description="This will permanently delete all cities. This action cannot be undone."
        loading={loading}
        confirmText="Delete All"
        variant="danger"
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete City"
        description="This city will be permanently deleted. This action cannot be undone."
        loading={loading}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
