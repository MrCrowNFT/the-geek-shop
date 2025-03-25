import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import ProductCard from "@/components/shop/product-card";
import { useProductsSearch } from "@/hooks/use-product";
import { ISearchParams } from "@/types/product";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

//todo add advanced search functionality

const Search: React.FC = () => {
  // Initial search params
  const [searchParams, setSearchParams] = useState<ISearchParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isError, error } = useProductsSearch(searchParams);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <Header />
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          Loading products...
        </div>
        <Footer />
      </Layout>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Layout>
        <Header />
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-red-500">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
        <Footer />
      </Layout>
    );
  }

  // Ensure data exists and has the expected structure
  if (!data || !data.data) {
    return (
      <Layout>
        <Header />
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          No products found
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {data.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(data.pagination.currentPage - 1);
                    }}
                    className={cn(
                      data.pagination.currentPage === 1 &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {/* Page numbers */}
                {[...Array(data.pagination.totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(index + 1);
                      }}
                      isActive={data.pagination.currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(data.pagination.currentPage + 1);
                    }}
                    className={cn(
                      data.pagination.currentPage ===
                        data.pagination.totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <Footer />
    </Layout>
  );
};

export default Search;
