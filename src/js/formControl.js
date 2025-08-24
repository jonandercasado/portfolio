document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.querySelector('button.js-only');
  if (submitButton) {
    submitButton.style.display = 'inline-flex';
    submitButton.disabled = false;
  }

  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  const inputs = {
    name: form.elements['name'],
    apellidos: form.elements['apellidos'],
    email: form.elements['email'],
    subject: form.elements['subject'],
    message: form.elements['message'],
    _gotcha: form.elements['_gotcha']
  };

  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function isOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  function setError(input, message) {
    input.classList.add('error');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = 'block';
      errorSpan.setAttribute('aria-live', 'polite');
    }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }
  }

  function showFormMessage(message, type = 'error') {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        formMessage.style.display = 'none';
        form.reset();
        Object.values(inputs).forEach(clearError);
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
      }, 4000);
    }
  }

  function validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    let valid = false;
    let errorMessage = '';

    switch (name) {
      case 'name':
        if (!value) errorMessage = 'El nombre es obligatorio.';
        else if (isOnlyNumbers(value)) errorMessage = 'El nombre no puede contener solo números.';
        else if (value.length < 2) errorMessage = 'El nombre debe tener al menos 2 caracteres.';
        else valid = true;
        break;

      case 'apellidos':
        if (!value) errorMessage = 'Los apellidos son obligatorios.';
        else if (isOnlyNumbers(value)) errorMessage = 'Los apellidos no pueden contener solo números.';
        else if (value.length < 2) errorMessage = 'Los apellidos deben tener al menos 2 caracteres.';
        else valid = true;
        break;

      case 'email':
        if (!value) errorMessage = 'El email es obligatorio.';
        else if (!isValidEmail(value)) errorMessage = 'El email debe ser válido.';
        else valid = true;
        break;

      case 'subject':
        if (!value) errorMessage = 'El asunto es obligatorio.';
        else if (value.length < 4) errorMessage = 'El asunto debe tener al menos 4 caracteres.';
        else valid = true;
        break;

      case 'message':
        if (!value) errorMessage = 'El mensaje es obligatorio.';
        else if (value.length < 10) errorMessage = 'El mensaje debe tener al menos 10 caracteres.';
        else valid = true;
        break;

      case '_gotcha':
        if (value) valid = false;
        else valid = true;
        break;
    }

    if (!valid) {
      setError(input, errorMessage);
    } else {
      clearError(input);
      if ((name === 'name' || name === 'apellidos') && value) {
        input.value = capitalizeWords(input.value);
      }
    }

    return valid;
  }

  // Capitalización en tiempo real
  ['name', 'apellidos'].forEach(fieldName => {
    const input = inputs[fieldName];
    input.addEventListener('input', () => {
      const cursorPos = input.selectionStart;
      input.value = capitalizeWords(input.value);
      input.setSelectionRange(cursorPos, cursorPos);
      validateField(input);
    });
  });

  // Validación onBlur
  ['email', 'subject', 'message'].forEach(fieldName => {
    const input = inputs[fieldName];
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateField(inputs._gotcha)) {
      return;
    }

    let allValid = true;
    Object.values(inputs).forEach(input => {
      if (input.name !== '_gotcha' && !validateField(input)) allValid = false;
    });

    if (!allValid) {
      showFormMessage('Por favor, corrige los campos marcados en rojo.', 'error');
      return;
    }

    // Desactivar botón
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    // Crear datos sanitizados
    const sanitizedData = {
      name: sanitizeInput(inputs.name.value.trim()),
      apellidos: sanitizeInput(inputs.apellidos.value.trim()),
      email: sanitizeInput(inputs.email.value.trim()),
      subject: sanitizeInput(inputs.subject.value.trim()),
      message: sanitizeInput(inputs.message.value.trim())
    };

    // Convertir en FormData para enviar
    const formData = new FormData();
    for (let key in sanitizedData) {
      formData.append(key, sanitizedData[key]);
    }

    formData.append('_gotcha', '');

    try {
      const response = await fetch('https://formspree.io/f/direccionFormSpree', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        showFormMessage('Mensaje enviado correctamente. ¡Gracias!', 'success');
      } else {
        const data = await response.json();
        const errorMsg = data.error || 'Hubo un problema al enviar el formulario.';
        showFormMessage(errorMsg, 'error');
        submitButton.disabled = false;
      }
    } catch (error) {
      showFormMessage('Error de red. Intenta más tarde.', 'error');
      submitButton.disabled = false;
    }
  });
});