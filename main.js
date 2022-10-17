let m1=  MakeAudioRecord("#m1");
let m2=  MakeAudioRecord("#m2");

//m1 config
(()=>{
    let {discard}=m1;
    m1.onfinish=({audio})=>{
        document.querySelector(`audio`).setAttribute("controls", "");
        document.querySelector(`audio`).src = audio;
    }
    m1.discard=()=>{
        if(confirm("Desea Descartar este audio?"))discard();
    }
})();

//m2 config
(()=>{
    let {discard}=m2;
    m2.onfinish=({audio})=>{
        document.querySelector(`audio`).setAttribute("controls", "");
        document.querySelector(`audio`).src = audio;
    }
    m2.discard=()=>{
        if(confirm("Desea Descartar este audio?"))discard();
    }
})()

