//Create landscape collection
const landscapeImages = [
    {
        src: "res/landscape/bkSTB.jpg",
        title: "Burger King of Santo Tomas",
        description: "Burger King in Santo Tomas, Batangas, is a popular fast-food restaurant known for its flame-grilled burgers, including the iconic Whopper. The location offers a casual dining experience with a menu featuring a variety of burgers, chicken sandwiches, sides, and beverages. It serves both dine-in and takeout options, making it a convenient choice for locals and visitors. The restaurant is designed with a modern ambiance, providing a comfortable space for families and friends to enjoy their meals. Overall, it’s a go-to spot for quick, satisfying bites in the area."
    },
    {
        src: "res/landscape/countrySideScene.jpg",
        title: "Country Side Scenery",
        description: "The photo captures a peaceful rural landscape near Mount Makiling, framed by lush green trees in the foreground. A grazing water buffalo can be seen on the open land, while a road and small structures blend into the natural surroundings. In the background, the forest-covered slopes of Mount Makiling rise against a bright blue sky with soft clouds, creating a serene and scenic view."
    },
    {
        src: "res/landscape/highWay.jpg",
        title: "Highway Scenery",
        description: "The highway scenery near Lianas Building in Santo Tomas, Batangas, presents a bustling view typical of a vibrant urban area. Lined with palm trees and local shops, the wide road is flanked by a mix of commercial establishments and residential properties. Vehicles of various sizes—cars, motorcycles, and buses—travel along the highway, creating a dynamic atmosphere. The backdrop features the rolling hills of Batangas, adding a touch of natural beauty to the scene. This intersection of urban life and scenic landscape captures the essence of Santo Tomas, making it a lively and inviting place."
    },
    {
        src: "res/landscape/lifestyle.jpg",
        title: "Lifestyle Strip",
        description: "The photo of the Lifestyle Strip in Santo Tomas, Batangas, captures a bright and inviting scene under a clear blue sky. The modern buildings line the strip, showcasing a mix of retail shops and dining establishments. Sunlight reflects off the glass facades, enhancing the vibrant colors of the surroundings. Lush greenery and well-maintained walkways add a touch of nature to the urban landscape, creating a welcoming atmosphere. The overall image conveys a sense of community and leisure, making it an appealing destination for both locals and visitors."
    },
    {
        src: "res/landscape/municipalFence.jpg",
        title: "Santo Tomas Municipal Outskirt",
        description: "The photo of the municipal fence in Santo Tomas, Batangas, features a striking yellow-painted structure that stands out against the clear blue sky. Flanking the fence are neatly lined palm trees, adding a tropical touch to the scene. Prominently displayed are two Philippine flags, symbolizing national pride and local identity. The vibrant colors of the fence and flags create a lively and welcoming atmosphere, capturing the essence of the community and its connection to the rich cultural heritage of the Philippines."
    },
    {
        src: "res/landscape/pup2023.jpg",
        title: "PUPSTC 2023",
        description: "The photo of PUP STC (Polytechnic University of the Philippines - Santo Tomas Campus) in 2023 captures a dynamic campus scene with the obelisk prominently featured in the foreground, symbolizing the university's rich heritage. The main building showcases its architectural design against a backdrop of lush grassland. The old gym and octagon, now removed to make way for new construction, serve as a reminder of the campus's evolving landscape. Above, a beautiful cloudy blue sky enhances the scene, reflecting the spirit of growth and transformation within the university community as it prepares for future developments."
    },
    {
        src: "res/landscape/pupGround.jpg",
        title: "PUP Ground",
        description: "The photo taken from the third floor of the PUP building in Santo Tomas, Batangas, offers a breath-taking view of the campus grounds. In the foreground, a well-maintained grass area stretches out, bordered by a roadway that provides access to various facilities. The gym is visible nearby, alongside a portion of the main building, showcasing the architectural features of the campus. Lined palm trees add a touch of greenery, creating a tropical ambiance. Prominently featured is a Philippine flag structure, symbolizing national pride and unity. The scene captures the vibrant and inviting atmosphere of the university, highlighting its blend of nature and education."
    },
    {
        src: "res/landscape/pupStbEntrance.jpg",
        title: "PUP STB Entrance",
        description: "The photo of the PUP STC (Polytechnic University of the Philippines - Santo Tomas Campus) entrance in Santo Tomas, Batangas, showcases a welcoming facade that reflects the university's vibrant atmosphere. The entrance features modern architectural elements, with a clear signage that proudly displays the university's name. Lush greenery and well-maintained pathways lead up to the gates, enhancing the inviting ambiance. Students and visitors can be seen entering and exiting, highlighting the campus's lively community. The overall scene captures the spirit of education and growth, making it a prominent landmark in the area."
    },
    {
        src: "res/landscape/smSTB.jpg",
        title: "SM Santo Tomas",
        description: "The photo of SM Santo Tomas in Batangas captures a striking view of the building's facade, prominently displaying the iconic SM logo and name. The clean lines and modern design of the structure stand out against a clear blue sky, creating a vibrant and inviting atmosphere. Sunlight reflects off the surfaces, emphasizing the building's contemporary features. This image encapsulates the essence of the shopping destination, symbolizing convenience and community in Santo Tomas."
    },
    {
        src: "res/landscape/smSTBScene.jpg",
        title: "SM Santo Tomas Interior",
        description: "The interior photo of SM Santo Tomas in Batangas presents a unique jungle-themed ambiance, characterized by warm golden and yellowish tones that create an inviting atmosphere. Lush greenery and decorative elements enhance the vibrant environment, immersing visitors in a lively, nature-inspired setting. A distinctive green cat structure, positioned in the upper part of the photo, adds a whimsical touch to the decor, making it a focal point of the space. Overall, the interior exudes a playful yet sophisticated vibe, reflecting a blend of modern retail and natural aesthetics."
    },
    {
        src: "res/landscape/stoneFormation.jpg",
        title: "Stone at Rest",
        description: "The photo features a small garden area with a cluster of large, smooth stones as the focal point. The stones are arranged on a slightly raised patch of bare soil, surrounded by smaller pebbles and fallen leaves. The ground is partially shaded, with sunlight filtering through, casting soft light and shadows over the stones and the surrounding earth. Small plants and greenery sprout from the soil, adding a natural touch to the simple and serene scene."
    },
];

let currentLandscape = 0;
let previousLandscape = 0;

function updateLandscapeCarousel() {
    const currentImage = landscapeImages[currentLandscape];
    const imgElement = document.getElementById("landscape-image").src = currentImage.src;
    document.getElementById("landscape-title").textContent = currentImage.title;
    document.getElementById("landscape-description").textContent = currentImage.description;
}

function slideAnimation() {
    const imgElement = document.getElementById("landscape-image");
    
    if (currentLandscape > previousLandscape) {
        imgElement.style.transform = "translateX(100%)"; 
    } else {
        imgElement.style.transform = "translateX(-100%)"; 
    }
    
    void imgElement.offsetWidth; 

    setTimeout(() => {
        imgElement.style.transform = "translateX(0)";
    }, 50); 

    previousLandscape = currentLandscape;
}

function nextLandscape() {
    currentLandscape = (currentLandscape + 1) % landscapeImages.length;
    slideAnimation();
    updateLandscapeCarousel();
}

function prevLandscape() {
    currentLandscape = (currentLandscape - 1 + landscapeImages.length) % landscapeImages.length;
    slideAnimation();
    updateLandscapeCarousel();
}

slideAnimation();
updateLandscapeCarousel();
