(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-aviajar');
        if (!widgetContainer) return;

        const products = widgetContainer.getAttribute('products') || 'AirHotel,Air,Hotel,Extras';
        const destination = widgetContainer.getAttribute('destination') || '';

        widgetContainer.innerHTML = `
            <div class="widget">
                <div class="widget-container">
                    <div class="header">
                        <h3>Buscar Paquetes en Oferta</h3>
                    </div>
                    <div class="origen">
                        <div class="input-group">
                            <input id="origen" type="text" placeholder="Desde dónde viajas" value="">
                            <span class="icon"><i class="fas fa-plane-departure"></i></span>
                        </div>                        
                    </div>
                    <div class="destino">
                        <div class="input-group">
                            <input id="destino" type="text" placeholder="Hacia dónde viajas" value="">
                            <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                        </div>
                    </div>
                    <div class="fechas">
                        <div class="input-group">
                            <input id="fecha-rango" type="text" placeholder="Selecciona un rango de fechas">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="habitaciones-pasajeros">
                            <div class="habitaciones">
                                <input id="num-hab" type="number" min="1" value="1">
                                <span class="icon"><i class="fas fa-bed"></i></span>
                            </div>
                            <div class="pasajeros">
                                <input id="num-per" type="number" min="1" value="2">
                                <span class="icon"><i class="fas fa-users"></i></span>
                            </div>                       
                        </div>
                    </div>
                    <div id="hab-popup" class="popup">
                            <div class="popup-content">
                                <span class="close-popup">&times;</span>
                                <div class="popup-header">
                                    <label for="popup-num-hab">Número de habitaciones:</label>
                                    <input id="popup-num-hab" type="number" min="1" value="1">
                            </div>
                            <div id="hab-container"></div>
                    </div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox">
                            <input id="checkbox-vequipaje" type="checkbox">
                            <label for="checkbox-vequipaje"> Solo vuelos con equipaje </label>
                        </div>
                        <div class="checkbox">
                            <input id="checkbox-vdirecto" type="checkbox"> 
                            <label for="checkbox-vdirecto"> Solo vuelos directos </label>
                        </div>
                    </div>
                    <div class="boton-buscar">
                        <div class="input-group">
                                <button id="buscar-btn"">Buscar</button>
                                <span class="icon"><i id=lupa-icon class="fas fa-search"></i></span>
                        </div>
                    </div>
                </div>
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
document.addEventListener("DOMContentLoaded", function () {
    const numHabInput = document.querySelector("#num-hab");
    const popupNumHabInput = document.querySelector("#popup-num-hab");
    const habPopup = document.querySelector("#hab-popup");
    const closePopup = document.querySelector(".close-popup");
    const habitacionesContainer = document.querySelector("#hab-container");

    // Mostrar el popup al hacer clic en el campo de habitaciones
    numHabInput.addEventListener("click", function () {
        habPopup.style.display = "flex"; // Mostrar el popup
    });

    // Cerrar el popup al hacer clic en el botón de cierre
    closePopup.addEventListener("click", function () {
        habPopup.style.display = "none"; // Ocultar el popup
    });

    // Cerrar el popup al hacer clic fuera del contenido
    habPopup.addEventListener("click", function (e) {
        if (e.target === habPopup) {
            habPopup.style.display = "none"; // Ocultar el popup
        }
    });

    // Actualizar el número de habitaciones desde el popup
    popupNumHabInput.addEventListener("input", function () {
        const numHab = parseInt(popupNumHabInput.value) || 1;
        numHabInput.value = numHab; // Sincronizar el valor con el campo principal
        generarHabitaciones(numHab); // Regenerar las habitaciones
    });

    // Función para generar habitaciones
    function generarHabitaciones(numHab) {
        habitacionesContainer.innerHTML = ""; // Limpiar el contenedor

        for (let i = 1; i <= numHab; i++) {
            const habitacionDiv = document.createElement("div");
            // habitacionDiv.style = "border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; background: #f9f9f9; border-radius: 5px;";
            habitacionDiv.innerHTML = `
                <div class="habitacion-header">
                    <h4>Habitación ${i}</h4>
                    <span class="icon"><i class="fas fa-bed"></i></span>
                </div>
                <div class="habitacion">
                    <div class="adultos">
                        <div class="label-adultos">
                            <label for="num-adultos">Adultos:</label>
                        </div>
                        <div class="input-adultos">
                            <input id="num-adultos" type="number" min="1" value="2">
                            <span class="icon"><i class="fas fa-user"></i></span>
                        </div>
                    </div>
                    <div class="ninos">
                        <div class="label-ninos">
                            <label for="num-ninos">Niños:</label>
                        </div>
                        <div class="input-ninos">
                            <input id="num-ninos" type="number" min="0" value="0">
                            <span class="icon"><i class="fas fa-child"></i></span>
                        </div>
                    </div>
                    <div id="edades-ninos"></div>
                </div>
            `;

            habitacionesContainer.appendChild(habitacionDiv);

            // Seleccionar elementos dentro de esta habitación
            const numAdultosInput = habitacionDiv.querySelector("#num-adultos");
            const numNinosInput = habitacionDiv.querySelector("#num-ninos");
            const edadesNinosContainer = habitacionDiv.querySelector("#edades-ninos");

            // Validar y actualizar el total de personas al cambiar el número de adultos
            numAdultosInput.addEventListener("input", function () {
                const numAdultos = parseInt(numAdultosInput.value) || 0;
                if (numAdultos < 1) {
                    alert("Debe haber al menos un adulto en la habitación.");
                    numAdultosInput.value = 1;
                }
            });

            // Generar dinámicamente los campos para las edades de los niños
            numNinosInput.addEventListener("input", function () {
                const numNinos = parseInt(numNinosInput.value) || 0;
                edadesNinosContainer.innerHTML = ""; // Limpiar el contenedor

                if (numNinos > 4) {
                    alert("El número máximo de niños permitido es 4.");
                    numNinosInput.value = 0;
                    return;
                }

                for (let j = 1; j <= numNinos; j++) {
                    const label = document.createElement("label");
                    label.textContent = `Edad del niño ${j}:`;
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
            });
        }
    }

    // Generar una habitación por defecto al cargar la página
    generarHabitaciones(1);

    // Actualizar habitaciones cuando el usuario cambie el número de habitaciones
    numHabInput.addEventListener("input", function () {
        const numHab = parseInt(numHabInput.value) || 1;
        generarHabitaciones(numHab);
    });
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

    // Falta modificar bien las edades de los niños
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

// ------------------

// Evento para el botón de búsqueda
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#buscar-btn").addEventListener("click", function (e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado del botón
        const generatedURL = generateURL();
        // alert("URL generada: " + generatedURL);
        // console.log("Generated URL:", generatedURL);
        // window.location.href = generatedURL; // Redirigir al usuario a la URL generada
    });
});

