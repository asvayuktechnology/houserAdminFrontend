import { useState } from "react";
import { addPost } from "../comman/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
// const Button = ({ children, className = "", ...props }) => (
//   <button
//     className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// );

const Input = ({ ...props }) => (
  <input
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    rows={3}
    {...props}
  />
);
const Select = ({ children, ...props }) => (
  <select
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  >
    {children}
  </select>
);
export function AddPostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phoneNo: "",
    city: "",
    sector: "",
    plot: "",
    address: "",
     type: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addPost(form);

      toast.success("Post added successfully");

      setForm({
        fullName: "",
        phoneNo: "",
        city: "",
        sector: "",
        plot: "",
        address: "",
         type: "",
        comment: "",
        
      });
      navigate("/admin/posts");
    } catch (error) {
      toast.error("Failed to add posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white p-6">

      <div className=" mx-auto">
        <Card title="Add Post">

          <form
            onSubmit={handleSubmit}
            className=" space-y-4"
          >
            <Input
              type="text"
              placeholder="Full Name *"
              value={form.fullName}
              required
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <Input
              type="tel"
              placeholder="Phone No *"
              value={form.phoneNo}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              maxLength={10}
              onChange={(e) =>
                setForm({
                  ...form,
                  phoneNo: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <Input
              type="text"
              placeholder="City *"
              value={form.city}
              required
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <Input
              type="text"
              placeholder="Sector *"
              value={form.sector}
              required
              onChange={(e) =>
                setForm({ ...form, sector: e.target.value })
              }
            />

        <Input
          type="text"
          placeholder="Address *"
          value={form.address}
          required
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />
<Select
  value={form.type}
  required
  onChange={(e) =>
    setForm({ ...form, type: e.target.value })
  }
>
  <option value="" disabled>
    Select Section Type
  </option>
  <option value="sell">Sell</option>
  <option value="buy">Buy</option>
  <option value="rent">Rent</option>
</Select>
        <Textarea
          placeholder="Comment *"
          value={form.comment}
          // required
          onChange={(e) =>
            setForm({ ...form, comment: e.target.value })
          }
        />

            <Textarea
              placeholder="Comment *"
              value={form.comment}
              // required
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
            />

            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Post"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full cursor-pointer"
                onClick={() => navigate("/admin/posts")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}