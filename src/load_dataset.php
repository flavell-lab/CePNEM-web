<?php
    $name = $_GET['name'];

    # Number of images that should be displayed on each row
    $imagesPerRow = 3;


    # load basic source data (type and redshift)
    $data = file_get_contents("data/$name.json");
    $decoded_data = json_decode($data, true);
    $trace_array = $decoded_data["trace_array"];
    $timestep = $decoded_data["avg_timestep"];
    $categorization = $decoded_data["neuron_categorization"];

    $multiplier = function($value) use ($timestep) {
        return $value * $timestep;
    };
    $time_range = array_map($multiplier, range(0,$decoded_data['max_t']));
    $velocity = $decoded_data["velocity"];
    $head_curvature = $decoded_data["head_curvature"];
    $pumping = $decoded_data["pumping"];
    $angular_velocity = $decoded_data["angular_velocity"];
    $body_curvature = $decoded_data["body_curvature"];

    $type = $decoded_data['dataset_type'];

    $subcats = array();
    $subcats["v"] = ["fwd", "rev", "fwd_slope_pos", "fwd_slope_neg", "rev_slope_pos", "rev_slope_neg", "rect_pos", "rect_neg"];
    $subcats["θh"] = ["dorsal", "ventral", "fwd_dorsal", "fwd_ventral", "rev_dorsal", "rev_ventral", "rect_dorsal", "rect_ventral"];
    $subcats["P"] = ["act", "inh", "fwd_act", "fwd_inh", "rev_act", "rev_inh", "rect_act", "rect_inh"];
?>

