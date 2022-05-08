//You can edit ALL of the code here

const searchBox = document.getElementById("search-box");
const searchCount = document.getElementById("search-count");
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  searchBox.addEventListener("keyup", (event) => {
    console.log(`event.target.value is ${event.target.value}`);

    searchBox.addEventListener("keyup", onSearchKeyUp);
  });
}

function makePageForEpisodes(episodeList) {
  const episodeContainer = document.getElementById("episode-list");
  episodeContainer.innerHTML = ""; //to empty episode container after each search

  function formatSeriesAndEpisode(season, number) {
    function padTheNumber(num) {
      return num.toString().padStart(2, "0");
    }
    return `S${padTheNumber(season)}E${padTheNumber(number)}`;
  }

  episodeList.forEach((e) => {
    const episode = document.createElement("div");
    const heading = document.createElement("h2");
    const summary = document.createElement("p");
    const image = document.createElement("img");

    image.src = e.image.medium;
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

    summary.className = "summary";
  });
}

function onSearchKeyUp(event) {
  const searchTerm = event.target.value.toLowerCase();

  console.log(event);
  console.log(searchTerm);
  console.log("something changed");
  console.log(`event.target.value is ${event.target.value}`);

  const allEpisodes = getAllEpisodes();

  const filteredEpisodes = getAllEpisodes().filter((e) => {
    const episodeName = e.name.toLowerCase();
    const episodeSummary = e.summary.toLowerCase();
    return (
      episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
    );
  });
  const filteredCount = filteredEpisodes.length;
  const allCount = allEpisodes.length;
  const countString = `Displaying ${filteredCount} / ${allCount}`;
  console.log(`Displaying ${filteredCount} / ${allCount}`);
  console.log(filteredEpisodes);
  searchCount.innerText = countString;
  makePageForEpisodes(filteredEpisodes);
}

window.onload = setup;
