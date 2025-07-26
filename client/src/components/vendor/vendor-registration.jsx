import React, { useState } from "react";
import { UserPlus, Eye, EyeOff, MapPin, CheckCircle } from "lucide-react";
import { toast } from "react-toastify"; // Make sure you have react-toastify installed and configured in your main App.jsx

// --- UI Component Replacements ---
const Card = ({ children, className }) => <div className={`bg-white rounded-2xl shadow-xl border-2 border-gray-100 ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-6 pb-4 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h2 className={`text-3xl font-extrabold text-gray-900 flex items-center gap-2 ${className}`}>{children}</h2>;
const CardDescription = ({ children, className }) => <p className={`text-gray-600 mt-1 ${className}`}>{children}</p>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-4 ${className}`}>{children}</div>;
const CardFooter = ({ children, className }) => <div className={`p-6 pt-4 ${className}`}>{children}</div>;
const Label = ({ children, ...props }) => <label className="text-sm font-medium text-gray-700 leading-none" {...props}>{children}</label>;
const Input = ({ className, ...props }) => <input className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-purple-500 ${className}`} {...props} />;
const Button = ({ children, className, variant, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50";
    const variantStyle = variant === 'outline' ? "border border-gray-300 bg-transparent hover:bg-gray-100" : "bg-[#8A2BE2] text-white hover:bg-[#8A2BE2]/90";
    return <button className={`${baseStyle} ${variantStyle} px-4 py-2 ${className}`} {...props}>{children}</button>;
};

const GoogleIcon = (props) => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M22.56 12.25C22.56 11.45 22.48 10.65 22.34 9.87H12.24V14.4H18.06C17.74 16.03 16.85 17.41 15.48 18.32V20.8H19.08C21.28 18.94 22.56 15.89 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12.24 23C15.11 23 17.55 22.09 19.08 20.8L15.48 18.32C14.51 18.99 13.45 19.39 12.24 19.39C9.82 19.39 7.74 17.88 6.96 15.69H3.28V18.27C4.85 21.16 8.24 23 12.24 23Z" fill="#34A853"/>
        <path d="M6.96 15.69C6.7 14.99 6.56 14.25 6.56 13.5C6.56 12.75 6.7 12.01 6.96 11.31V8.73H3.28C2.45 10.22 2 11.8 2 13.5C2 15.2 2.45 16.78 3.28 18.27L6.96 15.69Z" fill="#FBBC05"/>
        <path d="M12.24 7.61C13.56 7.61 14.63 8.05 15.52 8.89L19.16 5.27C17.55 3.79 15.11 2.91 12.24 2.91C8.24 2.91 4.85 4.84 3.28 7.73L6.96 10.31C7.74 8.12 9.82 6.61 12.24 7.61Z" fill="#EA4335"/>
    </svg>
);

// Correctly export the form component as the default
export default function VendorRegistrationForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        address: { street: "", city: "", state: "", zipCode: "", country: "India" },
        location: { type: 'Point', coordinates: [] },
    });

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
                    setFormData((prev) => ({ ...prev, location: { ...prev.location, coordinates: [longitude, latitude] } }));
                    toast.success("Location captured!");
                },
                () => toast.error("Could not get location. Check browser permissions.")
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (formData.location.coordinates.length !== 2) {
            toast.error("Please provide your location by clicking the button.");
            return;
        }
        console.log("Vendor Registration Data:", formData);
        toast.success("Registration successful! Check console for data.");
    };

    return (
        <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center p-4 font-sans">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle><UserPlus className="text-[#8A2BE2]" /> <span className="text-[#8A2BE2]">Vendor</span> Registration</CardTitle>
                    <CardDescription>Create your vendor account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <Button variant="outline" type="button" className="w-full"><GoogleIcon /> Continue with Google</Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or register with email</span></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="grid gap-2"><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="e.g., John Doe" required onChange={handleChange} /></div>
                            <div className="grid gap-2"><Label htmlFor="businessName">Business Name</Label><Input id="businessName" placeholder="e.g., John's Fresh Produce" required onChange={handleChange} /></div>
                            <div className="grid gap-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="you@example.com" required onChange={handleChange} /></div>
                            <div className="grid gap-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" placeholder="+91 98765 43210" required onChange={handleChange} /></div>
                        </div>
                        <div className="grid gap-2"><Label htmlFor="street">Street Address</Label><Input id="street" placeholder="e.g., 123 Market Lane" required onChange={handleAddressChange} /></div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="grid gap-2"><Label htmlFor="city">City</Label><Input id="city" placeholder="e.g., Mumbai" required onChange={handleAddressChange} /></div>
                            <div className="grid gap-2"><Label htmlFor="state">State</Label><Input id="state" placeholder="e.g., Maharashtra" required onChange={handleAddressChange} /></div>
                            <div className="grid gap-2"><Label htmlFor="zipCode">Zip Code</Label><Input id="zipCode" placeholder="e.g., 400001" required onChange={handleAddressChange} /></div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Geographic Location</Label>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" type="button" onClick={handleGetLocation} className="w-full"><MapPin className="mr-2 h-4 w-4" /> Get Current Location</Button>
                                {formData.location.coordinates.length === 2 && (<div className="flex items-center text-green-600 font-medium text-sm"><CheckCircle className="mr-2 h-5 w-5" /> Location Captured</div>)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">We need your coordinates to show your business on the map.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" required onChange={handleChange} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" required onChange={handleChange} />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" onClick={handleSubmit} className="w-full"><CheckCircle className="mr-2 h-4 w-4" /> Create Account</Button>
                </CardFooter>
            </Card>
        </div>
    );
}