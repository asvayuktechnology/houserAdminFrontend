import { useState, useEffect } from "react";
import { addDealer } from "../comman/api";
import toast from "react-hot-toast";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// const Button = ({ children, className = "", ...props }) => (
//   <button
//     className={`px-3 py-2 rounded-xl text-sm font-medium transition bg-blue-600 hover:bg-blue-500 ${className}`}
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

// 📍 Click on map
function LocationPicker({ position, setPosition, setForm }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      setForm((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    },
  });

  return position ? <Marker position={position} /> : null;
}

// 🔥 Auto center map
function ChangeMapView({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 13, { animate: true });
  }, [position]);

  return null;
}

export function AddDealerPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    area: "",
    lat: "",
    lng: "",
  });

  const [position, setPosition] = useState([28.6139, 77.2090]); // default Delhi
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 🌍 AUTO FETCH LAT LNG (debounced)
  useEffect(() => {
    if (!form.address || form.address.length < 5) return;

    const timeout = setTimeout(async () => {
      try {
        setLoadingLocation(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            form.address
          )}`
        );

        const data = await res.json();

        if (!data.length) {
          setLoadingLocation(false);
          return;
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setPosition([lat, lng]);

        setForm((prev) => ({
          ...prev,
          lat,
          lng,
        }));

        setLoadingLocation(false);
      } catch {
        setLoadingLocation(false);
        console.log("Location fetch error");
      }
    }, 700); // debounce

    return () => clearTimeout(timeout);
  }, [form.address]);

  // 📍 Current location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);

        setForm((prev) => ({
          ...prev,
          lat,
          lng,
        }));

        toast.success("Location fetched ✅");
      },
      () => toast.error("Permission denied ❌")
    );
  };

  const handleSubmit = async () => {
    if (!form.name || !form.contact) {
      toast.error("Name & Contact required ❌");
      return;
    }

    if (!form.lat || !form.lng) {
      toast.error("Location not selected ❌");
      return;
    }

    try {
      await addDealer(form);
      toast.success("Dealer added ✅");

      setForm({
        name: "",
        email: "",
        contact: "",
        address: "",
        area: "",
        lat: "",
        lng: "",
      });

      setPosition([28.6139, 77.2090]);
    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-black/80 text-white p-6">
      <div className="max-w-xl mx-auto   mt-14 mb-6">
        
      <Card showHeader={true} title="Add Dealer (Auto Location)">

        <div className=" p-6 rounded-2xl space-y-4">

          <Input
            placeholder="Company Name *"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            placeholder="Contact *"
            value={form.contact}
            onChange={(e) =>
              setForm({ ...form, contact: e.target.value })
            }
          />

          <Input
            placeholder="Address (type full address...)"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          {loadingLocation && (
            <p className="text-xs text-yellow-400">
              Fetching location...
            </p>
          )}

          <Input
            placeholder="Area"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value })
            }
          />

          {/* 📍 Current location */}
          <Button
            type="button"
            variant="success"
            className="w-full"
            onClick={getCurrentLocation}
          >
            Use Current Location 📍
          </Button>

          {/* 🗺️ MAP */}
          <div className="rounded-xl overflow-hidden">
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <ChangeMapView position={position} />

              <LocationPicker
                position={position}
                setPosition={setPosition}
                setForm={setForm}
              />
            </MapContainer>
          </div>

          {/* 📍 Show coords */}
          {form.lat && (
            <p className="text-sm text-gray-400 text-center">
              Lat: {form.lat} | Lng: {form.lng}
            </p>
          )}

          <Button variant="primary" onClick={handleSubmit} className="w-full">
            Save Dealer
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}