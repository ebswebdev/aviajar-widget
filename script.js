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
                                <input id="popup-num-hab" type="number" min="1" max="20" value="1">
                            </div>
                            <div id="hab-container"></div>
                            <div class="button-accept">
                            <button id="accept-popup">Aceptar</button>
                            </div>
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

    // Cerrar el popup al hacer click en el botón
    document.querySelector("#accept-popup").addEventListener("click", function () {
        habPopup.style.display = "none"; // Ocultar el popup
    });

    // Limitar numero de habitaciones       
    popupNumHabInput.addEventListener("input", function () {
        let numHab = parseInt(popupNumHabInput.value);

        // Validar que el número esté dentro del rango permitido
        if (numHab < 1 || numHab > 20) {
            popupNumHabInput.value = 20;
            return;
        }

        popupNumHabInput.value = numHab; // Actualizar el valor en el input
        numHabInput.value = numHab; // Sincronizar con el campo principal
        generarHabitaciones(numHab); // Regenerar las habitaciones
    });

    // Actualizar numero de pasajeros desde el popup
    popupNumHabInput.addEventListener("input", function () {
        const numHab = parseInt(popupNumHabInput.value) || 1;
        numHabInput.value = numHab; // Sincronizar el valor con el campo principal
        generarHabitaciones(numHab); // Regenerar las habitaciones
    });

    // Sincronizar el número de pasajeros al cerrar el popup
    document.querySelector("#accept-popup").addEventListener("click", function () {
        let totalAdultos = 0;
        let totalNinos = 0;

        const habitaciones = document.querySelectorAll("#hab-container > div");
        habitaciones.forEach(habitacion => {
            const numAdultos = parseInt(habitacion.querySelector("#num-adultos").value) || 0;
            const numNinos = parseInt(habitacion.querySelector("#num-ninos").value) || 0;

            totalAdultos += numAdultos;
            totalNinos += numNinos;
        });

        document.querySelector("#num-per").value = totalAdultos + totalNinos; // Actualizar el total de pasajeros
    });

    // Abrir popup si hago click en el input #num-per
    const numPerInput = document.querySelector("#num-per");
    numPerInput.addEventListener("click", function () {
        habPopup.style.display = "flex"; // Mostrar el popup
    });


    // ---------------------


    // Función para generar habitaciones
    function generarHabitaciones(numHab) {
        habitacionesContainer.innerHTML = ""; // Limpiar el contenedor

        for (let i = 1; i <= numHab; i++) {
            const habitacionDiv = document.createElement("div");
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
                            <input id="num-adultos" type="number" min="1" value="1">
                            <span class="icon"><i class="fas fa-user"></i></span>
                        </div>
                    </div>
                    <div class="ninos">
                        <div class="label-ninos">
                            <label for="num-ninos">Niños:</label>
                        </div>
                        <div class="input-ninos"></div>
                    </div>
                    <div id="edades-ninos"></div>
                </div>
            `;

            habitacionesContainer.appendChild(habitacionDiv);

            // Seleccionar elementos dentro de esta habitación
            const numAdultosSelect = document.createElement("select");
            numAdultosSelect.id = "num-adultos";
            numAdultosSelect.className = "num-adultos-select";

            const numNinosSelect = document.createElement("select");
            numNinosSelect.id = "num-ninos";
            numNinosSelect.className = "num-ninos-select";

            // Generar opciones para el select (número de adultos de 1 a 7)
            for (let i = 1; i <= 7; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                numAdultosSelect.appendChild(option);
            }

            // Generar opciones para el select (número de niños de 0 a 4)
            for (let i = 0; i <= 4; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                numNinosSelect.appendChild(option);
            }

            const inputAdultosContainer = habitacionDiv.querySelector(".input-adultos");
            inputAdultosContainer.innerHTML = ""; // Limpiar el contenedor

            // Crear el ícono
            const iconoAdultos = document.createElement("span");
            iconoAdultos.className = "icon";
            iconoAdultos.innerHTML = `<i class="fas fa-user"></i>`;

            const inputNinosContainer = habitacionDiv.querySelector(".input-ninos");
            inputNinosContainer.innerHTML = ""; // Limpiar el contenedor

            // Crear el ícono
            const iconoNinos = document.createElement("span");
            iconoNinos.className = "icon";
            iconoNinos.innerHTML = `<i class="fas fa-child"></i>`;

            // Agregar el select y el ícono al contenedor
            inputAdultosContainer.appendChild(numAdultosSelect);
            inputAdultosContainer.appendChild(iconoAdultos);
            inputNinosContainer.appendChild(numNinosSelect);
            inputNinosContainer.appendChild(iconoNinos);

            const edadesNinosContainer = habitacionDiv.querySelector("#edades-ninos");

            // Generar dinámicamente los campos para las edades de los niños
            numNinosSelect.addEventListener("change", function () {
                const numNinos = parseInt(numNinosSelect.value) || 0;
                edadesNinosContainer.innerHTML = ""; // Limpiar el contenedor

                for (let j = 1; j <= numNinos; j++) {
                    const label = document.createElement("label");
                    label.textContent = `Edad del niño ${j}:`;

                    const select = document.createElement("select");
                    select.className = "edad-nino";
                    select.name = `edad-nino-${j}`;

                    // Generar opciones para el select (edades de 1 a 12)
                    for (let edad = 1; edad <= 12; edad++) {
                        const option = document.createElement("option");
                        option.value = edad;
                        option.textContent = edad;
                        select.appendChild(option);
                    }

                    edadesNinosContainer.appendChild(label);
                    edadesNinosContainer.appendChild(select);
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

    // Numero habitaciones
    const selectPopupNumHab = document.createElement("select");
    selectPopupNumHab.id = "popup-num-hab";
    selectPopupNumHab.className = "popup-num-hab-select";

    for (let i = 1; i <= 4; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectPopupNumHab.appendChild(option);
    }

    popupNumHabInput.replaceWith(selectPopupNumHab);

    // Agregar un evento para manejar los cambios en el select
    selectPopupNumHab.addEventListener("change", function () {
        const numHab = parseInt(selectPopupNumHab.value);
        document.querySelector("#num-hab").value = numHab; // Sincronizar con el campo principal
        generarHabitaciones(numHab); // Regenerar las habitaciones
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

    // Construir la información de habitaciones
    let roomInfo = [];
    const habitaciones = document.querySelectorAll("#hab-container > div");
    habitaciones.forEach(habitacion => {
        const numAdultos = habitacion.querySelector("#num-adultos").value || "1";
        const numNinos = habitacion.querySelector("#num-ninos").value || "0";
        const edadesNinos = Array.from(habitacion.querySelectorAll(".edad-nino"))
            .map(select => select.value || "0")
            .join("-");
        if (numNinos > 0) {
            roomInfo.push(`${numAdultos}-${edadesNinos}`);
        } else {
            roomInfo.push(`${numAdultos}`);
        }
    });

    // Unir la información de habitaciones con "!"
    let roomInfoString = roomInfo.join("!");
    // Obtener las edades de los niños
    let childrenAges = [];
    document.querySelectorAll(".edad-nino").forEach(input => {
        childrenAges.push(input.value || "");
    });

    // Incluir la información de habitaciones en la URL
    let url = `${host}${culture}/${productType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${passengersAdult}/${passengersRoom}/0/${timeFrom}/${timeTo}/${roomInfoString}/${baggageIncluded}/${directFlight}/${airline}/${cabinType}/${departureTime}/${userService}-show-${branchCode}---------#air`;

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
        window.location.href = generatedURL; // Redirigir al usuario a la URL generada
    });
});


