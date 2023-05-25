$(document).ready(function() {
    // Obtener la lista de archivos Markdown disponibles
    $.getJSON('/files', function(data) {
      var fileList = $('#file-list-items');
      fileList.empty();
      $.each(data, function(index, file) {
        var listItem = $('<li>').text(file);
        listItem.click(function() {
          getFileContent(file);
        });
        fileList.append(listItem);
      });
    });
  
    // Obtener el contenido de un archivo Markdown
    function getFileContent(fileName) {
      $.getJSON('/files/' + fileName, function(data) {
        $('#file-content-html').html(data.html);
      });
    }
    
    // Crear un nuevo archivo Markdown
    $('#create-file-button').click(function() {
      var fileName = $('#file-name-input').val();
      var fileContent = $('#file-content-input').val();
      var fileData = {
        name: fileName,
        content: fileContent
      };
      $.ajax({
        type: 'POST',
        url: '/files',
        data: JSON.stringify(fileData),
        contentType: 'application/json',
        success: function() {
          alert('Archivo creado exitosamente');
          location.reload();
        },
        error: function() {
          alert('Error al crear el archivo');
        }
      });
    });
    
  });

