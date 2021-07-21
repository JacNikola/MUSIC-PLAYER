const container = document.querySelector(".container"),
musicImg = container.querySelector(".img-area img"),
musicName = container.querySelector(".song-details .name"),
musicArtist = container.querySelector(".song-details .artist"),
mainAudio = container.querySelector("#main-audio"),
playPauseBtn = container.querySelector(".play-pause"),
playPauseIcon = container.querySelector(".play-pause .play"),
prevBtn = container.querySelector("#prev"),
nextBtn = container.querySelector("#next"),
progressArea = container.querySelector(".progress-area"),
progressBar = container.querySelector(".progress-bar"),
musicList = container.querySelector(".music-list"),
moreMusicBtn = container.querySelector("#more-music"),
closeMoreMusic = container.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

//load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;

    // styling the song details in the music list 
    const allLiTags = ulTag.querySelectorAll("li");
    allLiTags[indexNumb - 1].classList.add("playing");
}

// play music function
function playMusic() {
    playPauseIcon.innerText = "pause_circle_filled";
    container.classList.add("paused");
    musicImg.classList.add("playing");
    mainAudio.play();
}

// pause music function 
function pauseMusic() {
    playPauseIcon.innerText = "play_circle_filled";
    container.classList.remove("paused");
    musicImg.classList.remove("playing");
    mainAudio.pause();
}

// Next Music function 
function nextMusic() {
    const allLiTags = ulTag.querySelectorAll("li");
    allLiTags[musicIndex - 1].classList.remove("playing");

    musicIndex++; // increment of musicIndex by 1
    // if musicIndex is greater than array length then musicIndex will be moved to the first song 
    if(musicIndex > allMusic.length) {
        musicIndex = 1;
    }

    loadMusic(musicIndex);
    playMusic();
}

// Prev Music function
function prevMusic() {
    const allLiTags = ulTag.querySelectorAll("li");
    allLiTags[musicIndex - 1].classList.remove("playing");

    musicIndex--; // decrement of musicIndex by 1
   // if musicIndex is less than 0 then musicIndex will be moved to the last song 
   if(musicIndex < 1) {
        musicIndex = allMusic.length;
    }
    loadMusic(musicIndex);
    playMusic();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

// next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// update progressbar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // getting playing song currenttime
    const duration = e.target.duration; // getting playing total song duration
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");
    
    // update song total duration
    let mainAudioDuration = duration;
    let totalMin = Math.floor(mainAudioDuration / 60);
    let totalSec = Math.floor(mainAudioDuration % 60);

    if(totalSec < 10) { // is sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
    }

    musicDuration.innerText =  `${totalMin}:${totalSec}`;

    //update song current time
    let mainAudioCurrentTime = currentTime;
    let currentMin = Math.floor(mainAudioCurrentTime / 60);
    let currentSec = Math.floor(mainAudioCurrentTime % 60);

    if(currentSec < 10) { // is sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText =  `${currentMin}:${currentSec}`;
});


// update playing song current width according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; // getting width of progress bar
    let clickedOffsetX = e.offsetX; // getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
});

// change loop, shuffle, repeat icon onclick
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText; // getting this tag innerText
    switch(getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;
    }
});


// above we just change icon, now let's work on what to do after song ended
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText; // getting this tag innerText
    switch(getText) {
        case "repeat":
            nextMusic(); // calling next music function
            break;
        case "repeat_one":
            mainAudio.currentTime = 0; // setting audio current time to 0
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor(Math.random() * allMusic.length + 1);
            do {
                randIndex = Math.floor(Math.random() * allMusic.length + 1); 
            } while(musicIndex == randIndex); // this loop runs until the next random number won't be the same as current musicIndex
            musicIndex = randIndex; // passing randomIndex to musicIndex
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

// show the music list onclick music from
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

closeMoreMusic.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

const ulTag = container.querySelector("ul");

// let create li tags according to array length for list
for(let i = 0; i < allMusic.length; i++) {
    let liTag = 
    `<li id="${i + 1}" class="level0">
        <div class="row level1">
            <span class="level2">${allMusic[i].name}</span>
            <p class="level2">${allMusic[i].artist}</p>
        </div>
        <audio class="${allMusic[i].src} level1" src="music/${allMusic[i].src}.mp3"></audio>
        <span id="${allMusic[i].src}" class="audio-duration level1">0:00</span>
    </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        
        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
        // adding t-duration attribute with total duration value
        liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}


// lets play song on click li
ulTag.addEventListener("click", (e) => {

    // getting li index of particular clicked li tag
    // let getLiIndex = e.target.getAttribute("li-index");
    let getLiIndex;
    console.log(e.target);
    if(e.target.classList.contains("level0")) {
        getLiIndex = e.target.id;
    }
    else if(e.target.classList.contains("level1")) {
        getLiIndex = e.target.parentNode.id;
    }
    else if(e.target.classList.contains("level2")) {
        getLiIndex = e.target.parentNode.parentNode.id;
    }
    else {
        return;
    }
    if(getLiIndex == musicIndex) return;

    const allLiTags = ulTag.querySelectorAll("li");
    allLiTags[musicIndex - 1].classList.remove("playing");

    musicIndex = getLiIndex; // passing that li index to musicIndex    
    loadMusic(musicIndex);
    playMusic();
});

