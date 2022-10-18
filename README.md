# MakeAudioRecord

## cdn
https://raw.githack.com/OrozcoOscar/MakeAudioRecord/main/MakeAudioRecord.js

> ## Crea una estructura base para grabar audio
> **`parent:String`**  Recibe el querySelector del elemento padre (solo si hay mas de un elemento)
> 
> **`showDecibels:Bolean`**  showDecibels Establece si se muestran o no la animación del sonido 
> 
> **`return->Object`**  {init,finish,pause,resume,discard,ondiscard,onfinish,oninit,onpause,onresume}
> 
> # Instalacion
>  Añade estas etiquetas a tu documento `HTML`
>> ```html
>>  <script src="https://kit.fontawesome.com/b5be18ffec.js" crossorigin="anonymous"></script>
>>  <link rel="stylesheet" href="https://raw.githack.com/OrozcoOscar/MakeAudioRecord/main/main.css">
>>  <script src="https://raw.githack.com/OrozcoOscar/MakeAudioRecord/main/AudioRecord.js"></script>
>>  <script src="https://raw.githack.com/OrozcoOscar/MakeAudioRecord/main/MakeAudioRecord.js"></script>
>> ```
>> Dentro de la etiqueta body
>> ```html
>>  <micro-contain id="m1"></micro-contain>
>>   <audio src=""></audio>
>>
>> ```
>> De esta forma se llama a la función
>> ```js
>> let m1=  MakeAudioRecord("#m1");
>> ```
>> Tambien puede hacerse de esta manera pero solo si hay una sola etiqueta `micro-contain`
>> ```js
>> let m1=  MakeAudioRecord();
>> ```
> # configurar
> Si deseamos modificar los valores por defecto podemos hacerlo de la siguiente manera:
>
>> ```js
>> //m1 config
>>(()=>{
>>  // Aquí establecemos las acciones a realizar después de que finalize la función finish en este caso obtenemos el audio y lo insertamos en una etiqueta de audio
>>   m1.onfinish=({audio})=>{
>>       document.querySelector(`audio`).setAttribute("controls", "");
>>       document.querySelector(`audio`).src = audio;
>>   }
>>   //En esta otra configuración añadimos una pequeña validación
>>   
>>   let {discard}=m1;//primero obtenemos y guardamos la función por defecto antes de modificarla
>>   m1.discard=()=>{//luego procedemos a sobre escribir la funcionen este caso le pedimos al usuario q confirme y una vez hecho esto ejecutamos la función por defecto
>>       if(confirm("Desea Descartar este audio?"))discard();
>>   }
>> })();
>> ```
# AudioRecord
## cdn
https://raw.githack.com/OrozcoOscar/MakeAudioRecord/main/AudioRecord.js


> ### Permite grabar el audio del micrófono y lo codifica en base64
> 
> **`showDecibels:Bolean`** Establece si se muestra o no la animación del sonido.
> 
> **`parentDecibels:String`** Establece cual es el elemento donde se debe mostrar la animación.
>
```js

let audio = new AudioRecord(true,".micro-decibels")
```
## Metodos
> ## start
>> **`fun:Function`** Función que se ejecuta después de que se inicia la grabación. 
>> **`fun2:Function`** Función que se ejecuta durante la grabación, esta recibe dos parámetros (timeState,timeMillisecond); un string con el tiempo y los mili segundos que van de grabación.
>> ```js
>> audio.start(() => {
>>       console.log("Ya inició 🧐")
>>   }, (time,milliseconds) => {
>>       console.log("Me ejecuto mientras esté grabando 😁")
>>   })
>> ```
>
> ## pause
>> **`fun:Function`** Función que se ejecuta después de que se pausa la grabación,esta recibe un objeto 
>> 
>>         {
>>             audio: Es el contenido de la grabación en base64,
>>             totalTime: Un string con el tiempo recorrido
>>         } 
>> ```js
>> audio.pause(() => {
>>       console.log("Se pausó 🥱")
>>   })
>> ```
>
> ## resume
>> **`fun:Function`** Función que se ejecuta después de que se pausa la grabación,esta recibe un objeto
>> 
>>         {
>>             audio: Es el contenido de la grabación en base64,
>>             totalTime: Un string con el tiempo recorrido
>>         } 
>> ```js
>> audio.resume(() => {
>>       console.log("Ya inició de nuevo 🤪")
>>   })
>> ```
>    
> ## finish
>> **`fun:Function`** Función que se ejecuta después de que se finaliza la grabación,esta recibe un objeto 
>> 
>>         {
>>             audio: Es el contenido de la grabación en base64,
>>             totalTime: Un string con el tiempo recorrido
>>         } 
>> ```js
>> audio.finish(({ audio }) => {
>>       console.log("Ya finalizó 🤩, y aquí esta el audio ",audio)
>>   })
>> ```
>
