<html>
<head>
<link rel="stylesheet" type="text/css" href="css/style.css"> 
<title>CePNEM Data Browser</title>
</head>
<body>


<div id="main" style="background-color:rgba(20,20,20,0.8)">
<h1>CePNEM Data Browser</h1>
<h3><a href="https://www.biorxiv.org/content/10.1101/2022.11.11.516186v1">Brain-wide representations of behavior spanning multiple timescales and states in <i>C. elegans</i></a>
</h3>

<center>
    <p><strong>Neurons</strong></p>
    <form action="load_neuron.php" method="get">
        Display data for the following neuron:
        <select name="name">
            <?php
                $matches = file_get_contents('data/matches.json');
                $decoded_matches = json_decode($matches, true);

                foreach ($decoded_matches as $neuron => $datasets) {
                    $num_detections = count($datasets);
                    echo "<option value=$neuron>$neuron ($num_detections detections)</option>\"";
                }
            ?>
        </select>&nbsp;<button type="submit">Load</button>
    </form>
</center>

<center>
    <p><strong>Datasets</strong></p>
    <table>

        <?php
            $data = file_get_contents('data/summary.json');

            $fields = ['dataset_type', 'num_neurons', 'num_labeled', 'max_t', 'num_encoding_changes'];

            $decoded_data = json_decode($data, true);

            $count = 0;

            echo "<tr>";
            echo "<th> Dataset </th>";
            echo "<th> Dataset Type </th>";
            echo "<th> # Neurons </th>";
            echo "<th> # Labeled Neurons </th>";
            echo "<th> Max timepoint </th>";
            echo "<th> # Encoding Changes </th>";
            echo "<th> Download link </th>";
            foreach ($decoded_data as $dataset => $dataset_data) {
                if ($count % 2 == 0) {
                    echo "<tr>";
                } else {
                    echo "<tr class='alt'>";
                }

                echo "<td> <a href=load_dataset.php?name=$dataset target = '_blank'> $dataset </a> </td>";
                for ($i = 0; $i < count($fields); $i++) {
                    $display_data = $dataset_data[$fields[$i]];
                    echo "<td> $display_data </td>";
                }
		echo "<td> <a href='data/$dataset.json' download>Download</a></td>";
		$count ++;
                echo "</tr>";
            }
        ?>
    </table>
</center>

