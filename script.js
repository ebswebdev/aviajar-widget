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
            AirHotel: { id: 'paquetes', icon: 'fa-suitcase', img: 'https://aviajarcolombia.com/wp-content/uploads/2025/06/HOTEL.png', text: 'Paquetes' },
            Air: { id: 'vuelos', icon: 'fa-plane', img: 'https://aviajarcolombia.com/wp-content/uploads/2025/06/VUELOS.png', text: 'Vuelos' },
            Hotel: { id: 'hoteles', icon: 'fa-h-square', img: 'https://aviajarcolombia.com/wp-content/uploads/2025/06/HOTEL-1.png', text: 'Hoteles' },
            Autos: { id: 'autos', icon: 'fa-car', img: 'https://aviajarcolombia.com/wp-content/uploads/2025/06/AUTOS.png', text: 'Autos' },
            Extras: { id: 'tours', icon: 'fa-ticket-alt', img: 'https://aviajarcolombia.com/wp-content/uploads/2025/06/EXTRAS.png', text: 'Tours' }
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
                <img src="${config.img}" alt="${config.text}" class="tab-icon" style="width:24px;height:24px;vertical-align:middle;">
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

        // Leer los atributos destination y destinationName para pre-configurar destino
        const destination = widgetContainer.getAttribute('destination');
        const destinationName = widgetContainer.getAttribute('destinationName');

        if (destination && destinationName) {
            // Si ambos atributos están presentes, usar la nueva función
            console.log('✨ DETECTADOS ATRIBUTOS DE DESTINO PRE-CONFIGURADO:');
            console.log('   🆔 destination:', destination);
            console.log('   📍 destinationName:', destinationName);

            // Usar un timeout para asegurar que los elementos del widget estén creados
            setTimeout(() => {
                setDestinationFromHTML(destination, destinationName);
            }, 100);
        } else if (destination) {
            // Si solo está destination (método anterior), usar setDestination
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

    // Función para establecer destino pre-configurado desde HTML
    function setDestinationFromHTML(destinationCode, destinationName) {
        const inputDestino = document.querySelector('#destino');
        const hiddenSelectDestino = document.querySelector('#destino-id');

        if (!inputDestino || !hiddenSelectDestino) {
            console.warn('No se encontraron los elementos del destino');
            return;
        }

        if (!destinationCode || !destinationName) {
            console.warn('Faltan parámetros: destination y/o destinationName');
            return;
        }

        console.log('🎯 CONFIGURANDO DESTINO PRE-SELECCIONADO:');
        console.log('   🆔 Código (para URL):', destinationCode);
        console.log('   📍 Nombre (para mostrar):', destinationName);

        // Establecer el nombre en el input
        inputDestino.value = destinationName;
        inputDestino.disabled = true; // Deshabilitar el input para indicar que está preseleccionado
        inputDestino.style.backgroundColor = '#f5f5f5'; // Color gris suave para indicar que está deshabilitado
        inputDestino.style.cursor = 'not-allowed';

        // Establecer el código en el select oculto (esto es lo que se envía en la URL)
        hiddenSelectDestino.innerHTML = '';
        const option = document.createElement('option');
        option.value = destinationCode;
        option.selected = true;
        hiddenSelectDestino.appendChild(option);

        console.log('✅ Destino pre-configurado exitosamente');
    }

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
                                <span class="label-input" data-i18n="formulario.origen"></span>
                                <input id="origen" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.origenPlaceholder" value=""
                                    onclick="this.select()">
                                <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                <select id="origen-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-departure"></i></span>
                            </div>
                        </div>

                        <div class="destino">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.destino"></span>
                                <input id="destino" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.destinoPlaceholder" value=""
                                    onclick="this.select()">
                                <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                <select id="destino-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="fechas">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.fechas"></span>
                            <input id="fecha-rango" type="text" data-i18n-placeholder="formulario.fechasPlaceholder">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>

                    <div class="habitaciones-pasajeros">
                        <div class="habitaciones">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.habitaciones"></span>
                                <input id="num-hab" type="number" min="1" value="1" readonly>
                                <span class="icon"><i class="fas fa-bed"></i></span>
                            </div>
                        </div>
                        <div class="pasajeros">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.personas"></span>
                                <input id="num-per" type="number" min="2" value="2" readonly>
                                <span class="icon"><i class="fas fa-users"></i></span>
                            </div>
                        </div>
                        <div id="modal-error" class="modal" style="display: none;">
                            <div class="modal-content">
                                <p data-i18n="formulario.modalMaxPasajeros"></p>
                            </div>
                        </div>
                    </div>

                    <div id="hab-popup" class="popup">
                        <div class="popup-content">
                            <div id="hab-container"></div>
                            <div class="popup-header">
                                <label for="popup-num-hab" data-i18n="formulario.cuantasHabitaciones"></label>
                                <input id="popup-num-hab" type="number" min="1" max="20" value="1">
                            </div>
                            <div class="button-accept">
                                <button id="accept-popup" data-i18n="formulario.aceptar"></button>
                            </div>
                        </div>
                    </div>

                    <div class="boton-buscar">
                        <div class="input-group">
                            <button id="buscar-btn-paquetes" data-i18n="formulario.buscar"></button>
                            <span class="icon"><i id="lupa-icon" class="fas fa-search"></i></span>
                        </div>
                    </div>
                    <div class="options-paq">
                        
                    <div class="checkbox-group">
                        <div class="checkbox">
                            <input id="checkbox-vequipaje" type="checkbox">
                            <label for="checkbox-vequipaje" data-i18n="formulario.soloVuelosEquipaje"></label>
                        </div>
                        <div class="checkbox">
                            <input id="checkbox-vdirecto" type="checkbox">
                            <label for="checkbox-vdirecto" data-i18n="formulario.soloVuelosDirecto"></label>
                        </div>
                    </div>

                    <div class="descuento-container">
                        <div class="descuento-toggle">
                            <a id="mostrar-descuento" href="#" style="cursor: pointer;" data-i18n="formulario.codigoDescuento"></a>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="descuento" style="display: none;">
                            <div class="codigo-descuento">
                                <div class="input-group" id="input-descuento">
                                    <span id="texto-descuento" class="label-input" data-i18n="formulario.codigoDescuento"></span>
                                    <input id="codigo-descuento" type="text" data-i18n-placeholder="formulario.codigoDescuentoPlaceholder">
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
                crearPopupPaquetes();
                botonBusquedaPaquetes();
                break;

            case 'vuelos':
                widgetHTML = `
            <div class="widget" id="widget-container">
                <div class="widget-container vuelos-container">
                    <div class="radio-group">
                        <div class="radio">
                            <input id="radio-idayregreso" type="radio" name="trip-type" value="idayregreso" checked>
                            <label for="radio-idayregreso" data-i18n="vuelos.idaYRegreso"></label>
                        </div>
                        <div class="radio">
                            <input id="radio-soloida" type="radio" name="trip-type" value="soloida">
                            <label for="radio-soloida" data-i18n="vuelos.soloIda"></label>
                        </div>
                        <div class="radio">
                            <input id="radio-multidestino" type="radio" name="trip-type" value="multidestino">
                            <label for="radio-multidestino" data-i18n="vuelos.multiDestino"></label>
                        </div>
                    </div>

                    <div class="origen-destino">
                        <div class="origen">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.origen"></span>
                                <input id="origen" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.origenPlaceholder" value="" onclick="this.select()">
                                <div id="autocomplete-list-origen" class="autocomplete-list"></div>
                                <select id="origen-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-departure"></i></span>
                            </div>
                        </div>

                        <div class="destino">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.destino"></span>
                                <input id="destino" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.destinoPlaceholder" value="" onclick="this.select()">
                                <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                <select id="destino-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                            </div>
                        </div>
                    </div>

                    <div id="multidestino-placeholder" style="display:none;">
                        <button id="btn-agregar-tramo" style="display:none; margin:10px 0;" data-i18n="vuelos.agregarTramo"></button>
                    </div>
                    <div id="multidestino-tramos"></div>

                    <div class="fechas">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.fechas"></span>
                            <input id="fecha-rango" type="text" data-i18n-placeholder="formulario.fechasPlaceholder">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>

                    <div class="habitaciones-pasajeros">
                        <div class="pasajeros">
                            <div class="input-group">
                                <span class="label-input" data-i18n="vuelos.pasajerosYClase"></span>
                                <input id="num-pasajeros" type="number" min="1" value="1" readonly tabindex="-1" inputmode="none">
                            </div>
                        </div>
                    </div>

                    <div id="pasajeros-popup" class="popup">
                        <div class="popup-content">
                            <span class="close-popup">&times;</span>
                            <div class="popup-header">
                                <label id="title-pasajeros" for="popup-num-pasajeros" data-i18n="vuelos.numeroPasajeros"></label>
                            </div>
                            <div id="pasajeros-container"></div>
                            <div class="button-accept">
                                <button id="accept-popup" data-i18n="formulario.aceptar"></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="options-air">            
                        <div class="checkbox-group">
                            <div class="checkbox">
                                <input id="checkbox-vequipaje" type="checkbox">
                                <label for="checkbox-vequipaje" data-i18n="formulario.soloVuelosEquipaje"></label>
                            </div>
                            <div class="checkbox">
                                <input id="checkbox-vdirecto" type="checkbox">
                                <label for="checkbox-vdirecto" data-i18n="formulario.soloVuelosDirecto"></label>
                            </div>
                        </div>
                        <div class="descuento-container">
                            <div class="descuento-toggle">
                                <a id="mostrar-descuento" href="#" style="cursor: pointer;" data-i18n="formulario.codigoDescuento"></a>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="descuento" style="display: none;">
                                <div class="codigo-descuento">
                                    <div class="input-group" id="input-descuento">
                                        <span id="texto-descuento" class="label-input" data-i18n="formulario.codigoDescuento"></span>
                                        <input id="codigo-descuento" type="text" data-i18n-placeholder="formulario.codigoDescuentoPlaceholder">
                                        <span class="icon"><i class="fas fa-tag"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="boton-buscar">
                        <div class="input-group">
                            <button id="buscar-btn-vuelos" data-i18n="formulario.buscar"></button>
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
                <div class="widget-container hoteles-container">
                    <div class="origen-destino">
                        <div class="destino destino-hotel">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.destino"></span>
                                <input id="destino" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.destinoPlaceholder" value="">
                                <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                <select id="destino-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                            </div>
                        </div>
                    </div>

                    <div class="fechas">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.fechas"></span>
                            <input id="fecha-rango" type="text" data-i18n-placeholder="formulario.fechasPlaceholder">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>

                    <div class="habitaciones-pasajeros">
                        <div class="habitaciones">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.habitaciones"></span>
                                <input id="num-hab" type="number" min="1" value="1" readonly>
                                <span class="icon"><i class="fas fa-bed"></i></span>
                            </div>
                        </div>
                        <div class="pasajeros">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.personas"></span>
                                <input id="num-per" type="number" min="2" value="2" readonly>
                                <span class="icon"><i class="fas fa-users"></i></span>
                            </div>
                        </div>
                        <div id="modal-error" class="modal" style="display: none;">
                            <div class="modal-content">
                                <p data-i18n="formulario.modalMaxPasajeros"></p>
                            </div>
                        </div>
                    </div>

                    <div id="hab-popup" class="popup">
                        <div class="popup-content">
                            <div id="hab-container"></div>
                            <div class="popup-header">
                                <label for="popup-num-hab" data-i18n="formulario.cuantasHabitaciones"></label>
                                <input id="popup-num-hab" type="number" min="1" max="20" value="1">
                            </div>
                            <div class="button-accept">
                                <button id="accept-popup" data-i18n="formulario.aceptar"></button>
                            </div>
                        </div>
                    </div>

                    <div class="options-hotel">
                        <div class="descuento-container">
                            <div class="descuento-toggle">
                                <a id="mostrar-descuento" href="#" style="cursor: pointer;" data-i18n="formulario.codigoDescuento"></a>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="descuento" style="display: none;">
                                <div class="codigo-descuento">
                                    <div class="input-group" id="input-descuento">
                                        <span id="texto-descuento" class="label-input" data-i18n="formulario.codigoDescuento"></span>
                                        <input id="codigo-descuento" type="text" data-i18n-placeholder="formulario.codigoDescuentoPlaceholder">
                                        <span class="icon"><i class="fas fa-tag"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="boton-buscar">
                        <div class="input-group">
                            <button id="buscar-btn-hoteles" data-i18n="formulario.buscar"></button>
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
                <div class="widget-container autos-container">
                    <div class="lugar-retiro">
                        <div class="retiro">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.lugarRetiro"></span>
                                <input id="destino" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.lugarRetiroPlaceholder" value="">
                                <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                <select id="destino-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                            </div>
                        </div>
                    </div>

                    <div class="fechas fechas-cars">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.fechas"></span>
                            <input id="fecha-rango" type="text" data-i18n-placeholder="formulario.fechasPlaceholder">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>
                    
                    <div class="time-cars">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.retiro"></span>
                            <input id="time-retiro" type="text" placeholder="10:00" readonly>
                            <span class="icon icon-time"><i class="fas fa-clock"></i></span>
                        </div>
                    </div>
                    <div class="time-cars">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.entrega"></span>
                            <input id="time-entrega" type="text" placeholder="10:00" readonly>
                            <span class="icon icon-time"><i class="fas fa-clock"></i></span>
                        </div>
                    </div>

                    <div class="checkbox-tours" style="display: flex;">
                        <div class="input-group">
                            <input type="checkbox" id="devolver-otro-destino" style="margin-top: 10px;" />
                            <label for="devolver-otro-destino" style="display: inline; margin-left: 6px;" data-i18n="formulario.devolverOtroDestino">
                                Devolver en otro destino
                            </label>
                        </div>
                    </div>

                    <div class="options-cars">
                        <div class="descuento-container">
                            <div class="descuento-toggle">
                                <a id="mostrar-descuento" href="#" style="cursor: pointer;" data-i18n="formulario.codigoDescuento"></a>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="descuento" style="display: none;">
                                <div class="codigo-descuento">
                                    <div class="input-group" id="input-descuento">
                                        <span id="texto-descuento" class="label-input" data-i18n="formulario.codigoDescuento"></span>
                                        <input id="codigo-descuento" type="text" data-i18n-placeholder="formulario.codigoDescuentoPlaceholder">
                                        <span class="icon"><i class="fas fa-tag"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="boton-buscar">
                        <div class="input-group">
                            <button id="buscar-btn-cars" data-i18n="formulario.buscar"></button>
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
                <div class="widget-container tours-container">
                    <div class="destino-extras">
                        <div class="destino-tours">
                            <div class="input-group">
                                <span class="label-input" data-i18n="formulario.destino"></span>
                                <input id="destino" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.destinoPlaceholder" value="">
                                <div id="autocomplete-list-destino" class="autocomplete-list"></div>
                                <select id="destino-id" style="display: none;"></select>
                                <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                            </div>
                        </div>
                    </div>

                    <div class="fechas fechas-tours">
                        <div class="input-group">
                            <span class="label-input" data-i18n="formulario.fechas"></span>
                            <input id="fecha-rango" type="text" data-i18n-placeholder="formulario.fechasPlaceholder">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>

                    <div class="options-tours">
                        <div class="descuento-container">
                            <div class="descuento-toggle">
                                <a id="mostrar-descuento" href="#" style="cursor: pointer;" data-i18n="formulario.codigoDescuento"></a>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="descuento" style="display: none;">
                                <div class="codigo-descuento">
                                    <div class="input-group" id="input-descuento">
                                        <span id="texto-descuento" class="label-input" data-i18n="formulario.codigoDescuento"></span>
                                        <input id="codigo-descuento" type="text" data-i18n-placeholder="formulario.codigoDescuentoPlaceholder">
                                        <span class="icon"><i class="fas fa-tag"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="boton-buscar">
                        <div class="input-group">
                            <button id="buscar-btn-tours" data-i18n="formulario.buscar"></button>
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

        const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
        const lang = cultureAttr.split('-')[0]; // 'en', 'es', 'pt', etc.
        applyTranslations(lang);

        // Inicializar funcionalidades específicas del widget
        inicializarFlatpickr();
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
            cargarAutocompletePaquetes();

        } else if (selectedTab === 'vuelos') {
            crearPopupVuelos();
            botonBusquedaVuelos();
            inicializarFlatpickrVuelos();
            cargarAutocompletes();

        } else if (selectedTab === 'hoteles') {
            const widgetAviajar = document.getElementById('widget-net');
            let apiUrlBase = widgetAviajar.getAttribute('autocomplete-api') || "https://reservas.aviajarcolombia.com/NetCoreapi/AutocompleteDestinationStaticContent";
            let userServices = widgetAviajar.getAttribute('userService') || "aviajar";
            let cultureAttr = widgetAviajar.getAttribute('culture') || "es-CO";
            let lang = cultureAttr.split('-')[0];

            crearPopupHoteles();
            botonBusquedaHoteles();
            autocompleteHotelesCiudadesAPI(
                "#destino",
                "#autocomplete-list-destino",
                "#destino-id",
                apiUrlBase,
                userServices,
                lang
            );
        } else if (selectedTab === 'autos') {
            inicializarFlatpickrHorasAutos();
            botonBusquedaAutos();
            generarURLAutos();
            inicializarCheckboxOtroDestino();
            autocompleteSearchAutosV2(
                "#destino",
                "#autocomplete-list-destino",
                window.external_file_AirportsCities,
                window.external_file_Neighborhood,
                "#destino-id"
            );
        } else if (selectedTab === 'tours') {
            cargarAutocompletes();
            botonBusquedaTours();
            generarURLTours();
            autocompleteSearchCiudadesTours();
        }

        // Invocar funcion cuando se cambia tamaño de pantalla (Para Testing)
        document.addEventListener("DOMContentLoaded", function () {
            window.addEventListener("resize", function () {
                inicializarFlatpickr(); // Reinicializar Flatpickr al cambiar el tamaño de la pantalla
            });
        });

        if (selectedTab === 'vuelos') {
            // Multi-destino: mostrar botón y gestionar tramos
            const radioMulti = document.getElementById('radio-multidestino');
            const btnAgregarTramo = document.getElementById('btn-agregar-tramo');
            const tramosContainer = document.getElementById('multidestino-tramos');
            const radios = document.querySelectorAll('input[name="trip-type"]');
            const botonBuscar = document.querySelector('.boton-buscar');

            // Asegúrate de ocultar el botón al cargar
            btnAgregarTramo.style.display = (radioMulti && radioMulti.checked) ? 'inline-block' : 'none';

            radios.forEach(radio => {
                radio.addEventListener('change', function () {
                    const placeholder = document.getElementById('multidestino-placeholder');
                    if (radioMulti.checked) {
                        btnAgregarTramo.style.display = 'inline-block';
                        tramosContainer.style.display = 'block';
                        placeholder.style.display = 'flex';

                        // Mover los tramos al placeholder (donde estaban los inputs originales)
                        if (placeholder && !placeholder.contains(tramosContainer)) {
                            placeholder.appendChild(tramosContainer);
                        }

                        // Deshabilitar y ocultar inputs principales
                        document.querySelector("#origen").disabled = true;
                        document.querySelector("#destino").disabled = true;
                        document.querySelector("#origen-id").disabled = true;
                        document.querySelector("#destino-id").disabled = true;
                        document.querySelector("#fecha-rango").disabled = true;

                        // Ocultar los inputs originales
                        document.querySelector('.origen-destino').style.display = 'none';
                        document.querySelector('.fechas').style.display = 'none';

                        // Quitar errores visuales
                        document.querySelector("#origen").classList.remove("input-error");
                        document.querySelector("#destino").classList.remove("input-error");
                        document.querySelector("#fecha-rango").classList.remove("input-error");

                        // Generar 2 tramos automáticamente si no existen
                        if (tramosContainer.children.length < 2) {
                            tramosContainer.innerHTML = "";
                            crearTramo(1);
                            crearTramo(2);
                        }
                    } else {
                        btnAgregarTramo.style.display = 'none';
                        tramosContainer.style.display = 'none';
                        tramosContainer.innerHTML = '';
                        placeholder.style.display = 'none';

                        // Habilitar y mostrar inputs principales
                        document.querySelector("#origen").disabled = false;
                        document.querySelector("#destino").disabled = false;
                        document.querySelector("#origen-id").disabled = false;
                        document.querySelector("#destino-id").disabled = false;
                        document.querySelector("#fecha-rango").disabled = false;

                        // Mostrar los inputs originales
                        document.querySelector('.origen-destino').style.display = '';
                        document.querySelector('.fechas').style.display = '';

                        // Opcional: mover los tramos fuera del placeholder si quieres
                        document.getElementById('widget-container').appendChild(tramosContainer);
                    }
                });

                if (botonBuscar) {
                    if (radioMulti && radioMulti.checked) {
                        botonBuscar.classList.add('full-width');
                    } else {
                        botonBuscar.classList.remove('full-width');
                    }
                }
            });

            // Función para crear un tramo
            function crearTramo(idx) {
                const tramoDiv = document.createElement('div');
                tramoDiv.className = 'tramo';
                tramoDiv.style.marginBottom = '10px';
                tramoDiv.innerHTML = `
                    <div class="tramo-content">
                        <div class="input-tramo input-group">
                            <span class="label-input-tramo" data-i18n="formulario.origen"></span>
                            <input type="text" class="input-tramo-origen" data-i18n-placeholder="formulario.origenPlaceholder" id="input-tramo-origen-${idx}">
                            <div class="autocomplete-list" id="autocomplete-list-tramo-origen-${idx}"></div>
                            <select class="input-tramo-origen-id" style="display:none"></select>
                            <span class="icon"><i class="fas fa-plane-departure"></i></span>
                        </div>
                        <div class="input-tramo input-group">
                            <span class="label-input-tramo" data-i18n="formulario.destino"></span>
                            <input type="text" class="input-tramo-destino" data-i18n-placeholder="formulario.destinoPlaceholder" id="input-tramo-destino-${idx}">
                            <div class="autocomplete-list" id="autocomplete-list-tramo-destino-${idx}"></div>
                            <select class="input-tramo-destino-id" style="display:none"></select>
                            <span class="icon"><i class="fas fa-plane-arrival"></i></span>
                        </div>
                        <div class="input-tramo input-group">
                            <span class="label-input-tramo" data-i18n="formulario.fechas"></span>
                            <input type="text" class="input-tramo-fecha flatpickr-input" data-i18n-placeholder="formulario.fechasPlaceholder" id="input-tramo-fecha-${idx}" readonly="readonly">
                            <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                        <button type="button" class="btn-quitar-tramo" title="Quitar tramo" style="color:red;">×</button>
                    </div>
                `;


                // Quitar tramo
                tramoDiv.querySelector('.btn-quitar-tramo').onclick = () => tramoDiv.remove();
                tramosContainer.appendChild(tramoDiv);

                // Asignar IDs únicos
                const origenInput = tramoDiv.querySelector('.input-tramo-origen');
                const destinoInput = tramoDiv.querySelector('.input-tramo-destino');
                const fechaInput = tramoDiv.querySelector('.input-tramo-fecha');
                origenInput.id = `input-tramo-origen-${idx}`;
                destinoInput.id = `input-tramo-destino-${idx}`;
                fechaInput.id = `input-tramo-fecha-${idx}`;

                // Autocomplete para origen y destino
                if (typeof external_file_AirportsCities !== "undefined") {
                    autocompleteSearch(
                        `#${origenInput.id}`,
                        `#autocomplete-list-tramo-origen-${idx}`,
                        external_file_AirportsCities,
                        `select.input-tramo-origen-id`
                    );
                    autocompleteSearch(
                        `#${destinoInput.id}`,
                        `#autocomplete-list-tramo-destino-${idx}`,
                        external_file_AirportsCities,
                        `select.input-tramo-destino-id`
                    );
                }

                const fechaInput2 = tramoDiv.querySelector('.input-tramo-fecha');
                fechaInput2.id = `input-tramo-fecha-${idx}`;

                // Obtener la fecha del tramo anterior (si existe)
                let minDate = "today";
                if (idx > 1) {
                    const prevFechaInput = document.querySelector(`#input-tramo-fecha-${idx - 1}`);
                    if (prevFechaInput && prevFechaInput.value) {
                        minDate = prevFechaInput.value;
                    }
                }

                // Aplicar traducciones
                const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
                const lang = cultureAttr.split('-')[0];
                applyTranslations(lang);

                // Flatpickr para la fecha del tramo
                if (typeof flatpickr !== "undefined") {
                    const isMobile = window.innerWidth <= 768;
                    flatpickr(fechaInput2, {
                        dateFormat: "Y-m-d",
                        minDate: "today",
                        disableMobile: true,
                        showMonths: isMobile ? 1 : 2, // 1 mes en mobile, 2 en desktop
                        locale: {
                            firstDayOfWeek: 1,
                            weekdays: {
                                shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                            },
                            months: {
                                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                            },
                        },

                    });
                }

                if (idx > 1) {
                    const prevFechaInput = document.querySelector(`#input-tramo-fecha-${idx - 1}`);
                    if (prevFechaInput) {
                        prevFechaInput.addEventListener('change', function () {
                            const isMobile = window.innerWidth <= 768;
                            if (fechaInput2._flatpickr) fechaInput2._flatpickr.destroy();
                            flatpickr(fechaInput2, {
                                dateFormat: "Y-m-d",
                                minDate: prevFechaInput.value || "today",
                                disableMobile: true,
                                showMonths: isMobile ? 1 : 2,
                                locale: {
                                    firstDayOfWeek: 1,
                                    weekdays: {
                                        shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                                        longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                                    },
                                    months: {
                                        shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                        longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                                    },
                                }
                            });
                        });
                    }
                }

                // --- COPIAR DESTINO AL SIGUIENTE ORIGEN AL SALIR DEL INPUT ---
                const thisDestinoSelect = tramoDiv.querySelector('.input-tramo-destino-id');
                destinoInput.addEventListener('blur', copiarDestinoAOtroTramo);

                function copiarDestinoAOtroTramo() {
                    const nextTramo = tramosContainer.children[idx];
                    if (nextTramo) {
                        // Copiar el texto visible
                        const nextOrigenInput = nextTramo.querySelector('.input-tramo-origen');
                        if (nextOrigenInput) nextOrigenInput.value = destinoInput.value;

                        // Copiar el ID oculto
                        const nextOrigenSelect = nextTramo.querySelector('.input-tramo-origen-id');
                        if (nextOrigenSelect) {
                            nextOrigenSelect.innerHTML = "";
                            let id = "";
                            // 1. Si hay un option seleccionado en el select oculto, úsalo
                            let selectedOption = thisDestinoSelect.querySelector("option[selected]");
                            if (!selectedOption) selectedOption = thisDestinoSelect.querySelector("option");
                            if (selectedOption && selectedOption.value) {
                                id = selectedOption.value;
                            } else if (typeof external_file_AirportsCities !== "undefined") {
                                // 2. Si no hay option, intenta buscar el ID por el texto visible
                                const match = external_file_AirportsCities.find(entry => {
                                    const parts = entry.split(" | ");
                                    const displayText = parts.length > 1 ? parts[1] : entry;
                                    return displayText.trim().toLowerCase() === destinoInput.value.trim().toLowerCase();
                                });
                                if (match) {
                                    const matchId = match.match(/\(([^)]+)\)$/);
                                    if (matchId) id = matchId[1];
                                }
                            }
                            if (id) {
                                const newOption = document.createElement("option");
                                newOption.value = id;
                                newOption.selected = true;
                                nextOrigenSelect.appendChild(newOption);
                                nextOrigenSelect.dispatchEvent(new Event('change'));
                            }
                        }
                    }
                }
            }

            function actualizarMinDatesTramos() {
                const tramos = Array.from(document.querySelectorAll('.tramo'));
                for (let i = 1; i < tramos.length; i++) {
                    const prevFechaInput = tramos[i - 1].querySelector('.input-tramo-fecha');
                    const currFechaInput = tramos[i].querySelector('.input-tramo-fecha');
                    if (currFechaInput && currFechaInput._flatpickr) {
                        let minDate = "today";
                        if (prevFechaInput && prevFechaInput.value) {
                            minDate = prevFechaInput.value;
                        }
                        currFechaInput._flatpickr.set('minDate', minDate);
                    }
                }
            }

            // Agregar tramo al hacer clic
            btnAgregarTramo.addEventListener('click', function () {
                if (tramosContainer.children.length >= 6) {
                    return;
                }
                crearTramo(tramosContainer.children.length + 1);
                actualizarMinDatesTramos(); // <-- Llama aquí

                // Hacer focus en el penúltimo tramo (el recién creado es el último)
                if (tramosContainer.children.length > 1) {
                    const penultimoTramo = tramosContainer.children[tramosContainer.children.length - 2];
                    if (penultimoTramo) {
                        const penultimoDestinoInput = penultimoTramo.querySelector('.input-tramo-destino');
                        if (penultimoDestinoInput) {
                            penultimoDestinoInput.focus();
                            penultimoDestinoInput.blur(); // Quitar foco para activar el trigger de cambio
                        }
                    }
                }
            });
        }

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

    function inicializarFlatpickrHorasAutos() {
        if (typeof flatpickr === "undefined") return;

        const timeRetiro = document.getElementById("time-retiro");
        const timeEntrega = document.getElementById("time-entrega");

        if (timeRetiro && timeRetiro._flatpickr) {
            timeRetiro._flatpickr.destroy();
            timeRetiro.type = "text";
        }
        if (timeEntrega && timeEntrega._flatpickr) {
            timeEntrega._flatpickr.destroy();
            timeEntrega.type = "text";
        }

        flatpickr("#time-retiro", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultDate: "10:00",
            disableMobile: true,
            allowInput: false
        });

        flatpickr("#time-entrega", {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultDate: "10:00",
            disableMobile: true,
            allowInput: false
        });

        document.addEventListener("mousedown", function (e) {
            if (
                timeRetiro &&
                timeRetiro._flatpickr &&
                !timeRetiro.contains(e.target) &&
                !document.querySelector(".flatpickr-calendar")?.contains(e.target)
            ) {
                timeRetiro._flatpickr.close();
            }
            if (
                timeEntrega &&
                timeEntrega._flatpickr &&
                !timeEntrega.contains(e.target) &&
                !document.querySelector(".flatpickr-calendar")?.contains(e.target)
            ) {
                timeEntrega._flatpickr.close();
            }
        });
    }



    document.addEventListener("DOMContentLoaded", createWidget);
})();


