var GlobalTimeRange = []
var StartTime = 0
function updateLyric(obj){

    var index= 0
    GlobalTimeRange  = []
    document.querySelectorAll('p').forEach(p=>{
        p.remove()
    })
    obj.ms.forEach(line => {
        let p = document.createElement('p')
        p.textContent = line.c
        p.dataset.index = index
        index++;
        GlobalTimeRange.push(parseFloat(line.t))
        document.querySelector('#song-lyrics div').appendChild(p)
    })
}

function updateTime(playTime){
    if(GlobalTimeRange.length<1){
        return
    }

    let index = 0;
    let pre_time = 0;
    for(let i = 0; i < GlobalTimeRange.length; i++){
        let current = GlobalTimeRange[i]
        if(current>playTime && playTime>pre_time){
            index=i-1;
            break;
        }
    }
    if(index<0){
        index = 0;
    }
    console.log("Select index:",index)
    let top = document.getElementById('lyrics-wrapper').offsetTop
    let translate = -(document.querySelector(`p[data-index="${index}"]`).offsetTop - top)
    document.getElementById('lyrics-wrapper').style.transform = `translateY(${translate}px)`
    document.querySelectorAll('p.active').forEach(function(p){
        p.classList.remove('active')
    })
    document.querySelector(`p[data-index="${index}"]`).classList.add('active')
    if(document.querySelector(`p[data-index="${index+1}"]`)){
        document.querySelector(`p[data-index="${index+1}"]`).classList.add('active')
    }
}
function confirmLyrics(){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'http://localhost:8080/confirmLyrics', true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {

        if(httpRequest.readyState === 4){
            if ( httpRequest.status === 200) {
               console.log(httpRequest.responseText)
            }
        }
    };
}
function tryQQWithArtist(){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'http://localhost:8080/tryQQWithArtist', true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {

        if(httpRequest.readyState === 4){
            if ( httpRequest.status === 200) {
                console.log(httpRequest.responseText)
            }
        }
    };
}
function tryNetEase(){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'http://localhost:8080/tryNetEase', true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {

        if(httpRequest.readyState === 4){
            if ( httpRequest.status === 200) {
                console.log(httpRequest.responseText)
            }
        }
    };
}
const evtSource = new EventSource("http://localhost:8080/sse");
evtSource.onmessage = function (event) {
    const obj = JSON.parse(event.data)
    //console.log(obj)
    if(obj.songSwitch){
        updateLyric(obj.Lyrics)
    }
    if(obj.startTime>0){
        StartTime = obj.startTime
    }
};
setInterval(() => {
    updateTime(Math.floor(Date.now() / 1000)-StartTime)
}, 500);