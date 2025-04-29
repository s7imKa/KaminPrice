// Відкрити модальне вікно
function openModal(imageSrc) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
  }
  
  // Закрити модальне вікно
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  }
  


