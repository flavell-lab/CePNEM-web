<?php
    $name = $_GET['name'];

    # Number of images that should be displayed on each row
    $imagesPerRow = 3;


    # load basic source data (type and redshift)
    $data = file_get_contents("data/$name.json");
    $decoded_data = json_decode($data, true);
    $trace_array = $decoded_data["trace_array"];
    $timestep = $decoded_data["avg_timestep"];

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
            <th scope="col" colspan=10>Velocity tuning</th>
            <th scope="col" colspan=10>Head curvature tuning</th>
            <th scope="col" colspan=10>Feeding tuning</th>
            <th scope="col">EWMA</th>
        </tr>
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
