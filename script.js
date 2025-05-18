// -------------------- TABS -------------------------

(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-net');
        if (!widgetContainer) return;

        // Leer products
        const products = widgetContainer
            .getAttribute('products')
            ?.replace(/[\[\]\s]/g, '') // Eliminar los corchetes "[" y "]" y los espacios en blanco
            .split(',') || [];
        console.log(products);

        const tabsConfig = {
            AirHotel: { id: 'paquetes', icon: 'fa-suitcase', text: 'Paquetes' },
            Air: { id: 'vuelos', icon: 'fa-plane', text: 'Vuelos' },
            Hotel: { id: 'hoteles', icon: 'fa-h-square', text: 'Hoteles' },
            Autos: { id: 'autos', icon: 'fa-car', text: 'Autos' },
            Extras: { id: 'tours', icon: 'fa-ticket-alt', text: 'Tours' }
        };



        // Crear las tabs dinámicamente según el atributo "products"
        const tabs = document.createElement('div');
        tabs.className = 'tabs';
        tabs.innerHTML = products
            .filter(product => tabsConfig[product]) // Filtrar solo los productos válidos
            .map(product => {
                const config = tabsConfig[product] || {};
                return `
                    <div class="tab" id="tab-${config.id}">
                        <i class="fa ${config.icon}" aria-hidden="true"></i>
                        <span class="tab-text"> ${config.text}</span>
                    </div>
                `;
            })
            .join('');
        if (products.length == 1) {
            tabs.style.display = "none";
        } else {
            tabs.style.display = "flex"
        }
        widgetContainer.appendChild(tabs);

        // Agregar evento de clic a cada tab
        const tabsList = document.querySelectorAll('.tab');
        tabsList.forEach(tab => {
            tab.addEventListener('click', function () {
                tabsList.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const selectedTab = this.id.replace('tab-', '');
                widgetContainer.setAttribute('selected-tab', selectedTab);

                // Cambiar el estilo del tab seleccionado
                this.style.backgroundColor = "#fff"; // Cambiar el fondo del tab seleccionado
                this.style.color = "#000"; // Cambiar el color del texto del tab seleccionado
                tabsList.forEach(t => {
                    if (t !== this) {
                        t.style.backgroundColor = ""; // Restaurar el fondo de los otros tabs
                        t.style.color = ""; // Restaurar el color del texto de los otros tabs
                    }
                });

                // Eliminar widgets existentes antes de crear uno nuevo
                const existingWidget = document.querySelector('#widget-container');
                if (existingWidget) {
                    existingWidget.remove();
                }

                // Crear el widget correspondiente al tab seleccionado
                createWidgetContent(selectedTab);
            });
        });

        // Seleccionar y renderizar el primer tab por defecto
        if (products.length > 0) {
            const firstTab = tabsList[0];
            firstTab.click(); // Simular clic en el primer tab
        }

        // Leer el atributo destination y actualizar el input destino
        const destination = widgetContainer.getAttribute('destination');
        if (destination) {
            setDestination(destination);
        }
    }

    function setDestination(destinationId) {
        const inputDestino = document.querySelector('#destino');
        const hiddenSelectDestino = document.querySelector('#destino-id');

        if (!inputDestino || !hiddenSelectDestino || typeof external_file_AirportsCities === 'undefined') {
            console.error('No se pudo configurar el destino. Verifica los elementos y datos.');
            return;
        }

        // Buscar el destino en la lista de datos
        const ciudadDestino = external_file_AirportsCities.find(entry => entry.includes(`(${destinationId})`));
        if (ciudadDestino) {
            // Extraer la ciudad del texto del autocompletado
            const parts = ciudadDestino.split(' | ');
            const displayText = parts.length > 1 ? parts[1] : ciudadDestino;

            // Actualizar el input y el hidden select
            inputDestino.value = displayText;
            inputDestino.disabled = true; // Deshabilitar el input
            hiddenSelectDestino.innerHTML = ''; // Limpiar el select
            const option = document.createElement('option');
            option.value = destinationId;
            option.selected = true;
            hiddenSelectDestino.appendChild(option);
        } else {
            console.warn(`No se encontró un destino con el ID: ${destinationId}`);
        }
    }


    // Llamar a la función después de cargar el widget
    // document.addEventListener("DOMContentLoaded", function () {
    //     toggleDestinoInput();
    // });

    function createWidgetContent(selectedTab) {
        const widgetContainer = document.getElementById('widget-net');
        if (!widgetContainer) return;

        // Eliminar todos los hijos excepto las tabs
        Array.from(widgetContainer.children).forEach(child => {
            if (!child.classList.contains('tabs')) {
                widgetContainer.removeChild(child);
            }
        });

        let widgetHTML = '';
        switch (selectedTab) {
            case 'paquetes':
                widgetHTML = `
                <div class="contenedor-widget">
                <div class="widget widget-package" id="widget-container">
                    <div class="widget-container package-container">

                        <div class="origen-destino">
                            <div class="origen">
                                <div class="input-group">
                                    <span class="label-input">ORIGEN</span>
                                    <input id="origen" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Desde dónde viajas" value=""
                                        onclick="this.select()">
                                    <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                    <select id="origen-id" style="display: none;"></select> <!-- Select oculto para guardar el ID -->
                                    <span class="icon"><i class="fas fa-plane-departure"></i></span>
                                </div>
                            </div>

                            <div class="destino">
                                <div class="input-group">
                                    <span class="label-input">DESTINO</span>
                                    <input id="destino" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Hacia dónde viajas" value=""
                                        onclick="this.select()">
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
                                    <input id="num-hab" type="number" min="1" value="1" readonly>
                                    <span class="icon"><i class="fas fa-bed"></i></span>
                                </div>
                            </div>
                            <div class="pasajeros">
                                <div class="input-group">
                                    <span class="label-input">PERSONAS</span>
                                    <input id="num-per" type="number" min="2" value="2" readonly>
                                    <span class="icon"><i class="fas fa-users"></i></span>
                                </div>
                            </div>
                            <div id="modal-error" class="modal" style="display: none;">
                                <div class="modal-content">
                                    <p>El número máximo de pasajeros permitidos es 7.</p>
                                </div>
                            </div>
                        </div>

                        <div id="hab-popup" class="popup">
                            <div class="popup-content">
                                <div id="hab-container"></div>
                                <div class="popup-header">
                                    <label for="popup-num-hab">¿Cuántas habitaciones?</label>
                                    <input id="popup-num-hab" type="number" min="1" max="20" value="1">
                                </div>
                                <div class="button-accept">
                                    <button id="accept-popup">Aceptar</button>
                                </div>
                            </div>
                        </div>

                        <div class="boton-buscar">
                            <div class="input-group">
                                <button id="buscar-btn-paquetes">Buscar</button>
                                <span class="icon"><i id="lupa-icon" class="fas fa-search"></i></span>
                            </div>
                        </div>
                        <div class="options-paq">
                            
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

                        <div class="descuento-container">
                            <a id="mostrar-descuento" href="#" style="cursor: pointer;">Código de descuento
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="descuento" style="display: none;">
                                <div class="codigo-descuento">
                                    <div class="input-group" id="input-descuento">
                                        <span id="texto-descuento" class="label-input">CÓDIGO DE DESCUENTO</span>
                                        <input id="codigo-descuento" type="text" placeholder="Ingresa tu código de descuento">
                                        <span class="icon"><i class="fas fa-tag"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    </div>
                    
                </div>
                </div>
                    `;
                // Paquetes
                crearPopupPaquetes();
                botonBusquedaPaquetes();

                break;

            case 'vuelos':
                widgetHTML = `
                <div class="widget" id="widget-container">
                        <div class="widget-container vuelos-container">

                            <div class="origen-destino">
                                <div class="origen">
                                    <div class="input-group">
                                        <span class="label-input">ORIGEN</span>
                                        <input id="origen" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Desde dónde viajas" value="" onclick="this.select()">
                                        <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                        <select id="origen-id" style="display: none;"></select> <!-- Select oculto para guardar el ID -->
                                        <span class="icon"><i class="fas fa-plane-departure"></i></span>
                                    </div>
                                </div>

                                <div class="destino">
                                    <div class="input-group">
                                        <span class="label-input">DESTINO</span>
                                        <input id="destino" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Hacia dónde viajas" value="" onclick="this.select()">
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
                                <div class="pasajeros">
                                    <div class="input-group">
                                        <span class="label-input">PASAJEROS Y CLASE</span>
                                        <input id="num-pasajeros" type="number" min="1" value="1" readonly>
                                        <span class="icon"><i class="fas fa-users"></i></span>
                                    </div>
                                </div>
                            </div>

                            <div id="pasajeros-popup" class="popup">
                                <div class="popup-content">
                                    <span class="close-popup">&times;</span>
                                    <div class="popup-header">
                                        <label id="title-pasajeros" for="popup-num-pasajeros">Número de Pasajeros</label>
                                    </div>
                                    <div id="pasajeros-container"></div>
                                    <div class="button-accept">
                                    <button id="accept-popup">Aceptar</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="options-air">
                                <div class="radio-group">
                                    <div class="radio">
                                        <input id="radio-idayregreso" type="radio" name="trip-type" value="idayregreso" checked>
                                        <label for="radio-idayregreso">Ida y regreso</label>
                                    </div>
                                    <div class="radio">
                                        <input id="radio-soloida" type="radio" name="trip-type" value="soloida">
                                        <label for="radio-soloida">Solo ida</label>
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
                                <div class="descuento-container">
                                    <a id="mostrar-descuento" href="#" style="cursor: pointer;">Código de descuento
                                        <i class="fas fa-chevron-down"></i>
                                    </a>
                                    <div class="descuento" style="display: none;">
                                        <div class="codigo-descuento">
                                            <div class="input-group" id="input-descuento">
                                                <span id="texto-descuento" class="label-input">CÓDIGO DE DESCUENTO</span>
                                                <input id="codigo-descuento" type="text" placeholder="Ingresa tu código de descuento">
                                                <span class="icon"><i class="fas fa-tag"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div class="boton-buscar">
                                <div class="input-group">
                                    <button id="buscar-btn-vuelos">Buscar</button>
                                    <span class="icon"><i id="lupa-icon" class="fas fa-search"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                break;

            case 'hoteles':
                widgetHTML = `
                <div class="widget" id="widget-container">
                        <div class="widget-container vuelos-container">
                            <div class="origen-destino">
                                <div class="destino destino-hotel">
                                    <div class="input-group">
                                        <span class="label-input">DESTINO</span>
                                        <input id="destino" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Hacia dónde viajas" value="">
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
                                        <input id="num-hab" type="number" min="1" value="1" readonly>
                                        <span class="icon"><i class="fas fa-bed"></i></span>
                                    </div>
                                </div>
                                <div class="pasajeros">
                                    <div class="input-group">
                                        <span class="label-input">PERSONAS</span>
                                        <input id="num-per" type="number" min="2" value="2" readonly>
                                        <span class="icon"><i class="fas fa-users"></i></span>
                                    </div>
                                </div>
                                <div id="modal-error" class="modal" style="display: none;">
                                    <div class="modal-content">
                                        <p>El número máximo de pasajeros permitidos es 7.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="hab-popup" class="popup">
                                <div class="popup-content">
                                    <div id="hab-container"></div>
                                    <div class="popup-header">
                                        <label for="popup-num-hab">¿Cuántas habitaciones?</label>
                                        <input id="popup-num-hab" type="number" min="1" max="20" value="1">
                                    </div>
                                    <div class="button-accept">
                                        <button id="accept-popup">Aceptar</button>
                                    </div>
                                </div>
                            </div>

                            <div class="options-hotel">
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
                                <div class="descuento-container">
                                    <a id="mostrar-descuento" href="#" style="cursor: pointer;">Código de descuento
                                        <i class="fas fa-chevron-down"></i>
                                    </a>
                                    <div class="descuento" style="display: none;">
                                        <div class="codigo-descuento">
                                            <div class="input-group" id="input-descuento">
                                                <span id="texto-descuento" class="label-input">CÓDIGO DE DESCUENTO</span>
                                                <input id="codigo-descuento" type="text" placeholder="Ingresa tu código de descuento">
                                                <span class="icon"><i class="fas fa-tag"></i></span>
                                            </div>
                                        </div>
                                    </div>
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


                break;

            case 'autos':
                widgetHTML = `
                <div class="widget" id="widget-container">
                        <div class="widget-container vuelos-container">
                            <div class="origen-destino">
                                <div class="origen">
                                    <div class="input-group">
                                        <span class="label-input">ORIGEN</span>
                                        <input id="origen" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Desde dónde viajas" value="">
                                        <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                        <select id="origen-id" style="display: none;"></select> <!-- Select oculto para guardar el ID -->
                                        <span class="icon"><i class="fas fa-plane-departure"></i></span>
                                    </div>
                                </div>
                                <div class="destino">
                                    <div class="input-group">
                                        <span class="label-input">DESTINO</span>
                                        <input id="destino" type="text" class="autocomplete-input" placeholder="(mín. 3 letras)Hacia dónde viajas" value="">
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
                                <div class="pasajeros">
                                    <div class="input-group">
                                        <span class="label-input">PASAJEROS Y CLASE</span>
                                        <input id="num-pasajeros" type="number" min="1" value="1" readonly>
                                        <span class="icon"><i class="fas fa-users"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div id="pasajeros-popup" class="popup">
                                <div class="popup-content">
                                    <span class="close-popup">&times;</span>
                                    <div class="popup-header">
                                        <label id="title-pasajeros" for="popup-num-pasajeros">Número de Pasajeros</label>
                                    </div>
                                    <div id="pasajeros-container"></div>
                                    <div class="button-accept">
                                    <button id="accept-popup">Aceptar</button>
                                    </div>
                                </div>
                            </div>
                            <div class="radio-group">
                                <div class="radio">
                                    <input id="radio-idayregreso" type="radio" name="trip-type" value="idayregreso" checked>
                                    <label for="radio-idayregreso">Ida y regreso</label>
                                </div>
                                <div class="radio">
                                    <input id="radio-soloida" type="radio" name="trip-type" value="soloida">
                                    <label for="radio-soloida">Solo ida</label>
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


                break;

            case 'tours':
                widgetHTML = `
                <div class="widget" id="widget-container">
                        <div class="widget-container vuelos-container">
                            <div class="origen-destino">
                                <div class="origen">
                                    <div class="input-group">
                                        <span class="label-input">ORIGEN</span>
                                        <input id="origen" type="text" class="autocomplete-input" placeholder="(mín. 3 letras) Desde dónde viajas" value="">
                                        <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                        <select id="origen-id" style="display: none;"></select> <!-- Select oculto para guardar el ID -->
                                        <span class="icon"><i class="fas fa-plane-departure"></i></span>
                                    </div>
                                </div>
                                <div class="destino">
                                    <div class="input-group">
                                        <span class="label-input">DESTINO</span>
                                        <input id="destino" type="text" class="autocomplete-input" placeholder="(mín. 3 letras)Hacia dónde viajas" value="">
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
                                <div class="pasajeros">
                                    <div class="input-group">
                                        <span class="label-input">PASAJEROS Y CLASE</span>
                                        <input id="num-pasajeros" type="number" min="1" value="1">
                                        <span class="icon"><i class="fas fa-users"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div id="pasajeros-popup" class="popup">
                                <div class="popup-content">
                                    <span class="close-popup">&times;</span>
                                    <div class="popup-header">
                                        <label id="title-pasajeros" for="popup-num-pasajeros">Número de Pasajeros</label>
                                    </div>
                                    <div id="pasajeros-container"></div>
                                    <div class="button-accept">
                                    <button id="accept-popup">Aceptar</button>
                                    </div>
                                </div>
                            </div>
                            <div class="radio-group">
                                <div class="radio">
                                    <input id="radio-idayregreso" type="radio" name="trip-type" value="idayregreso" checked>
                                    <label for="radio-idayregreso">Ida y regreso</label>
                                </div>
                                <div class="radio">
                                    <input id="radio-soloida" type="radio" name="trip-type" value="soloida">
                                    <label for="radio-soloida">Solo ida</label>
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


                break;

            default:
                widgetHTML = `<p>Widget no disponible</p>`;
        }

        widgetContainer.insertAdjacentHTML('beforeend', widgetHTML);

        // Inicializar funcionalidades específicas del widget
        inicializarFlatpickr();
        cargarAutocompletes();
        inicializarDescuento();
        ajustarWidget();

        // Restaurar el destino automático si existe
        const destination = widgetContainer.getAttribute('destination');
        if (destination) {
            setDestination(destination);
        }

        // Inicializar funcionalidades específicas del widget
        if (selectedTab === 'paquetes') {
            crearPopupPaquetes();
            botonBusquedaPaquetes();
        } else if (selectedTab === 'vuelos') {
            crearPopupVuelos();
            botonBusquedaVuelos();
        }

        // Invocar funcion cuando se cambia tamaño de pantalla (Para Testing)
        document.addEventListener("DOMContentLoaded", function () {
            window.addEventListener("resize", function () {
                inicializarFlatpickr(); // Reinicializar Flatpickr al cambiar el tamaño de la pantalla
            });
        });

        // Quitar la raya si el tab es hoteles
        const origenDestino = document.querySelector('.origen-destino');
        if (origenDestino) {
            if (selectedTab === 'hoteles') {
                origenDestino.classList.add('sin-raya');
            } else {
                origenDestino.classList.remove('sin-raya');
            }
        }
    }


    document.addEventListener("DOMContentLoaded", createWidget);
})();


