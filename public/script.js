document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioReporte');
    const mensajeGlobal = document.getElementById('mensajeGlobal');
    const infoContainer = document.getElementById('infoContainer');

    const cliente = document.getElementById('cliente');
    const consola = document.getElementById('consola');
    const anio = document.getElementById('anio');
    const falla = document.getElementById('falla');

    const errorCliente = document.getElementById('errorCliente');
    const errorConsola = document.getElementById('errorConsola');
    const errorAnio = document.getElementById('errorAnio');
    const errorFalla = document.getElementById('errorFalla');

    form.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.target.classList.remove('invalid');
            const errorSpan = document.getElementById(`error${e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1)}`);
            if (errorSpan) errorSpan.textContent = '';
        }
    });

    function validarFormulario() {
        let esValido = true;

        [cliente, consola, anio, falla].forEach(el => el.classList.remove('invalid'));
        [errorCliente, errorConsola, errorAnio, errorFalla].forEach(sp => sp.textContent = '');

        const clienteVal = cliente.value.trim();
        const consolaVal = consola.value.trim();
        const anioVal = anio.value.trim();
        const fallaVal = falla.value.trim();

        // Validación: ningún campo vacío
        if (clienteVal === '') { errorCliente.textContent = 'El nombre es obligatorio.'; cliente.classList.add('invalid'); esValido = false; }
        if (consolaVal === '') { errorConsola.textContent = 'El modelo es obligatorio.'; consola.classList.add('invalid'); esValido = false; }
        if (anioVal === '') { errorAnio.textContent = 'El año es obligatorio.'; anio.classList.add('invalid'); esValido = false; }
        if (fallaVal === '') { errorFalla.textContent = 'La falla es obligatoria.'; falla.classList.add('invalid'); esValido = false; }

        if (!esValido) return false;

        // Validación solo letras y espacios en el cliente
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(clienteVal)) {
            errorCliente.textContent = 'Formato inválido: Solo se permiten letras.'; 
            cliente.classList.add('invalid'); esValido = false;
        }

        // Validación 4 dígitos en el año
        if (anioVal.length !== 4 || !/^\d+$/.test(anioVal)) {
            errorAnio.textContent = 'Debe ingresar 4 números.'; 
            anio.classList.add('invalid'); esValido = false;
        }

        // Validación de palabras que no se pueden usar en el modelo de la consola
        const groseriasConsola = ['aparato', 'feo', 'consola', 'malo', 'basura', 'inservible']; 
        const contieneGroseriaConsola = groseriasConsola.some(palabra => consolaVal.toLowerCase().includes(palabra));

        if (consolaVal.length < 3) { 
            errorConsola.textContent = 'El modelo debe contener al menos 3 caracteres.';
            consola.classList.add('invalid'); esValido = false;
        } else if (contieneGroseriaConsola) { 
            errorConsola.textContent = 'El nombre contiene palabras no permitidas en el registro.';
            consola.classList.add('invalid'); esValido = false;
        }

        // Validación no usar nombre del cliente en la falla
        if (fallaVal.toLowerCase() === clienteVal.toLowerCase()) {
            errorFalla.textContent = 'La descripción no puede ser igual al nombre del cliente.'; 
            falla.classList.add('invalid'); esValido = false;
        }

        return esValido;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) return; 

        const data = {
            cliente: cliente.value.trim(),
            consola: consola.value.trim(),
            anio: anio.value.trim(),
            falla: falla.value.trim()
        };

        try {
            const response = await fetch('/api/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data) 
            });

            if (response.ok) {
                mensajeGlobal.textContent = "Reporte guardado con éxito.";
                mensajeGlobal.className = "success-text";
                form.reset(); 
            } else {
                mensajeGlobal.textContent = "Error al guardar el reporte en el servidor.";
                mensajeGlobal.className = "error-text";
            }
        } catch (err) {
            mensajeGlobal.textContent = "Error de conexión.";
            mensajeGlobal.className = "error-text";
        }
    });

    document.getElementById('btnCargar').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/ultimo');
            
            if (infoContainer.firstChild) {
                infoContainer.removeChild(infoContainer.firstChild);
            }

            if (response.status === 404) {
                const noData = document.createElement('p');
                noData.textContent = 'No hay reportes en la base de datos.';
                infoContainer.appendChild(noData);
                return;
            }

            const ticket = await response.json();

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-dinamica';

            const h3 = document.createElement('h3');
            h3.textContent = 'Último Diagnóstico Guardado:';

            const p1 = document.createElement('p');
            p1.innerHTML = `Cliente: ${ticket.cliente}`;

            const p2 = document.createElement('p');
            p2.innerHTML = `Consola: ${ticket.consola} (${ticket.anio})`;

            const p3 = document.createElement('p');
            p3.innerHTML = `Falla: ${ticket.falla}`;

            cardDiv.appendChild(h3);
            cardDiv.appendChild(p1);
            cardDiv.appendChild(p2);
            cardDiv.appendChild(p3);
            infoContainer.appendChild(cardDiv);

        } catch (err) {
            alert('Error al conectar con la API.');
        }
    });
});