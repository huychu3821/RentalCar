export default function CustomCarousel({ children }) {
    return (
        <div className="carousel slide" data-bs-ride="carousel">
            {children.map((item, index) => {
                return (
                    <div
                        key={index}
                        // className={`carousel-item ${index === activeIndex? 'active' : ''}`}
                    >
                        {item}
                    </div>
                );
            })}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#customSlider"
                data-bs-slide="prev"
                onClick={(e) => {
                    e.preventDefault();
                    slidePrev();
                }}
            >
                {'<'}
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#customSlider"
                data-bs-slide="next"
                onClick={(e) => {
                    e.preventDefault();
                    slideNext();
                }}
            >
                {'>'}
            </button>
        </div>
    );
}
