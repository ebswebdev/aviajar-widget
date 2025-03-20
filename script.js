(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-aviajar');
        if (!widgetContainer) return;

        const products = widgetContainer.getAttribute('products') || 'AirHotel,Air,Hotel,Extras';
        const destination = widgetContainer.getAttribute('destination') || '';

        widgetContainer.innerHTML = `
            <div style="width: 100%; max-width: 400px;">
            <h3>Buscar Paquetes en Oferta</h3>
            <label>Origen:</label>
            <input id="origen" type="text" placeholder="Ingrese una ciudad">
            <label>Destino:</label>
                <input id="destino" type="text" placeholder="Ingrese una ciudad" value="${destination}">
                <label>Fechas:</label>
                <input id="fecha-rango" type="text" placeholder="Seleccione un rango de fechas">
                <label>Habitaciones:</label>
                <input id="num-hab" type="number" min="1" value="1">
            
                <label>Pasajeros:</label>
                <input id="num-per" type="number" min="1" value="2">
                <div id="submenu-pasajeros" style="display: none; border: 1px solid #ddd; padding: 10px; margin-top: 10px; background: #f9f9f9; border-radius: 5px;">
                    <label>Adultos:</label>
                    <input id="num-adultos" type="number" min="1" value="1" style="width: 100%; margin-bottom: 10px;">
                    <label>Niños:</label>
                    <input id="num-ninos" type="number" min="0" value="0" style="width: 100%; margin-bottom: 10px;">
                    <div id="edades-ninos"></div>
                </div>
                <div>
                    <input id="checkbox-vequipaje" type="checkbox"> Solo vuelos con equipaje
                    <br>
                    <input id="checkbox-vdirecto" type="checkbox"> Solo vuelos directos
                </div>
                <button id="buscar-btn">Buscar</button>
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



// -------------------------


// Evento para el numero de pasajeros
document.addEventListener("DOMContentLoaded", function () {
    const numPerInput = document.querySelector("#num-per");
    const submenuPasajeros = document.querySelector("#submenu-pasajeros");
    const numNinosInput = document.querySelector("#num-ninos");
    const edadesNinosContainer = document.querySelector("#edades-ninos");
    const numAdultosInput = document.querySelector("#num-adultos");

    // Valores
    let numPer = parseInt(numPerInput.value) || 0;
    let numAdultos = parseInt(numAdultosInput.value) || 0;
    let numNinos = parseInt(numNinosInput.value) || 0;
    let numAdNin = numAdultos + numNinos;

    // Mostrar el submenú al hacer clic en el campo #num-per
    numPerInput.addEventListener("click", function () {
        submenuPasajeros.style.display = "block"; // Mostrar el submenú
    });

    // Actualizar el total de personas al cambiar el número de adultos
    numAdultosInput.addEventListener("input", function () {
        const numAdultos = parseInt(numAdultosInput.value) || 0; // Obtener el número de adultos
        const numNinos = parseInt(numNinosInput.value) || 0; // Obtener el número de niños
        const numAdNin = numAdultos + numNinos; // Calcular el total de personas

        numPerInput.value = numAdNin; // Actualizar el total de personas en el campo #num-per
    });

    // Generar dinámicamente los campos para las edades de los niños
    numNinosInput.addEventListener("input", function () {
        numNinos = parseInt(numNinosInput.value) || 0;
        edadesNinosContainer.innerHTML = ""; // Limpiar el contenedor

        // Limitar que numNinos sea menor o igual a 4
        if (numNinos <= 4) {
            for (let i = 1; i <= numNinos; i++) {
                const label = document.createElement("label");
                label.textContent = `Edad del niño ${i}:`;
                const input = document.createElement("input");
                input.type = "number";
                input.min = "0";
                input.max = "12";
                input.value = "0";
                input.style = "width: 100%; margin-bottom: 10px;";
                input.className = "edad-nino";

                edadesNinosContainer.appendChild(label);
                edadesNinosContainer.appendChild(input);
            }
        } else {
            numNinosInput.value = 0;
            alert("El número máximo de niños permitido es 4.");
            numPerInput.value = numAdNin;
            return;
        }

        // Validar que numNinos y numAdultos sean iguales a numPer
        if (numPer !== numAdNin) {
            numPerInput.value = numAdultos + numNinos;
            return;
        }
    }
    );
});

// -------------------------


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
    // Rooms: 1, Adults: 2, Children: 0
    let passengersRoom = document.querySelector('#num-hab').value; // Número de Habitaciones 
    let passengersAdult = document.querySelector('#num-adultos').value; // Número de Adultos 
    let passengersChild = document.querySelector('#num-ninos').value; // Número de Niños 

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
    // ------------1-------2------------3------------4-----------5---------6----------7-------------8-----------------------------------------------------9---------10
    let url = `${host}${culture}/${productType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${passengersAdult}/${passengersRoom}/${passengersChild}/${timeFrom}/${timeTo}/${baggageIncluded}/${directFlight}/${airline}/${cabinType}/${departureTime}/${userService}/${branchCode}`;

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

