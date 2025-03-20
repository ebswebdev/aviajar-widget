(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-aviajar');
        if (!widgetContainer) return;

        const products = widgetContainer.getAttribute('products') || 'AirHotel,Air,Hotel,Extras';
        const destination = widgetContainer.getAttribute('destination') || '';

        widgetContainer.innerHTML = `
            <div width: 100%; max-width: 400px;">
                <h3>Buscar Paquetes en Oferta</h3>
                <label>Origen:</label>
                <input id="origen" type="text" placeholder="Ingrese una ciudad">
                <label>Destino:</label>
                <input id="destino" type="text" placeholder="Ingrese una ciudad" value="${destination}">
                <label>Fechas:</label>
                <input id="fecha-rango" type="text" placeholder="Seleccione un rango de fechas">
                <label>Habitaciones:</label>
                <input type="number" min="1" value="1">
                <input type="number" min="1" value="2">
                <div>
                    <input id="checkbox-vequipaje" type="checkbox"> Solo vuelos con equipaje
                    <br>
                    <input id="checkbox-vdirecto" type="checkbox"> Solo vuelos directos
                </div>
                <button id="buscar-btn" s>Buscar</button>
            </div>
        `;

        // Esperar a que Flatpickr esté cargado
        if (typeof flatpickr !== 'undefined') {
            flatpickr("#fecha-rango", {
                mode: "range",
                dateFormat: "Y-m-d",
                showMonths: 2,
                onClose: function (selectedDates) {
                    if (selectedDates.length === 2) {
                        const fecha1 = selectedDates[0].toISOString().split('T')[0];
                        const fecha2 = selectedDates[1].toISOString().split('T')[0];
                        console.log("Fecha de inicio:", fecha1);
                        console.log("Fecha de fin:", fecha2);
                    }
                }
            });
        }
    }


    document.addEventListener("DOMContentLoaded", createWidget);
})();


// Crear la url
function generateURL() {
    const host = "https://reservas.aviajarcolombia.com/";
    const culture = "es-CO";
    const productType = "Package";

    // Obtener valores del formulario
    let cityFrom = document.querySelector("#origen").value || "BOG"; // Lugar de salida
    let cityTo = document.querySelector("#destino").value || "LAX"; // Lugar de llegada
    let dateRange = document.querySelector("#fecha-rango").value.split(" to "); // Rango de fechas
    let dateFrom = dateRange[0]; // Fecha de salida
    let dateTo = dateRange[1]; // Fecha de llegada
    // Falta modificar bien el número de pasajeros
    let passengers = "2"; // Número de pasajeros 
    let baggageIncluded = document.querySelector("#checkbox-vequipaje").checked;
    let directFlight = document.querySelector("#checkbox-vdirecto").checked;
    let timeFrom = dateFrom; // Hora de salida
    let timeTo = dateTo; // Hora de llegada

    // Valores por defecto
    let airline = "NA"; // Aerolínea
    let cabinType = "Economy"; // Tipo de cabina
    let departureTime = "NA"; // Hora de salida
    let returnTime = "NA"; // Hora de regreso
    let userService = "aviajar";
    let branchCode = "003";

    // Construir la URL
    // ------------1-------2------------3------------4-----------5---------6----------7-------------8----------9----------10
    let url = `${host}${culture}/${productType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${passengers}/${timeFrom}/${timeTo}/${baggageIncluded}/${directFlight}/${airline}/${cabinType}/${departureTime}/${returnTime}/${userService}/${branchCode}`;

    console.log("Generated URL:", url);
    return url;
}


// Evento para el botón de búsqueda
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#buscar-btn").addEventListener("click", function (e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado del botón
        const generatedURL = generateURL();
        // console.log("Generated URL:", generatedURL);
        // window.location.href = generatedURL; // Redirigir al usuario a la URL generada
    });
});