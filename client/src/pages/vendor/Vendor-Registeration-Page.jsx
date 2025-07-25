import { MultiStepVendorForm } from "@/components/vendor/multi-step-vendor-form"
import { Store, User, MapPin, CheckCircle, Handshake } from "lucide-react"
import { useState, useEffect } from "react"

export default function VendorRegistrationPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const welcomeFeatures = [
        {
            icon: Store,
            label: "Comprehensive Store Details",
            description: "Provide all essential information about your business.",
        },
        { icon: User, label: "Secure Contact Information", description: "Ensure we can reach you for important updates." },
        { icon: MapPin, label: "Accurate Location Details", description: "Help customers find your store easily." },
        { icon: Handshake, label: "Seamless Onboarding", description: "A guided process to get you started quickly." },
    ]

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
            {/* Left side - Welcome Message */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] relative overflow-hidden hidden md:flex items-center justify-center p-12">
                {/* Subtle background pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm24 0h2v-2h-2v2zm0 12h2v-2h-2v2zM12 36h2v-2h-2v2zm24-24h2v-2h-2v2zM12 0h2v-2h-2v2zm24 0h2v-2h-2v2zM0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zM0 36h2v-2h-2v2zm0 0h2v-2h-2v2zM0 0h2v-2h-2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>

                <div
                    className={`relative z-10 flex flex-col items-center justify-center p-12 text-white transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Main Icon */}
                    <div className="relative mb-8">
                        <div className="w-36 h-36 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                            <Handshake className="w-20 h-20 text-white" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-lg">
                            <CheckCircle className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome, Future Vendor!</h1>
                        <p className="text-white/90 text-xl max-w-sm leading-relaxed">
                            Join our thriving marketplace and connect with thousands of customers.
                        </p>
                    </div>

                    {/* Registration Steps Grid */}
                    <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                        {welcomeFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg hover:bg-white/25 transition-all duration-300 flex items-start space-x-4"
                            >
                                <feature.icon className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-semibold text-lg mb-1">{feature.label}</h3>
                                    <p className="text-white/80 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-32 left-16 w-20 h-20 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/3 left-8 w-16 h-16 bg-white/5 rounded-full"></div>
            </div>

            {/* Right side - Registration Form */}
            <div
                className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                <MultiStepVendorForm />
            </div>
        </div>
    )
}
