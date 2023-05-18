async function getJSONData(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
}

function roundNull(x, n) {
    if (x == null) {
        return null
    } else {
        return x.toFixed(n)
    }
}

function toggleColumns(table, parent, check_id, column_name) {
    var control = document.getElementById(parent)
    var check = control.querySelector("#" + check_id)
    if (check.checked) {
        $(table).bootstrapTable('showColumn', column_name);
    } else {
        $(table).bootstrapTable('hideColumn', column_name);
    }
}

function updateTableColumn(table, parent) {
    // v
    toggleColumns(table, parent, "check_v_s", "strength_v")
    toggleColumns(table, parent, "check_v_fwdness", "fwdness")
    toggleColumns(table, parent, "check_v_fwd", "fwd")
    toggleColumns(table, parent, "check_v_rev", "rev")
    toggleColumns(table, parent, "check_fwd_slope_p", "fwd_slope_p")
    toggleColumns(table, parent, "check_fwd_slope_n", "fwd_slope_n")
    toggleColumns(table, parent, "check_rev_slope_p", "rev_slope_p")
    toggleColumns(table, parent, "check_rev_slope_n", "rev_slope_n")
    toggleColumns(table, parent, "check_slope_1", "slope_1")
    toggleColumns(table, parent, "check_slope_2", "slope_2")

    // hc
    toggleColumns(table, parent, "check_hc_s", "strength_hc")
    toggleColumns(table, parent, "check_hc_dorsalness", "dorsalness")
    toggleColumns(table, parent, "check_hc_dorsal", "dorsal")
    toggleColumns(table, parent, "check_hc_ventral", "ventral")
    toggleColumns(table, parent, "check_hc_fd", "fd")
    toggleColumns(table, parent, "check_hc_fv", "fv")
    toggleColumns(table, parent, "check_hc_rd", "rd")
    toggleColumns(table, parent, "check_hc_rv", "rv")
    toggleColumns(table, parent, "check_hc_mdf", "mdf")
    toggleColumns(table, parent, "check_hc_mvf", "mvf")

    // feeding
    toggleColumns(table, parent, "check_f_strength", "strength_feeding")
    toggleColumns(table, parent, "check_feedness", "feedingness")
    toggleColumns(table, parent, "check_f_act", "act")
    toggleColumns(table, parent, "check_f_inh", "inh")
    toggleColumns(table, parent, "check_f_fa", "fa")
    toggleColumns(table, parent, "check_f_fi", "fi")
    toggleColumns(table, parent, "check_f_ra", "ra")
    toggleColumns(table, parent, "check_f_ri", "ri")
    toggleColumns(table, parent, "check_f_maf", "maf")
    toggleColumns(table, parent, "check_f_mif", "mif")
    
    // other
    toggleColumns(table, parent, "check_o_ewma", "ewma")
    toggleColumns(table, parent, "check_o_enc_var", "enc_var")
}


function selectDefault(table, parent) {
    var control = document.getElementById(parent)
    all_checks = control.getElementsByClassName("form-check-input")
    for (var i = 0; i < all_checks.length; i++) {
        all_checks[i].checked = false
    }

    let list_check_id = ["check_v_fwd", "check_v_rev", "check_hc_dorsal", "check_hc_ventral",
        "check_f_act", "check_f_inh", "check_o_ewma"]
    toggleChecks(parent, list_check_id, true)

    updateTableColumn(table, parent)
}

function toggleChecks(parent, list_check_id, check) {
    var control = document.getElementById(parent)
    for (var i = 0; i < list_check_id.length; i++) {
        control.querySelector("#" + list_check_id[i]).checked = check
    }
}

function toggleV(parent) {
    var control = document.getElementById(parent)
    var button_v_all = control.querySelector("#button_v_all")

    let list_check_id = ["check_v_fwdness", "check_v_fwd", "check_v_rev", "check_v_s",
        "check_fwd_slope_p", "check_fwd_slope_n", "check_rev_slope_p", "check_rev_slope_n", "check_slope_1", "check_slope_2"]


    if (button_v_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_v_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_v_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)
    }
}

function toggleHC(parent) {
    var control = document.getElementById(parent)
    var button_hc_all = control.querySelector("#button_hc_all")

    let list_check_id = ["check_hc_s", "check_hc_dorsalness", "check_hc_dorsal", "check_hc_ventral",
        "check_hc_fd", "check_hc_fv", "check_hc_rd", "check_hc_rv", "check_hc_mdf", "check_hc_mvf"]

    if (button_hc_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_hc_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_hc_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)   
    }
}

function toggleF(parent) {
    var control = document.getElementById(parent)
    var button_f_all = control.querySelector("#button_f_all")

    let list_check_id = ["check_f_strength", "check_feedness", "check_f_act", "check_f_inh",
        "check_f_fa", "check_f_fi", "check_f_ra", "check_f_ri", "check_f_maf", "check_f_mif"]

    if (button_f_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_f_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_f_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)
    }
}

function toggleO(parent) {
    var control = document.getElementById(parent)
    var button_o_all = control.querySelector("#button_o_all")

    let list_check_id = ["check_o_ewma", "check_o_enc_var"]

    if (button_o_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_o_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_o_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)
    }
}

