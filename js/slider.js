function slide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const scrollAmount = slider.clientWidth * 0.8;

    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
