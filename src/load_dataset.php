<?php
    $name = $_GET["name"];

    # Number of images that should be displayed on each row
    $imagesPerRow = 3;


    # load basic source data (type and redshift)
    $data = file_get_contents("data/$name.json");
    $type = $data['dataset_type'];
?>

<html>
<head>

<link rel="stylesheet" type="text/css" href="css/source_styles.css">
</head>
<body>
<p CLASS="centeralign">
<title> <?php echo "$name: $type";?> </title>
<h1 style="white-space:nowrap;"> <?php echo "$name";?> </h1>
</p>

