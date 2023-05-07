let audio=document.querySelector("audio");

let playIcon=document.getElementById("playIcon").addEventListener("click",function(){
    audio.play();
    console.log(audio.duration);
    document.getElementById("playIcon").style.display="none";
    document.getElementById("pauseIcon").style.display="block";
})

let pauseIcon=document.getElementById("pauseIcon").addEventListener("click",function(){
    audio.pause();
    document.getElementById("pauseIcon").style.display="none";
    document.getElementById("playIcon").style.display="block";
})