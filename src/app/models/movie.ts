
export interface IMovie {
  movie_id: number // will be created from database
  movie_name: string
  movie_duration: number
  production_date: number
  description: string
  titleImage: string
  director: string
  major_actor: string
  pegi: string
  screentype: string
  soundtype: string
  actors: string
  status: string
}

export class Movie { // movie constructor for post requests
  movie_name: string
  movie_duration: number
  production_date: number
  description: string
  titleImage: string
  director: string
  major_actor: string
  pegi: string
  screentype: string
  soundtype: string
  actors: string
  status: string
}

// veraltet
export interface IOverview { // new view in Database
  id: number // geerbt von Movie
  overviewImg: string // geerbt von Movie
  overviewStatus: string // geerbt von Movie
  overviewPEGI: string // geerbt von Movie
  overviewScreen: string // geerbt von Movie
  overviewSound: string // geerbt von Movie
}