// ------------ FUNCIONES GENERALES -------------------

// Codigo descuento
function inicializarDescuento() {
    const mostrarDescuento = document.querySelector("#mostrar-descuento");
    const codigoDescuentoDiv = document.querySelector(".descuento");

    if (mostrarDescuento && codigoDescuentoDiv) {
        mostrarDescuento.addEventListener("click", function (e) {
            e.preventDefault();
            if (codigoDescuentoDiv.style.display === "none" || codigoDescuentoDiv.style.display === "") {
                codigoDescuentoDiv.style.display = "block";
            } else {
                codigoDescuentoDiv.style.display = "none";
            }
        });
    }
}

function cargarEstilosSegunContenedor() {
    const widget = document.querySelector('#widget-net');
    if (!widget) {
        console.error('No se encontró el widget.');
        return;
    }

    // Buscar el primer ancestro cuyo ancho sea menor al viewport
    let contenedor = widget;
    while (
        contenedor.parentElement &&
        contenedor.parentElement !== document.body &&
        contenedor.parentElement.offsetWidth >= window.innerWidth - 1 // -1 por posibles decimales
    ) {
        contenedor = contenedor.parentElement;
    }

    // Si no se encontró un contenedor más pequeño, usar el widget
    const anchoContenedor = contenedor.offsetWidth;
    console.log(`Contenedor usado:`, contenedor);
    console.log(`Ancho del contenedor: ${anchoContenedor}px`);

    const existingLink = document.querySelector('#dynamic-styles');
    const nuevoArchivoCSS = anchoContenedor < 1165 ? 'styles-mobile.css' : 'styles.css';

    if (existingLink && existingLink.getAttribute('href') === nuevoArchivoCSS) {
        return;
    }
    if (existingLink) {
        existingLink.remove();
    }

    const link = document.createElement('link');
    link.id = 'dynamic-styles';
    link.rel = 'stylesheet';
    link.href = nuevoArchivoCSS;
    document.head.appendChild(link);

    console.log(`Cargado: ${nuevoArchivoCSS}`);
}

