//Create flowers collection
const flowerImages = [
    {
        src: "res/flower/ixora.jpg",
        title: "Ixora",
        description: "The close-up photo of the Ixora flower showcases the delicate beauty of its vibrant blooms. The flowers display a stunning gradient of light red to pink hues, creating a visually striking contrast against their lush green leaves. Each cluster of tiny petals is intricately detailed, highlighting the flower's natural texture. The soft sunlight enhances the colors, giving the Ixora a fresh and lively appearance. This close-up captures the essence of tropical flora, celebrating the vivid beauty found in the region."
    },
    {
        src: "res/flower/lantana.jpg",
        title: "Lantana",
        description: "The close-up photo of the Lantana flower highlights the vibrant clusters of tiny blossoms, showcasing a stunning blend of colors ranging from bright yellow to deep orange and soft pink. Each flower features a unique arrangement of petals that create a cheerful and lively appearance. The rich green foliage provides a beautiful backdrop, enhancing the overall brightness of the scene. The intricate details of the flower's texture and structure are beautifully captured, reflecting the charm and diversity of the tropical flora in the region."
    },
    {
        src: "res/flower/peaCock.jpg",
        title: "Peacock",
        description: "The close-up photo of the Peacock flower highlights its stunning reddish petals that transition into vibrant orange-hued buds. The intricate detail of the flower's texture is beautifully showcased, with the petals elegantly unfolding. The striking colors create a captivating contrast against the lush green foliage surrounding it, enhancing the flower's vivid appearance. This close-up captures the exotic charm of the Peacock flower, making it a standout feature of the region's tropical landscape."
    },
    {
        src: "res/flower/peruvianZinnia.jpg",
        title: "Peruvian Zinnia",
        description: "The close-up photo of the Peruvian zinnia flower showcases its vibrant pinkish color tones, creating a striking visual impact. Each petal is delicately layered, forming a lush, textured bloom that exudes freshness and vitality. The rich pink hues range from soft pastel shades to deeper, more vibrant tones, adding depth and dimension to the flower. Surrounding foliage provides a beautiful contrast, enhancing the zinnia's vivid colors. This close-up beautifully captures the charm and elegance of the Peruvian zinnia, celebrating its role in the garden's colorful display."
    },
    {
        src: "res/flower/sulfurCosmos.jpg",
        title: "Sulfur Cosmos",
        description: "The close-up photo of the sulfur cosmos flower features its bright orange petals, radiating warmth and vibrancy. The delicate, overlapping petals create a striking star-like shape, drawing the eye to the flower's central yellow disc. The rich orange hue is vivid and inviting, perfectly complemented by lush green foliage in the background. This close-up beautifully highlights the intricate details of the petals and the flower's overall cheerful disposition, capturing the essence of its sunny, tropical charm."
    },
    {
        src: "res/flower/whiteCrapeJasmine.jpg",
        title: "White Crape Jasmine",
        description: "The close-up photo of the white crape jasmine flower showcases its stunning star-shaped form, characterized by five perfectly symmetrical petals. The petals are pure white, exuding a sense of elegance and purity. Their smooth texture and delicate curves create a striking visual appeal, while the bright yellow center adds a subtle contrast. Surrounded by lush green leaves, this close-up captures the intricate beauty and simplicity of the crape jasmine, highlighting its charm in the garden setting."
    },
    {
        src: "res/flower/zinniaHaageana.jpg",
        title: "Zinnia Haageana",
        description: "The close-up photo of the Zinnia haageana highlights its cheerful yellowish tone, radiating warmth and vibrancy. Each petal is uniquely shaped, forming a lively, layered bloom that draws the eye. The rich yellow hues range from soft pastel shades to deeper golden tones, adding depth to the flower. Surrounding green foliage provides a fresh contrast, enhancing the zinnia's brightness. This close-up beautifully captures the lively essence of Zinnia haageana, celebrating its role in adding color and cheer to the garden."
    },
];

let currentFlower = 0;
let previousFlower = 0;

function updateFlowerCarousel() {
    const currentImage = flowerImages[currentFlower];
    const imgFlower = document.getElementById("flower-image").src = currentImage.src;
    document.getElementById("flower-title").textContent = currentImage.title;
    document.getElementById("flower-description").textContent = currentImage.description;
}

function flowerAnimation() {
    const imgFlower = document.getElementById("flower-image");
    
    if (currentFlower > previousFlower) {
        imgFlower.style.transform = "translateX(100%)"; 
    } else {
        imgFlower.style.transform = "translateX(-100%)"; 
    }
    
    void imgFlower.offsetWidth; 

    setTimeout(() => {
        imgFlower.style.transform = "translateX(0)";
    }, 50); 

    previousFlower = currentFlower;
}

function nextFlower() {
    currentFlower = (currentFlower + 1) % flowerImages.length;
    flowerAnimation();
    updateFlowerCarousel();
}

function prevFlower() {
    currentFlower = (currentFlower - 1 + flowerImages.length) % flowerImages.length;
    flowerAnimation();
    updateFlowerCarousel();
}

flowerAnimation();
updateFlowerCarousel();
