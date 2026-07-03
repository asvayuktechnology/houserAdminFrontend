import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Pencil, Download, Upload, Search, MapPin, Globe, Star } from "lucide-react";
import {
  getDealers,
  deleteDealer,
  updateDealer,
  uploadDealersExcel,
  allDeleteDealers,
} from "../comman/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

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

export default function DealersPage() {
  const [dealers, setDealers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mapDealer, setMapDealer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchWebsite, setSearchWebsite] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const searchRef = useRef({ name: "", city: "", phone: "", website: "", keyword: "" });

  const fetchDealers = useCallback(async () => {
    try {
      setLoading(true);
      const { name, city, phone, website, keyword } = searchRef.current;
      const params = { page, limit, name, city, phone, website, keyword };
      const res = await getDealers(params);
      setDealers(res?.data ?? []);
      setTotalCount(res?.totalCount ?? 0);
      setCurrentCount(res?.currentCount ?? 0);
    } catch {
      toast.error("Failed to load dealers ❌");
    } finally {
      setLoading(false);
    }
  }, [page, limit, refreshKey]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  useEffect(() => {
    const hasInputValues = searchName || searchCity || searchPhone || searchWebsite || searchKeyword;
    const hasRefValues = searchRef.current.name || searchRef.current.city || searchRef.current.phone || searchRef.current.website || searchRef.current.keyword;

    if (!hasInputValues && hasRefValues) {
      searchRef.current = { name: "", city: "", phone: "", website: "", keyword: "" };
      setPage(1);
      setRefreshKey((k) => k + 1);
    }
  }, [searchName, searchCity, searchPhone, searchWebsite, searchKeyword]);

  const handleSearch = () => {
    searchRef.current = {
      name: searchName,
      city: searchCity,
      phone: searchPhone,
      website: searchWebsite,
      keyword: searchKeyword,
    };
    if (page !== 1) {
      setPage(1);
    } else {
      fetchDealers();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deleteDealer(deleteId);
      toast.success("Dealer deleted ✅");
      setDeleteId(null);
      fetchDealers();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const confirmDeleteAll = async () => {
    try {
      setLoading(true);
      await allDeleteDealers();
      toast.success("All dealers deleted ✅");
      setDeleteAll(false);
      fetchDealers();
    } catch {
      toast.error("Delete all failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dealer) => setSelected(dealer);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { id, ...payload } = selected;
      const res = await updateDealer(selected.id, payload);

      setDealers((prev) =>
        prev.map((d) => (d.id === selected.id ? res.data : d))
      );

      toast.success("Dealer updated ✅");
      setSelected(null);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const { name, city, phone, website, keyword } = searchRef.current;
      const res = await getDealers({ export: true, name, city, phone, website, keyword });
      const allData = res?.data ?? res ?? [];
      const items = Array.isArray(allData) ? allData : [];

      if (!items.length) {
        toast.error("No data to export ❌");
        return;
      }

      const exportData = items.map((d) => ({
        Name: d.name || "",
        City: d.city || "",
        Phone: d.phone || "",
        Address: d.address || "",
        Website: d.website || "",
        Rating: d.rating || "",
        Lat: d.lat || "",
        Lng: d.lng || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dealers");
      XLSX.writeFile(workbook, "dealers.xlsx");
    } catch (err) {
      toast.error("Export failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const res = await uploadDealersExcel(file);

      const { total, inserted, skipped, skippedRows } = res.data;

      let msg = `Import completed ✅\nTotal: ${total}, Inserted: ${inserted}, Skipped: ${skipped}`;

      if (skippedRows?.length) {
        msg += `\nReason: ${skippedRows[0].reason}`;
      }

      toast.success(msg);
      fetchDealers();
    } catch (err) {
      toast.error(err.message || "Import failed ❌");
    } finally {
      e.target.value = "";
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
const handleCopyPhone = async () => {
  if (!searchPhone) return;

  await navigator.clipboard.writeText(searchPhone);
  toast.success("Phone copied!");
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      <div className="flex justify-between items-center mb-6 mt-14">
        <h1 className="text-3xl font-bold">Dealers</h1>

        <div className="flex items-center gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
            onClick={() => document.getElementById("excelInput").click()}
          >
            <Upload className="w-4 h-4 cursor-pointer" />
            Import Excel
          </Button>

          <input
            id="excelInput"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />

          <Button
            className="bg-green-600 hover:bg-red-500 cursor-pointer"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 cursor-pointer" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Name</label>
          <Input
            placeholder="Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">City</label>
          <Input
            placeholder="City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Phone</label>
          <Input
            placeholder="Phone"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Website</label>
          <Input
            placeholder="Website"
            value={searchWebsite}
            onChange={(e) => setSearchWebsite(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div> */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Keyword</label>
          <Input
            placeholder="Search By Address & Rating"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
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

      <div className="text-sm text-gray-400 mb-3">
        {dealers.length > 0
          ? `Showing ${(page - 1) * limit + 1} - ${(page - 1) * limit + dealers.length} of ${totalCount} dealers`
          : "No dealers found"}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-800 text-left text-sm uppercase text-gray-400">
              <tr>
                <th className="p-3">#</th>
                 {/* <th className="p-3">UserId</th> */}
                <th className="p-3">City</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3">Website</th>
                <th className="p-3 text-center">Rating</th>
                <th className="p-3 text-center">Map</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!dealers?.length ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    No dealers found
                  </td>
                </tr>
              ) : dealers?.map((d, i) => (
                <tr
                  key={d.id}
                  className={`border-t border-gray-800 hover:bg-gray-900 ${
                    i % 2 === 0 ? "bg-gray-950/50" : ""
                  }`}
                >
                  <td className="p-3 text-gray-400">{(page - 1) * limit + i + 1}</td>
                  <td className="p-3">{d.city || "-"}</td>
                  <td className="p-3 font-semibold">{d.name}</td>
                    <td className="p-3">
                      <span
                        className="bg-green-900 text-green-400 px-2 py-1 rounded-lg text-xs cursor-pointer"
                        onClick={async () => {
                          await navigator.clipboard.writeText(d.phone || "");
                          toast.success("Phone copied!");
                        }}
                      >
                        {d.phone}
                      </span>
                  </td>
                  <td className="p-3 max-w-xs truncate">{d.address || "-"}</td>
                  <td className="p-3">
                    {d.website ? (
                      <a
                        href={`https://${d.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Globe size={14} />
                        {d.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {d.rating ? (
                      <span className="flex items-center justify-center gap-1 text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        {d.rating}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {d.lat && d.lng ? (
                      <Button
                        className="bg-purple-600 hover:bg-purple-500"
                        onClick={() => setMapDealer(d)}
                      >
                        View
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-xs">No Location</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => handleDelete(d.id)}
                    >
                      <Trash2 className="w-4 h-4 cursor-pointer" />
                    </Button>

                    <Button onClick={() => handleEdit(d)}>
                      <Pencil className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                className={`${
                  p === page
                    ? "bg-indigo-600 hover:bg-indigo-500"
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
                Open in Maps
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

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit Dealer</h2>

            {[
              "city",
              "name",
              "phone",
              "address",
              "website",
              "rating",
              "lat",
              "lng",
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

            <div className="flex gap-2 pt-2 cursor-pointer">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>

              <Button
                className="bg-gray-700 cursor-pointer"
                onClick={() => setSelected(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteAll && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 text-center space-y-4">
            <h2 className="text-xl font-semibold">Delete All Dealers?</h2>
            <p className="text-gray-400 text-sm">
              This will permanently delete all dealers.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                className="bg-red-600 hover:bg-red-500"
                onClick={confirmDeleteAll}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete All"}
              </Button>
              <Button
                className="bg-gray-700"
                onClick={() => setDeleteAll(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 text-center space-y-4">
            <h2 className="text-xl font-semibold">Are you sure?</h2>
            <p className="text-gray-400 text-sm">
              This dealer will be deleted permanently.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                className="bg-red-600 hover:bg-red-500"
                onClick={confirmDelete}
              >
                Yes, Delete
              </Button>
              <Button
                className="bg-gray-700"
                onClick={() => setDeleteId(null)}
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
