
// =============================================
// MODAL CONTROL
// =============================================

function mostrarLogin() {
  cerrarModales();
  document.getElementById("modalLogin").style.display = "block";
}

function mostrarRegistro() {
  window.location.href = "registro_cuidador.html";
}

function mostrarAccesoPaciente() {
  cerrarModales();
  document.getElementById("modalPaciente").style.display = "block";
}

function cerrarModales() {
  document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
}

// =============================================
// LOGIN DE CUIDADOR (CON BACKEND)
// =============================================

async function iniciarSesion() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Validación básica
  if (!email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
  // ✅ LIMPIAR datos antiguos antes de guardar los nuevos
  localStorage.removeItem('nombreCuidador');
  localStorage.removeItem('usuarioActivo');
  
  alert(`¡Bienvenido/a, ${data.user.nombre}!`);
  localStorage.setItem('usuarioActivo', JSON.stringify(data.user));
  cerrarModales();
  window.location.href = "bienveidainicioss.html";
}
	else {
      alert(data.message || "Error en el login");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
  }
}

// =============================================
// ACCESO PACIENTE (CON BACKEND)
// =============================================

async function accesoPaciente() {
  const codigoIngresado = document.getElementById("codigoPacienteInput").value.trim().toUpperCase();

  if (!codigoIngresado) {
    alert("Por favor, ingresa un código");
    return;
  }

  try {
    const response = await fetch('/api/auth/acceso-paciente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo: codigoIngresado })
    });

    const data = await response.json();

    if (data.success) {
  // ✅ LIMPIAR sesión de cuidador si existe
  localStorage.removeItem('nombreCuidador'); 
  localStorage.removeItem('usuarioActivo');
  
  localStorage.setItem("usuarioActivo", JSON.stringify(data.paciente));
  window.location.href = "panel_paciente.html";
}
	else {
      alert(data.message || "Código inválido");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
  }
}

// =============================================
// VISTA PREVIA DEL COLOR (REGISTRO)
// =============================================

const colorInput = document.getElementById("colorPaciente");
const colorPreview = document.getElementById("colorPreview");

if (colorInput && colorPreview) {
  colorInput.addEventListener("input", function () {
    colorPreview.style.backgroundColor = colorInput.value;
  });
}

// =============================================
// REGISTRO DE CUIDADOR (CON BACKEND)
// =============================================

if (document.getElementById("formRegistroCuidador")) {
  document.getElementById("formRegistroCuidador").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Confirmación si el nivel de demencia no es leve
    const nivel = document.getElementById("nivelDemencia").value;
    if (nivel !== "leve") {
      if (!confirm("La plataforma está dirigida a pacientes con demencia leve. ¿Deseas continuar de todos modos?")) {
        return;
      }
    }

    // Datos del cuidador
    const cuidadorData = {
      nombre: document.getElementById("nombreCuidador").value.trim(),
      fecha_nacimiento: document.getElementById("fechaNacCuidador").value,
      parentesco: document.getElementById("parentesco").value.trim(),
      celular: document.getElementById("celularCuidador").value.trim(),
      email: document.getElementById("correo").value.trim(),
      password: document.getElementById("contrasena").value
    };

    // Datos del paciente
    const pacienteData = {
      nombre: document.getElementById("nombrePaciente").value.trim(),
      fecha_nacimiento: document.getElementById("fechaNacPaciente").value,
      condiciones_medicas: document.getElementById("condicionesMedicas").value.trim(),
      nivel_demencia: document.getElementById("nivelDemencia").value,
      color_hex: document.getElementById("colorPaciente").value
    };

    // Validaciones básicas
    if (!cuidadorData.email || !cuidadorData.password) {
      alert("Email y contraseña son obligatorios");
      return;
    }

    if (!pacienteData.nombre) {
      alert("El nombre del paciente es obligatorio");
      return;
    }

    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cuidador: cuidadorData, 
          paciente: pacienteData 
        })
      });

      const data = await response.json();

      if (data.success) {
        // Mostrar código generado
        const divCodigo = document.getElementById("codigoPaciente");
        divCodigo.style.display = "block";
        divCodigo.textContent = "Código generado para el paciente: " + data.codigoPaciente;

        // Mostrar botón de continuar
        document.getElementById("btnContinuar").style.display = "block";

        // Guardar el usuario activo completo (igual que en login)
		const usuarioActivo = {
  id: data.cuidador.id,
  nombre: data.cuidador.nombre,
  email: data.cuidador.email,
  parentesco: data.cuidador.parentesco,
  celular: data.cuidador.celular
		};
		localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo)); 

        console.log("Registro exitoso:", data);
      } else {
        alert("Error en el registro: " + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
    }
  });
}

// =============================================
// CONTINUAR DESPUÉS DEL REGISTRO
// =============================================

if (document.getElementById("btnContinuar")) {
  document.getElementById("btnContinuar").addEventListener("click", function () {
    window.location.href = "bienvenida.html";
  });
}

// =============================================
// CÓDIGO VIEJO (COMENTADO - PARA REFERENCIA)
// =============================================

/*
// CÓDIGO VIEJO CON LOCALSTORAGE (NO USAR)

function iniciarSesionViejo() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const cuidador = usuarios.find(
    (u) => u.tipo === "cuidador" && u.email === email && u.pass === password
  );

  if (cuidador) {
    alert(`¡Bienvenido/a, ${cuidador.nombre}!`);
    localStorage.setItem("usuarioActivo", JSON.stringify(cuidador));
    window.location.href = "bienvenida.html";
  } else {
    alert("Correo o contraseña incorrectos.");
  }
}

function accesoPacienteViejo() {
  const codigoIngresado = document.getElementById("codigoPacienteInput").value.trim().toUpperCase();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const paciente = usuarios.find(u => u.tipo === "paciente" && u.codigo === codigoIngresado);

  if (paciente) {
    localStorage.setItem("usuarioActivo", JSON.stringify(paciente));
    window.location.href = "panel_paciente.html";
  } else {
    alert("Código inválido o no encontrado.");
  }
}
*/


  /*localStorage.setItem("usuarios", JSON.stringify(usuarios));

  //  Simulación de envío de código por correo (desactivado)
  
  fetch('/enviar-correo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById("correo").value,
      codigoPaciente: codigo
    })
  });
  */

/*
function accesoPaciente() {
  const inputCodigo = document.getElementById("codigoPacienteInput").value.trim().toUpperCase();
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

  const paciente = pacientes.find(p => p.codigo === inputCodigo);

  if (paciente) {
    localStorage.setItem("codigoPacienteActivo", paciente.codigo);
    localStorage.setItem("nombrePacienteActivo", paciente.nombre);
    window.location.href = "panel_paciente.html";
  } else {
    alert("Código no válido. Verifica e intenta de nuevo.");
  }
}
 */ 
