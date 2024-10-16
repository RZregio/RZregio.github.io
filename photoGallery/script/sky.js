//Create sky collection
const skyImages = [
    {
        src: "res/sky/cloudJam.jpg",
        title: "Cloud Jam",
        description: "The photo shows a peaceful sky filled with soft, light clouds. The sky has a pale blue hue, and the clouds appear wispy and delicate, with hints of pastel colors—likely from the soft glow of sunlight or approaching sunset. The scene exudes calmness and tranquility, with a light and airy atmosphere."
    },
    {
        src: "res/sky/cloudPortion.jpg",
        title: "Cloud Portion",
        description: "This photo beautifully captures a serene scene where a vibrant blue sky meets a portion of soft, fluffy clouds. The bright, rich blue on the left gradually blends with the white, giving the impression of a peaceful and open atmosphere. The clouds, with their gentle, billowy forms, seem to be floating effortlessly, bringing a sense of calm and relaxation to the viewer. The simplicity of the composition emphasizes the natural beauty of the sky, inviting a moment of quiet reflection on the vastness and tranquility above."
    },
    {
        src: "res/sky/cloudStraction.jpg",
        title: "CloudStraction",
        description: "This photo captures the natural beauty of a bright day, with a clear blue sky dotted by fluffy white clouds. Silhouetted against this vibrant backdrop are the intricate branches and leaves of tall trees, their dark forms creating a striking contrast with the sky. The trees, with their thin, winding branches, add a sense of depth and texture to the image. The interplay between the rich blues and the delicate green foliage evokes a feeling of calm and connection with nature, as if inviting the viewer to pause and appreciate the serene surroundings."
    },
    {
        src: "res/sky/cloudyMountain.jpg",
        title: "Cloudy Mountain",
        description: "This photo presents a moody and dramatic scene, with dark clouds gathering over a lush, green mountain landscape. The dense clouds dominate the sky, hinting at an approaching storm or rainfall. The mountain's silhouette rises subtly against the cloudy backdrop, its dark form almost blending into the deep green vegetation below. A small house sits to the right, partially hidden by tall grass and foliage, adding a sense of solitude to the scene. The contrast between the impending clouds and the natural greenery creates a powerful atmosphere, capturing the calm before the storm and the beauty of nature’s intensity."
    },
    {
        src: "res/sky/jellyCloud.jpg",
        title: "Jelly Cloud",
        description: "This photo captures a striking cloud formation that resembles a glowing dome or halo against a soft, pastel sky. The cloud’s rounded shape is accentuated by the sun’s light streaming from behind, giving its edges a golden, almost ethereal glow. The surrounding sky is painted in gentle shades of lavender, peach, and blue, creating a tranquil and dreamlike ambiance. The unique shape and illumination of the cloud evoke a sense of wonder, as if it were a surreal, floating island in the sky. This natural spectacle highlights the beauty and artistry of clouds, offering a moment of awe and inspiration."
    },
    {
        src: "res/sky/shallowNoon.jpg",
        title: "Shallow Noon",
        description: "This image captures a serene sky painted in warm shades of pink and orange, suggesting a beautiful transition during sunrise or sunset. The soft hues create a calming, almost dreamlike atmosphere, with subtle, darker clouds scattered across the sky. Their gentle shapes blend harmoniously into the colorful backdrop, evoking a sense of tranquility and warmth. The overall composition feels peaceful, as if inviting the viewer to pause and appreciate the fleeting beauty of nature’s quiet moments."
    },
    {
        src: "res/sky/sunDown.jpg",
        title: "Sun Down",
        description: "This image beautifully captures the soft light of the sun filtering through a delicate haze in the sky, casting an ethereal glow around it. The silhouetted tree in the foreground adds a touch of contrast, its dark leaves standing out sharply against the pastel hues of the background. Faint hints of orange and pink seem to blend with the gentle blue sky, hinting at a tranquil, late afternoon or early evening. The lines from nearby power cables stretch across the scene, subtly grounding the peaceful view in an everyday setting, blending the serenity of nature with subtle traces of urban life."
    },
];

let currentsky = 0;

function updateskyCarousel() {
    const currentImage = skyImages[currentsky];
    document.getElementById("sky-image").src = currentImage.src;
    document.getElementById("sky-title").textContent = currentImage.title;
    document.getElementById("sky-description").textContent = currentImage.description;
}

function nextSky() {
    currentsky = (currentsky + 1) % skyImages.length;
    updateskyCarousel();
}

function prevSky() {
    currentsky = (currentsky - 1 + skyImages.length) % skyImages.length;
    updateskyCarousel();
}

updateskyCarousel();
