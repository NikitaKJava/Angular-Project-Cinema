export interface IShow {
  movie_id: number
  theater_id: number
  display_time: string
  date_of_display: string
  show_id: number
  display_timestamp: number // is the date and the time as unix timestamp
}

export class Show {
  movie_id: number
  theater_id: number
  display_time: string
  date_of_display: string
  display_timestamp: number
  show_id: number
}
