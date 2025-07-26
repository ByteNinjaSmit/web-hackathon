import React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

// SVG component for the Google Icon with original colors
const GoogleIcon = (props) => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M22.56 12.25C22.56 11.45 22.48 10.65 22.34 9.87H12.24V14.4H18.06C17.74 16.03 16.85 17.41 15.48 18.32V20.8H19.08C21.28 18.94 22.56 15.89 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12.24 23C15.11 23 17.55 22.09 19.08 20.8L15.48 18.32C14.51 18.99 13.45 19.39 12.24 19.39C9.82 19.39 7.74 17.88 6.96 15.69H3.28V18.27C4.85 21.16 8.24 23 12.24 23Z" fill="#34A853"/>
        <path d="M6.96 15.69C6.7 14.99 6.56 14.25 6.56 13.5C6.56 12.75 6.7 12.01 6.96 11.31V8.73H3.28C2.45 10.22 2 11.8 2 13.5C2 15.2 2.45 16.78 3.28 18.27L6.96 15.69Z" fill="#FBBC05"/>
        <path d="M12.24 7.61C13.56 7.61 14.63 8.05 15.52 8.89L19.16 5.27C17.55 3.79 15.11 2.91 12.24 2.91C8.24 2.91 4.85 4.84 3.28 7.73L6.96 10.31C7.74 8.12 9.82 6.61 12.24 7.61Z" fill="#EA4335"/>
    </svg>
)

export function VendorLoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        store_id: "",
        password: "",
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        // Keep the store_id uppercase, but not the password
        if (id === "store_id") {
            setFormData((prev) => ({ ...prev, [id]: value.toUpperCase() }))
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.store_id || !formData.password) {
            toast.error("Please enter both Store ID and Password.")
            return
        }

        console.log("Vendor Login Data:", formData)
        toast.success("Login successful! (Demo data logged to console)")
        // api calllllllllllllllllllllllllllll
    }

    return (
        <Card className="w-full max-w-md shadow-lg border-2 border-gray-100 rounded-xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <LogIn className="text-primary" /> <span className="text-[#8A2BE2]">Vendor</span> Login
                </CardTitle>
                <CardDescription className="text-gray-600">Sign in to access your vendor dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="store_id">Store ID</Label>
                        <Input
                            id="store_id"
                            placeholder="Your 8-character Store ID"
                            value={formData.store_id}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            maxLength={8}
                            className="uppercase"
                        />
                    </div>
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
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end text-sm">
                        <Link to="#" className="text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* --- Google Login Option --- */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" type="button" className="w-full">
                      <GoogleIcon />
                      Continue with Google
                    </Button>
                    {/* --------------------------- */}
                    
                    <Button type="submit" className="w-full bg-[#8A2BE2] text-white hover:bg-[#8A2BE2]/90 cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground text-center flex flex-col gap-2">
                <p>
                    Don't have an account?{" "}
                    <Link to="/vendor-register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}