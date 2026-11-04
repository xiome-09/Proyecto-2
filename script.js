// --- FUNCIONES DE CÁLCULO Y VALIDACIÓN ---

function clasificarNota(promedio) {
    if (promedio >= 9.0) return "Excelente";
    if (promedio >= 7.0) return "Muy bueno";
    if (promedio >= 6.0) return "Aprobado";
    return "Reprobado";
}

function validarNota(valor) {
    const nota = parseFloat(valor);
    return !isNaN(nota) && nota >= 0.0 && nota <= 10.0;
}

// --- APARTADO 1 & 2: REGISTRO Y DESCARGA TXT ---

document.getElementById('form-notas').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const nie = document.getElementById('nie').value.trim();
    const n1Str = document.getElementById('nota1').value;
    const n2Str = document.getElementById('nota2').value;
    const n3Str = document.getElementById('nota3').value;
    const exStr = document.getElementById('examen').value;

    // Validaciones
    if (!validarNota(n1Str) || !validarNota(n2Str) || !validarNota(n3Str) || !validarNota(exStr)) {
        alert("⚠ ERROR: Todas las notas deben estar en el rango de 0.0 a 10.0.");
        return;
    }

    const n1 = parseFloat(n1Str);
    const n2 = parseFloat(n2Str);
    const n3 = parseFloat(n3Str);
    const ex = parseFloat(exStr);

    const promedioNum = (n1 + n2 + n3 + ex) / 4;
    const promedio = promedioNum.toFixed(2);
    const resultado = clasificarNota(promedioNum);

    // Mostrar el resultado en pantalla
    const resBox = document.getElementById('resultado-calculo');
    resBox.classList.remove('hidden');
    resBox.innerHTML = `
        <p><strong>ESTUDIANTE:</strong> ${nombre}</p>
        <p><strong>NIE:</strong> ${nie}</p>
        <p><strong>Promedio:</strong> ${promedio}</p>
        <p><strong>Resultado:</strong> ${resultado.toUpperCase()}</p>
    `;

    // Formato de línea para guardar en notas.txt
    // Formato: NIE|Nombre|Nota1|Nota2|Nota3|Examen|Promedio|Resultado
    const lineaTxt = `${nie}|${nombre}|${n1}|${n2}|${n3}|${ex}|${promedio}|${resultado}\n`;

    // Generar archivo descargable
    descargarLineaTxt(lineaTxt, `nota_${nie}.txt`);
});

function descargarLineaTxt(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8;' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
}

// --- APARTADO 7 & RETO ADICIONAL: CONSULTA DEL ARCHIVO ---

document.getElementById('btn-mostrar').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const archivo = fileInput.files[0];

    if (!archivo) {
        alert("Por favor, selecciona un archivo TXT primero.");
        return;
    }

    const lector = new FileReader();
    lector.onload = function(e) {
        const contenido = e.target.result;
        procesarYMostrarTXT(contenido);
    };
    lector.readAsText(archivo);
});

function procesarYMostrarTXT(contenido) {
    const lineas = contenido.split(/\r?\n/);
    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';

    let totalEstudiantes = 0;
    let aprobados = 0;
    let reprobados = 0;

    lineas.forEach(linea => {
        if (linea.trim() === '') return;

        const campos = linea.split('|');
        if (campos.length >= 8) {
            const nie = campos[0];
            const nombre = campos[1];
            const promedio = parseFloat(campos[6]).toFixed(2);
            const resultado = campos[7];

            // Crear fila en la tabla
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nie}</td>
                <td>${nombre}</td>
                <td>${promedio}</td>
                <td>${resultado}</td>
            `;
            tbody.appendChild(tr);

            // Métricas del reto adicional
            totalEstudiantes++;
            const promedioNum = parseFloat(campos[6]);
            if (promedioNum >= 6.0) {
                aprobados++;
            } else {
                reprobados++;
            }
        }
    });

    // Mostrar tabla y métricas
    document.getElementById('tabla-notas').classList.remove('hidden');
    document.getElementById('stats').classList.remove('hidden');
    
    document.getElementById('stat-total').textContent = totalEstudiantes;
    document.getElementById('stat-aprobados').textContent = aprobados;
    document.getElementById('stat-reprobados').textContent = reprobados;
}