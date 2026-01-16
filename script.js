// script.js
const input  = document.getElementById('texto');
const boton  = document.getElementById('btn');
const canvas = document.getElementById('canvas');

boton.addEventListener('click', generarQR);
input.addEventListener('keyup', e => { if (e.key === 'Enter') generarQR(); });

function generarQR() {
  const texto = input.value.trim();
  if (!texto) { input.focus(); return; }

  canvas.innerHTML = ''; // borra QR previo

  new QRCode(canvas, {
    text       : texto,
    width      : 220,
    height     : 220,
    colorDark  : '#000000',
    colorLight : '#ffffff',
    correctLevel : QRCode.CorrectLevel.H
  });
}
