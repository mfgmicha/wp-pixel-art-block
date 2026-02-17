/**
 * Pixel Art Block - Frontend Interactive Script
 *
 * Makes the pixel grid clickable on the frontend.
 * Clicking a pixel toggles its painted state.
 */

document.addEventListener('DOMContentLoaded', function() {
    const block = document.querySelector('.wp-block-mfgmicha-pixel-art');
    if (!block) return;
    
    // Get the color from data attribute, default to black
    const selectedColor = block.dataset.selectedColor || '#000000';
    
    const pixels = document.querySelectorAll('.pixel-art-pixel');
    
    pixels.forEach(function(pixel) {
        pixel.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('is-painted');
            
            // Apply color when painted, remove when not
            if (this.classList.contains('is-painted')) {
                this.style.backgroundColor = selectedColor;
            } else {
                this.style.backgroundColor = '#ffffff';
            }
        });
        
        // Make it look clickable
        pixel.style.cursor = 'pointer';
    });
});
