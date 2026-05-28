/* -----
Horizontal Slider Navigation
Smoothly scrolls custom slider containers left or right based on the given direction.
----- */
function slide(sliderContainerId, scrollDirection) {
    const sliderElement = document.getElementById(sliderContainerId);

    // Calculate scroll distance based on 80% of the visible container width
    const scrollDistance = sliderElement.clientWidth * 0.8;

    sliderElement.scrollBy({
        left: scrollDirection * scrollDistance,
        behavior: 'smooth'
    });
}