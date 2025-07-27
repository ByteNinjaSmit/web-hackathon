import { Clock, Leaf, MapPin, Star, TrendingUp, Heart, Package, Zap } from "lucide-react"

const QuickActions = () => {
  const actions = [
    {
      icon: Clock,
      label: "Reorder",
      description: "Quick reorder from history",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      icon: Leaf,
      label: "Fresh Deals",
      description: "Today's best offers",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      icon: MapPin,
      label: "Nearby",
      description: "Find closest vendors",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      icon: Star,
      label: "Top Rated",
      description: "Highest rated vendors",
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "hover:from-yellow-600 hover:to-yellow-700",
    },
    {
      icon: TrendingUp,
      label: "Trending",
      description: "Popular products",
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
    },
    {
      icon: Heart,
      label: "Favorites",
      description: "Your saved items",
      color: "from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700",
    },
    {
      icon: Package,
      label: "Bulk Orders",
      description: "Special bulk pricing",
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
    },
    {
      icon: Zap,
      label: "Express",
      description: "Fast delivery options",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access your most-used features and discover new ways to shop
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`group relative flex flex-col items-center p-6 lg:p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${action.hoverColor}`}
            >
              {/* Background Gradient on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:bg-white/20`}
                >
                  <action.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>

                {/* Label */}
                <span className="text-sm lg:text-base font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 mb-1">
                  {action.label}
                </span>

                {/* Description */}
                <span className="text-xs lg:text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 text-center">
                  {action.description}
                </span>
              </div>

              {/* Hover Effect Ring */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/30 transition-all duration-300"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickActions
