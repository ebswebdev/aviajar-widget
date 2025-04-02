(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-aviajar');
        if (!widgetContainer) return;

        const products = widgetContainer.getAttribute('products') || 'AirHotel,Air,Hotel,Extras';
        const destination = widgetContainer.getAttribute('destination') || '';

        widgetContainer.innerHTML = `
            <div class="widget">
                <div class="widget-header">
                    <div class="header">
                    <h3>Buscar Paquetes en Oferta</h3>
                    </div>
                </div>
                <div class="widget-container">
                    <div class="origen-destino">
                        <div class="origen">
                            <div class="input-group">
                                <span class="label-input">ORIGEN</span>
                                <input id="origen" type="text" class="autocomplete-input" placeholder="Desde dónde viajas" value="">
                                <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                <span class="icon"><i class="fas fa-plane-departure"></i></span>
                            </div>
                        </div>
                        <div class="destino">
                            <div class="input-group">
                                <span class="label-input">DESTINO</span>
                                <input id="destino" type="text" class="autocomplete-input" placeholder="Hacia dónde viajas" value="">
                                <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="fechas">
                    <div class="input-group">
                        <span class="label-input">FECHA</span>
                        <input id="fecha-rango" type="text" placeholder="Selecciona un rango de fechas">
                        <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                    </div>
                    </div>
                    <div class="habitaciones-pasajeros">
                        <div class="habitaciones">
                            <div class="input-group">
                                <span class="label-input">HABITACIONES</span>
                                <input id="num-hab" type="number" min="1" value="1">
                                <span class="icon"><i class="fas fa-bed"></i></span>
                            </div>
                        </div>
                        <div class="pasajeros">
                            <div class="input-group">
                                <span class="label-input">PERSONAS</span>
                                <input id="num-per" type="number" min="1" value="1">
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
                            <label for="checkbox-vequipaje">Solo vuelos con equipaje</label>
                        </div>
                        <div class="checkbox">
                            <input id="checkbox-vdirecto" type="checkbox">
                            <label for="checkbox-vdirecto">Solo vuelos directos</label>
                        </div>
                    </div>
                    <div class="boton-buscar">
                        <div class="input-group">
                            <button id="buscar-btn">Buscar</button>
                            <span class="icon"><i id="lupa-icon" class="fas fa-search"></i></span>
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
                minDate: "today", // Disable dates earlier than today
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
    let cityFrom = document.querySelector("#origen-id").value;
    let cityTo = document.querySelector("#destino-id").value; // Lugar de llegada
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

        // Obtener los valores de los campos
        const origenInput = document.querySelector("#origen");
        const destinoInput = document.querySelector("#destino");
        const fechaRangoInput = document.querySelector("#fecha-rango");
        const origenSelect = document.querySelector("#origen-id");
        const destinoSelect = document.querySelector("#destino-id");

        let valid = true;

        // Función para mostrar mensajes de error y resaltar el input
        function showError(input, message) {
            // Buscar o crear el contenedor de errores global
            let errorContainer = document.querySelector("#error-container");
            if (!errorContainer) {
                errorContainer = document.createElement("div");
                errorContainer.id = "error-container";
                errorContainer.style.marginTop = "16px";
                errorContainer.style.color = "red";
                errorContainer.style.fontSize = "14px";
                document.querySelector(".widget-container").appendChild(errorContainer); // Agregarlo después del formulario
            }

            // Crear un mensaje de error específico para el campo
            let fieldError = errorContainer.querySelector(`.error-${input.id}`);
            if (!fieldError) {
                fieldError = document.createElement("div");
                fieldError.className = `error-${input.id}`;
                errorContainer.appendChild(fieldError);
            }

            fieldError.textContent = message;

            // Cambiar el fondo del input a rojo
            input.classList.add("input-error");
        }

        // Función para limpiar mensajes de error y quitar el resaltado
        function clearError(input) {
            let errorContainer = document.querySelector("#error-container");
            if (errorContainer) {
                const fieldError = errorContainer.querySelector(`.error-${input.id}`);
                if (fieldError) {
                    fieldError.remove();
                }

                // Si no quedan errores, eliminar el contenedor de errores
                if (!errorContainer.hasChildNodes()) {
                    errorContainer.remove();
                }
            }

            // Quitar el fondo rojo del input
            input.classList.remove("input-error");
        }

        // Validar que se haya seleccionado un origen desde el autocompletado
        if (!origenSelect || !origenSelect.value) {
            showError(origenInput, "Por favor, selecciona un origen válido desde el autocompletado.");
            valid = false;
        } else {
            clearError(origenInput);
        }

        // Validar que se haya seleccionado un destino desde el autocompletado
        if (!destinoSelect || !destinoSelect.value) {
            showError(destinoInput, "Por favor, selecciona un destino válido desde el autocompletado.");
            valid = false;
        } else {
            clearError(destinoInput);
        }

        // Validar que el rango de fechas no esté vacío
        if (!fechaRangoInput.value) {
            fechaRangoInput.classList.add("input-error");
            valid = false;
        }

        // Si todos los campos son válidos, generar la URL
        if (valid) {
            const generatedURL = generateURL();
            // Redirigir al usuario a la URL generada
            window.location.href = generatedURL;
            // Limpiar basura del select origen y destino
            document.querySelectorAll("#origen-id, #destino-id").forEach(select => {
                const selectedOption = select.querySelector("option[selected]");
                if (!selectedOption) {
                    select.innerHTML = ""; // Limpiar si no hay opción seleccionada
                }
            });

            // Limpiar los inputs de origen, destino y fecha-rango
            origenInput.value = "";
            destinoInput.value = "";
            fechaRangoInput.value = "";
        }
    });

    // Quitar la clase input-error cuando el rango de fechas cambie
    document.querySelector("#fecha-rango").addEventListener("change", function () {
        this.classList.remove("input-error");
    });
});

// -------------------

// Autocomplete

let airports = []; // Declarar la variable 

if (typeof airportscity === "undefined") {
    console.error("No se encuentran las ciudades");
} else {
    airports = airportscity.map(entry => {
        // Dividir la entrada en partes usando el separador "|"
        const parts = entry.split("|").map(part => part.trim());

        if (parts.length === 1) {
            // Caso 1: Formato simple como "Ciudad, País (Código)"
            const match = parts[0].match(/^(.*), (.*) \((\w+)\)$/);
            if (match) {
                return { id: match[3], name: match[1], country: match[2] };
            }
        } else if (parts.length === 2) {
            // Caso 2: Formato "Todos aeropuertos | Ciudad, País (Código)"
            const match = parts[1].match(/^(.*), (.*) \((\w+)\)$/);
            if (match) {
                return { id: match[3], name: match[1], country: match[2] };
            }
        } else if (parts.length === 3) {
            // Caso 3: Formato "Ciudad | Detalles | Código"
            const match = parts[2].match(/\((\w+)\)$/);
            if (match) {
                return { id: match[1], name: parts[0].trim(), country: parts[1].trim() };
            }
        }

        // Si no coincide con ningún formato, devolver null
        return null;
    }).filter(Boolean); // Filtrar las entradas no válidas

    console.log(airports);
}

// Autocomplete Origen
document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#origen");
    const autocompleteList = document.createElement("div");
    autocompleteList.id = "autocomplete-list-origen"; // Updated ID
    autocompleteList.className = "autocomplete-list";
    input.parentNode.appendChild(autocompleteList);

    // Crear un select oculto para almacenar el ID
    const hiddenSelect = document.createElement("select");
    hiddenSelect.id = "origen-id";
    hiddenSelect.style.display = "none"; // Ocultar el select
    document.body.appendChild(hiddenSelect);

    // Escuchar el evento "input" para filtrar las sugerencias
    input.addEventListener("input", function () {
        const query = input.value.toLowerCase();
        autocompleteList.innerHTML = ""; // Limpiar la lista de sugerencias

        if (!query) {
            hiddenSelect.innerHTML = ""; // Limpiar el select si el input está vacío
            return;
        }

        // Filtrar las ciudades que coincidan con el texto ingresado
        const filteredCities = airports.filter(city =>
            city.name.toLowerCase().includes(query) || city.id.toLowerCase().includes(query) // Filtrar por país también
        );

        // Mostrar las sugerencias
        filteredCities.forEach((city) => {
            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = `${city.name}, ${city.country} (${city.id})`; // Combinar ciudad, país y código
            item.dataset.id = city.id; // Guardar el ID de la ciudad en un atributo de datos

            autocompleteList.appendChild(item);
        });
    });

    // Manejar el clic en una sugerencia
    autocompleteList.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("autocomplete-item")) {
            const city = e.target.dataset.id;
            input.value = e.target.textContent; // Mostrar toda la información en el input
            autocompleteList.innerHTML = ""; // Limpiar las sugerencias

            // Actualizar el select oculto con el ID seleccionado
            hiddenSelect.innerHTML = ""; // Limpiar el select
            const option = document.createElement("option");
            option.value = city;
            option.selected = true;
            hiddenSelect.appendChild(option);

            // Remover la clase de error del input
            input.classList.remove("input-error");

            // Ocultar el mensaje de error correspondiente
            const errorContainer = document.querySelector("#error-container");
            if (errorContainer) {
                const fieldError = errorContainer.querySelector(`.error-${input.id}`);
                if (fieldError) {
                    fieldError.remove();
                }
            }
        }
    });

    input.addEventListener("focus", function () {
        autocompleteList.classList.add("active"); // Activate the autocomplete list
    });

    input.addEventListener("blur", function () {
        setTimeout(() => autocompleteList.classList.remove("active"), 200); // Deactivate after a short delay
    });

    // Cerrar la lista de sugerencias si el usuario hace clic fuera
    document.addEventListener("click", function (e) {
        if (!autocompleteList.contains(e.target) && e.target !== input) {
            autocompleteList.innerHTML = ""; // Limpiar las sugerencias
        }
    });
});

// Automcomplete destino
document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#destino");
    const autocompleteList = document.createElement("div");
    autocompleteList.id = "autocomplete-list-destino"; // Updated ID
    autocompleteList.className = "autocomplete-list";
    input.parentNode.appendChild(autocompleteList);

    // Crear un select oculto para almacenar el ID del destino
    const hiddenSelect = document.createElement("select");
    hiddenSelect.id = "destino-id";
    hiddenSelect.style.display = "none"; // Ocultar el select
    document.body.appendChild(hiddenSelect);

    // Escuchar el evento "input" para filtrar las sugerencias
    input.addEventListener("input", function () {
        const query = input.value.toLowerCase();
        autocompleteList.innerHTML = ""; // Limpiar la lista de sugerencias

        if (!query) {
            hiddenSelect.innerHTML = ""; // Limpiar el select si el input está vacío
            return;
        }

        // Filtrar las ciudades que coincidan con el texto ingresado
        const filteredCities = airports.filter(city =>
            city.name.toLowerCase().includes(query) || city.id.toLowerCase().includes(query) // Filtrar por país también
        );

        // Mostrar las sugerencias
        filteredCities.forEach((city) => {
            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = `${city.name}, ${city.country} (${city.id})`; // Combinar ciudad, país y código
            item.dataset.id = city.id; // Guardar el ID de la ciudad en un atributo de datos

            autocompleteList.appendChild(item);
        });
    });

    // Manejar el clic en una sugerencia
    autocompleteList.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("autocomplete-item")) {
            const city = e.target.dataset.id;
            input.value = e.target.textContent; // Mostrar toda la información en el input
            autocompleteList.innerHTML = ""; // Limpiar las sugerencias

            // Actualizar el select oculto con el ID seleccionado
            hiddenSelect.innerHTML = ""; // Limpiar el select
            const option = document.createElement("option");
            option.value = city;
            option.selected = true;
            hiddenSelect.appendChild(option);

            // Remover la clase de error del input
            input.classList.remove("input-error");

            // Ocultar el mensaje de error correspondiente
            const errorContainer = document.querySelector("#error-container");
            if (errorContainer) {
                const fieldError = errorContainer.querySelector(`.error-${input.id}`);
                if (fieldError) {
                    fieldError.remove();
                }
            }
        }
    });

    input.addEventListener("focus", function () {
        autocompleteList.classList.add("active"); // Activate the autocomplete list
    });

    input.addEventListener("blur", function () {
        setTimeout(() => autocompleteList.classList.remove("active"), 200); // Deactivate after a short delay
    });

    // Cerrar la lista de sugerencias si el usuario hace clic fuera
    document.addEventListener("click", function (e) {
        if (!autocompleteList.contains(e.target) && e.target !== input) {
            autocompleteList.innerHTML = ""; // Limpiar las sugerencias
        }
    });
});
