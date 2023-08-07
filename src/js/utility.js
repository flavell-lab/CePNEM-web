function getRandomNumber(x) {
    return Math.floor(Math.random() * x);
}

function minArray(x) {
    return x.reduce((accumulator, currentValue) => Math.min(accumulator, currentValue))
}

function maxArray(x) {
    return x.reduce((accumulator, currentValue) => Math.max(accumulator, currentValue))
}

function pearson(arr1, arr2) {
    // Compute the means of each array
    const mean1 = arr1.reduce((a, b) => a + b) / arr1.length;
    const mean2 = arr2.reduce((a, b) => a + b) / arr2.length;

    // Compute the standard deviations of each array
    const std1 = Math.sqrt(arr1.map(x => Math.pow(x - mean1, 2)).reduce((a, b) => a + b) / arr1.length);
    const std2 = Math.sqrt(arr2.map(x => Math.pow(x - mean2, 2)).reduce((a, b) => a + b) / arr2.length);

    // Compute the Pearson correlation coefficient
    return arr1.map((x, i) => (x - mean1) * (arr2[i] - mean2)).reduce((a, b) => a + b) / (arr1.length * std1 * std2);
}

function get_neuron_label(idx_neuron, neuropal_label) {
    let neuron = idx_neuron + 1;
    if (neuron in neuropal_label) {
        return `${neuron} (${neuropal_label[neuron]['label']})`;
    } else {
        return `${neuron}`;
    }
}

function get_neuron_class(idx_neuron) {
    let neuron = idx_neuron + 1;
    if (neuron in neuropal_label) {
        return `${neuron} (${neuropal_label[neuron]['neuron_class']})`;
    } else {
        return `${neuron}`;
    }
}


function getDatsetFullStr(datasettype) {
    switch (datasettype) {
        case "baseline":
            return "Baseline";
            break;
        case "neuropal":
            return "NeuroPAL";
            break;
        case "gfp":
            return "GFP"
            break;
        case "heat":
            return "Heat"
            break;
        default:
            return "Unknown dataset type";
    }
}

function getDatasetTypePill(datasettype) {
    let color;
    let type_str;
    switch (datasettype) {
        case "baseline":
            type_str = "Baseline";
            color = "secondary";
            break;
        case "neuropal":
            type_str = "NeuroPAL";
            color = "primary";
            break;
        case "gfp":
            type_str = "GFP"
            color = "success";
            break;
        case "heat":
            type_str = "Heat"
            color = "danger";
            break;
        default:
            color = "text-bg-danger";
    }
    result = '<span class="badge rounded-pill text-bg-' + color + ` dtype="${datasettype}">` +
        type_str + '</span>';
    return result;
}

function checkTuning(neuron_cat, behavior, tuning, idx_neuron) {
    let list_idx_tune = []
    for (const [key, value] of Object.entries(neuron_cat)) {
        if (value[behavior][tuning].includes(idx_neuron+1)) {
            list_idx_tune.push(key)
        }
      }

    if (list_idx_tune.length > 0) {
        return list_idx_tune.join(",")
    } else {
        return ""
    }
}

