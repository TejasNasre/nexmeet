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
    <div className="join">
      <button onClick={handlePreviousClick} className="join-item btn">
        «
      </button>
      <span className="join-item btn">
        {" "}
        Page {currentPage} of {totalPages}{" "}
      </span>
      <button onClick={handleNextClick} className="join-item btn">
        »
      </button>
    </div>
  );
};

export default Pagination;