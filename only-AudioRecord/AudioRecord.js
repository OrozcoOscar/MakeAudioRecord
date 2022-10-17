/**
 * OrozcoOscar
 * v1.0
 * 17/10/22
 */
/**
 * Permite grabar el audio del micrófono y lo codifica en base64
 * @param {boolean} showDecibels Establece si se muestra o no la animación del sonido
 * @param {string} parentDecibels Establece cual es el elemento donde se debe mostrar la animación.
*/
class AudioRecord {
    constructor(showDecibels=true,parentDecibels=".micro-decibels") {
        this.contDecibels = parentDecibels
        this.recordingCycle = null;
        this.recordingParts = [];
        this.endRecording = ""; //contiene el audio en base64
        this.media = null;
        this.timeState = "";
        this.timeMillisecond = 0
        this.initDecibelsAnimation = false
        this.showDecibelsAnimation = showDecibels
    }
    static timer(millisecond) {
        const minute = parseInt(millisecond / 1000 / 60);
        millisecond -= minute * 60 * 1000;
        const second = Math.floor((millisecond / 1000).toFixed(1));
        return `${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
    }
    scanDecibels(s) {
        let showDecibels = (f) => {
            f += 10
            let cont = document.querySelector(this.contDecibels)
            let div = document.createElement("div")
            div.classList.add("mirco-recording-decibel")
            div.setAttribute("style", `
                height:${(f - 2)}%;
                width:1px;
                border-radius: 30px;
                border: solid 2px;
                margin: 1px;`)
            cont.append(div)
            let l = cont.children.length
            let space = 5//espacio q ocupan los div
            if (l > cont.clientWidth / (space + 1.1)) cont.removeChild(cont.children[0])
        }
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)

        // crear un filtro pasa bajos
        let filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";

        // creamos un analyzer
        let analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = 0.09;
        analyser.fftSize = 2048;

        // Ajustar el rango de decibles de analisis cambia mucho los sonidos que toma. 
        analyser.minDecibels = -74.0;
        analyser.maxDecibels = -10.0;


        // creamos un audio processor
        let processor = audioCtx.createScriptProcessor(4096, 1, 1);
        let array = new Uint8Array(analyser.frequencyBinCount);
        let onInactive = () => {
            if (this.media.state == "inactive") {
                processor.disconnect()
            }
        }
        // en el evento, verificamos si hay volumen o no
        processor.onaudioprocess = function (audio) {
            // tomar los datos del analyzer
            analyser.getByteFrequencyData(array);
            showDecibels(array.filter(e => e < 100).sort().reverse()[0])
            onInactive()
        }

        let source = audioCtx.createMediaStreamSource(s);
        source.connect(filter);
        filter.connect(analyser);
        analyser.connect(processor);
        processor.connect(audioCtx.destination);
    }
    /**
     * 
     * @param {function} fun Función que se ejecuta después de que se inicia la grabación. 
     * @param {function} fun2 Función que se ejecuta durante la grabación, esta recibe dos parámetros (timeState,timeMillisecond); un string con el tiempo y los mili segundos que van de grabación.
     */
    start(fun = () => { }, fun2 = () => { }) {
        if (typeof fun != "function") fun = () => { }
        if (typeof fun2 != "function") fun2 = () => { }

        if (this.recordingCycle > 0) {
            this.timeState = ""
            this.finish()
        }
        setTimeout(() => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then((s) => {
                    this.media = new MediaRecorder(s, { mimeType: "audio/webm;codecs=opus" });
                    this.media.ondataavailable = (e) => {
                        let setData = (d) => {
                            this.endRecording = d;
                        }
                        this.recordingParts.push(e.data);
                        let blob = new Blob(this.recordingParts, { type: "audio/webm" });
                        let reader = new FileReader();

                        reader.onload = function (e) {
                            let fileInBase64 = btoa(e.target.result);
                            setData("data:audio/ogg;base64," + (fileInBase64));
                        };
                        reader.readAsBinaryString(blob);
                        this.recordingParts = [];

                    }

                    try {
                        this.media.start();

                        this.timeMillisecond = 0
                        this.initDecibelsAnimation = true;
                        this.recordingCycle = setInterval(() => {
                            if (this.media.state == "recording") {
                                this.timeState = AudioRecord.timer(this.timeMillisecond);
                                fun2(this.timeState, this.timeMillisecond);
                                this.timeMillisecond += 5;
                            }
                        })

                        if (this.timeState == "" && this.showDecibelsAnimation) this.scanDecibels(s);
                        fun()
                    } catch (error) {
                        this.finish();
                        console.error(error);
                    }

                }).catch(console.error)
        }, .009e3);
    }
    /**
     * 
     * @param {function} fun Función que se ejecuta después de que se pausa la grabación,esta recibe un objeto 
     *          {
     *               audio: Es el contenido de la grabación en base64,
     *               totalTime: Un string con el tiempo recorrido
     *          } 
    */
    pause(fun = () => { }) {
        if (typeof fun != "function") fun = () => { }
        try {
            if (this.media.state == "recording") {
                this.media.pause();
            }
            this.media.onpause = () => {
                this.initDecibelsAnimation = false
                let info = {
                    audio: this.endRecording,
                    totalTime: this.timeState
                }
                fun(info)
            }
        } catch (error) {
            this.finish()
            console.error(error)
        }

    }
    /**
     * 
     * @param {function} fun Función que se ejecuta después de que se reanuda la grabación,esta recibe un objeto 
     *          {
     *               audio: Es el contenido de la grabación en base64,
     *               totalTime: Un string con el tiempo recorrido
     *          } 
    */
    resume(fun = () => { }) {
        if (typeof fun != "function") fun = () => { }
        try {
            if (this.media.state == "paused") {
                this.media.resume();
            }
            this.media.onresume = () => {
                this.initDecibelsAnimation = true
                let info = {
                    audio: this.endRecording,
                    totalTime: this.timeState
                }
                fun(info)
            }
        } catch (error) {
            this.finish()
            console.error(error)
        }

    }
     /**
     * 
     * @param {function} fun Función que se ejecuta después de que se finaliza la grabación,esta recibe un objeto 
     *          {
     *               audio: Es el contenido de la grabación en base64,
     *               totalTime: Un string con el tiempo recorrido
     *          } 
    */
    finish(fun = () => { }) {
        if (typeof fun != "function") fun = () => { }
        try {
            clearInterval(this.recordingCycle)

            if (this.media.state == "recording" || this.media.state == "paused") {
                this.media.stop();
            }
            this.media.onstop = () => {
                this.media.stream.getTracks().forEach((track) => {
                    track.stop();
                });
                this.initDecibelsAnimation = false
                setTimeout(() => {
                    let info = {
                        audio: this.endRecording,
                        totalTime: this.timeState
                    }

                    fun(info)
                    this.endRecording = ""
                    this.timeState = ""
                }, .5e3)
            }

        } catch (error) { console.error(error) }
    }
}