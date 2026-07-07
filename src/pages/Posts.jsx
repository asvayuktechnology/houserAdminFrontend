import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Pencil, Search } from "lucide-react";
import {
  getPosts,
  deletePost,
  updatePost,
  allDeletePosts,
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

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const searchRef = useRef({ name: "", city: "", phone: "" });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { name, city, phone } = searchRef.current;
      const params = { page, limit, name, city, phone };
      const res = await getPosts(params);
      setPosts(res?.data ?? []);
      setTotalCount(res?.totalCount ?? 0);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, refreshKey]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const hasInputValues = searchName || searchCity || searchPhone;
    const hasRefValues = searchRef.current.name || searchRef.current.city || searchRef.current.phone;

    if (!hasInputValues && hasRefValues) {
      searchRef.current = { name: "", city: "", phone: "" };
      setPage(1);
      setRefreshKey((k) => k + 1);
    }
  }, [searchName, searchCity, searchPhone]);

  const handleSearch = () => {
    searchRef.current = {
      name: searchName,
      city: searchCity,
      phone: searchPhone,
    };
    if (page !== 1) {
      setPage(1);
    } else {
      fetchPosts();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deletePost(deleteId);
      toast.success("Post deleted");
      setDeleteId(null);
      fetchPosts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const confirmDeleteAll = async () => {
    try {
      setLoading(true);
      await allDeletePosts();
      toast.success("All posts deleted");
      setDeleteAll(false);
      fetchPosts();
    } catch {
      toast.error("Delete all failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => setSelected(post);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { id, ...payload } = selected;
      const res = await updatePost(selected.id, payload);

      setPosts((prev) =>
        prev.map((p) => (p.id === selected.id ? res.data : p))
      );

      toast.success("Post updated");
      setSelected(null);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.message || "Update failed");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">

      <div className="flex justify-between items-center mb-6 mt-14">
        <h1 className="text-3xl font-bold">Posts</h1>
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
        {posts.length > 0
          ? `Showing ${(page - 1) * limit + 1} - ${(page - 1) * limit + posts.length} of ${totalCount} posts`
          : "No posts found"}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-800 text-left text-sm uppercase text-gray-400">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">City</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Plot</th>
                <th className="p-3">Address</th>
                <th className="p-3">Comment</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!posts?.length ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    No posts found
                  </td>
                </tr>
              ) : posts?.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-t border-gray-800 hover:bg-gray-900 ${
                    i % 2 === 0 ? "bg-gray-950/50" : ""
                  }`}
                >
                  <td className="p-3 text-gray-400">{(page - 1) * limit + i + 1}</td>
                  <td className="p-3 font-semibold">{p.fullname || "-"}</td>
                  <td className="p-3">
                    <span
                      className="bg-green-900 text-green-400 px-2 py-1 rounded-lg text-xs cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(p.phoneNo || "");
                        toast.success("Phone copied!");
                      }}
                    >
                      {p.phoneNo}
                    </span>
                  </td>
                  <td className="p-3">{p.city || "-"}</td>
                  <td className="p-3">{p.sector || "-"}</td>
                  <td className="p-3">{p.plot || "-"}</td>
                  <td className="p-3 max-w-xs truncate">{p.address || "-"}</td>
                  <td className="p-3 max-w-xs truncate">{p.comment || "-"}</td>
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

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg space-y-3 border border-gray-800">
            <h2 className="text-xl font-semibold">Edit Post</h2>

            {[
              { field: "fullname", label: "Full Name" },
              { field: "phoneNo", label: "Phone No" },
              { field: "city", label: "City" },
              { field: "sector", label: "Sector" },
              { field: "plot", label: "Plot" },
              { field: "address", label: "Address" },
              { field: "comment", label: "Comment" },
            ].map(({ field, label }) => (
              <Input
                key={field}
                placeholder={label}
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
            <h2 className="text-xl font-semibold">Delete All Posts?</h2>
            <p className="text-gray-400 text-sm">
              This will permanently delete all posts.
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
              This post will be deleted permanently.
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
