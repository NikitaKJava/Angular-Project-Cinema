export interface ITheatre {
  theater_id: number // generated from database
  theater_name: string // theater name A, B, C
  number_of_seats: number
  seat_rows: number
  seat_columns: number
  screentype: string
  soundtype: string
  deluxe: number[]
  disabled: number[]
}

export class Theatre {
  theater_name: string // theater name A, B, C
  number_of_seats: number
  seat_rows: number
  seat_columns: number
  deluxe: number[]
  disabled: number[]
  screentype: string
  soundtype: string
}

export interface ITheatreSeats {
  seat_rows: number
  seat_columns: number
  normal: number[]
  deluxe: number[]
  disabled: number[]
  inactive: number[]
}
