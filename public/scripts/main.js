const URL = "https://gestortaquillas.firebaseio.com/.json";
var database = "https://gestortaquillas.firebaseio.com/.json";

jQuery(document).ready(function ($) {
  var $div = $('#floating-panel');

  function ajax(opciones) {
    return new Promise(function (resolve, reject) {
      $.ajax(opciones).done(resolve).fail(reject);
    });
  }

  function recogerErrorAjax(jqXHR, textStatus, errorThrown) {
    alert("Error:" + jqXHR.toString() + textStatus + errorThrown);
  }

  function parsearDatos(datosEntrada) {
    var datosSalida = {};
    if (typeof datosEntrada.Asignada != 'undefined') {
      datosSalida.Asignada = datosEntrada.Asignada;
    }
    datosSalida.Ubicacion = {}

    if (typeof datosEntrada.Ubicacion != 'undefined') {
      datosSalida.Ubicacion.Edificio = datosEntrada.Ubicacion.Edificio;
      datosSalida.Ubicacion.Piso = datosEntrada.Ubicacion.Piso;
      datosSalida.Ubicacion.Casillero = datosEntrada.Ubicacion.Casillero;
    } else {
      datosSalida.Ubicacion.Edificio = "";
      datosSalida.Ubicacion.Piso = "";
      datosSalida.Ubicacion.Casillero = "";
    }
    return datosSalida;
  }

  function cargarPosiciones(datos) {
    console.log("Tiene que cargar " + datos.length + " elementos.");
    var datosParseados = {};
    var edificios = [];
    for (var i = 0; i < datos.length; i++) {

      datosParseados = parsearDatos(datos[i]);
      var repetido = edificios.indexOf(datosParseados.Ubicacion.Edificio)
        // A.indexOf(B) devuelve la posicion de B en el array A, en caso de no estar contenido B dentro de A, indexOf devolvera -1
      if (repetido == -1)
        edificios.push(datosParseados.Ubicacion.Edificio);
    }
    edificios.sort();
    var HTMLSelectEdificios = HTMLRellenarSelect(edificios);
    $div.find('select#selectEdificios').append(HTMLSelectEdificios);
    var HTMLDivsEdificios = HTMLGenerarDivs(edificios);
    console.log(HTMLDivsEdificios);
    $('div#divEdificios').append(HTMLDivsEdificios);

    console.log("carga " + i + " elementos");

  }
  /* UTILS */
  function cargarMensaje(mensaje) {
    alert(mensaje);
  }

  function HTMLGenerarDivs(datos) {
    var divs = "";
    for (var i = 0; i < datos.length; i++) {
      divs += "<div id='divEdificio" + datos[i] + "' class='" + calcularColor(i) + " unoD2 edificio'>Edificio: "+ datos[i]+"</div>";
    }
    return divs;

  }

  function HTMLRellenarSelect(datos) {
    var opciones = "";
    for (var i = 0; i < datos.length; i++) {
      opciones += "<option value='" + datos[i] + "'>Edificio: " + datos[i] + "</option>";
    }
    return opciones;
  }

  function calcularColor(i) {
    var paridad = "";
    if (esPar(i)) {
      paridad = "par";
    } else {
      paridad = "impar";
    }
    return paridad;
  }

  function esPar(numero) {
    respuesta = false;
    if (numero % 2 == 0) {
      respuesta = true;
    }
    return respuesta;
  }
  /* AJAX */
  ajax({
    url: URL,
    type: "GET"
  })

  .then(cargarPosiciones, recogerErrorAjax)
    .catch(function errorHandler(error) {
      console.log(error);
    });

  console.log("exit");

});
