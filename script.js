const gifStages = [
    "https://c.tenor.com/lfDATg4Bhc0AAAAd/tenor.gif",    // 0 normal
    "https://c.tenor.com/HWlXt1G-wn8AAAAC/tenor.gif",  // 1 confused
    "https://media.tenor.com/IYdap55unFgAAAAi/nod-cat-nod.gif",             // 2 pleading
    "https://c.tenor.com/BhWz3LdQ4SIAAAAC/tenor.gif",             // 3 sad
    "https://c.tenor.com/DrBkLuUnJ_wAAAAd/tenor.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://c.tenor.com/mnSmkhnUpesAAAAd/tenor.gif",               // 6 very devastated
    "https://c.tenor.com/2pdRqiTB2GMAAAAd/tenor.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you suureeeeee? 🤔",
    "Potatooes please... 🥺",
    "Really no?? I will be tearring...",
    "can you hear jujuman howling... 😢",
    "Please???bai tuo? Abang?  💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You cant escape from me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay muted on load (browser-friendly)
function startMutedAutoplay() {
  music.muted = true
  music.volume = 0.3

  music.play().then(() => {
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔇' // muted
  }).catch(() => {
    musicPlaying = false
    document.getElementById('music-toggle').textContent = '🔇'
  })
}

startMutedAutoplay()

// Unmute + ensure playback on first user interaction
function unlockSound() {
  music.muted = false
  music.play().then(() => {
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊' // audible
  }).catch(() => {})
}

// Works on mobile + desktop
document.addEventListener('pointerdown', unlockSound, { once: true })
document.addEventListener('touchstart', unlockSound, { once: true, passive: true })
document.addEventListener('keydown', unlockSound, { once: true })

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
