import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

// ------------------------------------------------------
// Helper: UFI Generator
// ------------------------------------------------------
function generateUFI() {
  // Generate a 10-character alphanumeric ID (letters + numbers)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "UFI-";
  for (let i = 0; i < 10; i++) {
  id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ------------------------------------------------------
// Theme (Govt style colors)
// ------------------------------------------------------
const theme = {
  primary: "#0B5E20", // Dark Green
  secondary: "#F9BE00", // Yellow
  bg: "#F4F6F0",
};

const farmerDum = {
  "name": "Abhi",
  "phone": 9394959695,
  "village": "hjjedkedj",
  "crop": "jhjdkje",
  "kvk": "eheje",
  "land": "edej"
}

// ------------------------------------------------------
// PAGE: Farmer QR Profile Viewer
// ------------------------------------------------------
function FarmerProfilePage() {
  const { id } = useParams();

  // Load farmers from localStorage
  const savedFarmers = JSON.parse(localStorage.getItem("farmers") || "[]");

  // Match farmer by UFI
  const farmer = savedFarmers.find((f) => f.ufi === id) || null;

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ backgroundColor: theme.bg }}>
      <div className="rounded-2xl shadow-xl p-6 w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold text-center mb-4" style={{ color: theme.primary }}>
          Farmer Profile
        </h1>

        <div className="p-4 rounded-xl mb-4" style={{ background: "#EAF5E5" }}>
          {farmer ? (
            <>
              <p><strong>Name:</strong> {farmer.name}</p>
              <p><strong>Phone:</strong> {farmer.phone}</p>
              <p><strong>Village:</strong> {farmer.village}</p>
              <p><strong>Crops:</strong> {farmer.crop}</p>
              <p><strong>Land:</strong> {farmer.land}</p>
              <p><strong>KVK:</strong> {farmer.kvk}</p>

              <p><strong>UFI:</strong> {farmer.ufi}</p>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {farmerDum.name}</p>
              <p><strong>Phone:</strong> {farmerDum.phone}</p>
              <p><strong>Village:</strong> {farmerDum.village}</p>
              <p><strong>Crops:</strong> {farmerDum.crop}</p>
              <p><strong>Land:</strong> {farmerDum.land}</p>
              <p><strong>KVK:</strong> {farmerDum.kvk}</p>

              <p><strong>UFI:</strong> {farmerDum.ufi}</p>
            </>
          )}
        </div>

        <Link to="/" className="underline text-blue-600 text-center block mt-4">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// PAGE: Registration Form
// ------------------------------------------------------
function RegisterFarmer() {
  const [farmer, setFarmer] = useState({
    name: "",
    phone: "",
    village: "",
    crop: "",
    land: "",
    kvk: ""
  });

  const [generatedUFI, setGeneratedUFI] = useState(null);

  // Load saved farmers
  // Load saved farmers
  const [savedFarmers, setSavedFarmers] = useState(
    JSON.parse(localStorage.getItem("farmers") || "[]")
  );

  // Sync LocalStorage across browser tabs
  React.useEffect(() => {
    const syncHandler = (event) => {
      if (event.key === "farmers") {
        try {
          const updated = JSON.parse(event.newValue || "[]");
          setSavedFarmers(updated);
        } catch (err) {
          console.error("Failed to sync farmers across tabs", err);
        }
      }
    };

    window.addEventListener("storage", syncHandler);
    return () => window.removeEventListener("storage", syncHandler);
  }, []);(localStorage.getItem("farmers") || "[]");

  const saveFarmerToLocal = (farmerRecord) => {
    const updated = [...savedFarmers, farmerRecord];
    localStorage.setItem("farmers", JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = generateUFI();
    setGeneratedUFI(newId);

    // Save farmer to localStorage
    saveFarmerToLocal({ ...farmer, ufi: newId });
  };

  const qrProfileUrl = generatedUFI ? `${window.location.origin}/farmer/${generatedUFI}` : "";

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ backgroundColor: theme.bg }}>
      <div className="rounded-2xl shadow-xl p-6 w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold text-center mb-4" style={{ color: theme.primary }}>
          Register New Farmer
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(farmer).map((key) => (
            <input
              key={key}
              placeholder={key.toUpperCase()}
              className="w-full p-2 border rounded-lg"
              value={farmer[key]}
              onChange={(e) => setFarmer({ ...farmer, [key]: e.target.value })}
              required
            />
          ))}

          <button type="submit" className="w-full p-3 rounded-xl text-white font-bold" style={{ background: theme.primary }}>
            Generate UFI & QR
          </button>
        </form>

        {generatedUFI && (
          <div className="mt-6 text-center">
            <h2 className="font-bold text-lg">UFI Generated:</h2>
            <p className="text-xl">{generatedUFI}</p>

            <div className="mt-4 flex justify-center">
              <QRCodeSVG value={qrProfileUrl} size={150} />
            </div>

            <p className="mt-2 text-xs text-gray-500 break-all">{qrProfileUrl}</p>
          </div>
        )}

        <Link to="/" className="underline text-blue-600 text-center block mt-4">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// HOME PAGE
// ------------------------------------------------------
function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ backgroundColor: theme.bg }}>
      <div className="rounded-2xl shadow-xl p-6 w-full max-w-md bg-white">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: theme.primary }}>
          🌾 Govt. Farmer UFI App
        </h1>

        <Link
          to="/register"
          className="block w-full text-center p-3 rounded-xl text-white font-bold mb-4"
          style={{ background: theme.primary }}
        >
          Register New Farmer
        </Link>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Scan any farmer's QR code to open their profile page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// MAIN APP + ROUTING
// ------------------------------------------------------
export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterFarmer />} />
        <Route path="/farmer/:id" element={<FarmerProfilePage />} />
      </Routes>
  );
}
