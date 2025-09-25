import React from "react";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from "mdb-react-ui-kit";

const PhanTrang = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
      

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
