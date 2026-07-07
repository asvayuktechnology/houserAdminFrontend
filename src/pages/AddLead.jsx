import { useState } from "react";
import { addLead } from "../comman/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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

const Textarea = ({ ...props }) => (
  <textarea
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    rows={3}
    {...props}
  />
);

export function AddLeadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phoneNo: "",
    city: "",
    sector: "",
    plot: "",
    address: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addLead(form);

      toast.success("Lead added successfully");

      setForm({
        fullName: "",
        phoneNo: "",
        city: "",
        sector: "",
        plot: "",
        address: "",
        comment: "",
      });
      navigate("/admin/leads");
    } catch (error) {
      toast.error("Failed to add lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mt-14 mb-6">
        Add Lead
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4"
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
          placeholder="Plot *"
          value={form.plot}
          required
          onChange={(e) =>
            setForm({ ...form, plot: e.target.value })
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
    className="w-full cursor-pointer"
    disabled={loading}
  >
   {loading ? "Saving..." : "Save Lead"}
  </Button>

  <Button
    type="button"
    className="w-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
    onClick={() => navigate("/admin/leads")}
  >
    Cancel
  </Button>
</div>
      </form>
    </div>
  );
}