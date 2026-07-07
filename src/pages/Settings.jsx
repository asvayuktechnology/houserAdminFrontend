import { useState, useEffect } from "react";
import {
  Info,
  Shield,
  Upload,
  Settings2,
  Save,
  Loader2,
  ShieldClose,
} from "lucide-react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../comman/api";

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
  { id: "smtp", label: "SMTP Settings", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // General Settings state
  const [general, setGeneral] = useState({
  
    siteEmail: "",
    sitePhone: "",
    siteAddress: "",
  });

  const [smtp, setSmtp] = useState({
    host: "",
    port: "587",
    username: "",
    password: "",
    encryption: "tls",
    fromEmail: "",
    fromName: "",
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        const data = res.data || res;

        setGeneral({
     
          siteEmail: data.email || "",
          sitePhone: data.phoneNo || "",
          siteAddress: data.address || "",
        });

        if (data.smtp) {
          const enc = data.smtp.encryption;
          let encValue = "tls";
          if (enc?.ssl) encValue = "ssl";
          else if (!enc?.tls && !enc?.ssl) encValue = "none";

          setSmtp({
            host: data.smtp.host || "",
            port: String(data.smtp.port || "587"),
            username: data.smtp.username || "",
            password: data.smtp.password || "",
            encryption: encValue,
            fromEmail: data.smtp.fromEmail || "",
            fromName: data.smtp.fromName || "",
          });
        }

        if (data.logo) {
          setLogoPreview(data.logo);
        }
      } catch (err) {
        toast.error(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

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

      const formData = new FormData();
      formData.append("email", general.siteEmail);
      formData.append("phoneNo", general.sitePhone);
      formData.append("address", general.siteAddress);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const encryptionObj = {
        tls: smtp.encryption === "tls",
        ssl: smtp.encryption === "ssl",
      };
      formData.append("smtp", JSON.stringify({
        host: smtp.host,
        port: Number(smtp.port),
        username: smtp.username,
        password: smtp.password,
        encryption: encryptionObj,
        fromEmail: smtp.fromEmail,
        fromName: smtp.fromName,
      }));

      await updateSettings(formData);

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <span className="ml-3 text-gray-400">Loading settings...</span>
        </div>
      ) : (
      <>
      {/* TAB BAR */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border cursor-pointer border-gray-800 cursor-pointer"
                }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4 ">
        {/* GENERAL SETTINGS */}
        {activeTab === "general" && (
          <>
            <h2 className="text-lg font-semibold mb-4 ">General Settings</h2>
            <div className="space-y-3">
            
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

        {activeTab === "smtp" && (
          <>
            <h2 className="text-2xl font-semibold">
              SMTP Configuration
            </h2>

            <p className="mt-2 text-gray-400">
              Configure the outgoing mail server used
              for authentication emails and notifications.
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* SMTP Host */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  SMTP Host
                </label>

                <Input
                  placeholder="smtp.gmail.com"
                  value={smtp.host}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      host: e.target.value,
                    })
                  }
                />
              </div>

              {/* Port */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  SMTP Port
                </label>

                <Input
                  placeholder="587"
                  value={smtp.port}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      port: e.target.value,
                    })
                  }
                />
              </div>

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Username
                </label>

                <Input
                  placeholder="example@gmail.com"
                  value={smtp.username}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Password
                </label>

                <Input
                  type="password"
                  placeholder="********"
                  value={smtp.password}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              {/* From Email */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  From Email
                </label>

                <Input
                  placeholder="noreply@example.com"
                  value={smtp.fromEmail}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      fromEmail: e.target.value,
                    })
                  }
                />
              </div>

              {/* From Name */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  From Name
                </label>

                <Input
                  placeholder="Sky Heights"
                  value={smtp.fromName}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      fromName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Encryption */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-400">
                  Encryption
                </label>

                <select
                  value={smtp.encryption}
                  onChange={(e) =>
                    setSmtp({
                      ...smtp,
                      encryption: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>

            </div>

            {/* Test Email */}
            {/* <div className="mt-8 flex items-center justify-between rounded-2xl border border-blue-600/20 bg-blue-600/5 p-5">

              <div>
                <h3 className="font-medium text-white">
                  Test SMTP Connection
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Send a test email to verify your SMTP configuration.
                </p>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-500">
                Send Test Email
              </Button>

            </div> */}
          </>
        )}

        {/* SAVE BUTTON */}
        <div className="pt-4 border-t border-gray-800 ">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 cursor-pointer"
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
      </>
      )}
    </div>
  );
}
