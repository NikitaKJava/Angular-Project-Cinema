export interface IShow {
  movie_id: number
  theater_id: number
  display_time: string
  date_of_display: string
  show_id: number
  display_timestamp: number // generated from database
}

export class Show {
  movie_id: number
  theater_id: number
  display_time: string
  date_of_display: string
  show_id: number
}