window.addEventListener('DOMContentLoaded', cargarEstilosSegunContenedor);
window.addEventListener('resize', cargarEstilosSegunContenedor);

// Ejecutar al cargar la página y al redimensionar
window.addEventListener('DOMContentLoaded', cargarEstilosSegunContenedor);
window.addEventListener('resize', cargarEstilosSegunContenedor);


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

// Autocomplete para paquetes & vuelo 
let airports = [];

// API function para autocompletado
function GetOptionsFromServer(searchValue, userservices, lang, autoCompleteSCUrl, countryCode, callback) {
    var url = "";

    if (autoCompleteSCUrl != undefined && autoCompleteSCUrl != null && autoCompleteSCUrl != "") {
        if (autoCompleteSCUrl[autoCompleteSCUrl.length - 1] != "/")
            autoCompleteSCUrl += "/"

        if (searchValue != undefined && searchValue != null && searchValue != "")
            url = autoCompleteSCUrl + "?query=" + searchValue + "&lang=" + lang + "&limit=10&country=" + countryCode.toLowerCase() + "&userservice=" + userservices;
    }
    else {
        url = "https://reservas.aviajarcolombia.com/NetCoreapi/AutocompleteDestinationStaticContent?searchCriteria=" + searchValue + "&userServices=" + userservices + "&lang=" + lang;
    }

    var settings = {
        "url": url,
        "method": "GET",
    };

    // Usar fetch en lugar de jQuery
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => {
            console.error('Error en API autocompletado:', error);
            callback(null);
        });
}

