function getRandomNumber(x) {
    return Math.floor(Math.random() * x);
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