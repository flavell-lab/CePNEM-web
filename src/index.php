<html>
<head>
<link rel="stylesheet" type="text/css" href="css/style.css"> 
<title>CePNEM Data Browser</title>
</head>
<body>

<script src="script/sort_table.js"></script>
<h1>CePNEM Data Browser</h1>
<p>Link to paper: <a href="https://www.biorxiv.org/content/10.1101/2022.11.11.516186v1">Brain-wide representations of behavior spanning multiple timescales and states in <i>C. elegans</i></a>
</p>

<?php
    $matches = file_get_contents('data/matches.json');
    $decoded_matches = json_decode($matches, true);
    $encoding_data = file_get_contents("data/encoding_table.json");
    $encoding_table = json_decode($encoding_data, true);
?>

    <button class='accordion'>CePNEM data table</button>
    <div class='panel'>
    <table id="encoding_table">
        <tr>
            <th scope='col' rowspan=2 onclick='sortTable(0,"encoding_table",2,"asc");' style='cursor: pointer;'>Neuron identity</th>
            <th scope='col' rowspan=2>Datasets</th>
            <?php $offset=2;?>
            <th scope="col" rowspan=2 onclick='sortTable(<?php $n = $offset+0; echo $n;?>,"encoding_table",2,"asc");' style="cursor: pointer;">Number of detections</th>
            <th scope="col" colspan=10>Velocity tuning fraction</th>
            <th scope="col" colspan=10>Head curvature tuning fraction</th>
            <th scope="col" colspan=10>Feeding tuning fraction</th>
            <th scope="col" rowspan=2 onclick='sortTable(<?php $n = $offset+31; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">EWMA</th>
			<th scope="col" rowspan=2 onclick='sortTable(<?php $n = $offset+32; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">Encoding change fraction</th>
        </tr>
        <tr>
            <th onclick='sortTable(<?php $n = $offset+1; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;">Encoding strength</th>
            <th onclick='sortTable(<?php $n = $offset+2; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;">Forward-ness</th>
            <th onclick='sortTable(<?php $n = $offset+3; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>F</b>wd</th>
            <th onclick='sortTable(<?php $n = $offset+4; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>R</b>ev</th>
            <th onclick='sortTable(<?php $n = $offset+5; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>F</b>wd slope +</th>
            <th onclick='sortTable(<?php $n = $offset+6; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>F</b>wd slope -</th>
            <th onclick='sortTable(<?php $n = $offset+7; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>R</b>ev slope +</th>
            <th onclick='sortTable(<?php $n = $offset+8; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>R</b>ev slope -</th>
            <th onclick='sortTable(<?php $n = $offset+9; echo $n;?>, "encoding_table",2,"desc");' style="cursor: pointer;"><b>F</b>wd slope > R</b>ev slope</th>
            <th onclick='sortTable(<?php $n = $offset+10; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>F</b>wd slope < R</b>ev slope</th>

            <th onclick='sortTable(<?php $n = $offset+11; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">Encoding strength</th>
            <th onclick='sortTable(<?php $n = $offset+12; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">Dorsal-ness</th>
            <th onclick='sortTable(<?php $n = $offset+13; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>D</b>orsal</th>
            <th onclick='sortTable(<?php $n = $offset+14; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>V</b>entral</th>
            <th onclick='sortTable(<?php $n = $offset+15; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>D</b>orsal during <b>F</b></th>
            <th onclick='sortTable(<?php $n = $offset+16; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>V</b>entral during <b>F</b></th>
            <th onclick='sortTable(<?php $n = $offset+17; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>D</b>orsal during <b>R</b></th>
            <th onclick='sortTable(<?php $n = $offset+18; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>V</b>entral during <b>R</b></th>
            <th onclick='sortTable(<?php $n = $offset+19; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">More <b>D</b> during <b>F</b></th>
            <th onclick='sortTable(<?php $n = $offset+20; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">More <b>V</b> during <b>F</b></th>

            <th onclick='sortTable(<?php $n = $offset+21; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">Encoding strength</th>
            <th onclick='sortTable(<?php $n = $offset+22; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">Feeding-ness</th>
            <th onclick='sortTable(<?php $n = $offset+23; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>A</b>ctivated</th>
            <th onclick='sortTable(<?php $n = $offset+24; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>I</b>nhibited</th>
            <th onclick='sortTable(<?php $n = $offset+25; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>A</b>ct during <b>F</b></th>
            <th onclick='sortTable(<?php $n = $offset+26; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>I</b>nh during <b>F</b></th>
            <th onclick='sortTable(<?php $n = $offset+27; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>A</b>ct during <b>R</b></th>
            <th onclick='sortTable(<?php $n = $offset+28; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;"><b>I</b>nh during <b>R</b></th>
            <th onclick='sortTable(<?php $n = $offset+29; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">More <b>A</b> during <b>F</b></th>
            <th onclick='sortTable(<?php $n = $offset+30; echo $n;?>,"encoding_table",2,"desc");' style="cursor: pointer;">More <b>I</b> during <b>F</b></th>
        </tr>
        <?php
            foreach (range(0,count($encoding_table['class'])-1) as $i) {
                echo "<tr>";

                $neuron = $encoding_table['class'][$i];
                echo "<td>$neuron</td>";

                echo '<td>';
                echo '<select onchange="window.open(this.value, \'_blank\');">';
                echo '<option value="">Dataset</option>';
                foreach (range(0, count($decoded_matches[$neuron])) as $j) {
                    $dataset = $decoded_matches[$neuron][$j][0];
                    $n = $decoded_matches[$neuron][$j][1];
                    echo "<option value='load_dataset.php?name=$dataset&neurons[]=$n'>$dataset</option>";
                }
                echo "</select></td>";

                $num_detections = $encoding_table['count'][$i];
                echo "<td>$num_detections</td>";
                $enc_str_v = $encoding_table['enc_strength_v'][$i];
                echo "<td>$enc_str_v</td>";
                $forwardness = $encoding_table['enc_v'][$i];
                echo "<td>$forwardness</td>";
                foreach (range(0,7) as $j) {
                    $encoding = $encoding_table['encoding_table'][$i][$j];
                    echo "<td>$encoding</td>";
                }

                $enc_str_hc = $encoding_table['enc_strength_hc'][$i];
                echo "<td>$enc_str_hc</td>";
                $dorsalness = $encoding_table['enc_hc'][$i];
                echo "<td>$dorsalness</td>";
                foreach (range(8,15) as $j) {
                    $encoding = $encoding_table['encoding_table'][$i][$j];
                    echo "<td>$encoding</td>";
                }

                $enc_str_pumping = $encoding_table['enc_strength_pumping'][$i];
                echo "<td>$enc_str_pumping</td>";
                $pumpingness = $encoding_table['enc_pumping'][$i];
                echo "<td>$pumpingness</td>";
                foreach (range(16,23) as $j) {
                    $encoding = $encoding_table['encoding_table'][$i][$j];
                    echo "<td>$encoding</td>";
                }

                $tau = $encoding_table['tau'][$i];
                echo "<td>$tau</td>";
                $enc_change = $encoding_table['encoding_change_abundance'][$i];
                echo "<td>$enc_change</td>";

                echo "</tr>";
            }
        ?>
    </table>
    </div>

    <button class='accordion'>Filter datasets by neuron class</button>
    <div class='panel'>
    <p>
        <label>Input neuron classes (separate with commas, enter nothing to reset):</label>
        <input id="filter-input" type="text" value="">
        <button id="filter-button">Filter datasets</button>
	</p>
    <table id="dataset_table">
        <?php
            $data = file_get_contents('data/summary.json');

            $fields = ['dataset_type', 'num_neurons', 'num_labeled', 'max_t', 'num_encoding_changes'];

            $decoded_data = json_decode($data, true);

            $count = 0;

            echo "<tr>";
            echo "<th onclick='sortTable(0,\"dataset_table\",1,\"asc\");' style='cursor: pointer;'> Dataset </th>";
            echo "<th onclick='sortTable(1,\"dataset_table\",1,\"asc\");' style='cursor: pointer;'> Dataset Type </th>";
            echo "<th onclick='sortTable(2,\"dataset_table\",1,\"desc\");' style='cursor: pointer;'> # Neurons </th>";
            echo "<th onclick='sortTable(3,\"dataset_table\",1,\"desc\");' style='cursor: pointer;'> # Labeled Neurons </th>";
            echo "<th onclick='sortTable(4,\"dataset_table\",1,\"desc\");' style='cursor: pointer;'> Max timepoint </th>";
            echo "<th onclick='sortTable(5,\"dataset_table\",1,\"desc\");' style='cursor: pointer;'> # Encoding Changes </th>";
            echo "<th> Download link </th>";
			echo "</tr>";
            foreach ($decoded_data as $dataset => $dataset_data) {
                if ($count % 2 == 0) {
                    echo "<tr>";
                } else {
                    echo "<tr class='alt'>";
                }

                echo "<td> <a href=load_dataset.php?name=$dataset target = '_blank' id=$dataset> $dataset </a> </td>";
                for ($i = 0; $i < count($fields); $i++) {
                    $display_data = $dataset_data[$fields[$i]];
                    echo "<td>$display_data</td>";
                }
				echo "<td> <a href='data/$dataset.json' download>Download</a></td>";
				$count ++;
                echo "</tr>";
            }
        ?>
    </table>
    <script src="script/filter_table.js"></script>
    </div>
	<script src="script/button_move.js"></script>
</body>
</html>

