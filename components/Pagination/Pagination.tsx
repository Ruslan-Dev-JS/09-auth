"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      forcePage={currentPage - 1}
      onPageChange={handlePageClick}
      containerClassName={css.pagination}
      pageClassName={css.page}
      pageLinkClassName={css.button}
      activeClassName={css.active}
      previousClassName={css.page}
      nextClassName={css.page}
      previousLinkClassName={css.button}
      nextLinkClassName={css.button}
      disabledClassName={css.disabled}
      breakClassName={css.break}
      breakLinkClassName={css.ellipsis}
      previousLabel="←"
      nextLabel="→"
    />
  );
}