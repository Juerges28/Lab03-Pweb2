const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

const markdownDir = path.join(__dirname, 'markdown_files');

// Middleware para procesar el JSON de las peticiones
app.use(express.json());
//Esto configurará el directorio actual como el directorio de archivos estáticos
app.use(express.static(__dirname));

app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});

// Obtener la lista de archivos Markdown
app.get('/files', function(req, res) {
  fs.readdir(markdownDir, function(err, files) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el directorio de archivos' });
    } else {
      res.json(files);
    }
  });
});

// Obtener el contenido de un archivo Markdown
app.get('/files/:fileName', function(req, res) {
  const fileName = req.params.fileName;
  const filePath = path.join(markdownDir, fileName);

  fs.readFile(filePath, 'utf8', function(err, content) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo' });
    } else {
      const htmlContent = convertToHtml(content);
      res.json({ html: htmlContent });
    }
  });
});

// Crear un nuevo archivo Markdown
app.post('/files', function(req, res) {
  const fileName = req.body.name;
  const fileContent = req.body.content;
  const filePath = path.join(markdownDir, fileName);

  fs.writeFile(filePath, fileContent, function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el archivo' });
    } else {
      res.sendStatus(200);
    }
  });
});

// Convertir el Markdown a HTML 
function convertToHtml(markdownContent) {  
  const md = new markdownIt();
  const htmlContent = md.render(markdownContent);
  return htmlContent;
}

const port = 3000;
app.listen(port, function() {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
