import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../comman/api";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition ${className}`}
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

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ phone: "", role: "user" });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res?.data || []);
    } catch (error) {
      toast.error(error?.message ||  "Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ ADD USER
  const handleAdd = async () => {
    if (!form.phone) {
      toast.error("Phone required ❌");
      return;
    }

    try {
      const res = await addUser(form);
      setUsers((prev) => [res.data, ...prev]);
      toast.success("User added ✅");

      setForm({ phone: "", role: "user" });
    } catch {
      toast.error("Add failed ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Deleted ✅");
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // ✅ EDIT OPEN
  const handleEdit = (user) => {
    setSelected(user);
  };

  // ✅ UPDATE
  const handleSave = async () => {
    try {
      const res = await updateUser(selected.id, selected);

      setUsers((prev) =>
        prev.map((u) => (u.id === selected.id ? res.data : u))
      );

      toast.success("Updated ✅");
      setSelected(null);
    } catch {
      toast.error("Update failed ❌");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Users Management
      </h1>

      {/* ADD USER */}
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 mb-6 space-y-3 max-w-xl mx-auto">
        <h2 className="text-lg font-semibold">Add User</h2>

        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="dealer">Dealer</option>
          <option value="admin">Admin</option>
        </select>

        <Button
          onClick={handleAdd}
          className="w-full bg-blue-600 hover:bg-blue-500"
        >
          Add User
        </Button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-800 text-gray-400 text-sm">
              <tr>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-t border-gray-800 ${
                    i % 2 === 0 ? "bg-gray-950" : ""
                  }`}
                >
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3">{u.role}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        u.isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {u.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <Button onClick={() => toggleStatus(u)}>
                      Toggle
                    </Button>

                    <Button onClick={() => handleEdit(u)}>
                      <Pencil size={16} />
                    </Button>

                    <Button
                      className="bg-red-600"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center p-6 text-gray-400">
              No users found
            </p>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit User</h2>

            <Input
              value={selected.phone}
              onChange={(e) =>
                setSelected({ ...selected, phone: e.target.value })
              }
            />

            <select
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700"
              value={selected.role}
              onChange={(e) =>
                setSelected({ ...selected, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="dealer">Dealer</option>
              <option value="admin">Admin</option>
            </select>

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