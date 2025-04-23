<?php
$page = "airingAnime";

if (isset($_GET['page'])) {
  $page = $_GET['page'];
  switch ($page) {
    case "airingAnime":
    case "mostPopularAnime":
    case "topRatedAnime":
    case "upcomingAnime":
    case "searchAnime":
      break;
    default:
      $page = "airingAnime";
      break;
  }
}
?>

<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AniMania</title>
  <link rel="icon" href="res/RZbrand.ico">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet">

  <style>
    .btn-primary.active {
      background-color: rgb(14, 53, 110) !important;
      border-color: rgb(14, 53, 110) !important;
    }
  </style>
</head>


<body data-bs-theme="dark">

  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">Ani<span style="color: #DAA520; font-family: Fredoka;">Mania</span></a>
      <form class="d-flex" role="search" method="POST" action="index.php?page=searchAnime">
        <input class="form-control me-2" type="search" name="keyword" placeholder="Search" required>
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>

    </div>
  </nav>

  <div class="container-fluid mt-3">
    <div class="row">

      <div class="col-md-3">
        <div class="card shadow p-3" style="height: 60vh; margin-bottom: 20px;">
          <h4>Explore <span class="badge bg-secondary">Anime</span></h4>
          <a href="?page=airingAnime"
            class="btn btn-primary my-1 <?php echo $page === 'airingAnime' ? 'active' : ''; ?>">Airing Anime</a>
          <a href="?page=mostPopularAnime"
            class="btn btn-primary my-1 <?php echo $page === 'mostPopularAnime' ? 'active' : ''; ?>">Most Popular
            Anime</a>
          <a href="?page=topRatedAnime"
            class="btn btn-primary my-1 <?php echo $page === 'topRatedAnime' ? 'active' : ''; ?>">Top Rated Anime</a>
          <a href="?page=upcomingAnime"
            class="btn btn-primary my-1 <?php echo $page === 'upcomingAnime' ? 'active' : ''; ?>">Upcoming Anime</a>

        </div>
      </div>

      <div class="col-md-9">
        <div class="card shadow p-4" style="height: 85vh; overflow: auto;">
          <?php include("shared/" . $page . ".php"); ?>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>