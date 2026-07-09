import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Pencil, Download, Upload, Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  getProperties,
  deleteProperty,
  updateProperty,
  uploadPropertiesExcel,
  getFixedProperties,
  deleteFixedProperty,
  updateFixedProperty,
  allDeleteProperties,
  getCities,
} from "../comman/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Card from "../components/ui/Card";
import FormModal from "../components/ui/modal/FormModal";
import ConfirmModal from "../components/ui/modal/ConfirmModal";
import { useNavigate } from "react-router-dom";
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-md text-sm font-medium transition bg-gray-800 hover:bg-gray-700 flex items-center gap-1 ${className}`}
    {...props}
  >
    {children}
  </button>
);
import Button from "../components/ui/Button";
// const Button = ({ children, className = "", ...props }) => (
//   <button
//     className={`px-3 py-2 rounded-md text-sm font-medium transition bg-gray-800 hover:bg-gray-700 flex items-center gap-1 ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// );

const Input = (props) => (
  <input
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

export default function PropertiesPage() {
   const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fixedProperties, setFixedProperties] = useState([]);
  const [cities, setCities] = useState([]);

  // Search state
  const [searchCity, setSearchCity] = useState("");
  const [searchPlotNumber, setSearchPlotNumber] = useState("");
  const [searchSector, setSearchSector] = useState("");
  const [searchMobileNumber, setSearchMobileNumber] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);



  const searchRef = useRef({ city: "", plotNumber: "", sector: "", mobileNumber: "" });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { city, plotNumber, sector, mobileNumber } = searchRef.current;
      const params = { page, limit, city, plotNumber, sector, mobileNumber };
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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities({ limit: 1000 });
        setCities(res?.data ?? []);
      } catch {
        // silently fail
      }
    };
    fetchCities();
  }, []);

  // Refetch when all search inputs become empty after a previous search
  useEffect(() => {
    const hasInputValues = searchCity || searchPlotNumber || searchSector || searchMobileNumber;
    const hasRefValues = searchRef.current.city || searchRef.current.plotNumber || searchRef.current.sector || searchRef.current.mobileNumber;

    if (!hasInputValues && hasRefValues) {
      searchRef.current = { city: "", plotNumber: "", sector: "", mobileNumber: "" };
      setPage(1);
      setRefreshKey((k) => k + 1);
    }
  }, [searchCity, searchPlotNumber, searchSector, searchMobileNumber]);

  const handleSearch = () => {
    searchRef.current = {
      city: searchCity,
      plotNumber: searchPlotNumber,
      sector: searchSector,
      mobileNumber: searchMobileNumber,
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
      const { city, plotNumber, sector, mobileNumber } = searchRef.current;
      const res = await getFixedProperties({ export: true, city, plotNumber, sector, mobileNumber });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white p-6">
      <Card title="Properties" >
        {/* HEADER + EXPORT */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-6 mt-4 md:gap-0 gap-4">


          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
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
              variant="primary"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 cursor-pointer" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* SEARCH INPUTS */}
        <div className="flex md:flex-row flex-col flex-wrap md:items-end gap-3 mb-6">
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
            <label className="text-xs text-gray-400">Plot Number</label>
            <Input
              placeholder="Plot Number"
              value={searchPlotNumber}
              onChange={(e) => setSearchPlotNumber(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Sector</label>
            <Input
              placeholder="Sector"
              value={searchSector}
              onChange={(e) => setSearchSector(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Mobile Number</label>
            <Input
              placeholder="Mobile Number"
              value={searchMobileNumber}
              onChange={(e) => setSearchMobileNumber(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button variant="primary" onClick={handleSearch}>
            <Search className="w-4 h-4 cursor-pointer" />
            Search
          </Button>
          <Button variant="danger" onClick={() => setDeleteAll(true)}>
            <Trash2 className="w-4 h-4 cursor-pointer" />
            All Delete
          </Button>
           <Button
            className="bg-green-600 hover:bg-green-500 h-[42px] cursor-pointer"
            onClick={() => navigate("/admin/add-properties")}
          >
            Create
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
          <div className="rounded-2xl border border-[#2A3052] bg-[#1B2038] overflow-x-scroll shadow-xl table-scroller">
            <table className="w-full border border-gray-800 rounded-md overflow-hidden">
              <thead className="border-b border-[#2A3052]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">#</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">City</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Sector</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Plot</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Category Code</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Sub Category</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Name</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Father Name</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">PermanentAddress</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">CorrespondenceAddress</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Email</th>
                  {/* <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">Image</th> */}
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70 ">Actions</th>
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
                  <motion.tr
                    layout
                    whileHover={{
                      scale: 1.005
                    }}
                    transition={{
                      duration: .18
                    }}

                    key={p.id}
                    className={`group text-sm border-b border-[#2A3052] transition-all duration-200 hover:bg-[#232A47]/70 ${i % 2 === 0 ? "bg-gray-950/50" : ""
                      }`}>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-400">{(page - 1) * limit + i + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.city}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.sector}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.plotNumber}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.categoryCode}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.subCategoryCode}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.fatherName}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.permanentAddress}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.correspondenceAddress}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.mobileNumber}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.email}</td>
                    {/* <td className="px-6 py-3 whitespace-nowrap">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt="property"
                          className="w-14 h-14 rounded-md object-cover border border-[#2A3052]"
                        />
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td> */}

                    <td className="p-3 flex gap-2 justify-center">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4 cursor-pointer" />
                      </Button>

                      <Button variant="primary" onClick={() => handleEdit(p)}>
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
              variant={page <= 1 ? "ghost" : "secondary"}
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
                  variant={`${p === page
                    ? "primary"
                    : "outline"
                    }`}
                 
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}

      </Card>

      <FormModal
        open={!!selected}
        title="Edit Property"
        loading={loading}
        onClose={() => setSelected(null)}
        onSubmit={handleSave}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">City</label>
            <select
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
              value={selected?.city || ""}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>
          {[
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
              value={selected?.[field] || ""}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
            />
          ))}
        </div>
      </FormModal>

      <ConfirmModal
        open={deleteAll}
        onClose={() => setDeleteAll(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Properties"
        description="This will permanently delete all properties. This action cannot be undone."
        loading={loading}
        confirmText="Delete All"
        variant="danger"
      />

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Property"
        description="This property will be permanently deleted. This action cannot be undone."
        loading={loading}
        confirmText="Delete"
        variant="danger"
      />

      {/* EDIT MODAL */}
      {/* {selected && (
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
      )} */}


      {/* ALL DELETE CONFIRM MODAL */}
      {/* {deleteAll && (
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
      )} */}


      {/* DELETE CONFIRM MODAL */}
      {/* {deleteId && (
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
      )} */}

    </div>
  );
}
