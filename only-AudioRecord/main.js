
let audio = new AudioRecord(true,".micro-decibels")

function domQuery(query) {
    let q = document.querySelectorAll(query)
    if (q.length > 1) {
        return q
    } else {
        return q[0]
    }
}
domQuery(".micro-icon-init").addEventListener("click",init)
function init() {
    domQuery(".micro-recording").classList.remove("micro-inactive")
    audio.start(() => {
        domQuery(".micro-trash-icon").addEventListener("click",discard)
        domQuery(".micro-finish-icon").addEventListener("click",finish)
        domQuery(".micro-options-icon").addEventListener("click",pause)
    }, (time) => {
        domQuery(".micro-time").innerHTML = time
    })
}
function pause() {
    audio.pause(() => {
        domQuery(".micro-options-icon i").setAttribute("class", "fa-solid fa-play")
        domQuery(".micro-options-icon").addEventListener("click",resume)
    })
}
function resume() {
    audio.resume(() => {
        domQuery(".micro-options-icon i").setAttribute("class", "fa-solid fa-pause")
        domQuery(".micro-options-icon").addEventListener("click", pause)
    })
}
function finish() {
    domQuery(".micro-recording").classList.add("micro-inactive")
    audio.finish(({ audio }) => {
        domQuery(".micro-decibels").innerHTML = ""
        domQuery(".micro-time").innerHTML = "00:00"
        domQuery(".micro-options-icon i").setAttribute("class", "fa-solid fa-pause")
        domQuery("audio").setAttribute("controls", "");
        domQuery("audio").src = audio;
    })
}
function discard() {
    domQuery(".micro-recording").classList.add("micro-inactive")
    audio.finish(() => {
        domQuery(".micro-options-icon i").setAttribute("class", "fa-solid fa-pause")
        domQuery(".micro-decibels").innerHTML = ""
        domQuery(".micro-time").innerHTML = "00:00"
    })
}