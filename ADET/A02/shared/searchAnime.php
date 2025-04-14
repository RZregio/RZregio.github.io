<?php
include('animeData.php');
$keyword = isset($_POST['keyword']) ? strtolower(trim($_POST['keyword'])) : ''; 

$searchResults = [];

if (!empty($keyword)) {
  foreach ($animeData as $anime) {
    if (strpos(strtolower($anime['title']), $keyword) !== false) {
      $searchResults[] = $anime;
    }
  }
}
?>

<h3 class="mb-4">Search Results for "<?php echo htmlspecialchars($keyword); ?>"</h3>

<?php if (empty($searchResults)) : ?>
  <p class="text-muted">No matching anime found.</p>
<?php else : ?>
  <?php foreach ($searchResults as $anime) : ?>
    <div class="card mb-3 shadow-sm p-2">
      <div class="row g-2 align-items-stretch">
        <div class="col-md-3 col-12">
          <img src="<?php echo $anime['image']; ?>" class="img-fluid rounded w-100"
            style="max-height: 100%; object-fit: cover;" alt="Anime Cover">
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
              <strong>Source:</strong> <?php echo $anime['source']; ?><br>
              <strong>Popularity Rank:</strong> #<?php echo $anime['popularity_rank']; ?> •
              <strong>Rating Rank:</strong> #<?php echo $anime['rating_rank']; ?> •
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
  <?php endforeach; ?>
<?php endif; ?>