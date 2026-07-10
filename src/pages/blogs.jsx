import { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Pencil, Search, FileText, Eye, Upload, X, Image as ImageIcon } from "lucide-react";
import { getBlogs, deleteBlogs, updateBlogs, allDeleteBlogs } from "../comman/api";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormModal from "../components/ui/modal/FormModal";
import ConfirmModal from "../components/ui/modal/ConfirmModal";
import ViewModal from "../components/ui/modal/ViewModal";

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

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
  "image",
];

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewBlog, setViewBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const editFileInputRef = useRef(null);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const searchRef = useRef({ title: "", status: "" });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { title, status } = searchRef.current;
      const params = { page, limit, title, status };
      const res = await getBlogs(params);
      setBlogs(res?.data ?? res?.blogs ?? []);
      setTotalCount(res?.totalCount ?? res?.total ?? 0);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, refreshKey]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const hasInputValues = searchTitle || searchStatus;
    const hasRefValues = searchRef.current.title || searchRef.current.status;

    if (!hasInputValues && hasRefValues) {
      searchRef.current = { title: "", status: "" };
      setPage(1);
      setRefreshKey((k) => k + 1);
    }
  }, [searchTitle, searchStatus]);

  const handleSearch = () => {
    searchRef.current = { title: searchTitle, status: searchStatus };
    if (page !== 1) {
      setPage(1);
    } else {
      fetchBlogs();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await deleteBlogs(deleteId);
      toast.success("Blog deleted");
      setDeleteId(null);
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const confirmDeleteAll = async () => {
    try {
      setLoading(true);
      await allDeleteBlogs();
      toast.success("All blogs deleted");
      setDeleteAll(false);
      fetchBlogs();
    } catch {
      toast.error("Delete all failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setSelected({ ...blog });
    setEditImageFile(null);
    setEditImagePreview(blog.featuredImage || "");
  };

  const handleEditImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview("");
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { _id, id, ...rest } = selected;
      const blogId = _id || id;

      const formData = new FormData();
      formData.append("title", rest.title || "");
      formData.append("content", rest.content || "");
      formData.append("status", rest.status || "draft");
      if (editImageFile) {
        formData.append("featuredImage", editImageFile);
      }

      const res = await updateBlogs(blogId, formData);

      setBlogs((prev) =>
        prev.map((b) => ((b._id || b.id) === blogId ? (res.data ?? selected) : b))
      );

      toast.success("Blog updated");
      setSelected(null);
      setEditImageFile(null);
      setEditImagePreview("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
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

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white p-6">
      <Card title="Blogs">

        <div className="flex flex-wrap items-end gap-3 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Title</label>
            <Input
              placeholder="Search by title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Status</label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <Button variant="secondary" onClick={handleSearch}>
            <Search className="w-4 h-4 cursor-pointer" />
            Search
          </Button>
          <Button variant="primary"
            onClick={() => navigate("/admin/add-blogs")}
          >
            Create Blog
          </Button>
        </div>

        <div className="text-sm text-gray-400 mb-3">
          {blogs.length > 0
            ? `Showing ${(page - 1) * limit + 1} - ${(page - 1) * limit + blogs.length} of ${totalCount} blogs`
            : "No blogs found"}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-800 rounded-md overflow-hidden">
              <thead className="bg-gray-800 text-left text-sm uppercase text-gray-400">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Content</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!blogs?.length ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No blogs found
                    </td>
                  </tr>
                ) : blogs?.map((b, i) => (
                  <tr
                    key={b._id || b.id}
                    className={`border-t border-gray-800 hover:bg-gray-900 ${i % 2 === 0 ? "bg-gray-950/50" : ""
                      }`}
                  >
                    <td className="p-3 text-gray-400">{(page - 1) * limit + i + 1}</td>
                    <td className="p-3">
                      {b.featuredImage ? (
                        <img
                          src={b.featuredImage}
                          alt={b.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-semibold max-w-xs truncate">{b.title}</td>
                    <td className="p-3 max-w-sm truncate text-gray-400 text-sm">
                      {stripHtml(b.content || "").substring(0, 80)}...
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${b.status === "published"
                          ? "bg-green-900 text-green-400"
                          : "bg-yellow-900 text-yellow-400"
                          }`}
                      >
                        {b.status || "draft"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <Button
                        variant="primary"
                        onClick={() => setViewBlog(b)}
                      >
                        <Eye className="w-4 h-4 cursor-pointer" />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(b._id || b.id)}
                      >
                        <Trash2 className="w-4 h-4 cursor-pointer" />
                      </Button>
                      <Button variant="primary" onClick={() => handleEdit(b)}>
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


      <ViewModal
        open={!!viewBlog}
        title={viewBlog?.title}
        onClose={() => setViewBlog(null)}
        maxWidth="max-w-3xl"
      >
        {viewBlog?.featuredImage && (
          <img
            src={viewBlog.featuredImage}
            alt={viewBlog.title}
            className="w-full h-64 object-cover rounded-xl"
          />
        )}

        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${viewBlog?.status === "published"
              ? "bg-green-900 text-green-400"
              : "bg-yellow-900 text-yellow-400"
              }`}
          >
            {viewBlog?.status}
          </span>
        </div>

        <div
          className="prose prose-invert max-w-full wrap-break-word"
          dangerouslySetInnerHTML={{
            __html: viewBlog?.content || "",
          }}
        />
      </ViewModal>


      <FormModal
        open={!!selected}
        title="Edit Blog"
        submitText="Save Changes"
        loading={loading}
        onSubmit={handleSave}
        onClose={() => {
          setSelected(null);
          setEditImageFile(null);
          setEditImagePreview("");
        }}
        maxWidth="max-w-3xl"
      >
        <Input
          placeholder="Title"
          value={selected?.title || ""}
          onChange={(e) =>
            setSelected({
              ...selected,
              title: e.target.value,
            })
          }
        />

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Content
          </label>

          <div className="overflow-hidden rounded-xl border border-[#2A3052]">
            <ReactQuill
              theme="snow"
              value={selected?.content || ""}
              onChange={(value) =>
                setSelected({
                  ...selected,
                  content: value,
                })
              }
              modules={quillModules}
              formats={quillFormats}
              className="bg-[#1B2038] text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Featured Image
          </label>

          <div className="flex items-center gap-3">
            <input
              ref={editFileInputRef}
              type="file"
              id="editImageUpload"
              className="hidden"
              accept="image/*"
              onChange={handleEditImageSelect}
            />

            <label
              htmlFor="editImageUpload"
              className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-[#2A3052] px-5 py-4 transition hover:border-blue-500"
            >
              <Upload size={18} />
              {editImageFile ? editImageFile.name : "Choose Image"}
            </label>

            {editImagePreview && (
              <Button
                variant="danger"
                onClick={handleRemoveEditImage}
              >
                Remove
              </Button>
            )}
          </div>

          {editImagePreview && (
            <img
              src={editImagePreview}
              className="mt-4 h-52 w-full rounded-xl object-cover"
            />
          )}
        </div>

        <select
          className="w-full rounded-xl border border-[#2A3052] bg-[#1B2038] px-4 py-3 text-white"
          value={selected?.status || "draft"}
          onChange={(e) =>
            setSelected({
              ...selected,
              status: e.target.value,
            })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </FormModal>

      <ConfirmModal
        open={deleteAll}
        title="Delete All Blogs"
        description="This will permanently delete every blog."
        confirmText="Delete All"
        loading={loading}
        onClose={() => setDeleteAll(false)}
        onConfirm={confirmDeleteAll}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Blog"
        description="This blog will be permanently deleted."
        confirmText="Delete"
        loading={loading}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* View Blog Modal */}
      {viewBlog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl border border-gray-800 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{viewBlog.title}</h2>

            {viewBlog.featuredImage && (
              <img
                src={viewBlog.featuredImage}
                alt={viewBlog.title}
                className="w-full h-60 object-cover rounded-md mb-4"
              />
            )}

            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${viewBlog.status === "published"
                  ? "bg-green-900 text-green-400"
                  : "bg-yellow-900 text-yellow-400"
                  }`}
              >
                {viewBlog.status || "draft"}
              </span>
            </div>

            <div
              className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: viewBlog.content }}
            />

            <div className="flex gap-3 mt-6">
              <Button
                className="w-full bg-gray-700"
                onClick={() => setViewBlog(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl space-y-4 border border-gray-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">Edit Blog</h2>

            <Input
              placeholder="Title"
              value={selected.title || ""}
              onChange={(e) => setSelected({ ...selected, title: e.target.value })}
            />

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Content</label>
              <div className="rounded-md overflow-hidden border border-gray-700">
                <ReactQuill
                  theme="snow"
                  value={selected.content || ""}
                  onChange={(value) => setSelected({ ...selected, content: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write blog content..."
                  className="bg-gray-800 text-white"
                  style={{ minHeight: "150px" }}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Featured Image</label>
              <div className="flex items-center gap-3">
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageSelect}
                  className="hidden"
                  id="editImageUpload"
                />
                <label
                  htmlFor="editImageUpload"
                  className="flex items-center gap-2 px-4 py-3 rounded-md border-2 border-dashed border-gray-700 cursor-pointer transition hover:border-blue-500 hover:bg-gray-800/50"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {editImageFile ? editImageFile.name : "Click to upload"}
                  </span>
                </label>
                {editImagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveEditImage}
                    className="p-2 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editImagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md border border-gray-700"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">{editImageFile ? "New" : "Current"}</span>
                  </div>
                </div>
              )}
            </div>

            <select
              value={selected.status || "draft"}
              onChange={(e) => setSelected({ ...selected, status: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <div className="flex gap-2 pt-2 cursor-pointer">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>

              <Button
                className="bg-gray-700 cursor-pointer"
                onClick={() => {
                  setSelected(null);
                  setEditImageFile(null);
                  setEditImagePreview("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Modal */}
      {/* {deleteAll && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 text-center space-y-4">
            <h2 className="text-xl font-semibold">Delete All Blogs?</h2>
            <p className="text-gray-400 text-sm">
              This will permanently delete all blogs.
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

      {/* Delete Single Modal */}
      {/* {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 text-center space-y-4">
            <h2 className="text-xl font-semibold">Are you sure?</h2>
            <p className="text-gray-400 text-sm">
              This blog will be deleted permanently.
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

      {/* Quill Editor Custom Styles */}
      <style>{`
        .ql-toolbar.ql-snow {
          border: 1px solid #374151 !important;
          border-radius: 12px 12px 0 0 !important;
          background: #1f2937 !important;
        }
        .ql-container.ql-snow {
          border: 1px solid #374151 !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
          background: #1f2937 !important;
          min-height: 150px;
        }
        .ql-editor {
          color: white !important;
          min-height: 150px;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
        }
        .ql-snow .ql-stroke {
          stroke: #9ca3af !important;
        }
        .ql-snow .ql-fill {
          fill: #9ca3af !important;
        }
        .ql-snow .ql-picker {
          color: #9ca3af !important;
        }
        .ql-snow .ql-picker-options {
          background: #1f2937 !important;
          border-color: #374151 !important;
        }
        .ql-snow .ql-active .ql-stroke {
          stroke: #3b82f6 !important;
        }
        .ql-snow .ql-active .ql-fill {
          fill: #3b82f6 !important;
        }
        .ql-snow .ql-active {
          color: #3b82f6 !important;
        }
        .ql-snow .ql-tooltip {
          background: #1f2937 !important;
          border-color: #374151 !important;
          color: white !important;
        }
        .ql-snow .ql-tooltip input {
          background: #374151 !important;
          border-color: #4b5563 !important;
          color: white !important;
        }
        .ql-snow .ql-picker-label {
          color: #9ca3af !important;
        }
        .ql-snow .ql-picker-label:hover {
          color: white !important;
        }
        .ql-toolbar.ql-snow .ql-formats {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
