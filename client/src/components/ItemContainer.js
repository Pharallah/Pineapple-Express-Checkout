import React, { useContext } from 'react';
import { Context } from '../context/Context';

function ItemContainer() {
    const { currentUser, items, categories } = useContext(Context);

    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>

                {categories.map((category) => (
                    <div key={category.id} className="mb-8">
                        {/* Category Name */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {category.name}
                        </h3>

                        {/* Items under this category */}
                        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                            {items
                                .filter((item) => item.category_id === category.id)
                                .map((item) => (
                                    <div key={item.id} className="group">
                                        {/* Image Container */}
                                        <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                            <img
                                                src={item.image}
                                                alt={item.description}
                                                className="w-full h-full object-center object-cover group-hover:opacity-75"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="mt-4 flex items-center justify-between">
                                            {/* Item Name */}
                                            <div>
                                                <h3 className="text-sm text-gray-700">{item.name}</h3>
                                                <p className="mt-1 text-lg font-medium text-gray-900">${item.price}</p>
                                            </div>
                                            {/* Add Item Button */}
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-600 transition"
                                                aria-label={`Add ${item.name}`}
                                            >
                                                Add Item
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemContainer;