<?php
$animeData = [
  [
    'title' => 'Attack on Titan',
    'image' => 'res/animeCover/attackOnTitanS1.png',
    'genre' => 'Action, Mystery, Drama',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '8.56',
    'episodes' => '25 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Apr 7, 2013 – Sept 29, 2013',
    'studio' => 'Wit Studio',
    'source' => 'Manga',
    'popularity_rank' => 1,
    'rating_rank' => 116,
    'people_added' => '4.1M users',
    'description' => 'Eren Yeager joins the Survey Corps to fight against the Titans after his city is destroyed and his mother is killed by a Titan.'
  ],
  [
    'title' => 'Death Note',
    'image' => 'res/animeCover/deathNote.png',
    'genre' => 'Mystery, Psychological, Thriller',
    'status' => 'Completed',
    'type' => 'TV Series',
    'rating' => '8.62',
    'episodes' => '37 episodes',
    'minutes_per_episode' => '23 min',
    'release_dates' => 'Oct 4, 2006 – Jun 27, 2007',
    'studio' => 'Madhouse',
    'source' => 'Manga',
    'popularity_rank' => 2,
    'rating_rank' => 89,
    'people_added' => '4.08M users',
    'description' => 'A high school student discovers a mysterious notebook that allows him to kill anyone by writing their name in it.'
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
    'title' => 'One Punch Man',
    'image' => 'res/animeCover/onePunchManS1.png',
    'genre' => 'Action, Comedy, Superhero',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '8.49',
    'episodes' => '12 episodes (Season 1)',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Oct 5, 2015 – Dec 21, 2015',
    'studio' => 'Madhouse',
    'source' => 'Manga',
    'popularity_rank' => 4,
    'rating_rank' => 150,
    'people_added' => '3.3M users',
    'description' => 'Saitama is a hero who can defeat anyone with a single punch, but he struggles with boredom from his overwhelming power.'
  ],
  [
    'title' => 'Demon Slayer: Kimetsu no Yaiba',
    'image' => 'res/animeCover/demonSlayerS1.png',
    'genre' => 'Action, Demons, Historical',
    'status' => 'Completed',
    'type' => 'TV Series',
    'rating' => '8.44',
    'episodes' => '26 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Apr 6, 2019 – Sep 28, 2019',
    'studio' => 'ufotable',
    'source' => 'Manga',
    'popularity_rank' => 5,
    'rating_rank' => 175,
    'people_added' => '3.2M users',
    'description' => 'After a demon attack leaves his family slain and his sister turned into a demon, Tanjiro Kamado sets out to become a demon slayer.'
  ]
];

function comparePopularityRank($a, $b)
{
  if ($a['popularity_rank'] == $b['popularity_rank']) {
    return 0;
  }
  return ($a['popularity_rank'] < $b['popularity_rank']) ? -1 : 1;
}

usort($animeData, 'comparePopularityRank');
?>

<div class="container mt-4">
  <h3 class="mb-4">Most Popular Anime</h3>
  <?php
  foreach ($animeData as $anime) {
    ?>
    <div class="card mb-3 shadow-sm p-2" style="max-height: 500px;">
      <div class="row g-2">

        <div class="col-md-3 col-4">
          <img src="<?php echo $anime['image']; ?>" class="img-fluid rounded" alt="Anime Cover"
            style="height: 100%; object-fit: cover;">
        </div>

        <div class="col-md-9 col-8">
          <div class="card-body py-2 px-3">
            <h5 class="card-title mb-1"><?php echo "#" . $anime['popularity_rank'] . " " . $anime['title']; ?></h5>
            <p class="text-muted small mb-2">
              <strong>Genre:</strong> <?php echo $anime['genre']; ?><br>
              <strong>Status:</strong> <?php echo $anime['status']; ?> • <strong>Type:</strong>
              <?php echo $anime['type']; ?><br>
              <strong>Rating:</strong> ⭐ <?php echo $anime['rating']; ?>/10 • <strong>Episodes:</strong>
              <?php echo $anime['episodes']; ?> • <strong>Minutes/Episode:</strong>
              <?php echo $anime['minutes_per_episode']; ?><br>
              <strong>Total Runtime:</strong> <?php echo $anime['release_dates']; ?><br>
              <strong>Studio:</strong> <?php echo $anime['studio']; ?> • <strong>Source:</strong>
              <?php echo $anime['source']; ?><br>
              <strong>Rating Rank:</strong> <?php echo "#" . $anime['rating_rank']; ?> • <strong>People Added:</strong>
              <?php echo $anime['people_added']; ?>
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