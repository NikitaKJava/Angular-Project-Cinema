export interface IRating {
  customer_id: number
  movie_id: number
  review: string
  star: number
  rating_timestamp: string
}

export class Rating {
  customer_id: number
  movie_id: number
  review: string
  star: number
  rating_timestamp: string
}

export class NewRating {
  movie_id: number
  review: string
  star: number
}
