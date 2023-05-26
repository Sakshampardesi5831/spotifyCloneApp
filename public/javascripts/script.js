/*let audio=document.querySelector("audio");
let play=document.getElementById("playIcon");
let totalTime=document.getElementById("total_time");
let current_Time=document.getElementById("current_time");
let progress_div=document.getElementById("progress_div");
let progress=document.getElementById("progress");

let isPlaying=false;
const playMusic=()=>{
    audio.play();
    isPlaying=true;
   play.classList.replace("ri-play-fill","ri-pause-mini-line");

}

const pauseMusic=()=>{
    audio.pause();
    isPlaying=false;
    play.classList.replace("ri-pause-mini-line","ri-play-fill");
}

play.addEventListener("click",function(){
    if(isPlaying){
        pauseMusic();
    }else{
        playMusic();
    }
});

audio.addEventListener("timeupdate",function(event){
    //this code is audio timers current time and duration
    const {currentTime,duration}=event.srcElement;
    let progress_style=(currentTime/duration)*100;
    progress.style.width=`${progress_style}%`;

    //duration part  start
    let min_duration=Math.floor(duration/60);
    let sec_duration=Math.floor(duration%60);
    let total_du=`${min_duration}:${sec_duration}`;
    if(duration){
        totalTime.textContent=`${total_du}`;
    }
    // current TIME
    let curr_min= Math.floor(currentTime/60);
    let curr_sec=Math.floor(currentTime%60);

    if(curr_sec<10){
        curr_sec=`0${curr_sec}`;
    }
    let curr_du=`${curr_min}:${curr_sec}`;
    if(currentTime){
        current_Time.textContent=curr_du;
    }
})*/

/**---------------------------------------------------------------------------------------------------- */
/*let playIcon=document.getElementById("playIcon").addEventListener("click",function(){
    audio.play();
    console.log(audio.duration);
    document.getElementById("playIcon").style.display="none";
    document.getElementById("pauseIcon").style.display="block";
});

let pauseIcon=document.getElementById("pauseIcon").addEventListener("click",function(){
    audio.pause();
    document.getElementById("pauseIcon").style.display="none";
    document.getElementById("playIcon").style.display="block";
});*/
let overlayer=document.querySelector(".overlayer");
let close=document.getElementById('close').addEventListener("click",function(){
    overlayer.style.display="none"
    document.body.style.overflowY="auto"
})
let edit=document.getElementById("edit").addEventListener("click",function(){
    overlayer.style.display="initial"
    document.body.style.overflowY="hidden"
})