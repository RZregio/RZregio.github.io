<?php
$animeData = [
  [
    'title' => 'The Apothecary Diaries Season 2',
    'image' => 'res/animeCover/apothecaryDiariesS2.png',
    'genre' => 'Historical, Mystery, Drama',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '8.82',
    'episodes' => '12 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Jan 10, 2025 – Ongoing',
    'studio' => 'Madhouse',
    'source' => 'Manga',
    'popularity_rank' => 1008,
    'rating_rank' => 31,
    'people_added' => '260.6K users',
    'description' => 'Follows Maomao\'s intriguing journey within the inner palace, unraveling mysteries and navigating complex relationships.'
  ],
  [
    'title' => 'One Piece',
    'image' => 'res/animeCover/onePiece.png',
    'genre' => 'Action, Adventure, Fantasy',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '8.73',
    'episodes' => 'Ongoing',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'Oct 20, 1999 - Ongoing',
    'studio' => 'Toei Animation',
    'source' => 'Manga',
    'popularity_rank' => 17,
    'rating_rank' => 51,
    'people_added' => '2.5M users',
    'description' => 'The Straw Hat Pirates delve deeper into the mysteries of Egghead Island, encountering new allies and adversaries.'
  ],
  [
    'title' => 'To Be Hero X',
    'image' => 'res/animeCover/toBeHeroX.png',
    'genre' => 'Action, Comedy, Superhero',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '8.51',
    'episodes' => '24 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'April 6, 2025 - Ongoing',
    'studio' => 'Pb Animation Co. Ltd., LAN Studio, Paper Plane Animation Studio',
    'source' => 'Original',
    'popularity_rank' => 3409,
    'rating_rank' => 139,
    'people_added' => '48.3K users',
    'description' => 'A former hero, now living a mundane life, is thrust back into action, facing new challenges and foes.'
  ],
  [
    'title' => 'Heaven\'s Official Blessing Short Film',
    'image' => 'res/animeCover/heavensBlessingShortFilm.png',
    'genre' => 'Fantasy, Romance',
    'status' => 'Completed',
    'type' => 'Short Film',
    'rating' => '8.50',
    'episodes' => 'Ongoing',
    'minutes_per_episode' => '8 min',
    'release_dates' => 'Feb 12, 2025 - Ongoing',
    'studio' => 'Xenon Studios',
    'source' => 'Web Novel',
    'popularity_rank' => 8694,
    'rating_rank' => 144,
    'people_added' => '5.4K users',
    'description' => 'A beautifully animated short film depicting a romantic encounter in a celestial realm.'
  ],
  [
    'title' => 'Duopo Cangqiong: Nian Fan',
    'image' => 'res/animeCover/duopoCangqiongNianFan.png',
    'genre' => 'Fantasy, Historical',
    'status' => 'Ongoing',
    'type' => 'TV Series',
    'rating' => '8.45',
    'episodes' => '157 episodes',
    'minutes_per_episode' => '24 min',
    'release_dates' => 'July 31, 2022 – Ongoing',
    'studio' => 'Motion Magic',
    'source' => 'Novel',
    'popularity_rank' => 6875,
    'rating_rank' => 171,
    'people_added' => '9.8K users',
    'description' => 'An immersive fantasy series filled with drama and adventure as characters navigate a historical fantasy world.'
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
  <h3 class="mb-4">Airing Anime</h3>
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
            <h5 class="card-title mb-1"><?php echo $anime['title']; ?></h5>
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
              <strong>Popularity Rank:</strong> <?php echo "#" . $anime['popularity_rank']; ?> • <strong>Rating
                Rank:</strong> <?php echo "#" . $anime['rating_rank']; ?> • <strong>People Added:</strong>
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