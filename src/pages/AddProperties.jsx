import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import { addProperty, getCities } from "../comman/api";
import Button from "../components/ui/Button";

// const Button = ({ children, className = "", ...props }) => (
//   <button
//     className={`px-3 py-2 rounded-md text-sm font-medium transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// );

const Input = (props) => (
  <input
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
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

const Textarea = (props) => (
  <textarea
    rows={3}
    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    {...props}
  />
);

export default function AddPropertiesPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    city: "",
    sector: "",
    plotNumber: "",
    categoryCode: "",
    subCategoryCode: "",
    name: "",
    fatherName: "",
    permanentAddress: "",
    correspondenceAddress: "",
    mobileNumber: "",
    email: "",
    // imageUrl: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addProperty(form);

      toast.success("Property added successfully");

      navigate("/admin/properties");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/90 text-white p-6">
      <div className=" mx-auto">
        <Card title="Add Property">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid md:grid-cols-2 gap-4">

              <Select
                required
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              >
                <option value="">Select City *</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </Select>

              <Input
                placeholder="Sector *"
                required
                value={form.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
              />

              <Input
                placeholder="Plot Number *"
                required
                value={form.plotNumber}
                onChange={(e) => handleChange("plotNumber", e.target.value)}
              />

              <Input
                placeholder="Owner Name *"
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <Input
                placeholder="Father Name"
                value={form.fatherName}
                onChange={(e) => handleChange("fatherName", e.target.value)}
              />

              <Input
                type="tel"
                placeholder="Mobile Number *"
                required
                value={form.mobileNumber}
                maxLength={10}
                pattern="[0-9]{10}"
                onChange={(e) =>
                  handleChange(
                    "mobileNumber",
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />

              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              {/* <Input
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
              /> */}

              <Select
                required
                value={form.categoryCode}
                onChange={(e) =>
                  handleChange("categoryCode", e.target.value)
                }
              >
                <option value="">Select Category *</option>

                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="AGRICULTURE">Agriculture</option>
              </Select>

              <Select
                required
                value={form.subCategoryCode}
                onChange={(e) =>
                  handleChange("subCategoryCode", e.target.value)
                }
              >
                <option value="">Select Sub Category *</option>

                <option value="PLOT">Plot</option>
                <option value="HOUSE">House</option>
                <option value="SHOP">Shop</option>
                <option value="FLAT">Flat</option>
              </Select>

            </div>

            <Textarea
              placeholder="Permanent Address"
              value={form.permanentAddress}
              onChange={(e) =>
                handleChange("permanentAddress", e.target.value)
              }
            />

            <Textarea
              placeholder="Correspondence Address"
              value={form.correspondenceAddress}
              onChange={(e) =>
                handleChange("correspondenceAddress", e.target.value)
              }
            />

            <div className="space-y-3 max-w-[250px] gap-3 flex">

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
              >
                {loading ? "Saving..." : "Save Property"}
              </Button>

              <Button
                type="button"
                onClick={() => navigate("/admin/properties")}
                variant="secondary"
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