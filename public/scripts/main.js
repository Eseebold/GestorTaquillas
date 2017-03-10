const URL = "https://cityparser.firebaseio.com/.json";

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

    function parseData(data) {
        var datos = {};
        datos.nombre = data.Nombre;
        datos.tipo = data.Tipo;
        datos.Direccion = {};


        if (typeof data.Direccion !== 'undefined') {
            datos.Direccion.direccion = data.Direccion.direccion;
            datos.Direccion.numero = data.Direccion.numero;
            datos.Direccion.ciudad = data.Direccion.ciudad;
            datos.Direccion.region = data.Direccion.region;
            datos.Direccion.pais = data.Direccion.pais;
        } else {
            datos.Direccion.direccion = "";
            datos.Direccion.numero = "";
            datos.Direccion.ciudad = "";
            datos.Direccion.region = "";
            datos.Direccion.pais = "";

        }
        return datos;
    }

    function cargarUbicaciones(data) {
        for (var i = 0; i < data.length; i++) {
            var datos = {};
            datos = parseData(data[i]);
            datosToHTML(datos);
            console.log(data[i]);
        }
    }

    function cargarMensaje(mensaje) {
        alert(mensaje);
    }

    function datosToHTML(datos) {

        /*   var html_text = "<option value='" + datos.ubicacion.direccion +
      datos.ubicacion.ciudad + datos.ubicacion.pais + "'>" + datos.nombre + "</option>";
*/
        var html_text = "<option value='" + datos.Direccion.direccion + " " + datos.Direccion.numero + "," + datos.Direccion.ciudad + "," + datos.Direccion.pais + "'>" + datos.nombre + "</option>";
        if (datos.tipo == "origen") {
            $div.find('select#start').append(html_text);
        } else if (datos.tipo == "destino") {
            $div.find('select#end').append(html_text);
        }
    }

    ajax({
            url: URL,
            type: "GET"
        })
        .then(cargarUbicaciones)
        .catch(function errorHandler(error) {
            console.log(error);
        });

    console.log("exit");

});

function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });
    var directionsService = new google.maps.DirectionsService;
    var markerArray = [];


    // Create a map and center it on Bilbao

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {
            lat: 43.257975,
            lng: -2.918951
        }
    });



    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    var control = document.getElementById('floating-panel');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    var stepDisplay = new google.maps.InfoWindow;
    calculateAndDisplayRoute(
        directionsDisplay, directionsService, markerArray, stepDisplay, map, directionsDisplay);
    var onChangeHandler = function () {
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map, directionsDisplay);
    };

    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    document.getElementById('mode').addEventListener('change', onChangeHandler);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    var selectedMode = document.getElementById('mode').value;

    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }



    directionsService.route({
            origin: document.getElementById('start').value,
            destination: document.getElementById('end').value,
            travelMode: google.maps.TravelMode[selectedMode]
        },

        function (response, status) {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === google.maps.DirectionsStatus.OK) {
                document.getElementById('warnings-panel').innerHTML =
                    '<b>' + response.routes[0].warnings + '</b>';
                directionsDisplay.setDirections(response);
                showSteps(response, markerArray, stepDisplay, map);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
            stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function () {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}
