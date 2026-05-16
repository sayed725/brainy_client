
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface USPaginationProps {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const USPagination = ({
  page,
  totalPage,
  onPageChange,
  className,
}: USPaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPage - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPage - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (!pages.includes(totalPage)) {
        pages.push(totalPage);
      }
    }

    return pages;
  };

  if (totalPage <= 1) return null;

  return (
    <div className={cn("w-full flex justify-center py-4", className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={cn(
                "transition-all hover:bg-[#1cb89e]/10 hover:text-[#1cb89e]",
                page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((p, index) => (
            <PaginationItem key={index}>
              {p === "ellipsis-start" || p === "ellipsis-end" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(p as number);
                  }}
                  isActive={page === p}
                  className={cn(
                    "cursor-pointer transition-all duration-300 rounded-xl font-bold",
                    page === p
                      ? "bg-[#1cb89e] text-white border-[#1cb89e] hover:bg-[#1cb89e]/90 hover:text-white shadow-lg shadow-[#1cb89e]/20"
                      : "hover:bg-[#1cb89e]/10 hover:text-[#1cb89e] border-transparent hover:border-[#1cb89e]/20"
                  )}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPage) onPageChange(page + 1);
              }}
              className={cn(
                "transition-all hover:bg-[#1cb89e]/10 hover:text-[#1cb89e]",
                page === totalPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default USPagination;