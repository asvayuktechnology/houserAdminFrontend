import { useState } from "react";
import { addLead } from "../comman/api";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-blue-600 hover:bg-blue-500 ${className}`}
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
  const [form, setForm] = useState({
    fullname: "",
    phoneNo: "",
    city: "",
    sector: "",
    plot: "",
    address: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.fullname || !form.phoneNo) {
      toast.error("Full Name & Phone No required");
      return;
    }

    try {
      setLoading(true);
      await addLead(form);
      toast.success("Lead added successfully");

      setForm({
        fullname: "",
        phoneNo: "",
        city: "",
        sector: "",
        plot: "",
        address: "",
        comment: "",
      });
    } catch {
      toast.error("Failed to add lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/90 text-white p-6">
      <h1 className="text-3xl font-bold text-center mt-14 mb-6">
        Add Lead
      </h1>

      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">

        <Input
          placeholder="Full Name *"
          value={form.fullname}
          onChange={(e) =>
            setForm({ ...form, fullname: e.target.value })
          }
        />

        <Input
          placeholder="Phone No *"
          value={form.phoneNo}
          onChange={(e) =>
            setForm({ ...form, phoneNo: e.target.value })
          }
        />

        <Input
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <Input
          placeholder="Sector"
          value={form.sector}
          onChange={(e) =>
            setForm({ ...form, sector: e.target.value })
          }
        />

        <Input
          placeholder="Plot"
          value={form.plot}
          onChange={(e) =>
            setForm({ ...form, plot: e.target.value })
          }
        />

        <Input
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <Textarea
          placeholder="Comment"
          value={form.comment}
          onChange={(e) =>
            setForm({ ...form, comment: e.target.value })
          }
        />

        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Lead"}
        </Button>
      </div>
    </div>
  );
}
