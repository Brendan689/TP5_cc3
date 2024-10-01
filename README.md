## Taofifenua Levi

## Partie 1 : serveur HTTP natif Node.js

### execution commande npm init dans devweb-tp5

```bash
C:\GitHub\devweb-tp5\TP\TP>npm init

{
  "package name": "devweb-tp5",
  "version": "(1.0.0) 1.0.0",
  "description": "",
  "entry point": "(index.js) server-http.mjs",
  "test command": "echo \"Error: no test specified\" && exit 1",
  "git repository":
  "keywords":
  "author": "",
  "license": "(ISC) ISC"
}
```

### creation fichier server-http.mjs
```js
import http from "node:http";

const host = "localhost";
const port = 8000;

function requestListener(_request, response) {
  response.writeHead(200);
  response.end("<html><h1>My first server!<h1></html>");
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```
### execution commande node server-http.mjs
```
C:\GitHub\devweb-tp5\TP\TP>node server-http.mjs
Server is running on http://localhost:8000
```


**Question 1.1** donner la liste des en-têtes de la réponse HTTP du serveur.
-`content-type: application/json`
-`connexion: keep-alive`
-`date: date`

**Question 1.2** donner la liste des en-têtes qui ont changé depuis la version précédente.
-`content-type: text/html => application/json`


**Question 1.3** que contient la réponse reçue par le client ?
-`Aucune réponse recue par le client`

**Question 1.4** quelle est l'erreur affichée dans la console ? 
```bash
[Error: ENOENT: no such file or directory, open 'C:\GitHub\devweb-tp5\TP\TP5\index.html']{
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path; 'C:\\GitHub\\devweb-tp5\\TP\\TP5\\index.html'
}
```
-`l'erreur ENOENT est afficher dans la console (Erreur NO ENTry, signifie que le fichier ou la methode de lecture est incorrect)`


### modification de la fonction `requestListener()`

```js
function requestListener(_request, response) {
    fs.readFile("index.html", utf8")
    .then((contents) => {
        response.setHeader("content_type", "text/html");
        response.writeHead(200);
        response.end(contents);
    })
    .catch((error)) => {
        console.error(error);
    }
```

```
fichier `__index.html` renommer en `index.html`.
```


**Question 1.5** donner le code de `requestListener()` modifié _avec gestion d'erreur_ en `async/await`.

```js
import fs from "node:fs/promises


async function requestListener(_request, response) {
  try{
    const contents = await fs.readFile("index.html", "utf8");
    response.setHeader("content_type", "text/html");
    response.writeHead(200);
    response.end(contents);
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    response.end("<html><p>500: Internal server error</p></html>")
  }
}
```

### execution des commandes
- `npm install cross-env --save`
- `npm install nodemon --save-dev`

**Question 1.6** indiquer ce que cette commande a modifié dans votre projet.

-`ajout des fonctionnalité cross-env et nodemon au package.json`

propriété `"scripts"` du fichier `package.json` remplacer par:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "http-dev": "cross-env NODE_ENV=development nodemon server-http.mjs",
    "http-prod": "cross-env NODE_ENV=production node server-http.mjs"
  },
```


**Question 1.7** quelles sont les différences entre les scripts `http-dev` et `http-prod` ?

-`le script http-dev utilise nodemon pour recharger automatiquement le serveur et execute en mode development, et http-prod utilise node sans rechargement automatique, et execute en mode production`


```bash
npm install --save-dev prettier eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jest eslint-plugin-node eslint-plugin-promise eslint-plugin-security eslint-plugin-unicorn
```


### gestion manuelle des routes

Remplacer la fonction `requestListener()` par la suivante :

```js
async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const contents = await fs.readFile("index.html", "utf8");
    switch (request.url) {
      case "/index.html":
        response.writeHead(200);
        return response.end(contents);
      case "/random.html":
        response.writeHead(200);
        return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);
      default:
        response.writeHead(404);
        return response.end(`<html><p>404: NOT FOUND</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}
```

Tester les **routes** suivantes :

- `http://localhost:8000/index.html`
- `http://localhost:8000/random.html`
- `http://localhost:8000/`
- `http://localhost:8000/dont-exist`

**Question 1.8** donner les codes HTTP reçus par votre navigateur pour chacune des quatre pages précédentes.

- `http://localhost:8000/index.html: 200`
- `http://localhost:8000/random.html: 200`
- `http://localhost:8000/: 200`
- `http://localhost:8000/dont-exist: 404`


## Partie 2 : framework Express

### création du serveur

### creation du fichier `server-express.mjs` et exécution de la commande suivante :

```bash
npm install --save express http-errors loglevel morgan
```

**Question 2.1** donner les URL des documentations de chacun des modules installés par la commande précédente.

-`https://expressjs.com/`
-`https://www.npmjs.com/package/http-errors`
-`htttps://www.npmjs.com/package/loglevel`
-`https://www.npmjs.com/package/morgan`

création des scripts `express-prod` et `express-dev`.
-`"express-dev": "cross-env NODE_ENV=development nodemon server-express.mjs"`
-`"express-prod": "cross-env NODE_ENV=production node server-express.mjs"`

Ajout du contenu suivant au fichier `server-express.mjs`

```js
import express from "express";
import morgan from "morgan";

const host = "localhost";
const port = 8000;

const app = express();

app.get(["/", "/index.html"], async function (request, response, next) {
  response.sendFile("index.html", { root: "./" });
});

app.get("/random/:nb", async function (request, response, next) {
  const length = request.params.nb;
  const contents = Array.from({ length })
    .map((_) => `<li>${Math.floor(100 * Math.random())}</li>`)
    .join("\n");
  return response.send(`<html><ul>${contents}</ul></html>`);
});

app.listen(port, host);
```

**Question 2.4** quand l'événement `listening` est-il déclenché ?

-`listening est enclenché lorsque le serveur commence a lire le port 8000`





