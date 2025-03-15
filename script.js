document.addEventListener("DOMContentLoaded", function () {
    const widgetContainer = document.getElementById("widget-aviajar");
    if (!widgetContainer) return;

    // Crear el formulario del widget
    widgetContainer.innerHTML = `
        <style>
            .aviajar-widget {
                font-family: Arial, sans-serif;
                background: #fff;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 350px;
            }
            .aviajar-widget input, .aviajar-widget select, .aviajar-widget button {
                width: 100%;
                margin-bottom: 10px;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            .aviajar-widget button {
                background: #ffcc00;
                border: none;
                font-size: 16px;
                cursor: pointer;
            }
            .aviajar-widget button:hover {
                background: #e6b800;
            }
        </style>
        <div class="aviajar-widget">
            <h3>Buscar Paquetes en Oferta</h3>
            <label>Origen:</label>
            <input type="text" id="origin" placeholder="Ingrese una ciudad">
            <label>Destino:</label>
            <input type="text" id="destination" placeholder="Ingrese una ciudad">
            <label>Fecha de Partida:</label>
            <input type="date" id="departure">
            <label>Fecha de Regreso:</label>
            <input type="date" id="return">
            <label>Habitaciones:</label>
            <select id="rooms">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <label>Personas:</label>
            <select id="people">
                <option value="1">1</option>
                <option value="2" selected>2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <button id="search">Buscar</button>
        </div>
    `;

    // Agregar evento al botón de búsqueda
    document.getElementById("search").addEventListener("click", function () {
        const origin = document.getElementById("origin").value;
        const destination = document.getElementById("destination").value || widgetContainer.getAttribute("destination");
        const departure = document.getElementById("departure").value;
        const returnDate = document.getElementById("return").value;
        const rooms = document.getElementById("rooms").value;
        const people = document.getElementById("people").value;

        alert(`Buscando paquetes de ${origin} a ${destination}\nSalida: ${departure}\nRegreso: ${returnDate}\nHabitaciones: ${rooms}\nPersonas: ${people}`);
    });
});
