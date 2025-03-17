import Overview from "@/components/admin/overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders } from "@/mock/orders-mock";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="border-b mb-6">
          <TabsList className="mb-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <Overview orders={mockOrders} />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">Orders Management</h2>
            <p className="text-gray-500">Orders content will go here</p>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">Products Management</h2>
            <p className="text-gray-500">Products content will go here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
