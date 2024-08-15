export default function Pagination({ totalPage, currentPage, onPageChange }) {
    const pages = [];

    if (totalPage <= 5) {
        for (let i = 1; i <= totalPage; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, 5, '...', totalPage);
        } else if (currentPage >= totalPage - 2) {
            pages.push(
                1,
                '...',
                totalPage - 4,
                totalPage - 3,
                totalPage - 2,
                totalPage - 1,
                totalPage,
            );
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPage);
        }
    }

    return (
        <div className="pagination">
            {pages.map((page, index) =>
                page === '...' ? (
                    <span key={index} className="ellipsis">
                        ...
                    </span>
                ) : (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ),
            )}
        </div>
    );
}