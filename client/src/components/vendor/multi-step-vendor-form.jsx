import React from "react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Lock, Store, User, Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"

export function MultiStepVendorForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false) // State for password visibility
    const [formData, setFormData] = useState({
        store_id: "",
        store_name: "",
        store_type: "",
        store_description: "",
        store_address: "",
        zip_code: "",
        website_url: "",
        contact_person_name: "",
        contact_email: "",
        contact_phone: "",
        state: "",
        district: "",
        business_registration_number: "",
        password: "", // New field
        confirm_password: "", // New field
    })

    useEffect(() => {
        // Generate UUID on component mount for store_id
        if (typeof window !== "undefined" && window.crypto) {
            setFormData((prev) => ({ ...prev, store_id: crypto.randomUUID().substring(0, 8).toUpperCase() }))
        }
    }, [])

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    formData.store_name &&
                    formData.store_type &&
                    formData.store_address
                    // /^\d{5}(-\d{4})?$/.test(formData.zip_code) // Basic zip code validation
                )
            case 2:
                return (
                    formData.contact_person_name &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email) && 
                    /^\+?\d{10,15}$/.test(formData.contact_phone) && 
                    formData.state &&
                    formData.district
                )
            case 3: 
                return (
                    formData.password &&
                    formData.confirm_password &&
                    formData.password === formData.confirm_password &&
                    formData.password.length >= 8 // Example: minimum 8 characters
                )
            default:
                return false
        }
    }

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep((prev) => prev + 1)
        } else {
            toast.info("Please fill in all required fields.")
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateStep()) {
            console.log("Vendor Registration Data:", formData)
            toast.success("Vendor registered successfully! Check console for data.")
            //  API callllllllllllllllllllllllllllllllll
            // setFormData({ ...initialState });
            // setCurrentStep(1);
        } else {
            toast.error("Please fill in all required fields correctly.")
        }
    }

    const states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry"
    ];


    const storeTypes = [
        "Retail Store",
        "Online Shop",
        "Service Provider",
        "Food & Beverage",
        "Crafts & Handmade",
        "Electronics",
        "Apparel",
        "Home Goods",
        "Automotive",
        "Health & Beauty",
        "Other",
    ]

    const steps = [
        { id: 1, name: "Store Information", icon: Store },
        { id: 2, name: "Contact & Business Info", icon: User },
        { id: 3, name: "Account Security", icon: Lock }, // New step
    ]

    return (
        <Card className="w-full max-w-xl shadow-xl border-2 border-gray-100 rounded-xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 "><Lock /> <span className="text-[#8A2BE2]">Vendor</span> Registration</CardTitle>

                <CardDescription className="text-gray-600">
                    Step {currentStep} of {steps.length}
                </CardDescription>
                <div className="flex justify-center items-center space-x-4 mt-4">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 ${currentStep >= step.id ? "bg-[#8A2BE2]" : "bg-gray-300"
                                    }`}
                            >
                                <step.icon className="w-5 h-5" />
                            </div>
                            <span className={`mt-2 text-sm font-medium ${currentStep >= step.id ? "text-[#8A2BE2]" : "text-gray-500"}`}>
                                {step.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    {currentStep === 1 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="store_id">Store ID</Label>
                                <Input
                                    id="store_id"
                                    value={formData.store_id}
                                    readOnly
                                    disabled
                                    className="bg-muted-foreground/10 cursor-not-allowed font-mono text-sm"
                                    aria-label="Auto-generated Store ID"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="store_name">Store Name</Label>
                                <Input
                                    id="store_name"
                                    placeholder="e.g., Fresh Veggie Hub"
                                    value={formData.store_name}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="store_type">Store Type</Label>
                                <Select
                                    value={formData.store_type}
                                    onValueChange={(value) => handleSelectChange("store_type", value)}
                                    required
                                >
                                    <SelectTrigger id="store_type" aria-required="true">
                                        <SelectValue placeholder="Select store type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {storeTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="store_description">Store Description (Optional)</Label>
                                <textarea
                                    id="store_description"
                                    placeholder="Tell us about your store and products..."
                                    value={formData.store_description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="store_address">Store Address</Label>
                                <Input
                                    id="store_address"
                                    placeholder="e.g., 123 Main St, Anytown"
                                    value={formData.store_address}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="zip_code">Zip Code</Label>
                                    <Input
                                        id="zip_code"
                                        placeholder="e.g., 90210"
                                        value={formData.zip_code}
                                        onChange={handleChange}
                                        required
                                        aria-required="true"
                                        pattern="^\d{5}(-\d{4})?$"
                                        title="Enter a 5-digit or 5+4 digit zip code"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="website_url">Website URL (Optional)</Label>
                                    <Input
                                        id="website_url"
                                        type="url"
                                        placeholder="e.g., https://www.yourstore.com"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_person_name">Contact Person Name</Label>
                                <Input
                                    id="contact_person_name"
                                    placeholder="e.g., Jane Doe"
                                    value={formData.contact_person_name}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_email">Contact Email</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    placeholder="e.g., contact@yourstore.com"
                                    value={formData.contact_email}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_phone">Contact Phone</Label>
                                <Input
                                    id="contact_phone"
                                    type="tel"
                                    placeholder="e.g., +1 (555) 123-4567"
                                    value={formData.contact_phone}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="state">State</Label>
                                    <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)} required>
                                        <SelectTrigger id="state" aria-required="true">
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="district">District</Label>
                                    <Input
                                        id="district"
                                        placeholder="e.g., Downtown, Midtown"
                                        value={formData.district}
                                        onChange={handleChange}
                                        required
                                        aria-required="true"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="business_registration_number">Business Registration Number (Optional)</Label>
                                <Input
                                    id="business_registration_number"
                                    placeholder="e.g., 1234567890"
                                    value={formData.business_registration_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        aria-required="true"
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm_password">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm_password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        required
                                        aria-required="true"
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formData.password && formData.confirm_password && formData.password !== formData.confirm_password && (
                                    <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>
                                )}
                            </div>
                        </>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
                {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                )}
                {currentStep < steps.length && (
                    <Button onClick={handleNext} className="ml-auto bg-[#8A2BE2] text-white hover:bg-[#8A2BE2]/90 cursor-pointer">
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {currentStep === steps.length && (
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="ml-auto bg-[#8A2BE2] text-white hover:bg-[#8A2BE2]/90 cursor-pointer"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" /> Register
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
