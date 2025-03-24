import React, { useState, ChangeEvent, FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { IProductAdmin } from "@/types/product";
import { ICategory } from "@/types/category";

const NewProductButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IProductAdmin>>({
    name: "",
    priceTag: 0,
    total_cost: 0,
    discount: {
      amout: 0,
      status: false,
    },
    sku: "",
    isAvailable: true,
    images: [],
    description: "",
    categories: [], // Initialize as empty array instead of nested object
  });

  // Mock categories data
  const availableCategories: ICategory[] = [
    {
      _id: "cat1",
      name: "Electronics",
      description: "Electronic devices and accessories",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "cat2",
      name: "Clothing",
      description: "Apparel and fashion items",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "cat3",
      name: "Home & Kitchen",
      description: "Household and kitchen products",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "discount.amout") {
      setFormData({
        ...formData,
        discount: {
          ...formData.discount!,
          amout: parseFloat(value) || 0,
        },
      });
    } else if (name === "discount.status") {
      setFormData({
        ...formData,
        discount: {
          ...formData.discount!,
          status: checked,
        },
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === "priceTag" || name === "total_cost") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      setFormData({
        ...formData,
        images: [...(formData.images || []), ...fileUrls],
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  // category handling directly selecting category objects
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    const selectedCategories = availableCategories.filter((category) =>
      selectedCategoryIds.includes(category._id)
    );

    setFormData({
      ...formData,
      categories: selectedCategories, // Set categories directly as array
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure all required fields are present
    if (!formData.name || !formData.sku || formData.priceTag === undefined) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real application, you would send this data to your API
    const newProduct: IProductAdmin = {
      _id: formData._id || "",
      name: formData.name || "",
      priceTag: formData.priceTag || 0,
      total_cost: formData.total_cost || 0,
      discount: formData.discount || { amout: 0, status: false },
      sku: formData.sku || "",
      isAvailable: formData.isAvailable || false,
      images: formData.images || [],
      description: formData.description || "",
      categories: formData.categories || [],
      likesCount: 0,
      salesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("New Product:", newProduct);
    //  API call here

    handleCloseModal();
    // Reset form after submission
    setFormData({
      name: "",
      priceTag: 0,
      total_cost: 0,
      discount: {
        amout: 0,
        status: false,
      },
      sku: "",
      isAvailable: true,
      images: [],
      description: "",
      categories: [], // Reset to empty array
    });
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
      >
        <PlusCircle size={20} />
        <span>Create New Product</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Create New Product (Admin)
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="priceTag"
                      value={formData.priceTag}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Cost (Admin Only)
                    </label>
                    <input
                      type="number"
                      name="total_cost"
                      value={formData.total_cost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      name="discount.amout"
                      value={formData.discount?.amout}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      name="discount.status"
                      checked={formData.discount?.status}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Enable Discount
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Product Available
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mt-1 w-full"
                  />

                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative w-16 h-16">
                          <img
                            src={img}
                            alt={`Product preview ${index}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <select
                    multiple
                    name="categories"
                    value={formData.categories?.map((cat) => cat._id) || []}
                    onChange={handleCategoryChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    size={3}
                  >
                    {availableCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple categories
                  </p>
                </div>

                {formData.categories && formData.categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Selected Categories:
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category._id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductButton;
