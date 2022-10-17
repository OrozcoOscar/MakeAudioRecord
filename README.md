# MakeAudioRecord
Crea una estructura base para grabar audio

# AudioRecord
## cdn
https://raw.githack.com/OrozcoOscar/MakeAudioRecord/main/AudioRecord.js


> ### Permite grabar el audio del micrófono y lo codifica en base64
> 
> **showDecibels:Bolean** Establece si se muestra o no la animación del sonido.
> 
> **parentDecibels:String** Establece cual es el elemento donde se debe mostrar la animación.
>
```js

let audio = new AudioRecord(true,".micro-decibels")
```
## Metodos
> ## start
>> **fun:Function** Función que se ejecuta después de que se inicia la grabación. 
>> **fun:Function** Función que se ejecuta durante la grabación, esta recibe dos parámetros (timeState,timeMillisecond); un string con el tiempo y los mili segundos que van de grabación.
>> ```js
>> audio.start(() => {
>>       console.log("Ya inició 🧐")
>>   }, (time,milliseconds) => {
>>       console.log("Me ejecuto mientras esté grabando 😁")
>>   })
>> ```
>
> ## pause
>> **fun:Function** Función que se ejecuta después de que se pausa la grabación,esta recibe un objeto 
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
>> **fun:Function** Función que se ejecuta después de que se pausa la grabación,esta recibe un objeto
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
>> **fun:Function** Función que se ejecuta después de que se finaliza la grabación,esta recibe un objeto 
>> 
>>         {
>>             audio: Es el contenido de la grabación en base64,
>>             totalTime: Un string con el tiempo recorrido
>>         } 
>> ```js
>> audio.finish(({ audio }) => {
>>       console.log("Ya finalizó 🤩, y aqui esta el audio ",audio)
>>   })
>> ```
>
