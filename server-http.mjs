import http from "node:http";
import fs from "node:fs/promises";

const host = "localhost";
const port = 8000;

```
function requestListener(_request, response) {
  response.writeHead(200);
  response.end("<html><h1>My first server!<h1></html>");
}
```

```
function requestListener(_request, response) {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "I'm OK" }));
  }
```  

```
function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contents);
    })
    .catch((error) => console.error(error));
}
```

```
function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contents);
    })
    .catch((error) => {
      console.error(error);
      
      if (error.code === 'ENOENT') {
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end("<html><p>500: INTERNAL SERVER ERROR - File not found</p></html>");
      } else {
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end("<html><p>500: INTERNAL SERVER ERROR</p></html>");
      }
    });
}
```

```
async function requestListener(_request, response) {
    try {
      const contents = await fs.readFile("index.html", "utf8");
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contents);
    } catch (error) {
      console.error(error);
      response.writeHead(500);
      response.end("<html><p>500: INTERNAL SERVER ERROR</p></html>");
    }
  }
```

```
  async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    try {
      const contents = await fs.readFile("index.html", "utf8");
      switch (request.url) {
        case "/index.html":
        case "/":
          response.writeHead(200);
          return response.end(contents);
        case "/random.html":
          response.writeHead(200);
          return response.end("<html><p>${Math.floor(100 * Math.random())}</p></html>");
        default:
          response.writeHead(404);
          return response.end("<html><p>404: NOT FOUND</p></html>");
      }
    } catch (error) {
      console.error(error);
      response.writeHead(500);
      return response.end("<html><p>500: INTERNAL SERVER ERROR</p></html>");
    }
  }
```

async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    try {
      const contents = await fs.readFile("index.html", "utf8");
      const [_, base, param] = request.url.split('/');
      
      switch (base) {
        case "index.html":
        case "":
          response.writeHead(200);
          return response.end(contents);
        case "random.html":
          response.writeHead(200);
          return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);
        case "random":
          if (!isNaN(param)) {
            const numbers = Array.from({ length: param }, () => Math.floor(100 * Math.random()));
            response.writeHead(200);
            return response.end(`<html><ul>${numbers.map(num => `<li>${num}</li>`).join('')}</ul></html>`);
          }
          break;
        default:
          response.writeHead(404);
          return response.end("<html><p>404: NOT FOUND</p></html>");
      }
    } catch (error) {
      console.error(error);
      response.writeHead(500);
      return response.end("<html><p>500: INTERNAL SERVER ERROR</p></html>");
    }
  }
  

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});