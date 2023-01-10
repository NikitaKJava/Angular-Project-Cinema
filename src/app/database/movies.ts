import {IMovie, IOverview} from "../models/movie"; // interface

export const movies: IMovie[] = [
  {
    movie_id: 101,
    movie_name: "Avatar 2",
    movie_duration: 102,
    movie_productionDate: 2022,
    movie_desc: "With AVATAR: THE WAY OF WATER, the cinematic experience reaches new heights as James Cameron takes viewers back to the great world of Pandora in a spectacular and thrilling action-adventure. More than a decade after the events of the first film, AVATAR: THE WAY OF WATER tells the compelling story of the Sully family: the troubles that haunt them, the lengths they go to to protect each other, and the dramatic experiences and the struggles they fight to survive.",
    movie_titleImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_102709.jpg",
    movie_director: "James Cameron",
    movie_majorActors: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    movie_status: "NEW",
    movie_PEGI: 18,
    movie_Screen: "string",
    movie_Sound: "string",
    movie_actors: "string"
  }
//   {
//     id: 102,
//     title: "Violent Night",
//     text: "Eigentlich will Santa Claus nur die Geschenke bringen, aber als er auf eine Gruppe Söldner stößt, die auf einem Anwesen Geiseln genommen hat, war´s das mit Stille Nacht. Statt der Geschenke holt Santa in VIOLENT NIGHT den Hammer aus dem Sack. Denn an Heiligabend legt sich niemand ungestraft mit dem Weihnachtsmann an.",
//     titleImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_95787.jpg",
//     titleDirector: "Tommy Wirkola",
//     titleActors: "David Harbour, John Leguizamo, Alex Hassell"
//   },
//   {
//     id: 103,
//     title: "Der gestiefelte Kater: Der letzte Wunsch",
//     text: "Auch ein Kater kann ein unangenehmes Erwachen haben. Nach unzähligen riskanten Reisen und achtlosen Abenteuern muss der gestiefelte Kater entsetzt feststellen, dass seine Leidenschaft für Gefahren letztlich ihren Preis hatte - in seiner Abenteuerlust hat er bereits acht seiner neun Leben verbraucht. Um für die dringend nötige neue Vitalität zu sorgen, begibt sich der charmante Schnurrhaargauner auf den langen Weg in den Schwarzen Wald, um dort den mythischen Wunschstern zu finden. Leider entpuppt sich dieses Unterfangen mit nur einem verbleibenden Leben auf dem Katerkonto als ungewohnt risikoreich, sodass nicht nur ernsthafte Zurückhaltung gefragt ist, sondern auch ein wenig Unterstützung in Form der so hinreißenden wie hinterhältigen Kitty Samtpfote und des gutgelaunt geschwätzigen Vierbeiners Perro.",
//     titleImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_90905.jpg",
//     titleDirector: "Joel Crawford und Januel P. Mercado",
//     titleActors: "Antonio Banderas"
//   },
//   {
//     id: 104,
//     title: "M3GAN",
//     text: "Sie ist auf Freundschaft programmiert: M3GAN ist kein gewöhnliches Spielzeug, designt als beste Freundin eines Kindes und Verbündete der Eltern. Als Robotik-Expertin Gemma unerwartet zum Vormund ihrer verwaisten Nichte wird, nimmt sie den Prototyp der Hightech-Puppe mit nach Hause. Eine folgenschwere Entscheidung, denn M3GAN entwickelt einen geradezu mörderischen Beschützerinstinkt. Dass eine Puppe ihre Aufgabe so ernst nehmen wird, damit rechnet Gemma nicht einmal in ihren kühnsten Träumen, als sie diese ihrer Nichte gibt. Schließlich arbeitet sie für eine Spielzeugfirma und hat die lebensechte Puppe selbst programmiert.",
//     titleImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_103321.jpg",
//     titleDirector: "Gerard Johnstone",
//     titleActors: "Allison Williams, Violet McGraw"
//   },
//   {
//     id: 105,
//     title: "Operation Fortune",
//     text: "Superspion Orson Fortune soll einen brisanten Waffendeal aufklären und den Verkauf einer neuen hochgefährlichen Technologie verhindern. Widerstrebend wird er dabei mit einigen der weltbesten Agenten auf Mission geschickt. Als Ablenkungsmanöver rekrutieren sie Hollywoods größten Filmstar Danny Francesco und begeben sich auf internationalen Undercover-Einsatz. Ihr Ziel: ein milliardenschwerer Waffenhändler , der hinter dem Deal steckt und das Schicksal der Welt in seinen Händen hält…",
//     titleImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_95874.jpg",
//     titleDirector: "Guy Ritchie",
//     titleActors: "Jason Statham, Aubrey Plaza"
//   }
// ]
//
// export const overviews: IOverview[] = [
//   {
//     id: 101,
//     overviewImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_102709.jpg",
//     overviewStatus: "new",
//     overviewPEGI: "Ab 12 Jahren",
//     overviewScreen: "2D, 3D",
//     overviewSound: "Dolby Atmos, Dolby Souround"
//   },
//   {
//     id: 102,
//     overviewImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_95787.jpg",
//     overviewStatus: "new",
//     overviewPEGI: "Ab 16 Jahren",
//     overviewScreen: "2D, 3D",
//     overviewSound: "Dolby Atmos, Dolby Souround"
//   },
//   {
//     id: 103,
//     overviewImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_90905.jpg",
//     overviewStatus: "new",
//     overviewPEGI: "Ab 8 Jahren",
//     overviewScreen: "2D, 3D",
//     overviewSound: "Dolby Atmos, Dolby Souround"
//   },
//   {
//     id: 104,
//     overviewImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_103321.jpg",
//     overviewStatus: "new",
//     overviewPEGI: "Ab 16 Jahren",
//     overviewScreen: "2D",
//     overviewSound: "Dolby Atmos"
//   },
//   {
//     id: 105,
//     overviewImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_95874.jpg",
//     overviewStatus: "new",
//     overviewPEGI: "Ab 14 Jahren",
//     overviewScreen: "2D",
//     overviewSound: "Dolby Souround"
//   }
// ]
//
//
// export class ShowsComponent {
//   shows = [
//     {
//       id: 101,
//       showImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_102709.jpg",
//       showStatus: "new",
//       showPEGI: "Ab 12 Jahren",
//       showScreen: "2D, 3D",
//       showSound: "Dolby Atmos, Dolby Souround"
//     },
//     {
//       id: 102,
//       showImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_95787.jpg",
//       showStatus: "new",
//       showPEGI: "Ab 16 Jahren",
//       showScreen: "2D, 3D",
//       showSound: "Dolby Atmos, Dolby Souround"
//     },
//     {
//       id: 103,
//       showImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_90905.jpg",
//       showStatus: "new",
//       showPEGI: "Ab 8 Jahren",
//       showScreen: "2D, 3D",
//       showSound: "Dolby Atmos, Dolby Souround"
//     },
//     {
//       id: 104,
//       showImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_103321.jpg",
//       showStatus: "new",
//       showPEGI: "Ab 16 Jahren",
//       showScreen: "2D",
//       showSound: "Dolby Atmos"
//     },
//     {
//       id: 105,
//       showImg: "https://www.cinecity.at/images/Breite_400px_RGB/p_95874.jpg",
//       showStatus: "new",
//       showPEGI: "Ab 14 Jahren",
//       showScreen: "2D",
//       showSound: "Dolby Souround"
//     }
  ]