window.addEventListener('DOMContentLoaded', cargarEstilosSegunContenedor);
window.addEventListener('resize', cargarEstilosSegunContenedor);

// Ejecutar al cargar la página y al redimensionar
window.addEventListener('DOMContentLoaded', cargarEstilosSegunContenedor);
window.addEventListener('resize', cargarEstilosSegunContenedor);


// Autocomplete
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

        // Si el input tiene menos de 3 caracteres, no hacer nada
        if (query.length < 3) {
            if (hiddenSelect) hiddenSelect.innerHTML = ""; // Limpiar el select si el input está vacío o tiene pocos caracteres
            return;
        }

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

            // Determinar si es una ciudad o un aeropuerto
            const isCity = !entry.includes("-"); // Si no tiene -, es una ciudad
            const iconClass = isCity ? "fas fa-map-marker-alt" : "fas fa-plane"; // Icono de ciudad o avión

            // Crear el ícono
            const icon = document.createElement("i");
            icon.className = iconClass;
            icon.style.padding = "5px";

            const item = document.createElement("div");
            item.className = "autocomplete-item"
            item.textContent = displayText; // Mostrar solo la segunda parte
            const match = displayText.match(/\(([^)]+)\)$/); // Buscar el contenido entre paréntesis al final
            if (match) {
                const ids = match[1].split("-"); // Dividir el contenido por "-"
                if (ids.length > 1) {
                    item.textContent = `${displayText.replace(/\(.*?\)/, '').trim()} (${ids[1].trim()})`; // Mostrar el texto sin el primer paréntesis y agregar el segundo
                }
            }

            // Agregar el ícono 
            item.appendChild(icon);

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