function getEncodingTable(data) {
    const n_neuron = data["num_neurons"];
    const neuron_cat = data["neuron_categorization"]
    const list_idx_neuron = Array.from({ length: n_neuron }, (_, i) => i);
    const neuropal_label = data["labeled"];

    let table_encoding_data = [];

    for (var idx_neuron = 0; idx_neuron < list_idx_neuron.length; idx_neuron++) {
        let neuron = idx_neuron + 1;
        let label_ = ""
        if (neuron in neuropal_label) {
            label_ = neuropal_label[neuron]["label"]
        }
        
        let enc_change_ = "No"
        if (data["encoding_changing_neurons"].includes(neuron)) {
            enc_change_ = "Yes"
        }

        let tune_v_fwd = checkTuning(neuron_cat, "v", "fwd", idx_neuron)
        let tune_v_rev = checkTuning(neuron_cat, "v", "rev", idx_neuron)
        let tune_fwd_slope_p = checkTuning(neuron_cat, "v", "fwd_slope_pos", idx_neuron)
        let tune_fwd_slope_n = checkTuning(neuron_cat, "v", "fwd_slope_neg", idx_neuron)
        let tune_rev_slope_p = checkTuning(neuron_cat, "v", "rev_slope_pos", idx_neuron)
        let tune_rev_slope_n = checkTuning(neuron_cat, "v", "rev_slope_neg", idx_neuron)
        let tune_slope1 = checkTuning(neuron_cat, "v", "rect_pos", idx_neuron)
        let tune_slope2 = checkTuning(neuron_cat, "v", "rect_neg", idx_neuron)

        let tune_dorsal = checkTuning(neuron_cat, "θh", "dorsal", idx_neuron)
        let tune_ventral = checkTuning(neuron_cat, "θh", "ventral", idx_neuron)
        let tune_fd = checkTuning(neuron_cat, "θh", "fwd_dorsal", idx_neuron)
        let tune_fv = checkTuning(neuron_cat, "θh", "fwd_ventral", idx_neuron)
        let tune_rd = checkTuning(neuron_cat, "θh", "rev_dorsal", idx_neuron)
        let tune_rv = checkTuning(neuron_cat, "θh", "rev_ventral", idx_neuron)
        let tune_mdf = checkTuning(neuron_cat, "θh", "rect_dorsal", idx_neuron)
        let tune_mvf = checkTuning(neuron_cat, "θh", "rect_ventral", idx_neuron)

        let tune_act = checkTuning(neuron_cat, "P", "act", idx_neuron)
        let tune_inh = checkTuning(neuron_cat, "P", "inh", idx_neuron)
        let tune_fa = checkTuning(neuron_cat, "P", "fwd_act", idx_neuron)
        let tune_fi = checkTuning(neuron_cat, "P", "fwd_inh", idx_neuron)
        let tune_ra = checkTuning(neuron_cat, "P", "rev_act", idx_neuron)
        let tune_ri = checkTuning(neuron_cat, "P", "rev_inh", idx_neuron)
        let tune_maf = checkTuning(neuron_cat, "P", "rect_act", idx_neuron)
        let tune_mif = checkTuning(neuron_cat, "P", "rect_inh", idx_neuron)

        table_encoding_data.push({
            "neuron": neuron,
            "label": label_,
            "dataset": data["uid"],
            "id": `${data["uid"]}_${neuron}`,

            "strength_v": data["rel_enc_str_v"][idx_neuron].toFixed(3),
            "fwdness": data["forwardness"][idx_neuron].toFixed(2),
            "fwd": tune_v_fwd,
            "rev": tune_v_rev,
            "fwd_slope_p": tune_fwd_slope_p,
            "fwd_slope_n": tune_fwd_slope_n,
            "rev_slope_p": tune_rev_slope_p,
            "rev_slope_n": tune_rev_slope_n,
            "slope_1": tune_slope1,
            "slope_2": tune_slope2,

            "strength_hc": data["rel_enc_str_θh"][idx_neuron].toFixed(3),
            "dorsalness": data["dorsalness"][idx_neuron].toFixed(2),
            "dorsal": tune_dorsal,
            "ventral": tune_ventral,
            "fd": tune_fd,
            "fv": tune_fv,
            "rd": tune_rd,
            "rv": tune_rv,
            "mdf": tune_mdf,
            "mvf": tune_mvf,

            "strength_feeding": data["rel_enc_str_P"][idx_neuron].toFixed(3),
            "feedingness": data["feedingness"][idx_neuron].toFixed(2),
            "act": tune_act,
            "inh": tune_inh,
            "fa": tune_fa,
            "fi": tune_fi,
            "ra": tune_ra,
            "ri": tune_ri,
            "maf": tune_maf,
            "mif": tune_mif,

            "ewma": data["tau_vals"][idx_neuron].toFixed(1),
            "enc_change": enc_change_
        })
    }

    return table_encoding_data
}