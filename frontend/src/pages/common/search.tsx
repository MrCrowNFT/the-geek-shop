import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import ProductCard from "@/components/shop/product-card";
import { useProductsSearch } from "@/hooks/use-product";
import { ISearchParams } from "@/types/product";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router";

const Search: React.FC = () => {
  //need this to access search params on the url
  const location = useLocation();

  // Initial search params
  const [searchParams, setSearchParams] = useState<ISearchParams>({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    const searchQueryParam = queryParams.get("query");

    // Update search params with any URL parameters
    const updatedParams: Partial<ISearchParams> = {};

    if (categoryParam) {
      updatedParams.categories = categoryParam;
    }

    if (searchQueryParam) {
      updatedParams.searchTerm = searchQueryParam;
    }

    // Only update state if we have new parameters
    if (Object.keys(updatedParams).length > 0) {
      setSearchParams((prev) => ({
        ...prev,
        ...updatedParams,
      }));
    }
  }, [location.search]); //run whenever the url changes

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

  // Display search query if present
  const searchQuery = new URLSearchParams(location.search).get("query");
  const categoryName = new URLSearchParams(location.search).get("category");

  return (
    <Layout>
      <Header />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        {(searchQuery || categoryName) && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : categoryName
                ? `Category: ${categoryName}`
                : "All Products"}
            </h1>
            <p className="text-gray-600">
              Found {data.pagination.totalProducts || 0} products
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {data.data.length > 0 ? (
            data.data.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              No products found matching your criteria.
            </div>
          )}
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
