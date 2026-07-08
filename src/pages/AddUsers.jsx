import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../comman/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ error, icon, ...props }) => (
  <input
    className={`w-full px-3 py-2 rounded-xl bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"
      } text-white outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"
      }`}
    {...props}
  />
);

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "", phone: "", city: "", state: "", companyName: "", address: "", role: "user" });
  const [formErrors, setFormErrors] = useState({});
  const [selected, setSelected] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({ city: "", phone: "", keyword: "" });
  const limit = 10;

  const validateForm = (data) => {
    const errors = {};
    const required = { name: "Name", email: "Email", phone: "Phone", state: "State", city: "City" };
    for (const [key, label] of Object.entries(required)) {
      if (!data[key]?.trim()) {
        errors[key] = `${label} is required`;
      }
    }
    if (data.password && data.password !== data.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }
    return errors;
  };

  const clearFormError = (field) => {
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const clearEditError = (field) => {
    setEditErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ✅ FETCH USERS
  const fetchUsers = async (p = page) => {
    try {
      setLoading(true);
      const params = { page: p, limit, ...filters };
      const res = await getUsers(params);
      setUsers(res?.data || []);
      setTotalCount(res?.totalCount || 0);
    } catch (error) {
      toast.error(error?.message || "Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const totalPages = Math.ceil(totalCount / limit);

  // ✅ ADD USER
  const handleAdd = async () => {
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await addUser(form);
      setUsers((prev) => [res.data, ...prev]);
      toast.success("User added ✅");

      setForm({ name: "", email: "", password: "", confirm_password: "", phone: "", city: "", state: "", companyName: "", address: "", role: "user" });
      setFormErrors({});
      setShowAddModal(false);
    } catch (err) {
      const serverErrors = err?.data?.message;
      if (Array.isArray(serverErrors)) {
        const fieldErrors = {};
        serverErrors.forEach((e) => { if (e.field) fieldErrors[e.field] = e.message; });
        if (Object.keys(fieldErrors).length > 0) {
          setFormErrors(fieldErrors);
          toast.error("Please fix the errors below ❌");
          return;
        }
      }
      toast.error(err?.message || "Add failed ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Deleted ✅");
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed ❌");
    }

  };

  // ✅ EDIT OPEN
  const handleEdit = (user) => {
    setSelected({ ...user, password: "", confirm_password: "" });
    setEditErrors({});

  };

  // ✅ UPDATE
  const handleSave = async () => {
    const errors = validateForm(selected);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = { ...selected };
    if (!payload.password) {
      delete payload.password;
      delete payload.confirm_password;
    }

    try {
      const res = await updateUser(selected.id, payload);

      setUsers((prev) =>
        prev.map((u) => (u.id === selected.id ? res.data : u))
      );

      toast.success("Updated ✅");
      setSelected(null);
    } catch (err) {
      const serverErrors = err?.data?.message;
      if (Array.isArray(serverErrors)) {
        const fieldErrors = {};
        serverErrors.forEach((e) => { if (e.field) fieldErrors[e.field] = e.message; });
        if (Object.keys(fieldErrors).length > 0) {
          setEditErrors(fieldErrors);
          toast.error("Please fix the errors below ❌");
          return;
        }
      }
      toast.error(err?.message || "Update failed ❌");
    }
  };

  // ✅ TOGGLE STATUS
  const toggleStatus = async (user) => {
    try {
      const updated = {
        ...user,
        isActive: !user.isActive,
      };

      const res = await updateUser(user.id, updated);

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? res.data : u))
      );

      toast.success("Status updated ⚡");
    } catch {
      toast.error("Failed ❌");
    }
  };

  const renderField = (label, field, type = "text", formType = "add") => {
    const isAdd = formType === "add";
    const value = isAdd ? form[field] : selected[field];
    const error = isAdd ? formErrors[field] : editErrors[field];
    const setValue = isAdd
      ? (val) => { setForm((prev) => ({ ...prev, [field]: val })); clearFormError(field); }
      : (val) => { setSelected((prev) => ({ ...prev, [field]: val })); clearEditError(field); };

    return (
      <div>
        <Input
          placeholder={label}
          type={type}
          value={value || ""}
          error={error}
          onChange={(e) => setValue(e.target.value)}
        />
        {error && (
          <p className="text-red-400 text-xs mt-1">{error}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/90 text-white p-6">
      <Card title="Users Management">


        {/* FILTERS + CREATE USER */}
        <div className="flex items-end gap-3 mb-6 flex-wrap max-w-5xl ">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1 block">City</label>
            <Input
              placeholder="Filter by city"
              value={filters.city}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1 block">Phone</label>
            <Input
              placeholder="Filter by phone"
              value={filters.phone}
              onChange={(e) => setFilters((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1 block">Keyword</label>
            <Input
              placeholder="Search by name, email..."
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
            />
          </div>
          <Button
            onClick={() => { setPage(1); fetchUsers(1); }}
            className="bg-blue-600 hover:bg-blue-500 h-[42px]"
          >
            Search
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-500 h-[42px]"
          >
            + Create User
          </Button>
        </div>

        {/* TABLE */}
        {/* TABLE */}
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : (
          <div className="rounded-2xl border border-[#2A3052] bg-[#1B2038] overflow-x-auto shadow-xl">
            <table className="min-w-[1300px] w-full">
              <thead className="border-b border-[#2A3052]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    State
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-medium text-white/70">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-medium text-white/70">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {!users.length ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-12 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      layout
                      whileHover={{
                        scale: 1.005,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                      className={`group border-b border-[#2A3052] text-sm transition-all duration-200 hover:bg-[#232A47]/70 ${i % 2 === 0 ? "bg-gray-950/50" : ""
                        }`}
                    >
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {(page - 1) * limit + i + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        {u.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {u.email}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.phone}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.city}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.state}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.companyName || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="rounded-lg bg-blue-600/20 border border-blue-600/30 px-3 py-1 text-xs font-medium text-blue-400">
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${u.isActive
                            ? "bg-green-500/15 text-green-400 border border-green-500/20"
                            : "bg-red-500/15 text-red-400 border border-red-500/20"
                            }`}
                        >
                          <span
                            className={`mr-2 h-2 w-2 rounded-full ${u.isActive
                              ? "bg-green-400"
                              : "bg-red-400"
                              }`}
                          />
                          {u.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            className="bg-[#232A47] hover:bg-blue-600"
                            onClick={() => handleEdit(u)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            className="bg-red-600 hover:bg-red-500"
                            onClick={() => setDeleteTarget(u)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              className="rounded-xl border border-[#2A3052] bg-[#1B2038] hover:bg-[#232A47]"
              disabled={page <= 1}
              onClick={() => {
                const p = page - 1;
                setPage(p);
                fetchUsers(p);
              }}
            >
              Previous
            </Button>

            <div className="rounded-xl border border-[#2A3052] bg-[#171B2E] px-5 py-2 text-sm text-gray-300">
              Page <span className="font-semibold text-white">{page}</span> of{" "}
              <span className="font-semibold text-white">{totalPages}</span>
            </div>

            <Button
              className="rounded-xl border border-[#2A3052] bg-[#1B2038] hover:bg-[#232A47]"
              disabled={page >= totalPages}
              onClick={() => {
                const p = page + 1;
                setPage(p);
                fetchUsers(p);
              }}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-3 border border-gray-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">Add User</h2>

            {renderField("Name", "name")}
            {renderField("Email", "email", "email")}
            {renderField("Phone", "phone")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Company Name", "companyName")}
            {renderField("Address", "address")}

            <select
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="dealer">Dealer</option>
              <option value="admin">admin</option>
            </select>

            {renderField("Password", "password", "password")}
            {renderField("Confirm Password", "confirm_password", "password")}

            <div className="flex gap-2 pt-2">
              <Button className="w-full bg-blue-600" onClick={handleAdd}>
                Add User
              </Button>
              <Button
                className="w-full bg-gray-700"
                onClick={() => { setShowAddModal(false); setFormErrors({}); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm space-y-4 border border-gray-800 text-center">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p className="text-gray-400 text-sm">
              Are you sure you want to delete this user?
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                className="w-full bg-red-600 hover:bg-red-500"
                onClick={() => handleDelete(deleteTarget.id)}
              >
                Delete
              </Button>
              <Button
                className="w-full bg-gray-700"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit User</h2>

            {renderField("Name", "name", "text", "edit")}
            {renderField("Email", "email", "email", "edit")}

            {renderField("Phone", "phone", "text", "edit")}
            {renderField("City", "city", "text", "edit")}
            {renderField("State", "state", "text", "edit")}
            {renderField("Company Name", "companyName", "text", "edit")}
            {renderField("Address", "address", "text", "edit")}

            <select
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={selected.role}
              onChange={(e) =>
                setSelected({ ...selected, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="dealer">Dealer</option>

            </select>
            {renderField("Password", "password", "password", "edit")}
            {renderField("Confirm Password", "confirm_password", "password", "edit")}
            <div className="flex gap-2 pt-2">
              <Button className="w-full bg-blue-600" onClick={handleSave}>
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
