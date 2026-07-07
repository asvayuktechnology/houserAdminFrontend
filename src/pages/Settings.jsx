import { useState } from "react";
import {
  Info,
  Shield,
  Upload,
  Settings2,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-gray-800 hover:bg-gray-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600 resize-none"
    {...props}
  />
);

const tabs = [
  { id: "general", label: "General Settings", icon: Settings2 },
  // { id: "about", label: "About", icon: Info },
  // { id: "privacy", label: "Privacy Policy", icon: Shield },
  { id: "logo", label: "Logo Upload", icon: Upload },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // General Settings state
  const [general, setGeneral] = useState({
    siteName: "",
    siteEmail: "",
    sitePhone: "",
    siteAddress: "",
  });

  // About state
  const [about, setAbout] = useState({
    title: "",
    description: "",
  });

  // Privacy Policy state
  const [privacy, setPrivacy] = useState({
    content: "",
  });

  // Logo state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [saving, setSaving] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // TODO: Replace with actual API calls when endpoints are available
      // await updateSettings(activeTab, payload);

      await new Promise((r) => setTimeout(r, 500));

      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 mt-14">Settings</h1>

      {/* TAB BAR */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
        {/* GENERAL SETTINGS */}
        {activeTab === "general" && (
          <>
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Site Name</label>
                <Input
                  placeholder="Enter site name"
                  value={general.siteName}
                  onChange={(e) =>
                    setGeneral({ ...general, siteName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={general.siteEmail}
                  onChange={(e) =>
                    setGeneral({ ...general, siteEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={general.sitePhone}
                  onChange={(e) =>
                    setGeneral({ ...general, sitePhone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                <Textarea
                  rows={3}
                  placeholder="Enter address"
                  value={general.siteAddress}
                  onChange={(e) =>
                    setGeneral({ ...general, siteAddress: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        )}


      

        {/* LOGO UPLOAD */}
        {activeTab === "logo" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Logo Upload</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Upload Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  onChange={handleLogoChange}
                />
              </div>
              {logoPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-32 rounded-xl border border-gray-700"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* SAVE BUTTON */}
        <div className="pt-4 border-t border-gray-800">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
