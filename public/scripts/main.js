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
      console.log("Entra en parsearDatos");
        var datosSalida = {};
        datosSalida.Asignada = data.Asignada;
        datosSalida.Ubicacion = {};

        if (typeof datosEntrada.Ubicacion !== 'undefined') {
            datosSalida.Ubicacion.Edificio = data.Ubicacion.Edificio;
            datosSalida.Ubicacion.Piso = data.Ubicacion.Piso;
            datosSalida.Ubicacion.Casillero = data.Ubicacion.Casillero;
        } else {
            datosSalida.Ubicacion.Edificio = "";
            datosSalida.Ubicacion.Piso = "";
            datosSalida.Ubicacion.Casillero = "";
        }
       console.log("Sale de parsearDatos");
        return datosSalida;
    }

    function cargarPosiciones(data) {
                  console.log("Entra en cargarPosiciones");
        for (var i = 0; i < data.length; i++) {
            var datosSalida = {};
            datos = parsearDatos(data[i]);
            datosToHTML(datosSalida);
            console.log(data[i]);
        }
      console.log("Sale de cargarPosiciones tras "+i+" iteraciones");

    }

    function cargarMensaje(mensaje) {
        alert(mensaje);
    }

    function datosToHTML(datos) {


        var html_text = "<option value='" + datos.Ubicacion.Edificio + "</option>";

        $div.find('select#Edificio').append(html_text);
    }

      ajax({url: URL, type: "GET"})

        .then(cargarPosiciones,recogerErrorAjax)
        .catch(function errorHandler(error) {
            console.log(error);
        });

    console.log("exit");

});
