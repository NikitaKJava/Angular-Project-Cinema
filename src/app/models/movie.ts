
export interface IMovie {
  id: number
  title: string
  text: string
  titleImg: string
  titleDirector: string
  titleActors: string
}

export interface IOverview { // new view in Database
  id: number
  overviewImg: string
  overviewStatus: string
  overviewPEGI: string
  overviewScreen: string
  overviewSound: string
}
