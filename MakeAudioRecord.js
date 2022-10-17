/**
 * OrozcoOscar
 * v1.0
 * 17/10/22
 */
/**
 * Crea una estructura base para grabar audio 
 * @param {string} parent Recibe el querySelector del elemento padre (solo si hay mas de un elemento)
 * @param {string} showDecibels Establece si se muestran o no la animación del sonido 
 * @returns {object} {init,finish,pause,resume,discard,ondiscard,onfinish,oninit,onpause,onresume}
 */
function MakeAudioRecord(parent="micro-contain",showDecibels=true) {
    let Audio = new AudioRecord(showDecibels, `${parent} micro-decibels`);
    this.cont;
    const events = {
        init() {
            domQuery(`${parent} micro-recording`).classList.remove("micro-inactive");
            Audio.start(() => {
                domQuery(`${parent} micro-trash-icon`).addEventListener("click",events.discard);
                domQuery(`${parent} micro-finish-icon`).addEventListener("click",events.finish);
                domQuery(`${parent} micro-options-icon`).addEventListener("click",events.pause);
                events.oninit();
            }, (time) => {
                domQuery(`${parent} micro-time`).innerHTML = time;
            })
        },
        discard() {
            domQuery(`${parent} micro-recording`).classList.add("micro-inactive");
            Audio.finish((e) => {
                domQuery(`${parent} micro-options-icon i`).setAttribute("class", "fa-solid fa-pause");
                domQuery(`${parent} micro-decibels`).innerHTML = "";
                domQuery(`${parent} micro-time`).innerHTML = "00:00";
                events.ondiscard(e);
            })
        },
        resume() {
            Audio.resume((e) => {
                domQuery(`${parent} micro-options-icon i`).setAttribute("class", "fa-solid fa-pause");
                domQuery(`${parent} micro-options-icon`).addEventListener("click",events.pause);
                events.onresume(e);
            })
        },
        pause() {
            Audio.pause((e) => {
                domQuery(`${parent} micro-options-icon i`).setAttribute("class", "fa-solid fa-play");
                domQuery(`${parent} micro-options-icon`).addEventListener("click",events.resume);
                events.onpause(e);
            })
        },
        finish() {
                domQuery(`${parent} micro-recording`).classList.add("micro-inactive");
                Audio.finish((e) => {
                    domQuery(`${parent} micro-decibels`).innerHTML = "";
                    domQuery(`${parent} micro-time`).innerHTML = "00:00";
                    domQuery(`${parent} micro-options-icon i`).setAttribute("class", "fa-solid fa-pause");
                    events.onfinish(e);
                })
        }, 
        oninit() {},
        ondiscard(e) {},
        onresume(e) {},
        onpause(e) {},
        onfinish(e) {}
    }
    ///---------------------- crear estructura ---------------------------------
    this.cont = domQuery(parent);
    if(Array.isArray(domQuery(parent))){
        console.warn("Se hallaron varias etiquetas,especifica un id para cada etiqueta [<micro-contain></micro-contain>]");
    }
    if (this.cont) {
        domCreateElement(
            domCreateElement(
                domCreateElement(this.cont, "micro-icon")
            , "micro-icon-init")
        , "i", { class: "fa-solid fa-microphone" });

        domQuery(`${parent} micro-icon-init`).addEventListener("click",events.init);
        let mr = domCreateElement(this.cont, "micro-recording", { class: "micro-inactive" });
        domCreateElement(
            domCreateElement(mr, "micro-trash-icon")
        , "i", { class: "fa-solid fa-trash" });

        let mt = domCreateElement(mr, "micro-time-recording");
        domCreateElement(mt, "micro-time");
        domCreateElement(mt, "micro-decibels");

        domCreateElement(
            domCreateElement(mr, "micro-options-icon")
        , "i", { class: "fa-solid fa-pause" });

        domCreateElement(
            domCreateElement(mr, "micro-finish-icon")
        , "i", { class: "fa-solid fa-circle-check" });

    } else {
        console.error("No se encontró la etiqueta <micro-contain></micro-contain>")
        return null
    }
    function domQuery(query) {
        let q = document.querySelectorAll(query)
        if (q.length > 1) {
            return q
        } else {
            return q[0]
        }
    }
    function domCreateElement(parent, type, config = {}) {
        let q = document.createElement(type);
        for (const key in config) {
            if (Object.hasOwnProperty.call(config, key)) {
                q.setAttribute(key, config[key]);
            }
        }
        if (parent) parent.append(q);
        return q;
    }
    return events;
}