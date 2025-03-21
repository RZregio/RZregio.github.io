//Script to change the theme of the website
var colorMode = "light";
function changeColorMode() {
    if (colorMode == "light") {
        document.getElementById("body").setAttribute("data-bs-theme", "dark");
        document.getElementById("btnColor").innerHTML = "Light Mode";
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        colorMode = "dark";
    } else {
        document.getElementById("body").setAttribute("data-bs-theme", "light");
        document.getElementById("btnColor").innerHTML = "Dark Mode";
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        colorMode = "light";
    }
}

//Script to have nave link hover effect
var navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(navLink =>{
    navLink.addEventListener('mouseenter', () =>{
        navLink.style.textShadow =  'rgb(161, 123, 27, 0.7) 2px 2px 2px';  
    });
    
    navLink.addEventListener('mouseleave', () =>{
        navLink.style.textShadow = 'none';
    });
})

//Script to have slides button hover effect
var buttonSlides = document.querySelectorAll(".slide");

buttonSlides.forEach(buttonSlide =>{
    buttonSlide.addEventListener('mouseenter', () =>{
        buttonSlide.style.background =  '#a17b1b';  
        buttonSlide.style.transform = 'translateY(-5px)';
        buttonSlide.style.boxShadow =  'rgb(161, 123, 27, 0.7) 2px 2px 2px';  
    });
    
    buttonSlide.addEventListener('mouseleave', () =>{
        buttonSlide.style.background = '#DAA520';
        buttonSlide.style.transform = 'translateY(0px)';
        buttonSlide.style.boxShadow = 'none';
    });
})

//Script to have slides picture hover effect
var imageSlides = document.querySelectorAll(".slide-image");

imageSlides.forEach(imageSlide =>{
    imageSlide.addEventListener('mouseenter', () =>{
        imageSlide.style.boxShadow =  'rgb(161, 123, 27, 0.7) 2px 2px 2px';  
        imageSlide.style.transform = 'translateY(-20px)';
    });
    
    imageSlide.addEventListener('mouseleave', () =>{
        imageSlide.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15), 0 15px 40px rgba(0, 0, 0, 0.1)';
        imageSlide.style.transform = 'translateY(0px)';
    });
})