// init tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

var select = document.getElementById("select_neuron");

fetch("data/encoding_table.json").then(response => response.json()).then(data => {
    // table
    var table_encoding_data = []

    n_neuron_class = data["class"].length
    for (var i = 0; i < n_neuron_class; i++) {
        // selector
        var option = document.createElement("option");
        option.value = data["class"][i];
        option.text = data["class"][i];
        select.add(option);

        // table
        table_encoding_data.push(
            {
                "neuron": data["class"][i],
                "count": data["count"][i],
                "strength_v": roundNull(data["enc_strength_v"][i], 2),
                "strength_hc": roundNull(data["enc_strength_hc"][i], 2),
                "strength_feeding": roundNull(data["enc_strength_pumping"][i], 2),
                "fwdness": roundNull(data["enc_v"][i], 2),
                "dorsalness": roundNull(data["enc_hc"][i], 2),
                "feedingness": roundNull(data["enc_pumping"][i], 2),
                "ewma": roundNull(data["tau"][i], 2),
                "enc_var": roundNull(data["encoding_variability"][i], 2),

                "fwd": data["encoding_table"][i][0].toFixed(2),
                "rev": data["encoding_table"][i][1].toFixed(2),
                "fwd_slope_p": data["encoding_table"][i][2].toFixed(2),
                "fwd_slope_n": data["encoding_table"][i][3].toFixed(2),
                "rev_slope_p": data["encoding_table"][i][4].toFixed(2),
                "rev_slope_n": data["encoding_table"][i][5].toFixed(2),
                "slope_1": data["encoding_table"][i][6].toFixed(2),
                "slope_2": data["encoding_table"][i][7].toFixed(2),

                "dorsal": data["encoding_table"][i][8].toFixed(2),
                "ventral": data["encoding_table"][i][9].toFixed(2),
                "fd": data["encoding_table"][i][10].toFixed(2),
                "fv": data["encoding_table"][i][11].toFixed(2),
                "rd": data["encoding_table"][i][12].toFixed(2),
                "rv": data["encoding_table"][i][13].toFixed(2),
                "mdf": data["encoding_table"][i][14].toFixed(2),
                "mvf": data["encoding_table"][i][15].toFixed(2),

                "act": data["encoding_table"][i][16].toFixed(2),
                "inh": data["encoding_table"][i][17].toFixed(2),
                "fa": data["encoding_table"][i][18].toFixed(2),
                "fi": data["encoding_table"][i][19].toFixed(2),
                "ra": data["encoding_table"][i][20].toFixed(2),
                "ri": data["encoding_table"][i][21].toFixed(2),
                "maf": data["encoding_table"][i][22].toFixed(2),
                "mif": data["encoding_table"][i][23].toFixed(2),
            }
        )
    }

    $('#table_encoding').bootstrapTable({
        data: table_encoding_data,
    });

    $(document).ready(function () {
        $("#select_neuron").selectpicker('refresh');
    });
}).catch(error => {console.error(error)});

fetch("data/summary.json").then(response => response.json()).then(data => {
    let list_uid_neuropal = [];
    for (const [key, value] of Object.entries(data)) {
        let list_dtype = value.dataset_type;
        if (list_dtype.includes("neuropal")) {
            list_uid_neuropal.push(key);
        }
    }

    // load datasets
    let table_encoding_data = [];    
    
    Promise.all(list_uid_neuropal.map(function (uid) {
        return fetch(`data/${uid}_no_data.json`)
    })).then(function (responses) {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(data => {
        for (var i = 0; i < data.length; i++) {
            table_encoding_data.push(...getEncodingTable(data[i]))
        }

        // init table
        $('#table_encoding_class').bootstrapTable({
            data: table_encoding_data,
        });

        $('#table_encoding_class').bootstrapTable('filterBy', {id: "filter_dtype_reset"}, {
            'filterAlgorithm': (row, filters) => {
                return false;
            }
        })
        
        $("#select_neuron").selectpicker({}).on('change', function () {
            let selected = $(this).val();
            $('#table_encoding_class').bootstrapTable('filterBy', {id: "filter_class"}, {
                'filterAlgorithm': (row, filters) => {
                    for (let i = 0; i < selected.length; i++) {
                        let filter_q = row.label.startsWith(selected);
                        if (filter_q) {
                            let id = row.id;
                            let neuron = row.neuron;
                            let dataset = row.dataset;

                            let url_plot = new URL("plot_dataset.html", document.location);
                            url_plot.searchParams.set("uid", dataset);
                            url_plot.searchParams.set("list_neuron", [neuron]);
                            url_plot.searchParams.set("list_behavior", "v");
                            let new_html = `<a id="button_plot" class="btn btn-outline-dark btn-sm py-0" href=${url_plot} role="button" style="font-size: 12px">Plot</a>`
                            // let new_html = `<a href=${url_plot}>Plot</a>`
                            $('#table_encoding_class').bootstrapTable('updateCellByUniqueId', {
                                id: id,
                                field: "action",
                                value: new_html,
                                reinit: true
                            });
                        }
                        return filter_q
                    }
                    return false;
              }
            })
        });

    }).catch(error => console.error(error))


}).catch(error => console.error(error));