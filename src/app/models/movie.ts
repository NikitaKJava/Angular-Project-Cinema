
export interface IMovie {
  movie_id: number // 1
  movie_name: string
  movie_duration: number
  movie_productionDate: number
  movie_desc: string
  movie_titleImg: string
  movie_director: string
  movie_majorActors: string
  movie_status: string
  movie_PEGI: number
  movie_Screen: string
  movie_Sound: string
  movie_actors: string
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
