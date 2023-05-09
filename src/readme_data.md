# WormWideWeb dataset info
## Details
To get information about the recordings and the model-determined values, please check out the [paper](https://www.biorxiv.org/content/10.1101/2023.04.02.532814v1.abstract).
## Citation
Please cite the [paper](https://www.biorxiv.org/content/10.1101/2023.04.02.532814v1.abstract) if you use the datasets and findings from this website.
## JSON file keys:
`uid`: dataset uid 
`max_t`: number of time points recorded  
`avg_timestep`: number of time points per 1 min  
`num_neurons`: number of neurons recorded  
`dataset_type`: type(s) of the dataset  
`velocity`: velocity trace over time  
`head_curvature`: head curvature trace over time  
`pumping`: pumping/feeding trace over time  
`trace_array`: neural trace array. neurons x time  
`rel_enc_str_v`: velocity relative encoding strength  
`rel_enc_str_θh`: head curvature relative encoding strength  
`rel_enc_str_P`: feeding/pumping relative encoding strength  
`forwardness`: forward tuning slope  
`dorsalness`: dorsal tuning slope  
`pumpingness`: pumping tuning slope  
`tau_vals`: half-decay constants for the neurons, in seconds  
`encoding_changing_neurons`: list of encoding changing neurons  
`labeled`: labeling/identity information for NeuroPAL dataset  
`neuron_categorization`: model-determined neuron tuning information  