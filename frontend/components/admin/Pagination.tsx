"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagintion({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-green-200 rounded-md disabled:opacity-50 text-black"
      >
        Previous
      </button>
      <span className="px-3 py-1 bg-red-100 rounded-md text-black">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-green-200 rounded-md disabled:opacity-50 text-black"
      >
        Next
      </button>
    </div>
  );
}
