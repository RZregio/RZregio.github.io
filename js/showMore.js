const extraEdu = document.getElementById('moreSchools');
const btn = document.getElementById('schoolButton');

extraEdu.addEventListener('show.bs.collapse', function () {
    btn.innerHTML = 'SHOW LESS <i class="bi bi-chevron-up"></i>';
});

extraEdu.addEventListener('hide.bs.collapse', function () {
    btn.innerHTML = 'SHOW MORE <i class="bi bi-chevron-down"></i>';
});