// Flatpickr
function inicializarFlatpickr() {
    // Eliminar calendarios previos de Flatpickr
    document.querySelectorAll('.flatpickr-calendar').forEach(el => el.remove());

    const fechaRango = document.querySelector("#fecha-rango");
    if (fechaRango && typeof flatpickr !== 'undefined') {
        // Detectar el ancho de la pantalla
        const isMobile = window.innerWidth <= 768; // Considerar móvil si el ancho es menor o igual a 768px
        flatpickr("#fecha-rango", {
            mode: "range",
            dateFormat: "Y-m-d",
            showMonths: isMobile ? 1 : 2, // Mostrar 1 mes en móvil, 2 meses en escritorio
            minDate: "today", // Deshabilitar fechas anteriores a hoy
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                },
                months: {
                    shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Оct', 'Nov', 'Dic'],
                    longhand: ['Enero', 'Febreo', 'Мarzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                },
            },
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
        if (document.querySelector("#origen")) {
            autocompleteSearch("#origen", "#autocomplete-list-origen", external_file_AirportsCities);
        }
        if (document.querySelector("#destino")) {
            autocompleteSearch("#destino", "#autocomplete-list-destino", external_file_AirportsCities);
        }
    } else {
        console.error("external_file_AirportsCities no está definido.");
    }
}


//  -------------- FUNCIONES AIRHOTEL ---------------

// Popup
function crearPopupPaquetes() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const numHabInput = document.querySelector("#num-hab");
    const popupNumHabInput = document.querySelector("#popup-num-hab");
    const habPopup = document.querySelector("#hab-popup");
    const habitacionesContainer = document.querySelector("#hab-container");

    if (!numHabInput || !popupNumHabInput || !habPopup || !habitacionesContainer) return;

    // Asegúrate de que el contenedor padre tenga `position: relative`
    numHabInput.parentElement.style.position = "relative";

    // Mostrar el popup al hacer clic en el campo de habitaciones
    numHabInput.addEventListener("click", function () {
        habPopup.style.display = "flex"; // Mostrar el popup
        habPopup.classList.toggle("active"); // Mostrar/ocultar el modal
    });

    // Cerrar el popup al hacer click en el botón "Aceptar"
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

        // Actualizar el input de pasajeros con el total
        document.querySelector("#num-per").value = totalAdultos + totalNinos;

        // Remover la clase active para ocultar el popup
        habPopup.classList.remove("active");

        // Ocultar el popup
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
            inputAdultos.value = "2";
            inputAdultos.min = "1";
            inputAdultos.max = "7";
            inputAdultos.readOnly = true;


            const incrementAdultos = document.createElement("button");
            incrementAdultos.className = "increment";
            incrementAdultos.textContent = "+";

            numericInputAdultos.appendChild(decrementAdultos);
            numericInputAdultos.appendChild(inputAdultos);
            numericInputAdultos.appendChild(incrementAdultos);

            inputAdultosContainer.appendChild(numericInputAdultos);

            document.querySelector("#numeric-value-adultos").addEventListener("input", function () {
                const maxAdultos = 7; // Límite máximo de adultos
                let currentValue = parseInt(this.value) || 1;

                // Si el valor ingresado es mayor al máximo permitido, ajustarlo al máximo
                if (currentValue > maxAdultos) {
                    this.value = maxAdultos;
                }

                // Si el valor ingresado es menor al mínimo permitido, ajustarlo al mínimo
                if (currentValue < parseInt(this.min)) {
                    this.value = this.min;
                }
            });


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
            inputNinos.readOnly = true;

            // Registrar el evento input directamente en el elemento creado
            inputNinos.addEventListener("input", function () {
                const maxNinos = 4; // Límite máximo de niños
                let currentValue = parseInt(this.value) || 0;

                // Si el valor ingresado es mayor al máximo permitido, ajustarlo al máximo
                if (currentValue > maxNinos) {
                    this.value = maxNinos;
                }

                // Si el valor ingresado es menor al mínimo permitido, ajustarlo al mínimo
                if (currentValue < parseInt(this.min)) {
                    this.value = this.min;
                }
            });

            const incrementNinos = document.createElement("button");
            incrementNinos.className = "increment";
            incrementNinos.textContent = "+";

            numericInputNinos.appendChild(decrementNinos);
            numericInputNinos.appendChild(inputNinos);
            numericInputNinos.appendChild(incrementNinos);

            inputNinosContainer.appendChild(numericInputNinos);
            document.querySelector("#numeric-value-ninos").addEventListener("input", function () {
                const maxNinos = 4; // Límite máximo de niños
                let currentValue = parseInt(this.value) || 1;

                // Si el valor ingresado es mayor al máximo permitido, ajustarlo al máximo
                if (currentValue > maxNinos) {
                    this.value = maxNinos;
                }

                // Si el valor ingresado es menor al mínimo permitido, ajustarlo al mínimo
                if (currentValue < parseInt(this.min)) {
                    this.value = this.min;
                }
            });

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
    numericInput.readOnly = true;

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

    document.querySelector("#numeric-value").addEventListener("input", function () {
        const maxHab = 4; // Límite máximo de adultos
        let currentValue = parseInt(this.value) || 1;

        // Si el valor ingresado es mayor al máximo permitido, ajustarlo al máximo
        if (currentValue > maxHab) {
            this.value = maxHab;
        }

        // Si el valor ingresado es menor al mínimo permitido, ajustarlo al mínimo
        if (currentValue <= parseInt(this.min)) {
            this.value = this.min;
        }
    });

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

// Crear la url
function generateURLPaquetes() {
    const widgetContainer = document.getElementById('widget-container');
    const widgetAviajar = document.getElementById('widget-net');
    if (!widgetContainer) return;
    let culture = widgetAviajar.getAttribute('culture') || "es-CO";
    let host = widgetAviajar.getAttribute('host') || "https://reservas.aviajarcolombia.com/";
    let productType = widgetAviajar.getAttribute('productType') || "Package";

    // Leer los atributos userService y branchCode del HTML
    let userService = widgetAviajar.getAttribute('userService') || 'aviajar'; // Valor por defecto: "aviajar"
    let branchCode = widgetAviajar.getAttribute('branchCode') || '003'; // Valor por defecto: "003"

    // Obtener valores del formulario
    const cityFrom = document.querySelector("#origen-id")?.value || ""; // Origen
    const cityTo = document.querySelector("#destino-id")?.value || ""; // Destino
    const dateRange = document.querySelector("#fecha-rango")?.value.split(" al ") || []; // Rango de fechas
    const dateFrom = dateRange[0] || ""; // Fecha de salida
    const dateTo = dateRange[1] || dateFrom; // Fecha de llegada (igual a ida si no se selecciona otra)

    const passengersRoom = document.querySelector("#num-hab")?.value || "1"; // Número de habitaciones
    const baggageIncluded = document.querySelector("#checkbox-vequipaje")?.checked ? "true" : "false"; // Equipaje incluido
    const directFlight = document.querySelector("#checkbox-vdirecto")?.checked ? "true" : "false"; // Vuelo directo

    // Leer el código de descuento
    const discountCode = document.querySelector("#codigo-descuento")?.value || ""

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
    const url = `${host}${culture}/${productType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${totalAdultos}/${passengersRoom}/0/${dateFrom}/${dateTo}/${roomInfoString}/${baggageIncluded}/${directFlight}/NA/Economy/NA/${userService}-show-${branchCode}---------${discountCode}`;

    console.log("Generated URL:", url);
    return url;
}

// Boton busqueda

function botonBusquedaPaquetes() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    document.querySelector("#buscar-btn-paquetes").addEventListener("click", function (e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado del botón

        // Inicializar la variable valid
        let valid = true;

        // Obtener los valores de los campos
        const origenInput = document.querySelector("#origen");
        const destinoInput = document.querySelector("#destino");
        const fechaRangoInput = document.querySelector("#fecha-rango");
        const origenSelect = document.querySelector("#origen-id");
        const destinoSelect = document.querySelector("#destino-id");

        // Obtener el número total de pasajeros desde el campo #num-per
        const totalPasajeros = parseInt(document.querySelector("#num-per")?.value) || 0;


        // Validar que el número total de pasajeros no exceda el límite
        if (totalPasajeros > 7) {
            // Mostrar el modal
            const modal = document.querySelector("#modal-error");
            modal.style.display = "block";

            // Agregar un pequeño retraso para evitar que el evento de clic cierre el modal inmediatamente
            setTimeout(() => {
                document.addEventListener("click", function cerrarModal(e) {
                    const modalContent = document.querySelector(".modal-content");
                    if (!modalContent.contains(e.target)) {
                        modal.style.display = "none"; // Ocultar el modal
                        document.removeEventListener("click", cerrarModal); // Eliminar el evento después de cerrarlo
                    }
                });
            }, 100); // Retraso de 100 ms
        }

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

        // Si alguna validación falla, detener la ejecución
        if (!valid) {
            return; // Salir de la función si hay errores

        }
        // Si todos los campos son válidos, generar la URL
        else if (valid) {
            const generatedURL = generateURLPaquetes();
            // Redirigir al usuario a la URL generada
            window.location.href = generatedURL;


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

    document.querySelector("#fecha-rango").addEventListener("change", function () {
        if (document.querySelector("#fecha-rango").value.includes("to"))
            document.querySelector("#fecha-rango").value = document.querySelector("#fecha-rango").value.replace("to", "al")
    });

};


// //  -------------- FUNCIONES AIR ---------------

// Crear popup
function crearPopupVuelos() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const numPasajerosInput = document.querySelector("#num-pasajeros");
    const pasajerosPopup = document.querySelector("#pasajeros-popup");
    const closePopup = document.querySelector(".close-popup");
    const pasajerosContainer = document.querySelector("#pasajeros-container");

    if (!numPasajerosInput || !pasajerosPopup || !closePopup || !pasajerosContainer) return;

    // Mostrar el popup al hacer clic en el campo de pasajeros
    numPasajerosInput.addEventListener("click", function () {
        pasajerosPopup.style.display = "flex"; // Mostrar el popup
    });

    // Cerrar el popup al hacer clic en el botón de cierre
    closePopup.addEventListener("click", function () {
        pasajerosPopup.style.display = "none"; // Ocultar el popup
    });

    // Cerrar el popup al hacer clic fuera del contenido
    pasajerosPopup.addEventListener("click", function (e) {
        if (e.target === pasajerosPopup) {
            pasajerosPopup.style.display = "none"; // Ocultar el popup
        }
    });

    // Cerrar el popup al hacer clic en el botón "Aceptar"
    document.querySelector("#accept-popup")?.addEventListener("click", function () {
        let totalAdultos = parseInt(document.querySelector("#numeric-value-adultos")?.value) || 0;
        let totalNinos = parseInt(document.querySelector("#numeric-value-ninos")?.value) || 0;
        let totalInfantes = parseInt(document.querySelector("#numeric-value-infantes")?.value) || 0;

        // Actualizar el input de pasajeros con el total
        numPasajerosInput.value = totalAdultos + totalNinos + totalInfantes;

        // Ocultar el popup
        pasajerosPopup.style.display = "none";
    });

    // Crear el contenedor para adultos
    const adultosContainer = document.createElement("div");
    adultosContainer.className = "numeric-input-group";
    adultosContainer.innerHTML = `
        <label>Adultos:</label>
        <span class="info-text">12 o más años</span>
        <div class="numeric-input">
            <button class="decrement" id="decrement-adultos">-</button>
            <input type="number" id="numeric-value-adultos" value="1" min="1" max="10">
            <button class="increment" id="increment-adultos">+</button>
        </div>
    `;

    // Crear el contenedor para niños
    const ninosContainer = document.createElement("div");
    ninosContainer.className = "numeric-input-group";
    ninosContainer.innerHTML = `
        <label>Niños:</label>
        <span class="info-text">2 a 11 años</span>
        <div class="numeric-input">
            <button class="decrement" id="decrement-ninos">-</button>
            <input type="number" id="numeric-value-ninos" value="0" min="0" max="5">
            <button class="increment" id="increment-ninos">+</button>
        </div>
    `;

    // Crear el contenedor para infantes
    const infantesContainer = document.createElement("div");
    infantesContainer.className = "numeric-input-group";
    infantesContainer.innerHTML = `
        <label>Infantes:</label>
        <span class="info-text">0 a 23 meses</span>
        <div class="numeric-input">
            <button class="decrement" id="decrement-infantes">-</button>
            <input type="number" id="numeric-value-infantes" value="0" min="0" max="2">
            <button class="increment" id="increment-infantes">+</button>
        </div>
    `;

    // Limpiar el contenedor y agregar los nuevos elementos
    pasajerosContainer.innerHTML = "";
    pasajerosContainer.appendChild(adultosContainer);
    pasajerosContainer.appendChild(ninosContainer);
    pasajerosContainer.appendChild(infantesContainer);

    // Agregar eventos para manejar los botones de incremento y decremento
    document.querySelector("#decrement-adultos").addEventListener("click", function () {
        const inputAdultos = document.querySelector("#numeric-value-adultos");
        let currentValue = parseInt(inputAdultos.value) || 1;
        if (currentValue > parseInt(inputAdultos.min)) {
            inputAdultos.value = currentValue - 1;
        }
    });

    document.querySelector("#increment-adultos").addEventListener("click", function () {
        const inputAdultos = document.querySelector("#numeric-value-adultos");
        let currentValue = parseInt(inputAdultos.value) || 1;
        if (currentValue < parseInt(inputAdultos.max)) {
            inputAdultos.value = currentValue + 1;
        }
    });

    document.querySelector("#decrement-ninos").addEventListener("click", function () {
        const inputNinos = document.querySelector("#numeric-value-ninos");
        let currentValue = parseInt(inputNinos.value) || 0;
        if (currentValue > parseInt(inputNinos.min)) {
            inputNinos.value = currentValue - 1;
        }
    });

    document.querySelector("#increment-ninos").addEventListener("click", function () {
        const inputNinos = document.querySelector("#numeric-value-ninos");
        let currentValue = parseInt(inputNinos.value) || 0;
        if (currentValue < parseInt(inputNinos.max)) {
            inputNinos.value = currentValue + 1;
        }
    });

    document.querySelector("#decrement-infantes").addEventListener("click", function () {
        const inputInfantes = document.querySelector("#numeric-value-infantes");
        let currentValue = parseInt(inputInfantes.value) || 0;
        if (currentValue > parseInt(inputInfantes.min)) {
            inputInfantes.value = currentValue - 1;
        }
    });

    document.querySelector("#increment-infantes").addEventListener("click", function () {
        const inputInfantes = document.querySelector("#numeric-value-infantes");
        let currentValue = parseInt(inputInfantes.value) || 0;
        if (currentValue < parseInt(inputInfantes.max)) {
            inputInfantes.value = currentValue + 1;
        }
    });
}

// Generar URL
function generateURLVuelos() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;
    let culture = widgetAviajar.getAttribute('culture') || "es-CO";
    let host = widgetAviajar.getAttribute('host') || "https://reservas.aviajarcolombia.com/";
    let productType = widgetAviajar.getAttribute('productType') || "Air";

    // Leer los atributos userService y branchCode del HTML
    let userService = widgetAviajar.getAttribute('userService') || 'aviajar'; // Valor por defecto: "aviajar"
    let branchCode = widgetAviajar.getAttribute('branchCode') || '003'; // Valor por defecto: "003"

    // Determinar el tipo de viaje (RT: Ida y regreso, OW: Solo ida)
    const tripType = document.querySelector("#radio-soloida")?.checked ? "OW" : "RT";

    // Obtener valores del formulario
    const cityFrom = document.querySelector("#origen-id")?.value || ""; // Origen
    const cityTo = document.querySelector("#destino-id")?.value || ""; // Destino
    const dateRange = document.querySelector("#fecha-rango")?.value.split(" al ") || []; // Rango de fechas
    const dateFrom = dateRange[0] || ""; // Fecha de ida
    const dateTo = tripType === "RT" ? (dateRange[1] || "") : ""; // Fecha de regreso (solo si es RT)

    const numAdultos = parseInt(document.querySelector("#numeric-value-adultos")?.value) || 1; // Número de adultos
    const numNinos = parseInt(document.querySelector("#numeric-value-ninos")?.value) || 0; // Número de niños
    const numInfantes = parseInt(document.querySelector("#numeric-value-infantes")?.value) || 0; // Número de infantes

    const baggageIncluded = document.querySelector("#checkbox-vequipaje")?.checked ? "true" : "false"; // Equipaje incluido
    const directFlight = document.querySelector("#checkbox-vdirecto")?.checked ? "true" : "false"; // Vuelo directo

    // Validar que todos los campos requeridos estén completos
    if (!cityFrom || !cityTo || !dateFrom || (tripType === "RT" && !dateTo)) {
        console.error("Faltan parámetros obligatorios para generar la URL.");
        return null;
    }

    // Construir la URL final
    const url = `${host}${culture}/${productType}/${tripType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${numAdultos}/${numNinos}/${numInfantes}/NA/NA/NA/NA/NA/${baggageIncluded}/${directFlight}/${userService}-show-${branchCode}---------#air`;

    console.log("Generated URL:", url);
    return url;
}

// Botón de búsqueda
function botonBusquedaVuelos() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    document.querySelector("#buscar-btn-vuelos").addEventListener("click", function (e) {
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
            const generatedURL = generateURLVuelos();
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
}

function ajustarWidget() {
    const contenedor = document.querySelector('.contenedor-widget');
    if (!contenedor) return;
    const esEscritorio = window.innerWidth >= 1024;
    const contenedorEstrecho = contenedor.offsetWidth < 1000;

    contenedor.classList.toggle('widget-ajustado', esEscritorio && contenedorEstrecho);
}