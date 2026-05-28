/* -----
Show More Toggle Logic
Handles the text and icon switch for the educational journey section expander.
----- */
const extraEducationSection = document.getElementById('moreSchools');
const toggleButton = document.getElementById('schoolButton');

// Update button text when the section is expanded
extraEducationSection.addEventListener('show.bs.collapse', function () {
    toggleButton.innerHTML = 'SHOW LESS <i class="bi bi-chevron-up"></i>';
});

// Update button text when the section is collapsed
extraEducationSection.addEventListener('hide.bs.collapse', function () {
    toggleButton.innerHTML = 'SHOW MORE <i class="bi bi-chevron-down"></i>';
});