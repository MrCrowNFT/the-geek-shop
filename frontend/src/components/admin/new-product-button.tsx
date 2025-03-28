import React, { useState, ChangeEvent, FormEvent } from "react";
import { PlusCircle } from "lucide-react";
import { ICreateProductPayload } from "@/types/product";
import { useCreateProduct } from "@/hooks/use-product";
import { CategorySelection } from "./category-select";

const NewProductButton: React.FC = () => {
  const createProductMutation = useCreateProduct();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ICreateProductPayload>({
    name: "",
    priceTag: 0,
    total_cost: {
      cost: 0,
      shipping: 0,
    },
    discount: {
      amount: 0,
      status: false,
    },
    sku: "",
    isAvailable: true,
    images: [],
    description: "",
    categories: [],
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "discount.amount") {
      setFormData({
        ...formData,
        discount: {
          ...formData.discount!,
          amount: parseFloat(value) || 0,
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
    } else if (name === "total_cost.cost") {
      setFormData({
        ...formData,
        total_cost: {
          ...formData.total_cost,
          cost: parseFloat(value) || 0,
        },
      });
    } else if (name === "total_cost.shipping") {
      setFormData({
        ...formData,
        total_cost: {
          ...formData.total_cost,
          shipping: parseFloat(value) || 0,
        },
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === "priceTag") {
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
      // convert files to array of URLs
      const fileUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      // add new URLs to existing images
      setFormData({
        ...formData,
        images: [...formData.images, ...fileUrls],
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    // Create a new array without the image at the specified index
    const newImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    );

    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure all required fields are present
    if (!formData.name || !formData.sku || formData.priceTag === undefined) {
      alert("Please fill in all required fields");
      return;
    }

    createProductMutation.mutate(formData);

    handleCloseModal();
    // Reset form after submission
    setFormData({
      name: "",
      priceTag: 0,
      total_cost: {
        cost: 0,
        shipping: 0,
      },
      discount: {
        amount: 0,
        status: false,
      },
      sku: "",
      isAvailable: true,
      images: [],
      description: "",
      categories: [],
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
                <h2 className="text-xl font-bold">Create New Product</h2>
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
                      Total Cost (Cost)
                    </label>
                    <input
                      type="number"
                      name="total_cost.cost"
                      value={formData.total_cost.cost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Cost (Shipping)
                    </label>
                    <input
                      type="number"
                      name="total_cost.shipping"
                      value={formData.total_cost.shipping}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                    <label className="block text-sm font-medium text-gray-700 mt-4">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      name="discount.amount"
                      value={formData.discount?.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex items-center">
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
                  </div>
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

                <CategorySelection
                  onCategoryChange={(categories) =>
                    setFormData((prev) => ({
                      ...prev,
                      categories: categories,
                    }))
                  }
                />

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
