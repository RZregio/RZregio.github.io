<?php
$page = "airingAnime";

if (isset($_GET['page'])) {
  $page = $_GET['page'];
  switch ($page) {
    case "airingAnime":
    case "mostPopularAnime":
    case "topRatedAnime":
    case "upcomingAnime":
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
  <link rel="icon" href="res/RzBrand.ico">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">

  <style>
    .profilepic {
      width: 50px;
      height: 50px;
      border-radius: 100px;
      background-color: grey;
      float: left;
    }
  </style>
</head>

<body data-bs-theme="dark">

  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">Ani<span style="color: #DAA520">Mania</span></a>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search">
        <button class="btn btn-outline-success">Search</button>
      </form>
    </div>
  </nav>

  <div class="container-fluid mt-3">
    <div class="row">

      <div class="col-md-3">
        <div class="card shadow p-3" style="height: 60vh; margin-bottom: 20px;">
          <h4>Explore <span class="badge bg-secondary">Anime</span></h4>
          <a href="?page=airingAnime" class="btn btn-primary my-1">Airing Anime</a>
          <a href="?page=mostPopularAnime" class="btn btn-primary my-1">Most Popular Anime</a>
          <a href="?page=topRatedAnime" class="btn btn-primary my-1">Top Rated Anime</a>
          <a href="?page=upcomingAnime" class="btn btn-primary my-1">Upcoming Anime</a>
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