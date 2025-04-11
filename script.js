document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const dots = document.querySelectorAll('.dot');
    const carouselContainer = document.querySelector('.carousel-container');
    
    // Configuración del carrusel
    const originalCards = 25;
    const duplicatedCards = 2;
    let currentIndex = duplicatedCards;
    const cardWidth = cards[0].offsetWidth + 20;
    let visibleCards = Math.floor(carouselContainer.offsetWidth / cardWidth);
    let selectedCard = null;
    let isMobile = window.innerWidth <= 768;

    // Función para inicializar el carrusel
    function setupCarousel() {
        isMobile = window.innerWidth <= 768;
        visibleCards = Math.floor(carouselContainer.offsetWidth / cardWidth);
        goToIndex(duplicatedCards, false);
    }
    
    // Actualiza los puntos indicadores
    function updateDots() {
        const realIndex = (currentIndex - duplicatedCards) % originalCards;
        const positiveIndex = realIndex < 0 ? originalCards + realIndex : realIndex;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === positiveIndex);
        });
    }
    
    // Mueve el carrusel a una posición específica
    function goToIndex(index, animate = true) {
        currentIndex = index;
        const containerWidth = carouselContainer.offsetWidth;
        const offset = (containerWidth - (cardWidth * visibleCards)) / 2;
        
        if (animate) {
            carousel.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carousel.style.transition = 'none';
        }
        
        carousel.style.transform = `translateX(${offset - (currentIndex * cardWidth)}px)`;
        updateDots();
        
        // Lógica para el efecto infinito
        if (currentIndex <= 1) {
            setTimeout(() => {
                currentIndex = originalCards + duplicatedCards + currentIndex - 2;
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(${offset - (currentIndex * cardWidth)}px`;
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 500);
        } else if (currentIndex >= cards.length - visibleCards - 1) {
            setTimeout(() => {
                currentIndex = currentIndex - originalCards;
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(${offset - (currentIndex * cardWidth)}px`;
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 500);
        }
    }
    
    // Manejar selección de carta en móvil
    function handleCardSelection(card) {
        if (!isMobile) return;
        
        // Si ya está seleccionada, mostrar contenido
        if (card === selectedCard) {
            card.classList.toggle('show-content');
            return;
        }
        
        // Deseleccionar carta anterior
        if (selectedCard) {
            selectedCard.classList.remove('selected', 'show-content');
        }
        
        // Seleccionar nueva carta
        card.classList.add('selected');
        selectedCard = card;
        
        // Aplicar desenfoque a otras cartas
        carousel.classList.add('blur-cards');
    }
    
    // Event listeners para cartas
    cards.forEach(card => {
        // Click para móvil
        card.addEventListener('click', function() {
            handleCardSelection(this);
        });
        
        // Botón detalles para móvil
        const detailsBtn = card.querySelector('.details-btn');
        detailsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            card.classList.add('show-content');
        });
    });
    
    // Click fuera de las cartas para deseleccionar
    document.addEventListener('click', function(e) {
        if (!isMobile || !selectedCard) return;
        
        if (!e.target.closest('.card')) {
            selectedCard.classList.remove('selected', 'show-content');
            selectedCard = null;
            carousel.classList.remove('blur-cards');
        }
    });
    
    // Event listeners para navegación
    prevBtn.addEventListener('click', () => {
        goToIndex(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToIndex(currentIndex + 1);
    });
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToIndex(index + duplicatedCards);
        });
    });
    
    window.addEventListener('resize', setupCarousel);
    setupCarousel();
});