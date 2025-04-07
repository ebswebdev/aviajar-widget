// -------------------- TABS -------------------------

(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-aviajar');
        if (!widgetContainer) return;

        // Crear tabs para Paquetes, Vuelos, Hoteles, Renta de autos
        const tabs = document.createElement('div');
        tabs.className = 'tabs';
        tabs.innerHTML = `
            <div class="tab" id="tab-paquetes">
                <i class="fa fa-suitcase" aria-hidden="true"></i>
            </div>
            <div class="tab" id="tab-vuelos">
                <i class="fa fa-plane" aria-hidden="true"></i>
            </div>
            <div class="tab" id="tab-hoteles">
                <i class="fa fa-h-square" aria-hidden="true"></i>
            </div>
            <div class="tab" id="tab-autos">
                <i class="fa fa-car" aria-hidden="true"></i>
            </div>
            <div class="tab" id="tab-tours">
                <i class="fa fa-ticket-alt" aria-hidden="true"></i>
            </div>
        `;
        widgetContainer.appendChild(tabs);

        // Agregar evento de clic a cada tab
        const tabsList = document.querySelectorAll('.tab');
        tabsList.forEach(tab => {
            tab.addEventListener('click', function () {
                tabsList.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const selectedTab = this.id.replace('tab-', '');
                widgetContainer.setAttribute('selected-tab', selectedTab);
                console.log(`Selected tab: ${selectedTab}`);

                // TAB PAQUETES --------------------------------------------------
                // Si se selecciona paquetes en tabs, se asigna el atributo products a AirHotel
                if (widgetContainer.getAttribute('selected-tab') === 'paquetes') {
                    widgetContainer.setAttribute('products', 'AirHotel');
                } else {
                    widgetContainer.setAttribute('products', '');
                }

                // Renderizar el widget de paquetes
                if (document.getElementById('widget-package')) {
                    return; // Si el widget ya existe, no lo vuelvas a crear
                }
                // Sino, crearlo
                if (widgetContainer.getAttribute('products').includes("AirHotel")) {
                    const widgetPackage = document.createElement('div');
                    widgetPackage.id = 'widget-package';
                    widgetPackage.innerHTML = `
                    <div class="widget" id="widget-container">
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
                                        <select id="origen-id" style="display: none;"></select> <!-- Select oculto para guardar el ID -->
                                        <span class="icon"><i class="fas fa-plane-departure"></i></span>
                                    </div>
                                </div>
                                <div class="destino">
                                    <div class="input-group">
                                        <span class="label-input">DESTINO</span>
                                        <input id="destino" type="text" class="autocomplete-input" placeholder="Hacia dónde viajas" value="">
                                        <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                        <select id="destino-id" style="display: none;"></select> <!-- Select oculto para guardar el ID -->
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
                    // Renderizar paquetes
                    widgetContainer.appendChild(widgetPackage);
                    crearPopup(); // Crear el popup de habitaciones
                    botonBusqueda(); // Asignar el evento al botón de búsqueda
                    inicializarFlatpickr();
                    cargarAutocompletes()

                } else {
                    console.log("No existe");
                    return
                }

                // AQUI VAN OTROS TABS
            });
        });

        // let products = widgetContainer.getAttribute('products') || '';
        // let destination = widgetContainer.getAttribute('destination') || '';
    }
    document.addEventListener("DOMContentLoaded", createWidget);
})();


//  -------------- FUNCIONES AIRHOTEL ---------------

// -------------------- POPUP -----------------------

function crearPopup() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const numHabInput = document.querySelector("#num-hab");
    const popupNumHabInput = document.querySelector("#popup-num-hab");
    const habPopup = document.querySelector("#hab-popup");
    const closePopup = document.querySelector(".close-popup");
    const habitacionesContainer = document.querySelector("#hab-container");

    if (!numHabInput || !popupNumHabInput || !habPopup || !closePopup || !habitacionesContainer) return;

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
    document.querySelector("#accept-popup")?.addEventListener("click", function () {
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
    document.querySelector("#accept-popup")?.addEventListener("click", function () {
        let totalAdultos = 0;
        let totalNinos = 0;

        const habitaciones = document.querySelectorAll("#hab-container > div");
        habitaciones.forEach(habitacion => {
            const numAdultos = parseInt(habitacion.querySelector(".input-adultos input")?.value) || 0;
            const numNinos = parseInt(habitacion.querySelector(".input-ninos input")?.value) || 0;

            totalAdultos += numAdultos;
            totalNinos += numNinos;
        });

        // Update the num-per input with the total passengers
        document.querySelector("#num-per").value = totalAdultos + totalNinos;

        // Close the popup
        habPopup.style.display = "none";
    });

    // Abrir popup si hago click en el input #num-per
    const numPerInput = document.querySelector("#num-per");
    numPerInput?.addEventListener("click", function () {
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
                        <div class="input-adultos"></div>
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

            const inputAdultosContainer = habitacionDiv.querySelector(".input-adultos");
            inputAdultosContainer.innerHTML = ""; // Limpiar el contenedor

            const inputNinosContainer = habitacionDiv.querySelector(".input-ninos");
            inputNinosContainer.innerHTML = ""; // Limpiar el contenedor

            // Crear el contenedor de input numérico para adultos
            const numericInputAdultos = document.createElement("div");
            numericInputAdultos.className = "numeric-input";

            const decrementAdultos = document.createElement("button");
            decrementAdultos.className = "decrement";
            decrementAdultos.textContent = "-";

            const inputAdultos = document.createElement("input");
            inputAdultos.type = "number";
            inputAdultos.id = "numeric-value-adultos";
            inputAdultos.value = "1";
            inputAdultos.min = "1";
            inputAdultos.max = "7";

            const incrementAdultos = document.createElement("button");
            incrementAdultos.className = "increment";
            incrementAdultos.textContent = "+";

            numericInputAdultos.appendChild(decrementAdultos);
            numericInputAdultos.appendChild(inputAdultos);
            numericInputAdultos.appendChild(incrementAdultos);

            inputAdultosContainer.appendChild(numericInputAdultos);

            // Crear el contenedor de input numérico para niños
            const numericInputNinos = document.createElement("div");
            numericInputNinos.className = "numeric-input";

            const decrementNinos = document.createElement("button");
            decrementNinos.className = "decrement";
            decrementNinos.textContent = "-";

            const inputNinos = document.createElement("input");
            inputNinos.type = "number";
            inputNinos.id = "numeric-value-ninos";
            inputNinos.value = "0";
            inputNinos.min = "0";
            inputNinos.max = "4";

            const incrementNinos = document.createElement("button");
            incrementNinos.className = "increment";
            incrementNinos.textContent = "+";

            numericInputNinos.appendChild(decrementNinos);
            numericInputNinos.appendChild(inputNinos);
            numericInputNinos.appendChild(incrementNinos);

            inputNinosContainer.appendChild(numericInputNinos);

            const edadesNinosContainer = habitacionDiv.querySelector("#edades-ninos");

            // Generar dinámicamente los campos para las edades de los niños
            inputNinos.addEventListener("input", function () {
                const numNinos = parseInt(inputNinos.value) || 0;
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

            // Eventos para incrementar y decrementar adultos
            decrementAdultos.addEventListener("click", function () {
                let currentValue = parseInt(inputAdultos.value) || 1;
                if (currentValue > parseInt(inputAdultos.min)) {
                    inputAdultos.value = currentValue - 1;
                }
            });

            incrementAdultos.addEventListener("click", function () {
                let currentValue = parseInt(inputAdultos.value) || 1;
                if (currentValue < parseInt(inputAdultos.max)) {
                    inputAdultos.value = currentValue + 1;
                }
            });

            // Eventos para incrementar y decrementar niños
            decrementNinos.addEventListener("click", function () {
                let currentValue = parseInt(inputNinos.value) || 0;
                if (currentValue > parseInt(inputNinos.min)) {
                    inputNinos.value = currentValue - 1;
                    inputNinos.dispatchEvent(new Event("input"));
                }
            });

            incrementNinos.addEventListener("click", function () {
                let currentValue = parseInt(inputNinos.value) || 0;
                if (currentValue < parseInt(inputNinos.max)) {
                    inputNinos.value = currentValue + 1;
                    inputNinos.dispatchEvent(new Event("input"));
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

    // Crear el contenedor del input numérico
    const numericInputContainer = document.createElement("div");
    numericInputContainer.className = "numeric-input";

    // Crear el botón de decremento
    const decrementButton = document.createElement("button");
    decrementButton.className = "decrement";
    decrementButton.textContent = "-";

    // Crear el input numérico
    const numericInput = document.createElement("input");
    numericInput.type = "number";
    numericInput.id = "numeric-value";
    numericInput.value = "1";
    numericInput.min = "1";
    numericInput.max = "4";

    // Crear el botón de incremento
    const incrementButton = document.createElement("button");
    incrementButton.className = "increment";
    incrementButton.textContent = "+";

    // Agregar los elementos al contenedor
    numericInputContainer.appendChild(decrementButton);
    numericInputContainer.appendChild(numericInput);
    numericInputContainer.appendChild(incrementButton);

    // Reemplazar el input original con el nuevo contenedor
    popupNumHabInput.replaceWith(numericInputContainer);

    // Agregar eventos para manejar los cambios en el valor
    decrementButton.addEventListener("click", function () {
        let currentValue = parseInt(numericInput.value) || 1;
        if (currentValue > parseInt(numericInput.min)) {
            numericInput.value = currentValue - 1;
            document.querySelector("#num-hab").value = numericInput.value; // Sincronizar con el campo principal
            generarHabitaciones(numericInput.value); // Regenerar las habitaciones
        }
    });

    incrementButton.addEventListener("click", function () {
        let currentValue = parseInt(numericInput.value) || 1;
        if (currentValue < parseInt(numericInput.max)) {
            numericInput.value = currentValue + 1;
            document.querySelector("#num-hab").value = numericInput.value; // Sincronizar con el campo principal
            generarHabitaciones(numericInput.value); // Regenerar las habitaciones
        }
    });

    numericInput.addEventListener("input", function () {
        let currentValue = parseInt(numericInput.value) || 1;

        // Validar que el número esté dentro del rango permitido
        if (currentValue < parseInt(numericInput.min)) {
            numericInput.value = numericInput.min;
        } else if (currentValue > parseInt(numericInput.max)) {
            numericInput.value = numericInput.max;
        }

        document.querySelector("#num-hab").value = numericInput.value; // Sincronizar con el campo principal
        generarHabitaciones(numericInput.value); // Regenerar las habitaciones
    });
};

// ----------------- GENERAR URL ---------------------

// Crear la url
function generateURL() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;
    const host = "https://reservas.aviajarcolombia.com/";
    const culture = "es-CO";
    const productType = "Package";

    // Obtener valores del formulario
    const cityFrom = document.querySelector("#origen-id")?.value || ""; // Origen
    const cityTo = document.querySelector("#destino-id")?.value || ""; // Destino
    const dateRange = document.querySelector("#fecha-rango")?.value.split(" to ") || []; // Rango de fechas
    const dateFrom = dateRange[0] || ""; // Fecha de salida
    const dateTo = dateRange[1] || ""; // Fecha de llegada

    const passengersRoom = document.querySelector("#num-hab")?.value || "1"; // Número de habitaciones
    const baggageIncluded = document.querySelector("#checkbox-vequipaje")?.checked ? "true" : "false"; // Equipaje incluido
    const directFlight = document.querySelector("#checkbox-vdirecto")?.checked ? "true" : "false"; // Vuelo directo

    // Construir la información de habitaciones
    let roomInfo = [];
    let totalAdultos = 0;
    let totalNinos = 0;

    const habitaciones = document.querySelectorAll("#hab-container > div");
    habitaciones.forEach(habitacion => {
        const numAdultos = parseInt(habitacion.querySelector("#numeric-value-adultos")?.value || "1");
        const numNinos = parseInt(habitacion.querySelector("#numeric-value-ninos")?.value || "0");
        const edadesNinos = Array.from(habitacion.querySelectorAll(".edad-nino"))
            .map(select => select.value || "0")
            .join("-");

        totalAdultos += numAdultos;
        totalNinos += numNinos;

        if (numNinos > 0) {
            roomInfo.push(`${numAdultos}-${edadesNinos}`); // Formato: adultos-edadesNiños
        } else {
            roomInfo.push(`${numAdultos}`); // Solo adultos si no hay niños
        }
    });

    const roomInfoString = roomInfo.join("!"); // Separar habitaciones con "!"

    // Validar que todos los campos requeridos estén completos
    if (!cityFrom || !cityTo || !dateFrom || !dateTo) {
        console.error("Faltan parámetros obligatorios para generar la URL.");
        return null;
    }

    // Construir la URL final
    const url = `${host}${culture}/${productType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${totalAdultos}/${passengersRoom}/0/${dateFrom}/${dateTo}/${roomInfoString}/${baggageIncluded}/${directFlight}/NA/Economy/NA/aviajar-show-003---------#air`;

    console.log("Generated URL:", url);
    return url;
}

// -------------- BOTON DE BUSQUEDA ------------------

function botonBusqueda() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    document.querySelector("#buscar-btn").addEventListener("click", function (e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado del botón

        // Inicializar la variable valid
        let valid = true;

        // Obtener los valores de los campos
        const origenInput = document.querySelector("#origen");
        const destinoInput = document.querySelector("#destino");
        const fechaRangoInput = document.querySelector("#fecha-rango");
        const origenSelect = document.querySelector("#origen-id");
        const destinoSelect = document.querySelector("#destino-id");

        function showError(input) {
            // Resaltar el input con un borde rojo
            input.classList.add("input-error");
        }

        function clearError(input) {
            // Quitar el borde rojo del input
            input.classList.remove("input-error");
        }

        // Validar que se haya seleccionado un origen desde el autocompletado
        if (!origenSelect || !origenSelect.value) {
            showError(origenInput);
            valid = false;
        } else {
            clearError(origenInput);
        }

        // Validar que se haya seleccionado un destino desde el autocompletado
        if (!destinoSelect || !destinoSelect.value) {
            showError(destinoInput);
            valid = false;
        } else {
            clearError(destinoInput);
        }

        // Validar que el rango de fechas no esté vacío
        if (!fechaRangoInput.value) {
            showError(fechaRangoInput);
            valid = false;
        } else {
            clearError(fechaRangoInput);
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

    // Quitar la clase input-error cuando el usuario selecciona algo desde el autocompletado
    document.querySelector("#origen").addEventListener("input", function () {
        this.classList.remove("input-error");
    });

    document.querySelector("#destino").addEventListener("input", function () {
        this.classList.remove("input-error");
    });

    // Quitar la clase input-error cuando el rango de fechas cambie
    document.querySelector("#fecha-rango").addEventListener("change", function () {
        this.classList.remove("input-error");
    });
};

// ------------------- AUTOCOMPLETE ------------------

let airports = [];

// external_file_AirportsCities es un array de strings de ciudades y aeropuertos de un server
function autocompleteSearch(inputId, autocompleteListId, data) {
    const input = document.querySelector(inputId);
    const autocompleteList = document.querySelector(autocompleteListId);

    // Si necesitas manejar un hiddenSelect
    const hiddenSelectId = inputId === "#origen" ? "#origen-id" : "#destino-id";
    const hiddenSelect = document.querySelector(hiddenSelectId);

    // Función para normalizar cadenas (eliminar tildes)
    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    input.addEventListener("input", function () {
        const query = normalizeString(input.value.trim());
        autocompleteList.innerHTML = ""; // Limpiar la lista de sugerencias

        if (!query) {
            if (hiddenSelect) hiddenSelect.innerHTML = ""; // Limpiar el select si el input está vacío
            return;
        }

        // Filtrar las coincidencias en la lista de datos
        const filteredEntries = data
            // Por ahora lo oculto porque falta validar por que en medellin se pone eso
            .filter(entry => !entry.toLowerCase().includes("punto de partida")) // Excluir "punto de partida"
            .filter(entry => normalizeString(entry).includes(query)); // Coincidencias con la consulta normalizada

        // Mostrar las coincidencias en el autocompletado
        filteredEntries.forEach(entry => {
            // Dividir la entrada si contiene el carácter "|"
            const parts = entry.split(" | ");
            const displayText = parts.length > 1 ? parts[1] : entry; // Mostrar solo la segunda parte si existe

            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = displayText; // Mostrar solo la segunda parte
            const match = displayText.match(/\(([^)]+)\)$/); // Buscar el contenido entre paréntesis al final
            if (match) {
                const ids = match[1].split("-"); // Dividir el contenido por "-"
                if (ids.length > 1) {
                    item.textContent = `${displayText.replace(/\(.*?\)/, '').trim()} (${ids[1].trim()})`; // Mostrar el texto sin el primer paréntesis y agregar el segundo
                }
            }

            autocompleteList.appendChild(item);

            // Manejar el clic en una sugerencia
            item.addEventListener("click", function () {
                input.value = displayText; // Establecer el valor seleccionado en el input
                autocompleteList.innerHTML = ""; // Limpiar la lista de sugerencias

                // Extraer el ID del aeropuerto del texto seleccionado
                const match = entry.match(/\(([^)]+)\)$/); // Buscar el contenido entre paréntesis al final
                let id = match ? match[1] : ""; // Si hay coincidencia, extraer el contenido

                // Si el contenido tiene un guion "-", tomar solo el segundo ID
                if (id.includes("-")) {
                    id = id.split("-")[1].trim(); // Dividir y tomar solo el segundo ID
                }

                // Actualizar el hiddenSelect con el ID
                if (hiddenSelect) {
                    hiddenSelect.innerHTML = ""; // Limpiar el select
                    const option = document.createElement("option");
                    option.value = id; // Guardar el ID en el select
                    option.selected = true;
                    hiddenSelect.appendChild(option);
                }
                console.log('id', id); // Mostrar el ID en la consola
            });
        });
    });

    // Cerrar la lista de sugerencias si el usuario hace clic fuera
    document.addEventListener("click", function (e) {
        if (!autocompleteList.contains(e.target) && e.target !== input) {
            autocompleteList.innerHTML = ""; // Limpiar las sugerencias
        }
    });
}

// -------------------

// Flatpickr
function inicializarFlatpickr() {
    const fechaRango = document.querySelector("#fecha-rango");
    if (fechaRango && typeof flatpickr !== 'undefined') {
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
    } else {
        console.error("El input #fecha-rango no existe o Flatpickr no está cargado.");
    }
}

// Mostrar autocomplete
function cargarAutocompletes() {
    // Asegúrate de que external_file_AirportsCities esté definido antes de invocar
    if (typeof external_file_AirportsCities !== "undefined") {
        autocompleteSearch("#origen", "#autocomplete-list-origen", external_file_AirportsCities);
        autocompleteSearch("#destino", "#autocomplete-list-destino", external_file_AirportsCities);
    } else {
        console.error("external_file_AirportsCities no está definido.");
    }
};