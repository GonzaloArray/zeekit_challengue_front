import { Movie } from "../type";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODdiOWNiYmNjZDc4MDRhYzgzNWQ3NTY1ZTdiZTU0MSIsInN1YiI6IjYzZDJjZTQ3NWEwN2Y1MDBkYzllOGY2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AnxSBs0xINd5IylR335Uzi9AvbXEBvdwINWisCLZdfc'
  }
};

export const getDataMovieResults = async(): Promise<{results: Movie[]}> => {
  const url = 'https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1';

  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Hubo un error al obtener los datos:', error);
    });
}
