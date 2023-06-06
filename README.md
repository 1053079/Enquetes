# Werkplaats 4

Een 360-graden Feedback Tool gemaakt in React / Node.

### Dit project is gemaakt met:
- ReactJS
- Node
- Express.js
- JSX 
- Create-React-App

### Functionaliteiten:
- Basic React website met een paar routes.


## Om deze webapplicatie te starten doe het volgende:
- Installeer Node.JS van de website. https://nodejs.org/en 
  Deze applicatie gebruikt 18.16.0 LTS.
- Type in de terminal van de IDE: 
```
npm install
```
- Dit installeert de Package.json file die in de Github staat. Die hebben we nodig om de applicatie te runnen.


- Om de applicatie te runnen type in de terminal
```
npm start
```
- Om het af te sluiten toets in de terminal:
```
CTRL+C
```
## Let op!
De applicatie maakt gebruik van Node.JS 18 en sommige dingen kan je niet meer doen met OpenSSL 3.0.
Vandaar dat we in package.json bij 'scripts' -- openssl-legacy-provider hebben, dit zorgt ervoor dat dit applicatie nog kunnen starten zonder errors.
```
 "scripts": {
        "start": "react-scripts --openssl-legacy-provider start",
        "build": "react-scripts --openssl-legacy-provider build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
 }
 ```

 ## Bronnen
 React Routes aanleggen.
 ```
 https://www.youtube.com/watch?v=Ul3y1LXxzdU&t=1261s 
 ----
 Web Dev Simplified legt uit hoe je de routes moet aanleggen. Ook de error pagina was van hier.
 ```
 Search Filter voor SurveyList en QuestionList.
 ```
 https://www.youtube.com/watch?v=xAqCEBFGdYk
 ----
 Code heb ik overgenomen van Tutorial voor Search filter.
 ```
 Optional Chaining bij React Mapping.
 ```
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
 ----
 Gebruik ik overal just in case zodat het werkt ookal is de waarde null. Het hielp met de search filter laten werken in questionlist (daar moet je door Multiple Choice en Open.. waardoor er null waardes komen in de tables).
 ```
 Video over undefined in react..
 ```
 https://www.youtube.com/watch?v=UZT1V-VJxZE
 ----
 Denk dat ik een error had omdat het mogelijk is dat de data nog niet ingeladen was.. dus gooi je een if statement voor de mapping (variabel && variabel.map)
```
 Laat zien hoe React Mapping en Filter werkt.
 ```
 https://react.dev/learn/updating-arrays-in-state 
 ```
 Alert fade in bij ChangeQuestion.
 ```
 https://stackoverflow.com/questions/42733986/how-to-wait-and-fade-an-element-out 
 ----
 Code bij timer effects in changequestion.jsx om de alert een speciale fade animatie te geven.
 ```

 SqLiteStudio voor uittesten queries.
```
https://sqlitestudio.pl/
```
Stories.MD zijn gemaakt met TrelloExport(Google Chrome Extension).
```
https://chrome.google.com/webstore/detail/trelloexport/kmmnaeamjfdnbhljpedgfchjbkbomahp
```
GetDate functie om de recente datum te krijgen.
```
https://www.freecodecamp.org/news/javascript-get-current-date-todays-date-in-js/
```

 CHATGPT voor
 ```
 Timer 5 seconde laat duren in ChangeQuestion.jsx
 Code om de huidige datum te krijgen in YYYY-MM-DD 
 req.params en req.query. // Waren ideeen van ChatGPT waarop ikzelf verder bouw.//
 // Yong Pok //
```
 
 