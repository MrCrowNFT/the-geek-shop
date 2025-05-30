import OrderManagement from "@/components/admin/orders";
import Overview from "@/components/admin/overview";
import ProductList from "@/components/admin/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProfile from "@/components/admin/admin-profile";
import CategoriesList from "@/components/admin/categories";
import AddCategoryForm from "@/components/admin/add-category";

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
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <Overview />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <ProductList />
        </TabsContent>
        <TabsContent value="categories" className="mt-0">
          <AddCategoryForm />
          <CategoriesList />
        </TabsContent>
        <TabsContent value="profile" className="mt-0">
          <AdminProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
