// =============================================
// MODAL CONTROL
// =============================================

function mostrarLogin() {
  cerrarModales();
  const modal = document.getElementById("modalLogin");
  if (modal) modal.style.display = "block";
}

function mostrarRegistro() {
  window.location.href = "registro_cuidador.html";
}

function mostrarAccesoPaciente() {
  cerrarModales();
  const modal = document.getElementById("modalPaciente");
  if (modal) modal.style.display = "block";
}

function cerrarModales() {
  document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
}

// =============================================
// LOGIN DE CUIDADOR (CON BACKEND)
// =============================================

async function iniciarSesion() {
  const email = document.getElementById("loginEmail")?.value?.trim() || "";
  const password = document.getElementById("loginPassword")?.value || "";

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

    // Manejo mejorado de respuesta JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error("Respuesta del servidor no es válida. ¿Backend encendido?");
    }

    console.log("LOGIN RESPONSE:", data);

    if (data.success) {
      // LIMPIAR datos antiguos antes de guardar los nuevos
      localStorage.removeItem('nombreCuidador');
      localStorage.removeItem('usuarioActivo');
      
      alert(`¡Bienvenido/a, ${data.user.nombre}!`);
      localStorage.setItem('usuarioActivo', JSON.stringify(data.user));
      cerrarModales();
      window.location.href = "bienvenida.html";
    } else {
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
  const codigoIngresado = document.getElementById("codigoPacienteInput")?.value?.trim().toUpperCase() || "";

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

    // Manejo mejorado de respuesta JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error("Respuesta del servidor no es válida. ¿Backend encendido?");
    }

    console.log("ACCESO PACIENTE RESPONSE:", data);

    if (data.success) {
      // LIMPIAR sesión de cuidador si existe
      localStorage.removeItem('nombreCuidador'); 
      localStorage.removeItem('usuarioActivo');
      
      localStorage.setItem("usuarioActivo", JSON.stringify(data.paciente));
      window.location.href = "panel_paciente.html";
    } else {
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

// Auto-ejecutable para vista previa de color
(function() {
  const colorInput = document.getElementById("colorPaciente");
  const colorPreview = document.getElementById("colorPreview");
  
  if (colorInput && colorPreview) {
    // Establecer color inicial
    colorPreview.style.backgroundColor = colorInput.value;
    
    colorInput.addEventListener("input", function () {
      colorPreview.style.backgroundColor = colorInput.value;
    });
  }
})();

// =============================================
// REGISTRO DE CUIDADOR (CON BACKEND)
// =============================================

if (document.getElementById("formRegistroCuidador")) {
  document.getElementById("formRegistroCuidador").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Validación HTML5 nativa primero
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    // Confirmación si el nivel de demencia no es leve
    const nivel = document.getElementById("nivelDemencia")?.value || "";
    if (nivel && nivel !== "leve") {
      if (!confirm("La plataforma está dirigida a pacientes con demencia leve. ¿Deseas continuar de todos modos?")) {
        return;
      }
    }

    // Datos del cuidador con optional chaining
    const cuidadorData = {
      nombre: document.getElementById("nombreCuidador")?.value?.trim() || "",
      fecha_nacimiento: document.getElementById("fechaNacCuidador")?.value || "",
      parentesco: document.getElementById("parentesco")?.value?.trim() || "",
      celular: document.getElementById("celularCuidador")?.value?.trim() || "",
      email: document.getElementById("correo")?.value?.trim() || "",
      password: document.getElementById("contrasena")?.value || ""
    };

    // Datos del paciente con optional chaining
    const pacienteData = {
      nombre: document.getElementById("nombrePaciente")?.value?.trim() || "",
      fecha_nacimiento: document.getElementById("fechaNacPaciente")?.value || "",
      condiciones_medicas: document.getElementById("condicionesMedicas")?.value?.trim() || "",
      nivel_demencia: document.getElementById("nivelDemencia")?.value || "",
      color_hex: document.getElementById("colorPaciente")?.value || "#3b82f6"
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

    console.log("REGISTRO PAYLOAD:", { cuidador: cuidadorData, paciente: pacienteData });

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

      // Manejo mejorado de respuesta JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        throw new Error("Respuesta del servidor no es válida. ¿Backend encendido?");
      }

      console.log("REGISTRO RESPONSE:", data);

      if (data.success) {
        // Mostrar código generado
        const divCodigo = document.getElementById("codigoPaciente");
        if (divCodigo) {
          divCodigo.style.display = "block";
          divCodigo.textContent = "Código generado para el paciente: " + (data.codigoPaciente || "(sin código)");
        }

        // Mostrar botón de continuar
        const btnContinuar = document.getElementById("btnContinuar");
        if (btnContinuar) {
          btnContinuar.style.display = "block";
        }

        // Guardar el usuario activo completo
        if (data.cuidador) {
          const usuarioActivo = {
            id: data.cuidador.id,
            nombre: data.cuidador.nombre,
            email: data.cuidador.email,
            parentesco: data.cuidador.parentesco,
            celular: data.cuidador.celular
          };
          localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        }

        alert("✅ Registro exitoso");
      } else {
        alert("Error en el registro: " + (data.message || "Desconocido"));
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

// Auto-ejecutable para botón continuar
(function() {
  const btnContinuar = document.getElementById("btnContinuar");
  if (btnContinuar) {
    btnContinuar.addEventListener("click", function () {
      window.location.href = "bienvenida.html"; 
    });
  }
})();

// =============================================
// CÓDIGO VIEJO (COMENTADO - NO USAR)
// =============================================
/*
// 
*/