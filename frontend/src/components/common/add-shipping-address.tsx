import React, { useState } from "react";
import {
  Plus,
  X,
  MapPin,
  User,
  Phone,
  Home,
  Globe,
  FileText,
} from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { ICreateShippingPayload } from "@/types/shipping";

const AddShippingAddress: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { createShipping } = useProfile();

  const [formData, setFormData] = useState<ICreateShippingPayload>({
    name: "",
    phone: "",
    run: "",
    address: "",
    region: "",
    indications: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      const payload: ICreateShippingPayload = {
        name: formData.name,
        phone: formData.phone,
        run: formData.run,
        address: formData.address,
        region: formData.region,
        ...(formData.indications && { indications: formData.indications }),
      };

      const success = await createShipping(payload);

      if (success) {
        // Reset form and close modal
        setFormData({
          name: "",
          phone: "",
          run: "",
          address: "",
          region: "",
          indications: "",
        });
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Error creating shipping address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({
      name: "",
      phone: "",
      run: "",
      address: "",
      region: "",
      indications: "",
    });
    setIsFormOpen(false);
  };

  const isFormValid =
    formData.name &&
    formData.phone &&
    formData.run &&
    formData.address &&
    formData.region;

  return (
    <div className="relative">
      {/* Add Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        disabled={false}
      >
        <Plus size={20} />
        <span className="font-medium">Add Shipping Address</span>
      </button>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Shipping Address
                </h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div
              className="p-6 space-y-4"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  isFormValid &&
                  !isSubmitting
                ) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            >
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter full name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
              </div>

              {/* RUN Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  RUN *
                </label>
                <input
                  type="text"
                  name="run"
                  value={formData.run}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter RUN"
                  disabled={isSubmitting}
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Home size={16} />
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter street address"
                  disabled={isSubmitting}
                />
              </div>

              {/* Region Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} />
                  Region *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter region"
                  disabled={isSubmitting}
                />
              </div>

              {/* Indications Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Additional Indications
                </label>
                <textarea
                  name="indications"
                  value={formData.indications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Any additional delivery instructions (optional)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Address"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddShippingAddress;