function autocompleteSearch(inputId, autocompleteListId, data, hiddenSelectId, soloCiudades = false) {
    const input = document.querySelector(inputId);
    const autocompleteList = document.querySelector(autocompleteListId);
    const hiddenSelect = hiddenSelectId
        ? input.parentElement.querySelector(hiddenSelectId)
        : (inputId === "#origen" ? document.querySelector("#origen-id") : document.querySelector("#destino-id"));

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
        let filteredEntries = data
            .filter(entry => !entry.toLowerCase().includes("punto de partida"))
            .filter(entry => normalizeString(entry).includes(query));

        // Filtrar si se necesitan solo ciudades (Tours)
        if (soloCiudades) {
            filteredEntries = filteredEntries.filter(entry => !entry.includes("-"));
        }

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

                // Poner foco y quitarlo, para activar el trigger
                input.focus();
                input.blur();
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

// Autocompletado específico para paquetes usando API
function cargarAutocompletePaquetes() {
    const widgetAviajar = document.getElementById('widget-net');
    const userService = widgetAviajar.getAttribute('userService') || 'aviajar';
    const culture = widgetAviajar.getAttribute('culture') || 'es-CO';
    const lang = culture.split('-')[0]; // 'es', 'en', 'pt'
    const countryCode = culture.split('-')[1] || 'CO'; // 'CO', 'US', etc.

    // URL base de la API - puedes configurarla como atributo del widget si es necesario
    const autoCompleteSCUrl = widgetAviajar.getAttribute('autocomplete-api') || "";

    // ORIGEN: Usar autocompletado normal (como vuelos) - códigos cortos tipo MDE
    if (document.querySelector("#origen") && typeof external_file_AirportsCities !== "undefined") {
        autocompleteSearch("#origen", "#autocomplete-list-origen", external_file_AirportsCities, "#origen-id");
    }

    // DESTINO: Usar API autocompletado - códigos tipo h-39938
    if (document.querySelector("#destino")) {
        setupAPIAutocomplete("#destino", "#autocomplete-list-destino", "#destino-id", userService, lang, autoCompleteSCUrl, countryCode);
    }
}

// Función para configurar autocompletado con API
function setupAPIAutocomplete(inputSelector, listSelector, hiddenSelectSelector, userService, lang, autoCompleteSCUrl, countryCode) {
    const input = document.querySelector(inputSelector);
    const autocompleteList = document.querySelector(listSelector);
    const hiddenSelect = document.querySelector(hiddenSelectSelector);

    if (!input || !autocompleteList) return;

    let searchTimeout;

    input.addEventListener("input", function () {
        const searchValue = input.value.trim();

        // Limpiar timeout anterior
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Limpiar lista
        autocompleteList.innerHTML = "";

        // Si hay menos de 3 caracteres, no buscar
        if (searchValue.length < 3) {
            if (hiddenSelect) hiddenSelect.innerHTML = "";
            return;
        }

        // Debounce: esperar 300ms antes de hacer la búsqueda
        searchTimeout = setTimeout(() => {
            GetOptionsFromServer(searchValue, userService, lang, autoCompleteSCUrl, countryCode, function (response) {
                if (!response) return;

                // Limpiar lista anterior
                autocompleteList.innerHTML = "";

                // Procesar respuesta de la API
                const locations = response.Locations || response.locations || [];
                const hotels = response.Hotels || response.hotels || [];

                // Combinar ciudades y hoteles
                const allOptions = [...locations, ...hotels];

                allOptions.forEach(item => {
                    // Determinar si es ciudad o hotel
                    const isCity = item.Name !== undefined; // Las ciudades tienen "Name", los hoteles "hotel_name"
                    const displayName = isCity ? item.Name : item.hotel_name;
                    const subtitle = isCity ? (item.NameFull || "") : (item.address || "");
                    const itemId = item.Id || item.id;
                    const iconClass = isCity ? "fas fa-map-marker-alt" : "fas fa-building";

                    // Crear elemento de la lista
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "autocomplete-item";

                    itemDiv.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <i class="${iconClass}" style="padding: 5px; margin-right: 8px;"></i>
                            <div>
                                <div style="font-weight: 500;">${displayName}</div>
                                ${subtitle ? `<div style="font-size: 12px; color: #666;">${subtitle}</div>` : ""}
                            </div>
                        </div>
                    `;

                    // Evento clic
                    itemDiv.addEventListener("click", function () {
                        input.value = displayName;
                        autocompleteList.innerHTML = "";

                        // Actualizar select oculto con el código correcto
                        if (hiddenSelect) {
                            hiddenSelect.innerHTML = "";
                            const option = document.createElement("option");
                            // Para hoteles usar "h-ID", para ciudades usar "l-ID" (formato: letra-id)  
                            option.value = (isCity ? "l" : "h") + "-" + itemId;
                            option.selected = true;
                            hiddenSelect.appendChild(option);
                        }

                        console.log("Seleccionado:", displayName, "ID:", (isCity ? "l" : "h") + "-" + itemId, "Tipo:", isCity ? "ciudad" : "hotel");
                    });

                    autocompleteList.appendChild(itemDiv);
                });
            });
        }, 300);
    });

    // Cerrar lista al hacer clic fuera
    document.addEventListener("click", function (e) {
        if (!autocompleteList.contains(e.target) && e.target !== input) {
            autocompleteList.innerHTML = "";
        }
    });
}


let translations = {};

async function loadTranslations(lang = "es") {
    try {
        const res = await fetch("https://aviajarcolombia.com/widget3.0/data.json");
        // const res = await fetch("data.json");
        if (res.ok) {
            translations = await res.json();
        } else {
            console.warn("Failed to load translations from server, using default empty object");
            translations = {};
        }
        setLanguage(lang);
    } catch (e) {
        console.error("No se pudo cargar data.json", e);
        // Ensure translations is always at least an empty object
        translations = {};
        setLanguage(lang);
    }
}

function applyTranslations(lang = "es") {
    const t = translations[lang] || translations["es"] || {};
    // Traduce textos
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const value = key.split('.').reduce((o, i) => o?.[i], t);
        if (value) el.textContent = value;
    });
    // Traduce placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = key.split('.').reduce((o, i) => o?.[i], t);
        if (value) el.setAttribute("placeholder", value);
    });
}

function setLanguage(lang = "es") {
    applyTranslations(lang);
    const t = translations[lang] || translations["es"] || {};
    // Traducir tabs
    if (t.productos) {
        if (document.querySelector("#tab-vuelos .tab-text")) document.querySelector("#tab-vuelos .tab-text").textContent = t.productos.vuelos;
        if (document.querySelector("#tab-hoteles .tab-text")) document.querySelector("#tab-hoteles .tab-text").textContent = t.productos.hoteles;
        if (document.querySelector("#tab-paquetes .tab-text")) document.querySelector("#tab-paquetes .tab-text").textContent = t.productos.paquetes;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Detecta el idioma desde el atributo language
    const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
    const lang = cultureAttr.split('-')[0]; // 'en', 'es', 'pt', etc.
    loadTranslations(lang);
});

//  -------------- FUNCIONES AIRHOTEL ---------------

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

        const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
        const lang = cultureAttr.split('-')[0]; // 'en', 'es', 'pt', etc.

        for (let i = 1; i <= numHab; i++) {
            const habitacionDiv = document.createElement("div");
            habitacionDiv.innerHTML = `
                <div class="habitacion-header">
                    <h4><span data-i18n="formulario.habitacion"></span> ${i}</h4>
                    <span class="icon"><i class="fas fa-bed"></i></span>
                </div>
                <div class="habitacion">
                    <div class="adultos">
                        <div class="label-adultos">
                            <label for="num-adultos"><span data-i18n="formulario.adultos"></span>:</label>
                        </div>
                        <div class="input-adultos"></div>
                    </div>
                    <div class="ninos">
                        <div class="label-ninos">
                            <label for="num-ninos"><span data-i18n="formulario.ninos"></span>:</label>
                        </div>
                        <div class="input-ninos"></div>
                    </div>
                    <div id="edades-ninos"></div>
                </div>
            `;

            habitacionesContainer.appendChild(habitacionDiv);

            // Traducir los textos recién insertados
            applyTranslations(lang);

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
            inputAdultos.max = "15";
            inputAdultos.readOnly = true;

            const incrementAdultos = document.createElement("button");
            incrementAdultos.className = "increment";
            incrementAdultos.textContent = "+";

            numericInputAdultos.appendChild(decrementAdultos);
            numericInputAdultos.appendChild(inputAdultos);
            numericInputAdultos.appendChild(incrementAdultos);

            inputAdultosContainer.appendChild(numericInputAdultos);

            document.querySelector("#numeric-value-adultos").addEventListener("input", function () {
                const maxAdultos = 15;
                let currentValue = parseInt(this.value) || 1;
                if (currentValue > maxAdultos) this.value = maxAdultos;
                if (currentValue < parseInt(this.min)) this.value = this.min;
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

            inputNinos.addEventListener("input", function () {
                const maxNinos = 4;
                let currentValue = parseInt(this.value) || 0;
                if (currentValue > maxNinos) this.value = maxNinos;
                if (currentValue < parseInt(this.min)) this.value = this.min;
            });

            const incrementNinos = document.createElement("button");
            incrementNinos.className = "increment";
            incrementNinos.textContent = "+";

            numericInputNinos.appendChild(decrementNinos);
            numericInputNinos.appendChild(inputNinos);
            numericInputNinos.appendChild(incrementNinos);

            inputNinosContainer.appendChild(numericInputNinos);

            document.querySelector("#numeric-value-ninos").addEventListener("input", function () {
                const maxNinos = 4;
                let currentValue = parseInt(this.value) || 1;
                if (currentValue > maxNinos) this.value = maxNinos;
                if (currentValue < parseInt(this.min)) this.value = this.min;
            });

            const edadesNinosContainer = habitacionDiv.querySelector("#edades-ninos");

            // Generar dinámicamente los campos para las edades de los niños
            inputNinos.addEventListener("input", function () {
                const numNinos = parseInt(inputNinos.value) || 0;
                edadesNinosContainer.innerHTML = "";
                for (let j = 1; j <= numNinos; j++) {
                    const label = document.createElement("label");
                    label.innerHTML = `<span data-i18n="formulario.edadNino"></span> ${j}:`;
                    edadesNinosContainer.appendChild(label);
                    // Traducir el label recién insertado
                    applyTranslations(lang);

                    const select = document.createElement("select");
                    select.className = "edad-nino";
                    select.name = `edad-nino-${j}`;
                    for (let edad = 1; edad <= 12; edad++) {
                        const option = document.createElement("option");
                        option.value = edad;
                        option.textContent = edad;
                        select.appendChild(option);
                    }
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
    const fechaRangoRaw = document.querySelector("#fecha-rango")?.value || "";

    // Manejar ambos separadores de fecha (" al " y " to ")
    let dateRange = [];
    if (fechaRangoRaw.includes(" al ")) {
        dateRange = fechaRangoRaw.split(" al ");
    } else if (fechaRangoRaw.includes(" to ")) {
        dateRange = fechaRangoRaw.split(" to ");
    } else if (fechaRangoRaw) {
        dateRange = [fechaRangoRaw, fechaRangoRaw]; // Si solo hay una fecha
    }

    const dateFrom = dateRange[0]?.trim() || ""; // Fecha de salida
    const dateTo = dateRange[1]?.trim() || dateFrom; // Fecha de llegada

    const passengersRoom = document.querySelector("#num-hab")?.value || "1"; // Número de habitaciones
    const baggageIncluded = document.querySelector("#checkbox-vequipaje")?.checked ? "true" : "false"; // Equipaje incluido
    const directFlight = document.querySelector("#checkbox-vdirecto")?.checked ? "true" : "false"; // Vuelo directo

    // Leer el código de descuento
    const discountCode = document.querySelector("#codigo-descuento")?.value || "";

    // Debug: mostrar valores obtenidos
    console.log("Debug Paquetes - Valores obtenidos:");
    console.log("cityFrom:", cityFrom);
    console.log("cityTo:", cityTo);
    console.log("fechaRangoRaw:", fechaRangoRaw);
    console.log("dateFrom:", dateFrom);
    console.log("dateTo:", dateTo);

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

    // Construir la URL final con el formato correcto
    const discountSuffix = discountCode ? `-----${discountCode}` : '-----';
    const url = `${host}${culture}/${productType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${totalAdultos}/${passengersRoom}/0/${dateFrom}/${dateTo}/${roomInfoString}/${baggageIncluded}/${directFlight}/NA/Economy/NA/${userService}--${branchCode}${discountSuffix}`;

    console.log("Generated URL:", url);
    return url;
}

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
        if (totalPasajeros > 15) {
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

            // Generar URL y redirigir
            if (generatedURL) {
                console.log("Redirigiendo a:", generatedURL);
                window.location.href = generatedURL;
            } else {
                console.error("No se pudo generar la URL de paquetes");
                alert("Error: No se pudo generar la URL. Verifica que todos los campos estén completos.");
            }
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

function crearPopupVuelos() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const numPasajerosInput = document.querySelector("#num-pasajeros");
    if (numPasajerosInput) {
        numPasajerosInput.setAttribute("readonly", "readonly");
        numPasajerosInput.setAttribute("tabindex", "-1");
        numPasajerosInput.setAttribute("inputmode", "none");
        numPasajerosInput.style.caretColor = "transparent";
    }

    const pasajerosPopup = document.querySelector("#pasajeros-popup");
    const closePopup = document.querySelector(".close-popup");
    const pasajerosContainer = document.querySelector("#pasajeros-container");

    if (numPasajerosInput) {
        ["keydown", "wheel", "paste", "drop"].forEach(evt =>
            numPasajerosInput.addEventListener(evt, e => e.preventDefault())
        );
    }

    if (!numPasajerosInput || !pasajerosPopup || !closePopup || !pasajerosContainer) return;

    numPasajerosInput.addEventListener("click", function () {
        pasajerosPopup.style.display = "flex";
    });

    closePopup.addEventListener("click", function () {
        pasajerosPopup.style.display = "none";
    });

    pasajerosPopup.addEventListener("click", function (e) {
        if (e.target === pasajerosPopup) {
            pasajerosPopup.style.display = "none";
        }
    });

    document.querySelector("#accept-popup")?.addEventListener("click", function () {
        let totalAdultos = parseInt(document.querySelector("#numeric-value-adultos")?.value) || 0;
        let totalNinos = parseInt(document.querySelector("#numeric-value-ninos")?.value) || 0;
        let totalInfantes = parseInt(document.querySelector("#numeric-value-infantes")?.value) || 0;
        numPasajerosInput.value = Math.max(1, totalAdultos + totalNinos + totalInfantes);
        pasajerosPopup.style.display = "none";
    });

    // Traducción: Usar data-i18n en los textos
    const adultosContainer = document.createElement("div");
    adultosContainer.className = "numeric-input-group";
    adultosContainer.innerHTML = `
        <label data-i18n="formulario.adultos"></label>
        <span class="info-text" data-i18n="formulario.infoAdultos"></span>
        <div class="numeric-input">
            <button class="decrement" id="decrement-adultos">-</button>
            <input type="number" id="numeric-value-adultos" value="1" min="1" max="10">
            <button class="increment" id="increment-adultos">+</button>
        </div>
    `;

    const ninosContainer = document.createElement("div");
    ninosContainer.className = "numeric-input-group";
    ninosContainer.innerHTML = `
        <label data-i18n="formulario.ninos"></label>
        <span class="info-text" data-i18n="formulario.infoNinos"></span>
        <div class="numeric-input">
            <button class="decrement" id="decrement-ninos">-</button>
            <input type="number" id="numeric-value-ninos" value="0" min="0" max="5">
            <button class="increment" id="increment-ninos">+</button>
        </div>
    `;

    const infantesContainer = document.createElement("div");
    infantesContainer.className = "numeric-input-group";
    infantesContainer.innerHTML = `
        <label data-i18n="formulario.infantes"></label>
        <span class="info-text" data-i18n="formulario.infoInfantes"></span>
        <div class="numeric-input">
            <button class="decrement" id="decrement-infantes">-</button>
            <input type="number" id="numeric-value-infantes" value="0" min="0" max="2">
            <button class="increment" id="increment-infantes">+</button>
        </div>
    `;

    pasajerosContainer.innerHTML = "";
    pasajerosContainer.appendChild(adultosContainer);
    pasajerosContainer.appendChild(ninosContainer);
    pasajerosContainer.appendChild(infantesContainer);

    // Traduce los textos del popup
    const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
    const lang = cultureAttr.split('-')[0]; // 'en', 'es', 'pt', etc.
    applyTranslations(lang);

    ["#numeric-value-adultos", "#numeric-value-ninos", "#numeric-value-infantes"].forEach(selector => {
        const input = document.querySelector(selector);
        if (input) {
            input.setAttribute("readonly", "readonly");
            input.setAttribute("tabindex", "-1");
            input.setAttribute("inputmode", "none");
            ["keydown", "wheel", "paste", "drop"].forEach(evt =>
                input.addEventListener(evt, e => e.preventDefault())
            );
            input.addEventListener("input", function () {
                let min = parseInt(input.min) || 0;
                let max = parseInt(input.max) || 99;
                let val = parseInt(input.value) || min;
                if (val < min) input.value = min;
                if (val > max) input.value = max;
            });
        }
    });

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

function generateURLVuelos() {
    const widgetAviajar = document.getElementById('widget-net');
    let culture = widgetAviajar.getAttribute('culture') || "es-CO";
    let host = widgetAviajar.getAttribute('host') || "https://reservas.aviajarcolombia.com/";
    let productType = widgetAviajar.getAttribute('productType') || "Air";

    // Leer los atributos userService y branchCode del HTML
    let userService = widgetAviajar.getAttribute('userService') || 'aviajar'; // Valor por defecto: "aviajar"
    let branchCode = widgetAviajar.getAttribute('branchCode') || '003'; // Valor por defecto: "003"

    // Detectar si es multidestino
    const isMultiDestino = document.querySelector("#radio-multidestino")?.checked;

    // Pasajeros
    const numAdultos = parseInt(document.querySelector("#numeric-value-adultos")?.value) || 1;
    const numNinos = parseInt(document.querySelector("#numeric-value-ninos")?.value) || 0;
    const numInfantes = parseInt(document.querySelector("#numeric-value-infantes")?.value) || 0;

    const baggageIncluded = document.querySelector("#checkbox-vequipaje")?.checked ? "true" : "false";
    const directFlight = document.querySelector("#checkbox-vdirecto")?.checked ? "true" : "false";
    const discountCode = document.querySelector("#codigo-descuento")?.value || "";

    // --- MULTIDESTINO ---
    if (isMultiDestino) {
        const tramos = Array.from(document.querySelectorAll('.tramo'));
        if (tramos.length < 2) {
            alert("Debes agregar al menos dos tramos para multidestino.");
            return null;
        }

        // Extraer los IDs de origen y destino y las fechas de cada tramo
        const origenes = [];
        const destinos = [];
        const fechas = [];

        for (const tramo of tramos) {
            const origenSelect = tramo.querySelector('select.input-tramo-origen-id');
            const destinoSelect = tramo.querySelector('select.input-tramo-destino-id');
            const fechaInput = tramo.querySelector('.input-tramo-fecha');

            const origen = origenSelect?.value || '';
            const destino = destinoSelect?.value || '';
            const fecha = fechaInput?.value.trim();

            // Validar que todos los campos estén completos
            if (!origen || !destino || !fecha) {
                alert("Completa todos los campos de cada tramo.");
                return null;
            }

            origenes.push(origen);
            destinos.push(destino);
            fechas.push(fecha);
        }

        // Construir la URL multidestino
        const url = `${host}${culture}/${productType}/MD/${origenes.join(",")}/${destinos.join(",")}/${fechas.join(",")}/${numAdultos}/${numNinos}/${numInfantes}/${baggageIncluded}/${directFlight}/NA/NA/NA/${userService}-show-${branchCode}---------${discountCode}#air`;
        console.log("Generated URL (MD):", url);
        return url;
    }

    // --- NORMAL (IDA Y REGRESO O SOLO IDA) ---
    // Determinar el tipo de viaje (RT: Ida y regreso, OW: Solo ida)
    const tripType = document.querySelector("#radio-soloida")?.checked ? "OW" : "RT";

    // Obtener valores del formulario
    const cityFrom = document.querySelector("#origen-id")?.value || ""; // Origen
    const cityTo = document.querySelector("#destino-id")?.value || ""; // Destino
    const dateRange = document.querySelector("#fecha-rango")?.value.split(" to ") || []; // Rango de fechas
    const dateFrom = dateRange[0] || ""; // Fecha de ida
    const dateTo = tripType === "RT" ? (dateRange[1] || "") : ""; // Fecha de regreso (solo si es RT)

    // Dentro de generateURLVuelos, antes de la validación:
    console.log("cityFrom:", cityFrom);
    console.log("cityTo:", cityTo);
    console.log("dateFrom:", dateFrom);
    console.log("dateTo:", dateTo);

    // Validar que todos los campos requeridos estén completos
    if (!cityFrom || !cityTo || !dateFrom || (tripType === "RT" && !dateTo)) {
        console.error("Faltan parámetros obligatorios para generar la URL.");
        return null;
    }

    // Construir la URL final (agregando el código de descuento al final)
    const url = `${host}${culture}/${productType}/${tripType}/${cityFrom}/${cityTo}/${dateFrom}/${dateTo}/${numAdultos}/${numNinos}/${numInfantes}/NA/NA/NA/NA/NA/${baggageIncluded}/${directFlight}/${userService}-show-${branchCode}---------${discountCode}#air`;

    console.log("Generated URL:", url);
    return url;
}

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
            if (input) input.classList.add("input-error");
        }

        function clearError(input) {
            if (input) input.classList.remove("input-error");
        }

        const isMultiDestino = document.querySelector("#radio-multidestino")?.checked;

        // Solo validar los inputs principales si NO es multidestino
        if (!isMultiDestino) {
            if (!origenSelect || !origenSelect.value) {
                showError(origenInput);
                valid = false;
            } else {
                clearError(origenInput);
            }
            if (!destinoSelect || !destinoSelect.value) {
                showError(destinoInput);
                valid = false;
            } else {
                clearError(destinoInput);
            }
            if (!fechaRangoInput || !fechaRangoInput.value) {
                showError(fechaRangoInput);
                valid = false;
            } else {
                clearError(fechaRangoInput);
            }
        }

        // Si todos los campos son válidos, generar la URL
        if (valid) {
            const generatedURL = generateURLVuelos();
            if (generatedURL) {
                console.log(generatedURL);
                window.location.href = generatedURL;

                // Limpiar basura del select origen y destino
                document.querySelectorAll("#origen-id, #destino-id").forEach(select => {
                    const selectedOption = select.querySelector("option[selected]");
                    if (!selectedOption) {
                        select.innerHTML = ""; // Limpiar si no hay opción seleccionada
                    }
                });

                // Limpiar los inputs de origen, destino y fecha-rango
                if (origenInput) origenInput.value = "";
                if (destinoInput) destinoInput.value = "";
                if (fechaRangoInput) fechaRangoInput.value = "";
            } else {
                alert("Por favor completa todos los campos obligatorios.");
            }
        }
    });

    // Quitar la clase input-error cuando el usuario selecciona algo desde el autocompletado
    const origenInput = document.querySelector("#origen");
    if (origenInput) {
        origenInput.addEventListener("input", function () {
            this.classList.remove("input-error");
        });
    }

    const destinoInput = document.querySelector("#destino");
    if (destinoInput) {
        destinoInput.addEventListener("input", function () {
            this.classList.remove("input-error");
        });
    }

    // Quitar la clase input-error cuando el rango de fechas cambie
    const fechaRangoInput = document.querySelector("#fecha-rango");
    if (fechaRangoInput) {
        fechaRangoInput.addEventListener("change", function () {
            this.classList.remove("input-error");
        });
    }

    setupFlatpickrEvents();
    inicializarFlatpickrVuelos();
}

function ajustarWidget() {
    const contenedor = document.querySelector('.contenedor-widget');
    if (!contenedor) return;
    const esEscritorio = window.innerWidth >= 1024;
    const contenedorEstrecho = contenedor.offsetWidth < 1000;

    contenedor.classList.toggle('widget-ajustado', esEscritorio && contenedorEstrecho);
}

function inicializarFlatpickrVuelos() {
    const fechaRango = document.querySelector("#fecha-rango");
    if (!fechaRango || typeof flatpickr === 'undefined') return;

    // Destruir instancia previa si existe
    if (fechaRango._flatpickr) {
        fechaRango._flatpickr.destroy();
    }

    // Detectar idioma desde el atributo language del widget
    const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
    const lang = cultureAttr.split('-')[0]; // 'en', 'es', 'pt', etc.
    const t = translations[lang] || translations["es"] || {};
    const flatpickrT = t.flatpickr || {};

    // Detectar si es solo ida
    const soloIda = document.querySelector("#radio-soloida")?.checked;
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;

    flatpickr("#fecha-rango", {
        mode: soloIda ? "single" : "range",
        dateFormat: "Y-m-d",
        minDate: "today",
        showMonths: isMobile ? 1 : 2,
        disableMobile: true,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: flatpickrT.weekdays?.shorthand || ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                longhand: flatpickrT.weekdays?.longhand || ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            },
            months: {
                shorthand: flatpickrT.months?.shorthand || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: flatpickrT.months?.longhand || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            },
        },
        onClose: function (selectedDates) {
            if (selectedDates.length > 0) {
                const fecha1 = selectedDates[0].toISOString().split('T')[0];
                if (soloIda) {
                    fechaRango.value = fecha1;
                } else if (selectedDates.length === 2) {
                    const fecha2 = selectedDates[1].toISOString().split('T')[0];
                    fechaRango.value = `${fecha1} to ${fecha2}`;
                }
            }
        }
    });

    // Placeholder traducido desde el JSON
    fechaRango.setAttribute("type", "text");
    fechaRango.setAttribute(
        "placeholder",
        soloIda
            ? (flatpickrT.placeholderIda || "Selecciona la fecha de ida")
            : (flatpickrT.placeholderRango || "Selecciona un rango de fechas")
    );
}

function setupFlatpickrEvents() {
    const radioSoloIda = document.querySelector("#radio-soloida");
    const radioIdaRegreso = document.querySelector("#radio-idayregreso");

    if (radioSoloIda) {
        radioSoloIda.addEventListener("change", inicializarFlatpickrVuelos);
    }

    if (radioIdaRegreso) {
        radioIdaRegreso.addEventListener("change", inicializarFlatpickrVuelos);
    }
}


//  -------------- FUNCIONES HOTELS ---------------
function autocompleteHotelesCiudadesAPI(inputId, autocompleteListId, hiddenSelectId, apiUrlBase, userServices, lang) {
    const input = document.querySelector(inputId);
    const autocompleteList = document.querySelector(autocompleteListId);
    const hiddenSelect = document.querySelector(hiddenSelectId);

    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    input.addEventListener("input", function () {
        const query = normalizeString(input.value.trim());
        autocompleteList.innerHTML = "";

        if (query.length < 3) {
            if (hiddenSelect) hiddenSelect.innerHTML = "";
            return;
        }

        const url = apiUrlBase + "?searchCriteria=" + encodeURIComponent(query) + "&userServices=" + userServices + "&lang=" + lang;

        fetch(url)
            .then(res => res.json())
            .then(responseData => {
                const hoteles = (responseData.Hotels || responseData.hotels || []).map(hotel => ({
                    name: hotel.hotel_name,
                    subtitle: hotel.address || "",
                    type: "hotel",
                    id: hotel.Id
                }));

                const ciudades = (responseData.Locations || responseData.locations || []).map(city => ({
                    name: city.Name,
                    subtitle: city.NameFull || "",
                    type: "ciudad",
                    id: city.Id
                }));

                const data = ciudades.concat(hoteles);

                data.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "autocomplete-item-hoteles"
                    itemDiv.innerHTML = `
                        <div class="title-autocomplete-item">${item.name}</div>
                        ${item.subtitle ? `<div class="subtitle-autocomplete-item">${item.subtitle}</div>` : ""}
                    `;

                    itemDiv.addEventListener("click", function () {
                        input.value = item.name + (item.subtitle ? `, ${item.subtitle}` : "");
                        autocompleteList.innerHTML = "";

                        const code = (item.type === "hotel" ? "h" : "l") + item.id;

                        // Solo si hiddenSelect existe
                        if (hiddenSelect) {
                            hiddenSelect.innerHTML = "";
                            const option = document.createElement("option");
                            option.value = code;
                            option.selected = true;
                            hiddenSelect.appendChild(option);

                            hiddenSelect.setAttribute("data-tipo", item.type);
                        }
                        console.log("Seleccionado:", input.value, "Código:", code, "Tipo:", item.type);
                        console.log(item.name + (item.subtitle ? `, ${item.subtitle}` : ""), "ID:", item.id);
                    });

                    autocompleteList.appendChild(itemDiv);
                });
            })
            .catch(err => {
                console.error("Error en el autocomplete de hoteles/ciudades:", err);
            });
    });

    document.addEventListener("click", function (e) {
        if (autocompleteList && !autocompleteList.contains(e.target) && e.target !== input) {
            autocompleteList.innerHTML = "";
        }
    });
}

function generateURLHoteles() {
    const widgetAviajar = document.getElementById('widget-net');
    let culture = widgetAviajar.getAttribute('culture') || "es-CO";
    let host = widgetAviajar.getAttribute('host') || "https://reservas.aviajarcolombia.com/";
    let productType = widgetAviajar.getAttribute('productType') || "netsuite-hotels";
    let userService = widgetAviajar.getAttribute('userService') || 'aviajar';
    let branchCode = widgetAviajar.getAttribute('branchCode') || '003';

    // Obtener valores del formulario
    const destino = document.querySelector("#destino-id")?.value || "";
    let dateRangeRaw = document.querySelector("#fecha-rango")?.value || "";
    let dateFrom = "", dateTo = "";
    if (dateRangeRaw.includes(" to ")) {
        [dateFrom, dateTo] = dateRangeRaw.split(" to ").map(f => f.trim());
    } else if (dateRangeRaw.includes(" al ")) {
        [dateFrom, dateTo] = dateRangeRaw.split(" al ").map(f => f.trim());
    } else if (dateRangeRaw) {
        dateFrom = dateRangeRaw.trim();
        dateTo = dateRangeRaw.trim();
    }
    const discountCode = document.querySelector("#codigo-descuento")?.value || "";

    // Construir info de habitaciones
    let habitaciones = document.querySelectorAll("#hab-container > div");
    let habitacionesArr = [];
    habitaciones.forEach(habitacion => {
        const numAdultos = parseInt(habitacion.querySelector(".input-adultos input")?.value) || 0;
        const numNinos = parseInt(habitacion.querySelector(".input-ninos input")?.value) || 0;
        let habitacionStr = `${numAdultos}`;
        if (numNinos > 0) {
            // Obtener edades de los niños
            const edades = Array.from(habitacion.querySelectorAll(".edad-nino")).map(sel => sel.value).join("-");
            habitacionStr += `-${edades}`;
        }
        habitacionesArr.push(habitacionStr);
    });
    const habitacionesParam = habitacionesArr.join("!");

    // Validar campos requeridos
    if (!destino || !dateFrom || !dateTo || !habitacionesParam) {
        console.error("Faltan parámetros obligatorios para generar la URL de hoteles.");
        return null;
    }

    // Construir la URL final
    const url = `${host}${productType}/results/${culture}/${userService}/${destino}/${dateFrom}/${dateTo}/${habitacionesParam}?branchCode=${branchCode}${discountCode ? `&promoCode=${discountCode}` : ""}`;


    return url;
}

function botonBusquedaHoteles() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const buscarBtn = document.getElementById('buscar-btn-hoteles');
    if (!buscarBtn) return;

    buscarBtn.addEventListener("click", function (e) {
        e.preventDefault();

        let valid = true;

        const destinoInput = document.querySelector("#destino");
        const fechaRangoInput = document.querySelector("#fecha-rango");
        const destinoSelect = document.querySelector("#destino-id");
        const numHabInput = document.querySelector("#num-hab");
        const numPerInput = document.querySelector("#num-per");

        function showError(input) {
            if (input) input.classList.add("input-error");
        }

        function clearError(input) {
            if (input) input.classList.remove("input-error");
        }

        if (!destinoSelect || !destinoSelect.value) {
            showError(destinoInput);
            valid = false;
        } else {
            clearError(destinoInput);
        }

        if (!fechaRangoInput || !fechaRangoInput.value) {
            showError(fechaRangoInput);
            valid = false;
        } else {
            clearError(fechaRangoInput);
        }

        const numHab = parseInt(numHabInput?.value) || 1;
        const numPer = parseInt(numPerInput?.value) || 2;
        if (numHab < 1 || numPer < 1 || numPer > 15) {
            showError(numHabInput);
            showError(numPerInput);
            valid = false;

            // Mostrar el modal de error igual que en paquetes
            const modal = document.querySelector("#modal-error");
            if (modal) {
                modal.style.display = "block";
                setTimeout(() => {
                    document.addEventListener("click", function cerrarModal(e) {
                        const modalContent = document.querySelector(".modal-content");
                        if (!modalContent.contains(e.target)) {
                            modal.style.display = "none";
                            document.removeEventListener("click", cerrarModal);
                        }
                    });
                }, 100);
            }
        } else {
            clearError(numHabInput);
            clearError(numPerInput);
        }

        if (valid) {
            const generatedURL = generateURLHoteles();

            if (generatedURL) {
                window.location.href = generatedURL;
                console.log(generatedURL);
                if (destinoSelect) {
                    const selectedOption = destinoSelect.querySelector("option[selected]");
                    if (!selectedOption) {
                        destinoSelect.innerHTML = "";
                    }
                }
                if (destinoInput) destinoInput.value = "";
                if (fechaRangoInput) fechaRangoInput.value = "";
            } else {
                alert("Por favor completa todos los campos obligatorios.");
            }
        }
    });

    const destinoInput = document.querySelector("#destino");
    if (destinoInput) {
        destinoInput.addEventListener("input", function () {
            this.classList.remove("input-error");
        });
    }

    const fechaRangoInput = document.querySelector("#fecha-rango");
    if (fechaRangoInput) {
        fechaRangoInput.addEventListener('change', function () {
            this.classList.remove("input-error");
        });
    }

    const numHabInput = document.querySelector("#num-hab");
    if (numHabInput) {
        numHabInput.addEventListener("change", function () {
            this.classList.remove("input-error");
        });
    }

    const numPerInput = document.querySelector("#num-per");
    if (numPerInput) {
        numPerInput.addEventListener("change", function () {
            this.classList.remove("input-error");
        });
    }
}

