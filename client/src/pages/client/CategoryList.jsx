import React from 'react';

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }) => (
  <section className="py-8 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse Categories</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
              selectedCategory === category.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <span className="text-2xl mb-2">{category.icon}</span>
            <span className={`text-sm font-medium ${
              selectedCategory === category.id ? 'text-purple-600' : 'text-gray-700'
            }`}>
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryList; 