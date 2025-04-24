import { ref } from "vue";
import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";
import { Dialog, Notify } from "quasar";

// Movie Administration
export const dialogTitle = ref("");
export const movieTmdbId = ref(0);
export const movieWatchDate = ref("");
export const selectedCountry = ref("");
export const dialogAction = ref("");
export const newMovie = ref(null);
export const AddEditMovieDialog = ref();

export const movieBtnAction = (action, movieTitle, movieId) => {
  const storedMovies = getLocalStorage("watchMovies");
  const hasMovie = storedMovies.find((movie) => movie.movieID === movieId);

  return (
    (dialogTitle.value = movieTitle),
    (movieTmdbId.value = movieId),
    (movieWatchDate.value = hasMovie ? hasMovie.watchDate : ""),
    (selectedCountry.value = hasMovie ? hasMovie.streamingCountryName : ""),
    (dialogAction.value = action),
    action === "Add" && (newMovie.value = true),
    action !== "Delete" && AddEditMovieDialog.value.openMvDialog()
  );
};

export const delMovieAgenda = (mId, mTitle) => {
  Dialog.create({
    title: "Are you sure",
    message: `Delete <strong>${mTitle.toUpperCase()}</strong> from agenda?`,
    cancel: true,
    persistent: true,
    html: true,
  }).onOk(() => {
    // Removing movie from Agenda
    setLocalStorage(
      "watchMovies",
      getLocalStorage("watchMovies").filter((movie) => movie.movieID !== mId)
    );

    return Notify.create({
      type: "info",
      message: "Movie removed successful",
    });
  });
};
