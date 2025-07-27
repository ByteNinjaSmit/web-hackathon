"use client"
import { Store, Leaf, Package, Milk, Droplets, Wheat, Sparkles } from "lucide-react"

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }) => {
  // Enhanced category icons mapping
  const categoryIcons = {
    all: Store,
    vegetables: Leaf,
    spices: Sparkles,
    dairy: Milk,
    oils: Droplets,
    grains: Wheat,
    default: Package,
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fresh ingredients and raw materials from trusted local vendors
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.id] || categoryIcons.default
            const isSelected = selectedCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[140px] ${
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
                      : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#4B0082] group-hover:to-[#8A2BE2]"
                  }`}
                >
                  <IconComponent
                    className={`w-8 h-8 transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-gray-600 group-hover:text-white"
                    }`}
                  />
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
  )
}

export default CategoryList
