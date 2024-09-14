"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePreviousClick = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="w-full  flex flex-row justify-center items-center">
      <div className="w-[12rem] bg-white text-black rounded-lg">
        <button
          onClick={handlePreviousClick}
          className="bg-white text-black border-r border-black p-2"
        >
          «
        </button>
        <span className="bg-white text-black">
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button
          onClick={handleNextClick}
          className="bg-white text-black border-l border-black p-2"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
