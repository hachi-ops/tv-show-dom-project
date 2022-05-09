const searchBox = document.getElementById("search-box");
const searchCount = document.getElementById("search-count");
const selectMenu = document.getElementById("select-input");
const showSelect = document.getElementById("select-show");
const showList = document.getElementById("show-list");
const resetPage = document.getElementById("reset-page");

let currentEpisodes = [];

searchBox.addEventListener("keyup", onKeyUp);
selectMenu.addEventListener("change", onChange);
showSelect.addEventListener("change", onChangeShow);

function setup() {
  const allShows = getAllShows();
  makeSelectMenuForShows(allShows);
  makePageForShows(allShows);
}

function makeSelectMenuForShows(shows) {
  shows.sort((showA, showB) => {
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
  episodeContainer.innerHTML = "";

  episodeList.forEach((e) => {
    const episode = document.createElement("div");
    const image = document.createElement("img");
    const heading = document.createElement("h3");
    const summary = document.createElement("p");

    heading.innerText = `${e.name} - ${formatSeriesAndEpisode(
      e.season,
      e.number
    )}`;

    image.src = e.image.original;
    image.alt = e.name;
    image.setAttribute = ("id", "episode-img");

    summary.innerHTML = e.summary;

    episode.className = "episode";

    episode.appendChild(heading);
    episode.appendChild(image);
    episode.appendChild(summary);
    episodeContainer.appendChild(episode);

    episode.addEventListener("click", () => {
      console.log(e.url);
    });
  });
}

function makePageForShows(shows) {
  shows.forEach((show) => {
    const showElement = document.createElement("div");
    const heading = document.createElement("h3");
    const image = document.createElement("img");
    const summary = document.createElement("p");

    heading.innerText = `${show.name} - Runtime:${show.runtime}`;
    summary.innerHTML = show.summary;

    image.src = show.image.original;
    image.alt = show.name;
    image.setAttribute = ("id", "show-img");
    showElement.className = "episode";

    showElement.appendChild(heading);
    showElement.appendChild(image);
    showElement.appendChild(summary);
    showList.appendChild(showElement);

    showElement.addEventListener("click", () => {
      const showId = show.id;
      sendRequest(showId).then((data) => {
        currentEpisodes = data;
        showList.style.display = "none";
        makePageForEpisodes(currentEpisodes);
        makeSelectMenuForEpisodes(currentEpisodes);
      });
    });
  });
  return shows;
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
      return e.id === Number(episodeId);
    });
    makePageForEpisodes(filteredEpisodes);
  }
}

function onChangeShow(event) {
  const showId = event.target.value;
  sendRequest(showId).then((data) => {
    currentEpisodes = data;
    makePageForEpisodes(currentEpisodes);
    makeSelectMenuForEpisodes(currentEpisodes);
  });
}

function sendRequest(showId) {
  const urlForTheRequest = `https://api.tvmaze.com/shows/${showId}/episodes`;

  return fetch(urlForTheRequest)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => console.log(e));
}

window.onload = setup;
