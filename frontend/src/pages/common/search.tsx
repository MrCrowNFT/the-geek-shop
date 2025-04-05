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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Search: React.FC = () => {
  //need this to access search params on the url
  const location = useLocation();

  // Initial search params
  const [searchParams, setSearchParams] = useState<ISearchParams>({
    page: 1,
    limit: 20,
    sortBy: "newest", // Default sort order
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    const searchQueryParam = queryParams.get("query");
    const sortByParam = queryParams.get("sortBy");

    // Update search params with any URL parameters
    const updatedParams: Partial<ISearchParams> = {};

    if (categoryParam) {
      updatedParams.categories = categoryParam;
    }

    if (searchQueryParam) {
      updatedParams.searchTerm = searchQueryParam;
    }

    if (sortByParam) {
      updatedParams.sortBy = sortByParam as ISearchParams["sortBy"];
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

    // Update URL with new page parameter (without page reload)
    updateUrlWithoutReload({ ...searchParams, page: newPage });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const newSortBy = value as ISearchParams["sortBy"];

    setSearchParams((prev) => ({
      ...prev,
      sortBy: newSortBy,
      // Reset to page 1 when changing sort
      page: 1,
    }));

    // Update URL with new sort parameter (without page reload)
    updateUrlWithoutReload({
      ...searchParams,
      sortBy: newSortBy,
      page: 1,
    });
  };

  // Helper function to update URL without page reload
  const updateUrlWithoutReload = (params: ISearchParams) => {
    const url = new URL(window.location.href);

    // Clear existing query params we manage
    url.searchParams.delete("page");
    url.searchParams.delete("sortBy");

    // Add new params if they exist
    if (params.page && params.page > 1) {
      url.searchParams.set("page", params.page.toString());
    }

    if (params.sortBy) {
      url.searchParams.set("sortBy", params.sortBy);
    }

    // Update URL without reload
    window.history.pushState({}, "", url);
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
        {/* Search Results Header with Sort */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
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

          {/* Sort Dropdown */}
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Sort by:</span>
              <Select
                value={searchParams.sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="unpopular">Least Popular</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="no-likes">Least Liked</SelectItem>
                  <SelectItem value="bestselling">Bestsellers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
