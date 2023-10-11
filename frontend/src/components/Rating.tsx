import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons/faStar'
import { faStarHalf } from '@fortawesome/free-solid-svg-icons'
function Rating(props: {
  rating: number
  numReviews?: number
  caption?: string
}) {
  const { rating, numReviews, caption } = props
  return (
    <div className="rating">
      <span style={{ color: 'gold' }}>{rating.toFixed(1)}</span>
      <span>
        <FontAwesomeIcon
          icon={rating >= 1 ? fasStar : rating >= 0.5 ? faStarHalf : farStar}
          className="star"
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={rating >= 2 ? fasStar : rating >= 1.5 ? faStarHalf : farStar}
          className="star"
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={rating >= 3 ? fasStar : rating >= 2.5 ? faStarHalf : farStar}
          className="star"
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={rating >= 4 ? fasStar : rating >= 3.5 ? faStarHalf : farStar}
          className="star"
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={rating >= 5 ? fasStar : rating >= 4.5 ? faStarHalf : farStar}
          className="star"
        />
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : numReviews != 0 ? (
        <span>{' ' + numReviews + ' Reviews'}</span>
      ) : (
        ''
      )}
    </div>
  )
}

export default Rating
