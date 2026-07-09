import { useState, useRef } from "react";
import { addBlogs } from "../comman/api";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

// const Button = ({ children, className = "", ...props }) => (
//   <button
//     className={`px-3 py-2 rounded-md text-sm font-medium transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// );

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
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

export function AddBlogPage() {
     const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Content is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      if (imageFile) {
        formData.append("featuredImage", imageFile);
      }

      await addBlogs(formData);

      toast.success("Blog created successfully");

      setTitle("");
      setContent("");
      setStatus("draft");
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto mt-10">
        <Card showHeader title="Add Blog">
          <div className="space-y-5 p-6">
            {/* Title */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="rounded-md overflow-hidden border border-gray-700">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write blog content..."
                  className="bg-gray-800 text-white"
                  style={{ minHeight: "200px" }}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Featured Image
              </label>

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="imageUpload"
                />

                <label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 px-4 py-3 rounded-md border-2 border-dashed border-gray-700 cursor-pointer transition hover:border-blue-500 hover:bg-gray-800/50"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {imageFile ? imageFile.name : "Click to upload image"}
                  </span>
                </label>

                {imageFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-60 object-cover rounded-md border border-gray-700"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-lg flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Selected</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Submit */}
          
            <div className="space-y-3">
  <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? "Creating..." : "Create Blog"}
            </Button>

  <Button
    type="button"
    variant="secondary"
    onClick={() => navigate("/admin/blogs")}
    className="w-full"
  >
    Cancel
  </Button>
</div>
          </div>
        </Card>
      </div>

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
          min-height: 200px;
        }
        .ql-editor {
          color: white !important;
          min-height: 200px;
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
