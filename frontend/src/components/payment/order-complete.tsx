import { useOrderStore } from "@/hooks/use-new-order";

//todo need to add a failure option in case it fails
const OrderComplete = () => {
  const { currentOrder, resetOrder } = useOrderStore();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Complete!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order ID is:{" "}
        {currentOrder?._id || "Processing"}
      </p>
      <button
        onClick={resetOrder}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Return to Shop
      </button>
    </div>
  );
};

export default OrderComplete;
