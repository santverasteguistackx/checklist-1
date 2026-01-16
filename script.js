// Variables globales
let qrcode = null;
let currentQRData = '';

// Elementos del DOM
const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const qrCodeContainer = document.getElementById('qr-code');
const sizeSelect = document.getElementById('size');
const colorDarkInput = document.getElementById('color-dark');
const colorLightInput = document.getElementById('color-light');

// Función para generar el código QR
function generateQR() {
    const text = textInput.value.trim();
   
    if (!text) {
        showNotification('Por favor ingresa algún texto o URL', 'error');
        return;
    }
   
    // Mostrar loading
    showLoading(true);
   
    // Limpiar QR anterior
    qrCodeContainer.innerHTML = '';
   
    // Crear nuevo QR
    setTimeout(() => {
        try {
            qrcode = new QRCode(qrCodeContainer, {
                text: text,
                width: parseInt(sizeSelect.value),
                height: parseInt(sizeSelect.value),
                colorDark: colorDarkInput.value,
                colorLight: colorLightInput.value,
                correctLevel: QRCode.CorrectLevel.H
            });
           
            currentQRData = text;
            showQRActions(true);
            showNotification('¡Código QR generado exitosamente!', 'success');
           
        } catch (error) {
            showNotification('Error al generar el código QR', 'error');
            console.error('Error:', error);
        } finally {
            showLoading(false);
        }
    }, 500);
}

// Función para descargar el QR como PNG
function downloadQR() {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('¡Código QR descargado!', 'success');
    }
}

// Función para copiar el QR al portapapeles
async function copyQR() {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (canvas) {
        try {
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    showNotification('¡Código QR copiado al portapapeles!', 'success');
                } catch (err) {
                    // Fallback para navegadores que no soportan Clipboard API
                    fallbackCopy(canvas);
                }
            });
        } catch (err) {
            fallbackCopy(canvas);
        }
    }
}

// Fallback para copiar usando un elemento temporal
function fallbackCopy(canvas) {
    const dataURL = canvas.toDataURL('image/png');
    const tempImg = document.createElement('img');
    tempImg.src = dataURL;
   
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = true;
    tempDiv.appendChild(tempImg);
   
    document.body.appendChild(tempDiv);
    tempDiv.focus();
   
    try {
        document.execCommand('copy');
        showNotification('¡Código QR copiado al portapapeles!', 'success');
    } catch (err) {
        showNotification('No se pudo copiar automáticamente', 'error');
    }
   
    document.body.removeChild(tempDiv);
}

// Función para mostrar/ocultar loading
function showLoading(show) {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
   
    if (show) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        generateBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        generateBtn.disabled = false;
    }
}

// Función para mostrar/ocultar acciones del QR
function showQRActions(show) {
    const actions = document.querySelector('.qr-actions');
    if (show) {
        actions.style.display = 'flex';
        qrCodeContainer.classList.add('active');
    } else {
        actions.style.display = 'none';
        qrCodeContainer.classList.remove('active');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type) {
    // Eliminar notificaciones anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
   
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
   
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
   
    // Colores según tipo
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    }
   
    document.body.appendChild(notification);
   
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
   
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Event listeners
generateBtn.addEventListener('click', generateQR);
downloadBtn.addEventListener('click', downloadQR);
copyBtn.addEventListener('click', copyQR);

// Generar QR al presionar Enter
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateQR();
    }
});

// Generar QR automáticamente al cambiar opciones
[sizeSelect, colorDarkInput, colorLightInput].forEach(element => {
    element.addEventListener('change', () => {
        if (textInput.value.trim() && qrcode) {
            generateQR();
        }
    });
});

// Auto-crear un ejemplo al cargar la página
window.addEventListener('load', () => {
    textInput.value = 'https://github.com';
    generateQR();
});
