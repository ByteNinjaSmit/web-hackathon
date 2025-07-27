"use client"

import { useState } from "react"
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  X,
  Truck,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  CreditCard,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Users,
  Headphones,
  Store,
} from "lucide-react"
import Header from "./Header"

const Help = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFaq, setExpandedFaq] = useState(null)

  const helpCategories = [
    {
      id: "all",
      name: "All Topics",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "getting-started",
      name: "Getting Started",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "ordering",
      name: "Ordering",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
    },
    {
      id: "payments",
      name: "Payments",
      icon: CreditCard,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "delivery",
      name: "Delivery",
      icon: Truck,
      color: "from-red-500 to-red-600",
    },
    {
      id: "account",
      name: "Account",
      icon: User,
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  const faqData = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I create an account on StreetSupply?",
      answer:
        "Creating an account is simple! Click the 'Sign Up' button on the homepage, fill in your details including name, email, phone number, and business information. You'll receive a verification email to activate your account. Once verified, you can start browsing and ordering from local vendors.",
    },
    {
      id: 2,
      category: "getting-started",
      question: "How do I find vendors near me?",
      answer:
        "StreetSupply uses your location to show nearby vendors. Make sure to enable location services when prompted. You can also manually set your location in your profile settings. Use the search bar and category filters to find specific types of vendors and products.",
    },
    {
      id: 3,
      category: "ordering",
      question: "How do I place an order?",
      answer:
        "Browse vendors, select products, add them to your cart, review your order, choose delivery address and payment method, then confirm your order. You'll receive an order confirmation and can track your order status in the 'My Orders' section.",
    },
    {
      id: 4,
      category: "ordering",
      question: "Can I modify or cancel my order?",
      answer:
        "You can modify or cancel orders within 5 minutes of placing them, provided the vendor hasn't started processing. Go to 'My Orders', find your order, and click 'Modify' or 'Cancel'. After processing begins, contact the vendor directly or our support team.",
    },
    {
      id: 5,
      category: "payments",
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, UPI, net banking, digital wallets, and cash on delivery (where available). All online payments are secured with industry-standard encryption.",
    },
    {
      id: 6,
      category: "payments",
      question: "Is my payment information secure?",
      answer:
        "Yes, absolutely! We use bank-grade security and encryption to protect your payment information. We never store your complete card details on our servers. All transactions are processed through secure payment gateways.",
    },
    {
      id: 7,
      category: "delivery",
      question: "How long does delivery take?",
      answer:
        "Delivery times vary by vendor and location, typically ranging from 15 minutes to 2 hours. Each vendor displays their estimated delivery time. You can track your order in real-time once it's dispatched.",
    },
    {
      id: 8,
      category: "delivery",
      question: "What are the delivery charges?",
      answer:
        "Delivery charges vary by vendor, distance, and order value. Many vendors offer free delivery above a minimum order amount. Delivery charges are clearly displayed before you confirm your order.",
    },
    {
      id: 9,
      category: "account",
      question: "How do I update my profile information?",
      answer:
        "Go to your Profile section, click 'Edit Profile', update your information, and save changes. You can update your name, phone number, addresses, and business details. Email changes require verification.",
    },
    {
      id: 10,
      category: "account",
      question: "How do I add or remove delivery addresses?",
      answer:
        "In your Profile, go to 'Manage Addresses'. You can add new addresses, edit existing ones, or delete addresses you no longer use. You can set a default address for faster checkout.",
    },
  ]

  const contactOptions = [
    {
      title: "Phone Support",
      description: "Speak with our support team",
      contact: "+91 8830952127",
      hours: "24/7 Available",
      icon: Phone,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Email Support",
      description: "Send us your queries",
      contact: "atharvkote3@gmail.com",
      hours: "Response within 2 hours",
      icon: Mail,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Start Chat",
      hours: "Available 6 AM - 11 PM",
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "WhatsApp Support",
      description: "Message us on WhatsApp",
      contact: "+91 8830952127",
      hours: "Quick responses",
      icon: MessageCircle,
      color: "from-green-400 to-green-500",
    },
  ]

  const quickLinks = [
    {
      title: "Vendor Guidelines",
      description: "Learn how to become a vendor",
      icon: Store,
      link: "/vendor-signup",
    },
    {
      title: "Terms of Service",
      description: "Our terms and conditions",
      icon: Shield,
      link: "/terms",
    },
    {
      title: "Privacy Policy",
      description: "How we protect your data",
      icon: Shield,
      link: "/privacy",
    },
    {
      title: "Refund Policy",
      description: "Our refund and return policy",
      icon: CreditCard,
      link: "/refunds",
    },
  ]

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Enhanced Header */}
      <Header/>
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm24 0h2v-2h-2v2zm0 12h2v-2h-2v2zM12 36h2v-2h-2v2zm24-24h2v-2h-2v2zM12 0h2v-2h-2v2zm24 0h2v-2h-2v2zM0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zM0 36h2v-2h-2v2zm0 0h2v-2h-2v2zM0 0h2v-2h-2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 left-8 w-20 h-20 bg-white/5 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Help & Support</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed mb-8">
              Find answers to your questions and get the support you need
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-2xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <input
                      type="text"
                      placeholder="Search for help topics, FAQs, guides..."
                      className="w-full pl-14 pr-4 py-4 rounded-xl text-gray-900 text-lg bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 placeholder-gray-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Browse Help Topics</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers organized by category for quick and easy access
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {helpCategories.map((category) => {
              const IconComponent = category.icon
              const isSelected = selectedCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    isSelected
                      ? "border-purple-500 bg-gradient-to-br from-[#4B0082]/10 to-[#8A2BE2]/10 shadow-lg"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 shadow-md"
                  }`}
                >
                  {/* Background Glow Effect */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/5 to-[#8A2BE2]/5 rounded-2xl blur-xl"></div>
                  )}

                  {/* Icon Container */}
                  <div
                    className={`relative w-16 h-16 rounded-xl mb-4 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] shadow-lg"
                        : `bg-gradient-to-br ${category.color} group-hover:scale-110 shadow-lg`
                    }`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Category Name */}
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 text-center ${
                      isSelected ? "text-purple-700" : "text-gray-700 group-hover:text-purple-600"
                    }`}
                  >
                    {category.name}
                  </span>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <p className="text-lg text-gray-600">Find quick answers to the most common questions about StreetSupply</p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50/50 rounded-2xl transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-purple-100">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or category filter</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-purple-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Need More Help?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or issues
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-purple-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{option.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <div className="space-y-2">
                      <p className="font-semibold text-purple-700">{option.contact}</p>
                      <p className="text-xs text-gray-500 flex items-center justify-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {option.hours}
                      </p>
                    </div>
                    <button className="mt-4 w-full bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white py-2 px-4 rounded-lg hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Contact Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Quick Links</h3>
            <p className="text-lg text-gray-600">Important information and policies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon
              return (
                <a
                  key={index}
                  href={link.link}
                  className="group bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                      <div className="flex items-center text-purple-600 group-hover:text-purple-700 transition-colors">
                        <span className="text-sm font-medium">Learn more</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Support Hours Section */}
      <section className="py-12 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">24/7 Support Available</h3>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Our dedicated support team is available around the clock to help you with any questions or issues you may
            have.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Response Time</h4>
              <p className="text-purple-200 text-sm">Within 2 hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Resolution Rate</h4>
              <p className="text-purple-200 text-sm">98% First Contact</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Satisfaction</h4>
              <p className="text-purple-200 text-sm">4.9/5 Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Help
