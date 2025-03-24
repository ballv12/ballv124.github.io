// This script is such a mess smh //
// prepare for release! fix ALL of the paths! //

console.log(`
Hi! Look like your interested.
This is huge mess since I suck at web development lol
Anyways enjoy!   
                              🦆
                    - ZackDaQuack
`);

console.log(`
            [UPDATE 1.1]
        Finally added music!
    There are also effects too :)

(migration to ducks.lol/quack soon!)
            (hopefully)

`);

const defaultSong = 1;
const audioData = [
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874507704025128/sitting_ducks.mp3',
        author: 'Smile Empty Soul',
        title: 'Sitting Ducks',
        titleUrl: 'images/sitting_ducks.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874506542203021/my_life_as_a_duck.mp3',
        author: 'Charlie Winston',
        title: 'My Life As A Duck',
        titleUrl: 'images/my_life_as_a_duck.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874506126954537/march_of_the_sinister_ducks.mp3',
        author: 'The Sinister Ducks',
        title: 'March Of The Sinister Ducks - Remastered',
        titleUrl: 'images/sinister_ducks.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874505543950376/i_want_a_new_duck.mp3',
        author: '"Weird Al" Yankovic',
        title: 'I Want a New Duck',
        titleUrl: 'images/new_duck.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874505141305424/duck_song.mp3',
        author: 'Bryant Oden',
        title: 'Duck Song',
        titleUrl: 'images/duck_song.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874508035362876/three_little_birds.mp3',
        author: 'Bob Marley and the Wailers',
        title: 'Three Little Birds',
        titleUrl: 'images/little_birds.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874506944847933/nice_weather_for_ducks.mp3',
        author: 'Lemon Jelly',
        title: 'Nice Weather for Ducks',
        titleUrl: 'images/nice_weather.jpeg'
    },
    {
        url: 'https://cdn.discordapp.com/attachments/717855230301306944/1190874506944847933/nice_weather_for_ducks.mp3',
        author: 'Lemon Jelly',
        title: 'Nice Weather for Ducks',
        titleUrl: 'images/nice_weather.jpeg'
    }
];

const audioElement = document.getElementById('audio_player');
const progressBar = document.getElementById('song-progress');
const progressText = document.querySelector('.progress_text');
const background = document.querySelector('.background');

audioElement.addEventListener('timeupdate', function () {
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;

    const progressPercentage = (currentTime / duration) * 100;

    progressBar.value = progressPercentage;
    progressText.innerText = formatTime(currentTime) + " / " + formatTime(duration);
});

// Profile click secret
const clickSound = new Audio('storage/quack.mp3');
const profileImage = document.querySelector('.image-wrapper');
function playClickSound() {
    const newClickSound = new Audio('storage/quack.mp3');
    newClickSound.play();
    console.log("quack 🦆")
}
profileImage.addEventListener('click', function() {
    playClickSound();
});

// Funny thing
function rick() {
    var video = document.getElementById("rick");
    var profile = document.getElementById("profile");

    console.log("Lmao you clicked it >:)")
    profile.style.display = "none"
    background.style.display = "none"
    video.style.display = "block";
    audioElement.pause();
    video.play();
}
document.querySelector('.fa-facebook').onclick = rick;

// Main stuff
document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('overlay');
    let lastPlayed = getCookie('lastPlayed');
    let randomIndex;
    let audioContext = null;
    let analyser = null;
    let source = null;
    let overlayClicked = false;

    if (!lastPlayed) {
        randomIndex = defaultSong;
    } else {
        const availableSongs = audioData.filter(audio => audio.url !== lastPlayed);
        if (availableSongs.length === 0) {
            randomIndex = defaultSong;
        } else {
            do {
                randomIndex = Math.floor(Math.random() * availableSongs.length);
            } while (availableSongs[randomIndex].url === lastPlayed);
            lastPlayed = availableSongs[randomIndex].url;
        }
    }
    document.cookie = `lastPlayed=${lastPlayed};expires=${getCookieExpiration(30)};path=/`;
    
    const randomAudio = audioData[randomIndex];    
    const title_text = document.querySelector('.song-title');
    const author_text = document.querySelector('.author');
    const song_image = document.querySelector('.song-image');
    const overlay_text = document.querySelector('.enter-overlay');

    // funny CORS bypasser
    const targetUrl = randomAudio.url;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyUrl + targetUrl)
    .then(response => response.blob())
    .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        audioElement.src = objectUrl;
    })
    .catch(error => console.error('Unable to bypass CORS:', error));

    console.log("CORS restriction bypassed 😎")

    audioElement.volume = 0.5;
    audioElement.pause()

    title_text.innerText = randomAudio.title;
    author_text.innerText = randomAudio.author;
    song_image.src = randomAudio.titleUrl;

    // Click detector
    overlay.addEventListener('click', function() {
        overlayClicked = true;
       
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } else {
            analyser.disconnect();
            source.disconnect();
        }

        overlay.classList.add('hide');
        document.cookie = `lastPlayed=${lastPlayed};expires=${getCookieExpiration(30)};path=/`;
        
        audioElement.play();
        audioElement.addEventListener('ended', function() {
            audioElement.play();;
        });

        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let smoothedAmplitude = 0.0;

        function updateBackgroundZoom() {
            analyser.getByteFrequencyData(dataArray);
            smoothedAmplitude = 0.98 * smoothedAmplitude + 0.02 * (dataArray.reduce((sum, value) => sum + value, 0) / bufferLength);
            const scale = 1 + smoothedAmplitude / 355;

            background.style.transform = `scale(${scale})`;
            requestAnimationFrame(updateBackgroundZoom);
        }
        updateBackgroundZoom();
    });
    setTimeout(function() {
        if (!overlayClicked) {
            overlay_text.classList.add('fade-out');
            overlay_text.innerHTML = "you gonna click or not 💀";
        }
    }, 10000);
});

// Username Copier
const username = document.querySelector('.username');
username.addEventListener('click', function() {
    navigator.clipboard.writeText("zackdaquack");
    username.innerHTML = "Copied to clipboard!";
    setTimeout(function() {
       username.innerHTML = "ZackDaQuack";
       username.classList.remove('transitioning');
    }, 2000);
});

// Functions
function getCookie(name) {
    const cookieMatch = document.cookie.match(`(^|;)\\s*${name}\\s*=([^;]+)`);
    const cookieValue = cookieMatch ? cookieMatch[2] : null;
    return cookieValue
}

function getCookieExpiration(minutes) {
    const expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60 * 1000);
    return expires.toUTCString();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}