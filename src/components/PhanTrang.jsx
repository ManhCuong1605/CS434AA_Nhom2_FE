import React from "react";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from "mdb-react-ui-kit";

const PhanTrang = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Page navigation example">
            <MDBPagination className="mb-0 justify-content-center">
                {/* Previous */}
                <MDBPaginationItem disabled={currentPage === 1}>
                    <MDBPaginationLink
                        href="#"
                        aria-label="Previous"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                    >
                        <span aria-hidden="true">«</span>
                    </MDBPaginationLink>
                </MDBPaginationItem>

                {/* Page numbers */}
                {pageNumbers.map((number) => (
                    <MDBPaginationItem key={number} active={number === currentPage}>
                        <MDBPaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(number);
                            }}
                        >
                            {number}
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                ))}

                {/* Next */}
                <MDBPaginationItem disabled={currentPage === totalPages}>
                    <MDBPaginationLink
                        href="#"
                        aria-label="Next"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                    >
                        <span aria-hidden="true">»</span>
                    </MDBPaginationLink>
                </MDBPaginationItem>
            </MDBPagination>
        </nav>
    );
};

export default PhanTrang;
