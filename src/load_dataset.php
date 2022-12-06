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
    $time_range = array_map($multiplier, range(0,1599));
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

<p>
    <script src="script/lib/plotly-2.16.1.min.js"></script>
    <script src="script/plot.js"></script>
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


    <table>
        <tr>
            <th scope="col" rowspan=2>Neuron</th>
            <th scope="col" colspan=10>Velocity tuning</th>
            <th scope="col" colspan=10>Head curvature tuning</th>
            <th scope="col" colspan=10>Feeding tuning</th>
            <th scope="col">EWMA</th>
        </tr>
        <tr>
            <th>Encoding strength</th>
            <th>Forwardness</th>
            <th><b>F</b>wd</th>
            <th><b>R</b>ev</th>
            <th><b>F</b>wd slope +</th>
            <th><b>F</b>wd slope -</th>
            <th><b>R</b>ev slope +</th>
            <th><b>R</b>ev slope -</th>
            <th><b>F</b>wd slope > R</b>ev slope</th>
            <th><b>F</b>wd slope < R</b>ev slope</th>

            <th>Encoding strength</th>
            <th>Dorsalness</th>
            <th><b>D</b>orsal</th>
            <th><b>V</b>entral</th>
            <th><b>D</b>orsal during <b>F</b></th>
            <th><b>V</b>entral during <b>F</b></th>
            <th><b>D</b>orsal during <b>R</b></th>
            <th><b>V</b>entral during <b>R</b></th>
            <th>More <b>D</b> during <b>F</b></th>
            <th>More <b>V</b> during <b>F</b></th>

            <th>Encoding strength</th>
            <th>Feedingness</th>
            <th><b>A</b>ctivated</th>
            <th><b>I</b>nhibited</th>
            <th><b>A</b>ct during <b>F</b></th>
            <th><b>I</b>nh during <b>F</b></th>
            <th><b>A</b>ct during <b>R</b></th>
            <th><b>I</b>nh during <b>R</b></th>
            <th>More <b>A</b> during <b>F</b></th>
            <th>More <b>I</b> during <b>F</b></th>
        </tr>
        <?php
            $neurons = range(0,count($trace_array))

            foreach ($neurons as $neuron) {
                echo "<tr>";
                echo "<td>$neuron</td>";

                foreach (["v", "θh", "P"] as $beh) {
                    echo "<td>0.0</td>";
                    echo "<td>0.0</td>";
                    foreach ($subcats[$beh] as $subcat) {
                        $table_string = "";
                        foreach ([1,2] as $rng) {
                            if (in_array($neuron, $categorization[$rng]["v"]["fwd"])) {
                                $table_string = $table_string . $rng;
                            }
                        }
                        if ($table_string == "") {
                            $table_string = "-";
                            $style = "style='background-color:#400";
                        } elseif ($table_string == "12") {
                            $table_string = "1, 2";
                            $style = "style='background-color:#040";
                        } else {
                            $style = "style='background-color:#330";
                        }
                        echo "<td style=$style>$table_string</td>";
                    }
                }
                echo "</tr>";
            }

            echo "</table>";
        ?>

    </table>

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
</p>

</body>
</html>