function crearPopupHoteles() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const numHabInput = document.querySelector("#num-hab");
    const popupNumHabInput = document.querySelector("#popup-num-hab");
    const habPopup = document.querySelector("#hab-popup");
    const habitacionesContainer = document.querySelector("#hab-container");

    if (!numHabInput || !popupNumHabInput || !habPopup || !habitacionesContainer) return;

    numHabInput.parentElement.style.position = "relative";

    // Mostrar el popup al hacer clic en el campo de habitaciones
    numHabInput.addEventListener("click", function () {
        habPopup.style.display = "flex";
        habPopup.classList.toggle("active");
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

        // Actualizar el input de personas con el total
        document.querySelector("#num-per").value = totalAdultos + totalNinos;

        habPopup.classList.remove("active");
        habPopup.style.display = "none";
    });

    // Abrir popup si hago click en el input #num-per
    const numPerInput = document.querySelector("#num-per");
    numPerInput?.addEventListener("click", function () {
        habPopup.style.display = "flex";
    });

    // Generar habitaciones (puedes copiar la función generarHabitaciones de paquetes)
    function generarHabitaciones(numHab) {
        habitacionesContainer.innerHTML = "";

        const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
        const lang = cultureAttr.split('-')[0]; // 'en', 'es', 'pt', etc.

        for (let i = 1; i <= numHab; i++) {
            const habitacionDiv = document.createElement("div");
            habitacionDiv.innerHTML = `
                <div class="habitacion-header">
                    <h4><span data-i18n="formulario.habitacion"></span> ${i}</h4>
                    <span class="icon"><i class="fas fa-bed"></i></span>
                </div>
                <div class="habitacion">
                    <div class="adultos">
                        <div class="label-adultos">
                            <label for="num-adultos"><span data-i18n="formulario.adultos"></span>:</label>
                        </div>
                        <div class="input-adultos"></div>
                    </div>
                    <div class="ninos">
                        <div class="label-ninos">
                            <label for="num-ninos"><span data-i18n="formulario.ninos"></span>:</label>
                        </div>
                        <div class="input-ninos"></div>
                    </div>
                    <div id="edades-ninos"></div>
                </div>
            `;

            habitacionesContainer.appendChild(habitacionDiv);

            // Traducir los textos recién insertados
            applyTranslations(lang);

            const inputAdultosContainer = habitacionDiv.querySelector(".input-adultos");
            inputAdultosContainer.innerHTML = "";

            const inputNinosContainer = habitacionDiv.querySelector(".input-ninos");
            inputNinosContainer.innerHTML = "";

            // Adultos
            const numericInputAdultos = document.createElement("div");
            numericInputAdultos.className = "numeric-input";
            const decrementAdultos = document.createElement("button");
            decrementAdultos.className = "decrement";
            decrementAdultos.textContent = "-";
            const inputAdultos = document.createElement("input");
            inputAdultos.type = "number";
            inputAdultos.value = "2";
            inputAdultos.min = "1";
            inputAdultos.max = "15";
            inputAdultos.readOnly = true;
            const incrementAdultos = document.createElement("button");
            incrementAdultos.className = "increment";
            incrementAdultos.textContent = "+";
            numericInputAdultos.appendChild(decrementAdultos);
            numericInputAdultos.appendChild(inputAdultos);
            numericInputAdultos.appendChild(incrementAdultos);
            inputAdultosContainer.appendChild(numericInputAdultos);

            // Niños
            const numericInputNinos = document.createElement("div");
            numericInputNinos.className = "numeric-input";
            const decrementNinos = document.createElement("button");
            decrementNinos.className = "decrement";
            decrementNinos.textContent = "-";
            const inputNinos = document.createElement("input");
            inputNinos.type = "number";
            inputNinos.value = "0";
            inputNinos.min = "0";
            inputNinos.max = "4";
            inputNinos.readOnly = true;
            const incrementNinos = document.createElement("button");
            incrementNinos.className = "increment";
            incrementNinos.textContent = "+";
            numericInputNinos.appendChild(decrementNinos);
            numericInputNinos.appendChild(inputNinos);
            numericInputNinos.appendChild(incrementNinos);
            inputNinosContainer.appendChild(numericInputNinos);

            const edadesNinosContainer = habitacionDiv.querySelector("#edades-ninos");
            inputNinos.addEventListener("input", function () {
                const numNinos = parseInt(inputNinos.value) || 0;
                edadesNinosContainer.innerHTML = "";
                for (let j = 1; j <= numNinos; j++) {
                    const label = document.createElement("label");
                    label.textContent = `Edad del niño ${j}:`;
                    const select = document.createElement("select");
                    select.className = "edad-nino";
                    select.name = `edad-nino-${j}`;
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

            // Eventos adultos
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

            // Eventos niños
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

    // Reemplazar el input original del popup por un control numérico igual al de paquetes
    const numericInputContainer = document.createElement("div");
    numericInputContainer.className = "numeric-input";
    const decrementButton = document.createElement("button");
    decrementButton.className = "decrement";
    decrementButton.textContent = "-";
    const numericInput = document.createElement("input");
    numericInput.type = "number";
    numericInput.id = "numeric-value";
    numericInput.value = "1";
    numericInput.min = "1";
    numericInput.max = "4";
    numericInput.readOnly = true;
    const incrementButton = document.createElement("button");
    incrementButton.className = "increment";
    incrementButton.textContent = "+";
    numericInputContainer.appendChild(decrementButton);
    numericInputContainer.appendChild(numericInput);
    numericInputContainer.appendChild(incrementButton);
    popupNumHabInput.replaceWith(numericInputContainer);

    numericInput.addEventListener("input", function () {
        let currentValue = parseInt(numericInput.value) || 1;
        if (currentValue < parseInt(numericInput.min)) {
            numericInput.value = numericInput.min;
        } else if (currentValue > parseInt(numericInput.max)) {
            numericInput.value = numericInput.max;
        }
        document.querySelector("#num-hab").value = numericInput.value;
        generarHabitaciones(numericInput.value);
    });

    decrementButton.addEventListener("click", function () {
        let currentValue = parseInt(numericInput.value) || 1;
        if (currentValue > parseInt(numericInput.min)) {
            numericInput.value = currentValue - 1;
            document.querySelector("#num-hab").value = numericInput.value;
            generarHabitaciones(numericInput.value);
        }
    });

    incrementButton.addEventListener("click", function () {
        let currentValue = parseInt(numericInput.value) || 1;
        if (currentValue < parseInt(numericInput.max)) {
            numericInput.value = currentValue + 1;
            document.querySelector("#num-hab").value = numericInput.value;
            generarHabitaciones(numericInput.value);
        }
    });
}

//  -------------- FUNCIONES CARS ---------------

function autocompleteSearchAutosV2(inputId, autocompleteListId, dataCiudadesAeropuertos, dataBarrios, hiddenSelectId) {

    const input = document.querySelector(inputId);
    const autocompleteList = document.querySelector(autocompleteListId);
    const hiddenSelect = hiddenSelectId
        ? input.parentElement.querySelector(hiddenSelectId)
        : document.querySelector("#destino-id");

    // Normaliza cadenas para búsqueda
    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Convierte barrios a string para mostrar
    function barrioToString(barrio) {
        // Ejemplo: "Hachijo Jima, Queens (HAC)"
        return `${barrio.Desc} (${barrio.City})`;
    }

    input.addEventListener("input", function () {
        const query = normalizeString(input.value.trim());
        autocompleteList.innerHTML = "";

        if (query.length < 3) {
            if (hiddenSelect) hiddenSelect.innerHTML = "";
            return;
        }

        // Filtrar ciudades y aeropuertos
        let filteredCiudadesAeropuertos = dataCiudadesAeropuertos
            .filter(entry => !entry.toLowerCase().includes("punto de partida"))
            .filter(entry => normalizeString(entry).includes(query));

        // Filtrar barrios/zonas
        let filteredBarrios = (dataBarrios || [])
            .filter(barrio => normalizeString(barrio.Desc).includes(query));

        // Mostrar ciudades y aeropuertos
        filteredCiudadesAeropuertos.forEach(entry => {
            const parts = entry.split(" | ");
            const displayText = parts.length > 1 ? parts[1] : entry;
            const isCity = !entry.includes("-");
            const iconClass = isCity ? "fas fa-map-marker-alt" : "fas fa-plane";

            const icon = document.createElement("i");
            icon.className = iconClass;
            icon.style.padding = "5px";

            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = displayText;
            item.appendChild(icon);

            item.addEventListener("click", function () {
                input.value = displayText;
                autocompleteList.innerHTML = "";

                // Extraer el ID del aeropuerto del texto seleccionado
                const match = entry.match(/\(([^)]+)\)$/);
                let id = match ? match[1] : "";
                if (id.includes("-")) {
                    id = id.split("-")[1].trim();
                }

                if (hiddenSelect) {
                    hiddenSelect.innerHTML = "";
                    const option = document.createElement("option");
                    option.value = id;
                    option.selected = true;
                    hiddenSelect.appendChild(option);
                }
                input.focus();
                input.blur();
            });

            autocompleteList.appendChild(item);
        });

        // Mostrar barrios/zonas
        filteredBarrios.forEach(barrio => {
            const displayText = barrioToString(barrio);
            const icon = document.createElement("i");
            icon.className = "fas fa-map-pin";
            icon.style.padding = "5px";

            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = displayText;
            item.appendChild(icon);

            item.addEventListener("click", function () {
                input.value = displayText;
                autocompleteList.innerHTML = "";

                // El ID será el código de zona del barrio
                let id = barrio.Code;

                if (hiddenSelect) {
                    hiddenSelect.innerHTML = "";
                    const option = document.createElement("option");
                    option.value = id;
                    option.selected = true;
                    hiddenSelect.appendChild(option);
                }

                // Imprime el número de zona en consola
                console.log("Zona seleccionada:", id);

                input.focus();
                input.blur();
            });

            autocompleteList.appendChild(item);
        });
    });

    // Cerrar la lista de sugerencias si el usuario hace clic fuera
    document.addEventListener("click", function (e) {
        if (!autocompleteList.contains(e.target) && e.target !== input) {
            autocompleteList.innerHTML = "";
        }
    });
}

function inicializarCheckboxOtroDestino() {
    const checkbox = document.getElementById('devolver-otro-destino');
    const lugarRetiroDiv = document.querySelector('.lugar-retiro .retiro');

    if (!checkbox || !lugarRetiroDiv) return;

    checkbox.addEventListener('change', function () {
        // Si se marca el checkbox, agrega el input de devolución
        if (checkbox.checked) {
            // Evita duplicados
            if (document.getElementById('input-otro-destino')) return;

            // Crea el nuevo input-group
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            inputGroup.id = 'input-otro-destino';
            inputGroup.style.marginTop = '10px';

            inputGroup.innerHTML = `
                <span class="label-input" data-i18n="formulario.lugarDevolucion"></span>
                <input id="destino-otro" type="text" class="autocomplete-input" data-i18n-placeholder="formulario.lugarDevolucionPlaceholder" value="">
                <div id="autocomplete-list-destino-otro" class="autocomplete-list"></div>
                <select id="destino-otro-id" style="display: none;"></select>
                <span class="icon"><i class="fas fa-plane-departure"></i></span>
            `;

            // Inserta después del input original
            lugarRetiroDiv.appendChild(inputGroup);

            // Aplica traducción al nuevo input-group
            const cultureAttr = document.getElementById('widget-net')?.getAttribute('culture') || "es-CO";
            const lang = cultureAttr.split('-')[0];
            applyTranslations(lang);

            // Inicializa el autocomplete para el nuevo input
            autocompleteSearchAutosV2(
                "#destino-otro",
                "#autocomplete-list-destino-otro",
                window.external_file_AirportsCities,
                window.external_file_Neighborhood,
                "#destino-otro-id"
            );
        } else {
            // Si se desmarca, elimina el input de devolución
            const inputGroup = document.getElementById('input-otro-destino');
            if (inputGroup) inputGroup.remove();
        }
    });
}  // Si se desmarca, elimina

function generarURLAutos() {
    const widgetAviajar = document.getElementById('widget-net');
    let culture = widgetAviajar.getAttribute('culture') || "es-CO";
    let host = widgetAviajar.getAttribute('host') || "https://reservas.aviajarcolombia.com/";
    let productType = "Car";
    let userService = widgetAviajar.getAttribute('userService') || 'aviajar';
    let branchCode = widgetAviajar.getAttribute('branchCode') || '003';

    // Obtener valores del formulario
    const destino = document.querySelector("#destino-id")?.value || "";
    const destinoOtro = document.querySelector("#destino-otro-id")?.value || destino;

    let dateRangeRaw = document.querySelector("#fecha-rango")?.value || "";
    let dateFrom = "", dateTo = "";
    if (dateRangeRaw.includes(" to ")) {
        [dateFrom, dateTo] = dateRangeRaw.split(" to ").map(f => f.trim());
    } else if (dateRangeRaw.includes(" al ")) {
        [dateFrom, dateTo] = dateRangeRaw.split(" al ").map(f => f.trim());
    } else if (dateRangeRaw) {
        dateFrom = dateRangeRaw.trim();
        dateTo = dateRangeRaw.trim();
    }
    const timeRetiro = document.querySelector("#time-retiro")?.value.replace(":", "") || "1000";
    const timeEntrega = document.querySelector("#time-entrega")?.value.replace(":", "") || "1000";

    // Validar que todos los campos requeridos estén completos
    if (!destino || !dateFrom || !dateTo || !timeRetiro || !timeEntrega) {
        return null;
    }

    // Determinar tipo según si es texto o número
    function getTipo(id) {
        return isNaN(Number(id)) ? "City" : "Neighborhood";
    }

    const tipoDestino = getTipo(destino);
    const tipoDestinoOtro = getTipo(destinoOtro);

    // Construir la URL final
    const url = `${host}${culture}/${productType}/${tipoDestino}/${destino}/${dateFrom}/${timeRetiro}/${tipoDestinoOtro}/${destinoOtro}/${dateTo}/${timeEntrega}/NA/NA/NA/${userService}-show-${branchCode}---------`;
    console.log("Generated URL Autos:", url);
    return url;
}

function botonBusquedaAutos() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const buscarBtn = document.getElementById('buscar-btn-cars');
    if (!buscarBtn) return;

    buscarBtn.addEventListener("click", function (e) {
        e.preventDefault();

        let valid = true;

        const destinoInput = document.querySelector("#destino");
        const fechaRangoInput = document.querySelector("#fecha-rango");
        const destinoSelect = document.querySelector("#destino-id");
        const timeRetiroInput = document.querySelector("#time-retiro");
        const timeEntregaInput = document.querySelector("#time-entrega");

        function showError(input) {
            if (input) input.classList.add("input-error");
        }

        function clearError(input) {
            if (input) input.classList.remove("input-error");
        }

        if (!destinoSelect || !destinoSelect.value) {
            showError(destinoInput);
            valid = false;
        } else {
            clearError(destinoInput);
        }

        if (!fechaRangoInput || !fechaRangoInput.value) {
            showError(fechaRangoInput);
            valid = false;
        } else {
            clearError(fechaRangoInput);
        }

        if (!timeRetiroInput || !timeRetiroInput.value) {
            showError(timeRetiroInput);
            valid = false;
        } else {
            clearError(timeRetiroInput);
        }

        if (!timeEntregaInput || !timeEntregaInput.value) {
            showError(timeEntregaInput);
            valid = false;
        } else {
            clearError(timeEntregaInput);
        }

        if (valid) {
            const generatedURL = generarURLAutos();
            if (generatedURL) {
                window.location.href = generatedURL;
                if (destinoInput) destinoInput.value = "";
                if (fechaRangoInput) fechaRangoInput.value = "";
            } else {
                alert("Por favor completa todos los campos obligatorios.");
            }
        }
    });

    // Limpiar errores al editar
    const destinoInput = document.querySelector("#destino");
    if (destinoInput) {
        destinoInput.addEventListener("input", function () {
            this.classList.remove("input-error");
        });
    }

    const fechaRangoInput = document.querySelector("#fecha-rango");
    if (fechaRangoInput) {
        fechaRangoInput.addEventListener('change', function () {
            this.classList.remove("input-error");
        });
    }

    const timeRetiroInput = document.querySelector("#time-retiro");
    if (timeRetiroInput) {
        timeRetiroInput.addEventListener("change", function () {
            this.classList.remove("input-error");
        });
    }

    const timeEntregaInput = document.querySelector("#time-entrega");
    if (timeEntregaInput) {
        timeEntregaInput.addEventListener("change", function () {
            this.classList.remove("input-error");
        });
    }
}

// --------------- FUNCIONES TOURS ---------------

function generarURLTours() {
    const widgetAviajar = document.getElementById('widget-net');
    let culture = widgetAviajar.getAttribute('culture') || "es-CO";
    let host = widgetAviajar.getAttribute('host') || "https://reservas.aviajarcolombia.com/";
    let productType = "Extras";
    let userService = widgetAviajar.getAttribute('userService') || 'aviajar';
    let branchCode = widgetAviajar.getAttribute('branchCode') || '003';

    // Obtener valores del formulario
    const destino = document.querySelector("#destino-id")?.value || "";
    let dateRangeRaw = document.querySelector("#fecha-rango")?.value || "";
    let dateFrom = "", dateTo = "";
    if (dateRangeRaw.includes(" to ")) {
        [dateFrom, dateTo] = dateRangeRaw.split(" to ").map(f => f.trim());
    } else if (dateRangeRaw.includes(" al ")) {
        [dateFrom, dateTo] = dateRangeRaw.split(" al ").map(f => f.trim());
    } else if (dateRangeRaw) {
        dateFrom = dateRangeRaw.trim();
        dateTo = dateRangeRaw.trim();
    }
    const discountCode = document.querySelector("#codigo-descuento")?.value || "";

    // Validar que todos los campos requeridos estén completos
    if (!destino || !dateFrom || !dateTo) {
        return null;
    }

    // Construir la URL final
    const url = `${host}${culture}/${productType}/${destino}/NA/${dateFrom}/${dateTo}/${userService}-show-${branchCode}---------${discountCode}`;
    console.log("Generated URL Tours:", url);
    return url;
}

function botonBusquedaTours() {
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) return;

    const buscarBtn = document.getElementById('buscar-btn-tours');
    if (!buscarBtn) return;

    buscarBtn.addEventListener("click", function (e) {
        e.preventDefault();

        let valid = true;

        const destinoInput = document.querySelector("#destino");
        const fechaRangoInput = document.querySelector("#fecha-rango");
        const destinoSelect = document.querySelector("#destino-id");

        function showError(input) {
            if (input) input.classList.add("input-error");
        }

        function clearError(input) {
            if (input) input.classList.remove("input-error");
        }

        if (!destinoSelect || !destinoSelect.value) {
            showError(destinoInput);
            valid = false;
        } else {
            clearError(destinoInput);
        }

        if (!fechaRangoInput || !fechaRangoInput.value) {
            showError(fechaRangoInput);
            valid = false;
        } else {
            clearError(fechaRangoInput);
        }

        if (valid) {
            const generatedURL = generarURLTours();
            if (generatedURL) {
                window.location.href = generatedURL;
                if (destinoInput) destinoInput.value = "";
                if (fechaRangoInput) fechaRangoInput.value = "";
            } else {
                alert("Por favor completa todos los campos obligatorios.");
            }
        }
    });

    const destinoInput = document.querySelector("#destino");
    if (destinoInput) {
        destinoInput.addEventListener("input", function () {
            this.classList.remove("input-error");
        });
    }

    const fechaRangoInput = document.querySelector("#fecha-rango");
    if (fechaRangoInput) {
        fechaRangoInput.addEventListener('change', function () {
            this.classList.remove("input-error");
        });
    }
}

function autocompleteSearchCiudadesTours() {
    autocompleteSearch(
        "#destino",
        "#autocomplete-list-destino",
        external_file_AirportsCities,
        "#destino-id",
        true // solo ciudades
    );
}

// --------------- FUNCIONES SIZE ---------------
function ajustarWidget() {
    var e, t, n = document.querySelector(".thim-ekit-single-tour__content"); n && (e = 1024 <= window.innerWidth, t = n.offsetWidth < 1e3, n.classList.toggle("widget-ajustado", e && t))
}