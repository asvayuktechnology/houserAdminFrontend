import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Pencil, Download, Upload, Search } from "lucide-react";
import {
  getProperties,
  deleteProperty,
  updateProperty,
  uploadPropertiesExcel,
  getFixedProperties,
  deleteFixedProperty,
  updateFixedProperty,
  allDeleteProperties,
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

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fixedProperties, setFixedProperties] = useState([]);

  // Search state
  const [searchCity, setSearchCity] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);



  const searchRef = useRef({ city: "", category: "", mobile: "", keyword: "" });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { city, category, mobile, keyword } = searchRef.current;
      const params = { page, limit, city, category, mobileNumber: mobile, keyword };
      const res = await getFixedProperties(params);
      setFixedProperties(res?.data ?? []);
      setTotalCount(res?.totalCount ?? 0);
      setCurrentCount(res?.currentCount ?? 0);
    } catch {
      toast.error("Failed to load properties ❌");
    } finally {
      setLoading(false);
    }
  }, [page, limit, refreshKey]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Refetch when all search inputs become empty after a previous search
  useEffect(() => {
    const hasInputValues = searchCity || searchCategory || searchMobile || searchKeyword;
    const hasRefValues = searchRef.current.city || searchRef.current.category || searchRef.current.mobile || searchRef.current.keyword;

    if (!hasInputValues && hasRefValues) {
      searchRef.current = { city: "", category: "", mobile: "", keyword: "" };
      setPage(1);
      setRefreshKey((k) => k + 1);
    }
  }, [searchCity, searchCategory, searchMobile, searchKeyword]);

  const handleSearch = () => {
    searchRef.current = {
      city: searchCity,
      category: searchCategory,
      mobile: searchMobile,
      keyword: searchKeyword,
    };
    if (page !== 1) {
      setPage(1);
    } else {
      fetchProperties();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deleteFixedProperty(deleteId);
      toast.success("Property deleted ✅");
      setDeleteId(null);
      fetchProperties();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const confirmDeleteAll = async () => {
    try {
      setLoading(true);
      await allDeleteProperties();
      toast.success("All properties deleted ✅");
      setDeleteAll(false);
      fetchProperties();
    } catch {
      toast.error("Delete all failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => setSelected(property);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { id, imageUrl, createdAt, ...payload } = selected;
      const res = await updateFixedProperty(selected.id, payload);

      setFixedProperties((prev) =>
        prev.map((p) => (p.id === selected.id ? res.data : p))
      );

      toast.success("Property updated ✅");
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
      const { city, category, mobile, keyword } = searchRef.current;
      const res = await getFixedProperties({ export: true, city, category, mobileNumber: mobile, keyword });
      const allData = res?.data ?? res ?? [];
      const items = Array.isArray(allData) ? allData : [];

      if (!items.length) {
        toast.error("No data to export ❌");
        return;
      }

      const exportData = items.map((p) => ({
        City: p.city || "",
        SectorId: p.sector || "",
        PlotNumber: p.plotNumber || "",
        CategoryCode: p.categoryCode || "",
        SubCategoryCode: p.subCategoryCode || "",
        Name: p.name || "",
        FatherName: p.fatherName || "",
        PermanentAddress: p.permanentAddress || "",
        CorrespondenceAddress: p.correspondenceAddress || "",
        MobileNumber: p.mobileNumber || "",
        Email: p.email || "",
        // ImageUrl: p.imageUrl || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");
      XLSX.writeFile(workbook, "properties.xlsx");
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
      const res = await uploadPropertiesExcel(file);

      const { total, inserted, skipped, skippedRows } = res.data;

      let msg = `Import completed ✅\nTotal: ${total}, Inserted: ${inserted}, Skipped: ${skipped}`;

      if (skippedRows?.length) {
        msg += `\nReason: ${skippedRows[0].reason}`;
      }

      toast.success(msg);
      fetchProperties();
    } catch (err) {
      toast.error(err.message || "Import failed ❌");
    } finally {
      e.target.value = "";
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  // Clamp page when totalPages shrinks (e.g. after search)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      {/* HEADER + EXPORT */}
      <div className="flex justify-between items-center mb-6 mt-14">
        <h1 className="text-3xl font-bold">Properties</h1>

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

      {/* SEARCH INPUTS */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
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
          <label className="text-xs text-gray-400">Category</label>
          <Input
            placeholder="Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Mobile</label>
          <Input
            placeholder="Mobile Number"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Keyword</label>
          <Input
            placeholder="Search By Email & Name"
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

      {/* COUNT INFO */}
      <div className="text-sm text-gray-400 mb-3">
        {fixedProperties.length > 0
          ? `Showing ${(page - 1) * limit + 1} - ${(page - 1) * limit + fixedProperties.length} of ${totalCount} properties`
          : "No properties found"}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-800 text-left text-sm uppercase text-gray-400">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">City</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Plot</th>
                <th className="p-3">Category Code</th>
                <th className="p-3">Sub Category</th>
                <th className="p-3">Name</th>
                <th className="p-3">Father Name</th>
                <th className="p-3">PermanentAddress</th>
                <th className="p-3">CorrespondenceAddress</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Email</th>
                {/* <th className="p-3">Image</th> */}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!fixedProperties?.length ? (
                <tr>
                  <td colSpan={14} className="p-6 text-center text-gray-500">
                    No properties found
                  </td>
                </tr>
              ) : fixedProperties?.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-t border-gray-800 hover:bg-gray-900 ${
                    i % 2 === 0 ? "bg-gray-950/50" : ""
                  }`}
                >
                  <td className="p-3 text-gray-400">{(page - 1) * limit + i + 1}</td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{p.sector}</td>
                  <td className="p-3">{p.plotNumber}</td>
                  <td className="p-3">{p.categoryCode}</td>
                  <td className="p-3">{p.subCategoryCode}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.fatherName}</td>
                   <td className="p-3">{p.permanentAddress}</td>
                    <td className="p-3">{p.correspondenceAddress}</td>
                  <td className="p-3">{p.mobileNumber}</td>
                  <td className="p-3">{p.email}</td>
                  {/* <td className="p-3">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt="property"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td> */}

                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="w-4 h-4 cursor-pointer" />
                    </Button>

                    <Button onClick={() => handleEdit(p)}>
                      <Pencil className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </td>
                </tr>
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

      {/* EDIT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit Property</h2>

            {[
              "city",
              "sector",
              "plotNumber",
              "categoryCode",
              "subCategoryCode",
              "name",
              "fatherName",
              "permanentAddress",
              "correspondenceAddress",
              "mobileNumber",
              
              "email",
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

      {/* ALL DELETE CONFIRM MODAL */}
      {deleteAll && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 text-center space-y-4">
            <h2 className="text-xl font-semibold">Delete All Properties?</h2>
            <p className="text-gray-400 text-sm">
              This will permanently delete all properties.
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

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 text-center space-y-4">
            <h2 className="text-xl font-semibold">Are you sure?</h2>
            <p className="text-gray-400 text-sm">
              This property will be deleted permanently.
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
