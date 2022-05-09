const searchBox = document.getElementById("search-box");
const searchCount = document.getElementById("search-count");
const selectMenu = document.getElementById("select-input");
const showSelect = document.getElementById("select-show");

let currentEpisodes = [];

function setup() {
  const allShows = getAllShows();
  makeSelectMenuForShows(allShows);

  sendRequest(82).then((data) => {
    currentEpisodes = data;
    makePageForEpisodes(currentEpisodes);
    makeSelectMenuForEpisodes(currentEpisodes);
  });
  searchBox.addEventListener("keyup", onKeyUp);
  selectMenu.addEventListener("change", onChange);
  showSelect.addEventListener("change", onChangeShow);
}

function makeSelectMenuForShows(shows) {
  shows.sort((showA, showB) => {
    //in this case a and b are the show objects
    //this gives us two variables, nameA and nameB which have been
    //taken out of the show objects using destructuring
    const { name: nameA } = showA;
    const { name: nameB } = showB;

    if (nameA.toLowerCase() < nameB.toLowerCase()) {
      return -1;
    } else if (nameA.toLowerCase() > nameB.toLowerCase()) {
      return 1;
    } else {
      return 0;
    }
  });
  shows.forEach((show) => {
    const listOption = document.createElement("option");
    listOption.innerText = show.name;
    listOption.value = show.id;
    showSelect.appendChild(listOption);
  });
}

function makeSelectMenuForEpisodes(episodeList) {
  selectMenu.innerHTML = "";
  const showAll = document.createElement("option");
  showAll.innerText = "Show all episodes";
  showAll.value = "SHOW_ALL";
  selectMenu.appendChild(showAll);

  episodeList.forEach((episode) => {
    const listOption = document.createElement("option");
    const episodeString = `${formatSeriesAndEpisode(
      episode.season,
      episode.number
    )} - ${episode.name}`;
    listOption.innerText = episodeString;
    listOption.value = episode.id;
    selectMenu.appendChild(listOption);
  });
}

function formatSeriesAndEpisode(season, number) {
  function padTheNumber(num) {
    return num.toString().padStart(2, "0");
  }
  return `S${padTheNumber(season)}E${padTheNumber(number)}`;
}

function makePageForEpisodes(episodeList) {
  const episodeContainer = document.getElementById("episode-list");
  episodeContainer.innerHTML = ""; //to empty episode container after each search

  episodeList.forEach((e) => {
    const episode = document.createElement("div");
    const heading = document.createElement("h3");
    const summary = document.createElement("p");
    const image = document.createElement("img");

    image.src = e.image.original;
    image.alt = e.name;
    image.setAttribute = ("id", "episode-img");

    heading.innerText = `${e.name} - ${formatSeriesAndEpisode(
      e.season,
      e.number
    )}`;

    summary.innerHTML = e.summary;

    episode.className = "episode";

    episode.appendChild(heading);
    episode.appendChild(image);
    episode.appendChild(summary);
    episodeContainer.appendChild(episode);
  });
}

function onKeyUp(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredEpisodes = currentEpisodes.filter((e) => {
    const episodeName = e.name.toLowerCase();
    const episodeSummary = e.summary.toLowerCase();
    return (
      episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
    );
  });
  const filteredCount = filteredEpisodes.length;
  const currentCount = currentEpisodes.length;
  const countString = `Displaying ${filteredCount} / ${currentCount}`;
  searchCount.innerText = countString;
  makePageForEpisodes(filteredEpisodes);
}

function onChange(event) {
  const episodeId = event.target.value;

  if (episodeId === "SHOW_ALL") {
    makePageForEpisodes(currentEpisodes);
  } else {
    const filteredEpisodes = currentEpisodes.filter((e) => {
      // return e.id === +episodeId;
      return e.id === Number(episodeId);
    });

    makePageForEpisodes(filteredEpisodes);
  }
}

function onChangeShow(event) {
  const showId = event.target.value;
  // console.log({ showId });
  sendRequest(showId).then((data) => {
    currentEpisodes = data;
    makePageForEpisodes(currentEpisodes);
    makeSelectMenuForEpisodes(currentEpisodes);
  });
}

function sendRequest(showId) {
  const urlForRequest = `https://api.tvmaze.com/shows/${showId}/episodes`;

  return fetch(urlForRequest)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => console.log(e));
}

window.onload = setup;
