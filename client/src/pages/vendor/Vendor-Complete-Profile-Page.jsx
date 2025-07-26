import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/store/auth";

// UI Components (reuse from registration)
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle } from "lucide-react";

export default function VendorCompleteProfilePage() {
  const navigate = useNavigate();
  const { API, authorizationToken } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    businessName: "",
    fssaiNumber: "",
    gstNumber: "",
    businessLicense: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "India" },
    location: { lat: null, lng: null },
  });
  const [loading, setLoading] = useState(false);

  // Optionally, fetch current vendor data to prefill (if available)
  useEffect(() => {
    async function fetchVendor() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await axios.get(`${API}/api/auth/current-user`, {
          headers: { Authorization: authorizationToken }, withCredentials: true,
        });
        if (res.data.user && res.data.user.role === "vendor") {
          const v = res.data.user;
          setFormData((prev) => ({
            ...prev,
            phone: v.phone || "",
            businessName: v.businessName || "",
            fssaiNumber: v.fssaiNumber || "",
            gstNumber: v.gstNumber || "",
            businessLicense: v.businessLicense || "",
            address: v.address || prev.address,
            location: v.location || prev.location,
          }));
        }
      } catch (err) {
        // ignore
      }
    }
    fetchVendor();
  }, [API]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, address: { ...prev.address, [id]: value } }));
  };
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info("Fetching your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setFormData((prev) => ({ ...prev, location: { lat: latitude, lng: longitude } }));
          toast.success("Location captured!");
        },
        () => toast.error("Could not get location. Check browser permissions.")
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location.lat || !formData.location.lng) {
      return toast.error("Please provide your location by clicking the button.");
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        `${API}/api/auth/vendor/complete-profile`,
        { ...formData },
        { headers: { Authorization: authorizationToken },withCredentials:true }
      );
      toast.success(res.data.message);
      navigate("/vendordashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Vendor Profile</CardTitle>
          <CardDescription>Fill in the required details to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2"><Label htmlFor="businessName">Business Name</Label><Input id="businessName" value={formData.businessName} onChange={handleChange} required /></div>
              <div className="grid gap-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone} onChange={handleChange} required /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="grid gap-2"><Label htmlFor="fssaiNumber">FSSAI Number</Label><Input id="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} /></div>
              <div className="grid gap-2"><Label htmlFor="gstNumber">GST Number</Label><Input id="gstNumber" value={formData.gstNumber} onChange={handleChange} /></div>
              <div className="grid gap-2"><Label htmlFor="businessLicense">Business License</Label><Input id="businessLicense" value={formData.businessLicense} onChange={handleChange} /></div>
            </div>
            <div className="grid gap-2"><Label htmlFor="street">Street Address</Label><Input id="street" value={formData.address.street} onChange={handleAddressChange} required /></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="grid gap-2"><Label htmlFor="city">City</Label><Input id="city" value={formData.address.city} onChange={handleAddressChange} required /></div>
              <div className="grid gap-2"><Label htmlFor="state">State</Label><Input id="state" value={formData.address.state} onChange={handleAddressChange} required /></div>
              <div className="grid gap-2"><Label htmlFor="zipCode">Zip Code</Label><Input id="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} required /></div>
            </div>
            <div className="grid gap-2">
              <Label>Geographic Location</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline" type="button" onClick={handleGetLocation} className="w-full"><MapPin className="mr-2 h-4 w-4" /> Get Current Location</Button>
                {formData.location.lat && formData.location.lng && (
                  <div className="flex items-center text-green-600 font-medium text-sm">
                    <CheckCircle className="mr-2 h-5 w-5" /> Location Captured
                    <span className="ml-2 text-gray-500">({formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)})</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">We need your coordinates to show your business on the map.</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save & Continue"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}