(function () {
    function createWidget() {
        const widgetContainer = document.getElementById('widget-aviajar');
        if (!widgetContainer) return;

        const products = widgetContainer.getAttribute('products') || 'AirHotel,Air,Hotel,Extras';
        const destination = widgetContainer.getAttribute('destination') || '';

        widgetContainer.innerHTML = `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px; width: 100%; max-width: 400px;">
                <h3 style="text-align: center;">Buscar Paquetes en Oferta</h3>
                <label>Origen:</label>
                <input type="text" placeholder="Ingrese una ciudad" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                <label>Destino:</label>
                <input type="text" placeholder="Ingrese una ciudad" value="${destination}" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                <label>Fechas:</label>
                <input id="fecha-rango" type="text" placeholder="Seleccione un rango de fechas" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                <label>Habitaciones:</label>
                <input type="number" min="1" value="1" style="width: 48%; padding: 8px; margin-bottom: 10px;">
                <input type="number" min="1" value="2" style="width: 48%; padding: 8px; margin-bottom: 10px;">
                <div style="margin-bottom: 10px;">
                    <input type="checkbox"> Solo vuelos con equipaje
                    <br>
                    <input type="checkbox"> Solo vuelos directos
                </div>
                <button id="buscar-btn" style="width: 100%; padding: 10px; background-color: #FFC107; border: none; cursor: pointer; font-size: 16px;">Buscar</button>
            </div>
        `;

        // Esperar a que Flatpickr esté cargado
        if (typeof flatpickr !== 'undefined') {
            flatpickr("#fecha-rango", {
                mode: "range",
                dateFormat: "Y-m-d",
                showMonths: 2,
                onClose: function(selectedDates) {
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