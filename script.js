let currentsong = new Audio();
let songs = [];
let songul;
let curfolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getsongs(folder) {
  curfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let newSongs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      newSongs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  console.log("Fetched songs:", newSongs);
  return newSongs;
}

function playSong(song, pause = false) {
  if (!song) return; 

  currentsong.src = `${curfolder}/` + song;
  currentsong.load();

  currentsong.addEventListener("loadeddata", () => {
    if (!pause) {
      currentsong.play();
      play.src = "pause.svg";
    }
  });

  document.querySelector(".songinfo").innerHTML = decodeURI(song);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

function renderSongList() {
  songul = document.querySelector(".songlist ul");
  songul.innerHTML = "";

  let html = "";
  for (const song of songs) {
    html += `<li>
              <img class="invert" src="music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Aneesh</div>
              </div>
              <div class="playnow">
                <div style="font-size: small;">Play Now</div>
                <img src="play.svg" alt="">
              </div>
           </li>`;
  }
  songul.innerHTML = html;

  document.querySelectorAll(".playnow").forEach(button => {
    button.addEventListener("click", function() {
      let songSrc = this.previousElementSibling.querySelector("div").textContent.trim();
      playSong(songSrc);
    });
  });

  console.log("Song list updated!");
}

async function main() {
  songs = await getsongs("songs/nesong");

  if (songs.length > 0) {
    playSong(songs[0], true);
  }

   
 async function displayAlbums()
{
   let a=await fetch(`http://127.0.0.1:3000/songs/`)
   let response=await a.text();
   let div=document.createElement("div")
   div.innerHTML=response;
   let anchors=div.getElementsByTagName("a")
   Array.from(anchors).forEach(e=>{
    if(e.href.includes("/songs")){
      console.log(e.href)
    }
   })
   console.log(anchors)
}
  renderSongList();

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const circle = document.querySelector(".circle");
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    circle.style.left = `${percentage}%`;
    currentsong.currentTime = ((currentsong.duration) * percentage) / 100;
  });

  document.getElementById("previous").addEventListener("click", () => {
    currentsong.pause();
    console.log("Previous clicked");

    // Extract only the filename from the full URL
    let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
    console.log("Current song playing:", currentSongName);

    // Find the index of the current song in the songs array
    let index = songs.findIndex(song => decodeURIComponent(song) === currentSongName);

    console.log("Current song index:", index, "Total songs:", songs.length);

    if (index > 0) {
        playSong(songs[index - 1]); // Play the previous song
    } else {
        console.log("Already at the first song.");
    }
});

document.getElementById("next").addEventListener("click", () => {
    currentsong.pause();
    console.log("Next clicked");

    
    let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
    console.log("Current song playing:", currentSongName);
    let index = songs.findIndex(song => decodeURIComponent(song) === currentSongName);

    console.log("Current song index:", index, "Total songs:", songs.length);

    if (index !== -1 && index < songs.length - 1) {
        playSong(songs[index + 1]); 
    } else {
        console.log("Already at the last song.");
    }
});

document.getElementById("next").addEventListener("click", () => {
    currentsong.pause();
    console.log("Next clicked");

    let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
    let index = songs.indexOf(currentSongName);

    console.log("Current song index:", index);

    if (index !== -1 && index < songs.length - 1) {
        playSong(songs[index + 1]); 
    } else {
        console.log("Already at the last song.");
    }
});


  let volumeRange = document.querySelector(".volrange");
  if (volumeRange) {
    volumeRange.addEventListener("input", (e) => {
      currentsong.volume = e.target.value / 100;
    });
  } else {
    console.error("Volume range input not found!");
  }

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      let folderName = item.currentTarget.dataset.folder;
      console.log("Loading songs from:", folderName);

      songs = await getsongs(`songs/${folderName}`);
      console.log("Songs loaded:", songs);

      if (songs.length > 0) {
        playSong(songs[0], true);
      }

      renderSongList();
    });
  });
}

main();
