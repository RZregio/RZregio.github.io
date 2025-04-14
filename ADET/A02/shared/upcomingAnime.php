<?php
$animeData = [
  [
    'title' => 'One-Punch Man Season 3',
    'image' => 'res/animeCover/onePunchManS3.png',
    'genre' => 'Action, Comedy, Superhero',
    'status' => 'Upcoming',
    'type' => 'TV Series',
    'rating' => 'N/A',
    'episodes' => 'N/A',
    'minutes_per_episode' => 'N/A',
    'release_dates' => 'Fall 2025',
    'studio' => 'J.C. Staff',
    'source' => 'Manga',
    'popularity_rank' => 929,
    'rating_rank' => 'N/A',
    'people_added' => '279.5K users',
    'description' => 'Saitama, the hero who can defeat any opponent with a single punch, faces new adversaries and challenges in the third season of this satirical superhero series.'
  ],
  [
    'title' => 'My Dress-Up Darling Season 2',
    'image' => 'res/animeCover/myDressUpDarlingS2.png',
    'genre' => 'Romance, Comedy, Slice of Life',
    'status' => 'Upcoming',
    'type' => 'TV Series',
    'rating' => 'N/A',
    'episodes' => 'N/A',
    'minutes_per_episode' => 'N/A',
    'release_dates' => 'Summer 2025',
    'studio' => 'CloverWorks',
    'source' => 'Manga',
    'popularity_rank' => 1456,
    'rating_rank' => 'N/A',
    'people_added' => '175.7K users',
    'description' => 'The story continues with Wakana and Marin navigating their relationship and diving deeper into the world of cosplay and self-expression in season 2 of this heartwarming romantic series.'
  ],
  [
    'title' => 'The Saga of Tanya the Evil Season 2',
    'image' => 'res/animeCover/sagaOfTanyaTheEvilS2.png',
    'genre' => 'Action, Fantasy, Military',
    'status' => 'Upcoming',
    'type' => 'TV Series',
    'rating' => 'N/A',
    'episodes' => 'N/A',
    'minutes_per_episode' => 'N/A',
    'release_dates' => 'N/A',
    'studio' => 'NuT',
    'source' => 'Light Novel',
    'popularity_rank' => 1490,
    'rating_rank' => 'N/A',
    'people_added' => '171.6K users',
    'description' => 'The ambitious and ruthless Tanya Degurechaff continues her journey through a war-torn alternate world, facing off against powerful foes in season 2 of this military fantasy series.'
  ],
  [
    'title' => 'Hell’s Paradise Season 2',
    'image' => 'res/animeCover/hellsParadiseS2.png',
    'genre' => 'Action, Supernatural, Adventure',
    'status' => 'Upcoming',
    'type' => 'TV Series',
    'rating' => 'N/A',
    'episodes' => 'N/A',
    'minutes_per_episode' => 'N/A',
    'release_dates' => 'Winter 2026',
    'studio' => 'MAPPA',
    'source' => 'Manga',
    'popularity_rank' => 1640,
    'rating_rank' => 'N/A',
    'people_added' => '152.2K users',
    'description' => 'The journey of the condemned criminals on a mystical island continues as they battle supernatural creatures and uncover the island’s dark secrets in the second season of this thrilling supernatural series.'
  ],
  [
    'title' => 'Frieren: Beyond Journey’s End Season 2',
    'image' => 'res/animeCover/frierenS2.png',
    'genre' => 'Fantasy, Adventure, Drama',
    'status' => 'Upcoming',
    'type' => 'TV Series',
    'rating' => 'N/A',
    'episodes' => 'N/A',
    'minutes_per_episode' => 'N/A',
    'release_dates' => 'Winter 2026',
    'studio' => 'Madhouse',
    'source' => 'Manga',
    'popularity_rank' => 1640,
    'rating_rank' => 'N/A',
    'people_added' => '152.2K users',
    'description' => 'Frieren, the elf mage, embarks on her own journey after her long-lasting companions pass on. As she reflects on her adventures, she grows in a world that changes around her. Season 2 continues the heart-wrenching and reflective story.'
  ]
];

function compareReleaseDate($a, $b)
{
  $releaseDateA = strtotime($a['release_dates']);
  $releaseDateB = strtotime($b['release_dates']);

  if ($releaseDateA == $releaseDateB) {
    return 0;
  }
  return ($releaseDateA < $releaseDateB) ? -1 : 1;
}

usort($animeData, 'compareReleaseDate');
?>

<div class="container mt-4">
  <h3 class="mb-4">Upcoming Anime</h3>
  <?php
  foreach ($animeData as $anime) {
    ?>
    <div class="card mb-3 shadow-sm p-2">
      <div class="row g-2 align-items-stretch">

        <div class="col-md-3 col-12">
          <img src="<?php echo $anime['image']; ?>" class="img-fluid rounded w-100" alt="Anime Cover"
            style="max-height: 100%; object-fit: cover;">
        </div>

        <div class="col-md-9 col-12">
          <div class="card-body py-2 px-3">
            <h5 class="card-title mb-1"><?php echo $anime['title']; ?></h5>

            <p class="text-muted small mb-2">
              <strong>Genre:</strong> <?php echo $anime['genre']; ?><br>
              <strong>Status:</strong> <?php echo $anime['status']; ?> •
              <strong>Type:</strong> <?php echo $anime['type']; ?><br>
              <strong>Rating:</strong> ⭐ <?php echo $anime['rating']; ?>/10 •
              <strong>Episodes:</strong> <?php echo $anime['episodes']; ?> •
              <strong>Minutes/Episode:</strong> <?php echo $anime['minutes_per_episode']; ?><br>
              <strong>Total Runtime:</strong> <?php echo $anime['release_dates']; ?><br>
              <strong>Studio:</strong> <?php echo $anime['studio']; ?> •
              <strong>Source:</strong> <?php echo $anime['source']; ?>
            </p>

            <p class="card-text small mb-2">
              <?php echo $anime['description']; ?>
            </p>

            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm">Add to List</button>
              <button class="btn btn-outline-danger btn-sm">Remove from List</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <?php
  }
  ?>
</div>