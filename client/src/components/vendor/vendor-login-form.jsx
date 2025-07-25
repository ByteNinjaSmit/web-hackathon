import React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

export function VendorLoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        store_id: "",
        password: "",
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
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
                        <Link href="#" className="text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full bg-[#8A2BE2] text-white hover:bg-[#8A2BE2]/90 cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground text-center flex flex-col gap-2">
                <p>
                    Don't have an account?{" "}
                    <Link href="/vendor-registration" className="text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
