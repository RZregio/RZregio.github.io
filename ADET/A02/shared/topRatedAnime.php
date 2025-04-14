<?php
$animeData = [
  [
    'title' => 'Frieren: Beyond Journey\'s End',
    'image' => 'res/animeCover/frierenS1.png',
    'genre' => 'Fantasy, Adventure, Drama',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '9.31',
    'episodes' => '28 episodes (Season 1)',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Sep 29, 2023 – March 22, 2024',
    'studio' => 'Madhouse',
    'source' => 'Manga',
    'popularity_rank' => 155,
    'rating_rank' => 1,
    'people_added' => '1.08M users',
    'description' => 'An elf mage reflects on her past adventures and the fleeting nature of human life after her companions\' death.'
  ],
  [
    'title' => 'Fullmetal Alchemist: Brotherhood',
    'image' => 'res/animeCover/fullMetalAlchemistBrotherhood.png',
    'genre' => 'Action, Adventure, Drama',
    'status' => 'Completed',
    'type' => 'TV Series',
    'rating' => '9.1',
    'episodes' => '64 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Apr 5, 2009 – Jul 4, 2010',
    'studio' => 'Bones',
    'source' => 'Manga',
    'popularity_rank' => 3,
    'rating_rank' => 2,
    'people_added' => '3.5M users',
    'description' => 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their mother goes awry and leaves them in damaged physical forms.'
  ],
  [
    'title' => 'Steins;Gate',
    'image' => 'res/animeCover/steinsGate.png',
    'genre' => 'Sci-Fi, Thriller, Drama',
    'status' => 'Completed',
    'type' => 'TV Series',
    'rating' => '9.07',
    'episodes' => '24 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Apr 6, 2011 – Sep 14, 2011',
    'studio' => 'White Fox',
    'source' => 'Visual Novel',
    'popularity_rank' => 14,
    'rating_rank' => 3,
    'people_added' => '2.6M users',
    'description' => 'A group of friends discovers time travel, leading to dangerous consequences as they try to fix the timeline.'
  ],
  [
    'title' => 'Attack on Titan Season 3 Part 2',
    'image' => 'res/animeCover/attackOnTitanS3P2.png',
    'genre' => 'Action, Mystery, Drama',
    'status' => 'Completed',
    'type' => 'TV Series',
    'rating' => '9.05',
    'episodes' => '10 episodes (Part 2)',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Apr 29, 2019 – July 01, 2019',
    'studio' => 'Wit Studio',
    'source' => 'Manga',
    'popularity_rank' => 21,
    'rating_rank' => 4,
    'people_added' => '2.4M users',
    'description' => 'The fight for humanity\'s survival against the Titans reaches a pivotal climax.'
  ],
  [
    'title' => 'One Piece: Fan Letter',
    'image' => 'res/animeCover/onePieceFanLetter.png',
    'genre' => 'Action, Adventure, Fantasy',
    'status' => 'Ongoing',
    'type' => 'TV Series (Special Episode)',
    'rating' => '9.05',
    'episodes' => '1 episode (Special)',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Oct 20, 2024',
    'studio' => 'Toei Animation',
    'source' => 'Manga',
    'popularity_rank' => 2210,
    'rating_rank' => 5,
    'people_added' => '102.1K users',
    'description' => 'A special episode celebrating the One Piece series with a heartfelt fan letter tribute to the fans.'
  ]
];

function compareRatingRank($a, $b)
{
  if ($a['rating_rank'] == $b['rating_rank']) {
    return 0;
  }
  return ($a['rating_rank'] < $b['rating_rank']) ? -1 : 1;
}

usort($animeData, 'compareRatingRank');
?>

<div class="container mt-4">
  <h3 class="mb-4">Top Rated Anime</h3>
  <?php
  foreach ($animeData as $anime) {
    ?>
    <div class="card mb-3 shadow-sm p-2">
      <div class="row g-2 align-items-stretch">

        <div class="col-md-3 col-12">
          <img src="<?php echo $anime['image']; ?>" class="img-fluid rounded w-100"
            style="max-height: 100%; object-fit: cover;" alt="Anime Cover">
        </div>

        <div class="col-md-9 col-12">
          <div class="card-body py-2 px-3">
            <h5 class="card-title mb-1">
              <?php echo "#" . $anime['rating_rank'] . " " . $anime['title']; ?>
            </h5>

            <p class="text-muted small mb-2">
              <strong>Genre:</strong> <?php echo $anime['genre']; ?><br>
              <strong>Status:</strong> <?php echo $anime['status']; ?> •
              <strong>Type:</strong> <?php echo $anime['type']; ?><br>
              <strong>Rating:</strong> ⭐ <?php echo $anime['rating']; ?>/10 •
              <strong>Episodes:</strong> <?php echo $anime['episodes']; ?> •
              <strong>Minutes/Episode:</strong> <?php echo $anime['minutes_per_episode']; ?><br>
              <strong>Total Runtime:</strong> <?php echo $anime['release_dates']; ?><br>
              <strong>Studio:</strong> <?php echo $anime['studio']; ?> •
              <strong>Source:</strong> <?php echo $anime['source']; ?><br>
              <strong>Popularity Rank:</strong> #<?php echo $anime['popularity_rank']; ?> •
              <strong>People Added:</strong> <?php echo $anime['people_added']; ?>
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