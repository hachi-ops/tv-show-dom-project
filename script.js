//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const episodeContainer = document.getElementById("episode-list");

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

window.onload = setup;
