import React, { useState } from "react";
import { useAddCategory } from "@/hooks/use-category";

interface AddCategoryFormProps {
  onSuccess?: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onSuccess }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addCategoryMutation = useAddCategory();

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    // Reset form when hiding
    if (isFormVisible) {
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      await addCategoryMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined, // Only send if not empty
      });

      resetForm();
      setIsFormVisible(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    }
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={toggleForm}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isFormVisible ? "Cancel" : "Add New Category"}
      </button>

      {isFormVisible && (
        <div className="mt-4 p-4 border rounded-md shadow-sm">
          <h3 className="text-lg font-medium mb-3">Add New Category</h3>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter category name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter category description"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={toggleForm}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addCategoryMutation.isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-400"
              >
                {addCategoryMutation.isLoading ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {addCategoryMutation.isSuccess && !isFormVisible && (
        <div className="mt-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Category added successfully!
        </div>
      )}
    </div>
  );
};

export default AddCategoryForm;