<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
	<p CLASS="centeralign">
	<title> <?php echo "$name: $type";?> </title>
	<h1 style="white-space:nowrap;"> <?php echo "$name: $type";?> </h1>
	</p>

    <script src="script/lib/plotly-2.16.1.min.js"></script>
    <script src="script/plot.js"></script>
    <script src="script/sort_table.js"></script>
    <script type="text/javascript">
		const trace_array = <?php echo json_encode($trace_array)?>;
		var append = false;
		var append_behavior = false;

		const velocity_orig = <?php echo json_encode($velocity)?>;
		const velocity = velocity_orig.map(x => x * 10);
		const head_curve = <?php echo json_encode($head_curvature)?>;
		const pumping = <?php echo json_encode($pumping)?>;
		const angular_velocity = <?php echo json_encode($angular_velocity)?>;
		const body_curvature = <?php echo json_encode($body_curvature)?>;
		const time_range = <?php echo json_encode($time_range)?>;

		const behaviors = new Array(velocity, head_curve, pumping, angular_velocity, body_curvature);
		const behavior_units = ["0.1 mm/s", "rad", "pumps/sec", "rad/s", "rad"];
    </script>

    <button class='accordion'>CePNEM data table</button>
    <div class='panel'>
    <table id="encoding_table">
        <tr>
            <th scope="col" rowspan=2>Neuron</th>
            <th scope="col" colspan=10>Velocity tuning</th>
            <th scope="col" colspan=10>Head curvature tuning</th>
            <th scope="col" colspan=10>Feeding tuning</th>
            <th scope="col" rowspan=2 onclick='sortTable(31,\"encoding_table\");' style="cursor: pointer;">EWMA</th>
			<th scope="col" rowspan=2 onclick='sortTable(32,\"encoding_table\");' style="cursor: pointer;">Encoding change</th>
        </tr>
        <tr>
            <th onclick='sortTable(1,"encoding_table");' style="cursor: pointer;">Encoding strength</th>
            <th onclick='sortTable(2,"encoding_table");' style="cursor: pointer;">Forwardness</th>
            <th onclick='sortTable(3,"encoding_table");' style="cursor: pointer;"><b>F</b>wd</th>
            <th onclick='sortTable(4,"encoding_table");' style="cursor: pointer;"><b>R</b>ev</th>
            <th onclick='sortTable(5,"encoding_table");' style="cursor: pointer;"><b>F</b>wd slope +</th>
            <th onclick='sortTable(6,"encoding_table");' style="cursor: pointer;"><b>F</b>wd slope -</th>
            <th onclick='sortTable(7,"encoding_table");' style="cursor: pointer;"><b>R</b>ev slope +</th>
            <th onclick='sortTable(8,"encoding_table");' style="cursor: pointer;"><b>R</b>ev slope -</th>
            <th onclick='sortTable(9,"encoding_table");' style="cursor: pointer;"><b>F</b>wd slope > R</b>ev slope</th>
            <th onclick='sortTable(10,"encoding_table");' style="cursor: pointer;"><b>F</b>wd slope < R</b>ev slope</th>

            <th onclick='sortTable(11,"encoding_table");' style="cursor: pointer;">Encoding strength</th>
            <th onclick='sortTable(12,"encoding_table");' style="cursor: pointer;">Dorsalness</th>
            <th onclick='sortTable(13,"encoding_table");' style="cursor: pointer;"><b>D</b>orsal</th>
            <th onclick='sortTable(14,"encoding_table");' style="cursor: pointer;"><b>V</b>entral</th>
            <th onclick='sortTable(15,"encoding_table");' style="cursor: pointer;"><b>D</b>orsal during <b>F</b></th>
            <th onclick='sortTable(16,"encoding_table");' style="cursor: pointer;"><b>V</b>entral during <b>F</b></th>
            <th onclick='sortTable(17,"encoding_table");' style="cursor: pointer;"><b>D</b>orsal during <b>R</b></th>
            <th onclick='sortTable(18,"encoding_table");' style="cursor: pointer;"><b>V</b>entral during <b>R</b></th>
            <th onclick='sortTable(19,"encoding_table");' style="cursor: pointer;">More <b>D</b> during <b>F</b></th>
            <th onclick='sortTable(20,"encoding_table");' style="cursor: pointer;">More <b>V</b> during <b>F</b></th>

            <th onclick='sortTable(21,"encoding_table");' style="cursor: pointer;">Encoding strength</th>
            <th onclick='sortTable(22,"encoding_table");' style="cursor: pointer;">Feedingness</th>
            <th onclick='sortTable(23,"encoding_table");' style="cursor: pointer;"><b>A</b>ctivated</th>
            <th onclick='sortTable(24,"encoding_table");' style="cursor: pointer;"><b>I</b>nhibited</th>
            <th onclick='sortTable(25,"encoding_table");' style="cursor: pointer;"><b>A</b>ct during <b>F</b></th>
            <th onclick='sortTable(26,"encoding_table");' style="cursor: pointer;"><b>I</b>nh during <b>F</b></th>
            <th onclick='sortTable(27,"encoding_table");' style="cursor: pointer;"><b>A</b>ct during <b>R</b></th>
            <th onclick='sortTable(28,"encoding_table");' style="cursor: pointer;"><b>I</b>nh during <b>R</b></th>
            <th onclick='sortTable(29,"encoding_table");' style="cursor: pointer;">More <b>A</b> during <b>F</b></th>
            <th onclick='sortTable(30,"encoding_table");' style="cursor: pointer;">More <b>I</b> during <b>F</b></th>
        </tr>
        <?php
            $neurons = range(1,count($trace_array));

            foreach ($neurons as $neuron) {
                echo "<tr>";
                echo "<td style='cursor: pointer;' onclick=\"plotSpecificNeuralTrace(time_range, trace_array, $neuron, 'plot', append); append=true;\">$neuron</td>";

                foreach (["v", "θh", "P"] as $beh) {
					if ($beh == "v") {
						$enc_str_v = round($decoded_data['rel_enc_str_v'][$neuron-1], 2);
						echo "<td>$enc_str_v</td>";
						$forwardness = round($decoded_data['forwardness'][$neuron-1], 2);
	                    echo "<td>$forwardness</td>";
				 	} elseif ($beh == "θh") {
						$enc_str_hc = round($decoded_data['rel_enc_str_θh'][$neuron-1], 2);
						echo "<td>$enc_str_hc</td>";
						$dorsalness = round($decoded_data['dorsalness'][$neuron-1], 2);
						echo "<td>$dorsalness</td>";
					} else {
						$enc_str_P = round($decoded_data['rel_enc_str_P'][$neuron-1], 2);
						echo "<td>$enc_str_P</td>";
						$feedingness = round($decoded_data['feedingness'][$neuron-1], 2);
						echo "<td>$feedingness</td>";
					}
                    foreach ($subcats[$beh] as $subcat) {
                        $table_string = "";
                        foreach ([1,2] as $rng) {
                            if (in_array($neuron, $categorization[$rng][$beh][$subcat])) {
                                $table_string = $table_string . $rng;
                            }
                        }
                        if ($table_string == "") {
                            $table_string = "-";
                            $style = "";
                        } elseif ($table_string == "12") {
                            $table_string = "1, 2";
                            $style = "style='background-color: #141';";
                        } else {
                            $style = "style='background-color: #420';";
                        }
                        echo "<td $style>$table_string</td>";
                    }
                }
				$ewma = round($decoded_data['tau_vals'][$neuron-1], 2);
				echo "<td>$ewma</td>";
				if (in_array($neuron, $decoded_data['encoding_changing_neurons'])) {
					echo "<td style='background-color: #313';>yes</td>";
				} else {
					echo "<td>no</td>";
				}
                echo "</tr>";
            }

            echo "</table>";
        ?>

    </table>
    </div>

    <form>
        <label for="neuron_input">Plot neuron:</label>
        <input type="text" id="neuron_input" name="neuron_input">
    </form>
    <button onclick="plotNeuralTrace(time_range, trace_array, 'neuron_input', 'plot', append); append=true;">Plot neuron</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<form>
        <label for="behavior_input">Plot behavior:</label>
        <select name="behavior_input" id="behavior_input">
            <option value="velocity">velocity</option>
            <option value="head curvature">head curvature</option>
            <option value="feeding">feeding</option>
            <option value="angular velocity">angular velocity</option>
            <option value="body curvature">body curvature</option>
        </select>
	</form>
    <button onclick="plotBehavior(time_range, behaviors, behavior_units, 'behavior_input', 'plot', append_behavior); append=true;">Plot behavior</button>
	<div id='plot'></div>
    <button onclick="Plotly.purge(document.getElementById('plot')); append=false;">Clear plot</button>
    <script src="script/button_move.js"></script>
</body>
</html>
