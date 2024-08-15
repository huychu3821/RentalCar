import StarRatings from 'react-star-ratings';
export default function RatingComponent({ initialRating }) {
    if (initialRating >= 0) {
        return (
            <div>
                <StarRatings
                    rating={typeof initialRating === 'number' ? initialRating : 0}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                />
            </div>
        );
    }
}
