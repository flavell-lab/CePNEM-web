function roundNull(x, n) {
    if (x == null) {
        return null
    } else {
        return x.toFixed(n)
    }
}

function toggleColumns(check_id, column_name) {
    check = document.getElementById(check_id)
    if (check.checked) {
        $('#table_encoding').bootstrapTable('showColumn', column_name);
    } else {
        $('#table_encoding').bootstrapTable('hideColumn', column_name);
    }
}

function updateTableColumn() {
    toggleColumns("check_v_s", "strength_v")
    toggleColumns("check_v_fwdness", "fwdness")
    toggleColumns("check_v_fwd", "fwd")
    toggleColumns("check_v_rev", "rev")
    toggleColumns("check_fwd_slope_p", "fwd_slope_p")
    toggleColumns("check_fwd_slope_n", "fwd_slope_n")
    toggleColumns("check_rev_slope_p", "rev_slope_p")
    toggleColumns("check_rev_slope_n", "rev_slope_n")
    toggleColumns("check_slope_1", "slope_1")
    toggleColumns("check_slope_2", "slope_2")

    // head curvature columns
    toggleColumns("check_hc_s", "strength_hc")
    toggleColumns("check_hc_dorsalness", "dorsalness")
    toggleColumns("check_hc_dorsal", "dorsal")
    toggleColumns("check_hc_ventral", "ventral")
    toggleColumns("check_hc_fd", "fd")
    toggleColumns("check_hc_fv", "fv")
    toggleColumns("check_hc_rd", "rd")
    toggleColumns("check_hc_rv", "rv")
    toggleColumns("check_hc_mdf", "mdf")
    toggleColumns("check_hc_mvf", "mvf")

    // feeding columns
    toggleColumns("check_f_strength", "strength_feeding")
    toggleColumns("check_feedness", "feedingness")
    toggleColumns("check_f_act", "act")
    toggleColumns("check_f_inh", "inh")
    toggleColumns("check_f_fa", "fa")
    toggleColumns("check_f_fi", "fi")
    toggleColumns("check_f_ra", "ra")
    toggleColumns("check_f_ri", "ri")
    toggleColumns("check_f_maf", "maf")
    toggleColumns("check_f_mif", "mif")

    // others
    toggleColumns("check_o_ewma", "ewma")
    toggleColumns("check_o_enc_change", "enc_change")
}


function selectDefault() {
    all_checks = document.getElementsByClassName("form-check-input")
    for (var i = 0; i < all_checks.length; i++) {
        all_checks[i].checked = false
    }

    check_v_fwd.checked = true
    check_v_rev.checked = true
    check_hc_dorsal.checked = true
    check_hc_ventral.checked = true
    check_f_act.checked = true
    check_f_inh.checked = true
    check_o_ewma.checked = true

    updateTableColumn()
}

function toggleV() {
    var button_v_all = document.getElementById("button_v_all")
    if (button_v_all.innerHTML == "Select All") {
        button_v_all.innerHTML = "Deselect All"

        check_v_fwdness.checked = true
        check_v_fwd.checked = true
        check_v_rev.checked = true
        check_v_s.checked = true
        check_v_fwdness.checked = true
        check_v_fwd.checked = true
        check_v_rev.checked = true
        check_fwd_slope_p.checked = true
        check_fwd_slope_n.checked = true
        check_rev_slope_p.checked = true
        check_rev_slope_n.checked = true
        check_slope_1.checked = true
        check_slope_2.checked = true

    } else {
        button_v_all.innerHTML = "Select All"

        check_v_fwdness.checked = false
        check_v_fwd.checked = false
        check_v_rev.checked = false
        check_v_s.checked = false
        check_v_fwdness.checked = false
        check_v_fwd.checked = false
        check_v_rev.checked = false
        check_fwd_slope_p.checked = false
        check_fwd_slope_n.checked = false
        check_rev_slope_p.checked = false
        check_rev_slope_n.checked = false
        check_slope_1.checked = false
        check_slope_2.checked = false
    }
}

function toggleHC() {
    button_hc_all = document.getElementById("button_hc_all")

    if (button_hc_all.innerHTML == "Select All") {
        button_hc_all.innerHTML = "Deselect All"
        check_hc_s.checked = true
        check_hc_dorsalness.checked = true
        check_hc_dorsal.checked = true
        check_hc_ventral.checked = true
        check_hc_fd.checked = true
        check_hc_fv.checked = true
        check_hc_rd.checked = true
        check_hc_rv.checked = true
        check_hc_mdf.checked = true
        check_hc_mvf.checked = true
    } else {
        button_hc_all.innerHTML = "Select All"
        check_hc_s.checked = false
        check_hc_dorsalness.checked = false
        check_hc_dorsal.checked = false
        check_hc_ventral.checked = false
        check_hc_fd.checked = false
        check_hc_fv.checked = false
        check_hc_rd.checked = false
        check_hc_rv.checked = false
        check_hc_mdf.checked = false
        check_hc_mvf.checked = false
    }
}

function toggleF() {
    button_f_all = document.getElementById("button_f_all")
    if (button_f_all.innerHTML == "Select All") {
        button_f_all.innerHTML = "Deselect All"
        check_f_strength.checked = true
        check_feedness.checked = true
        check_f_act.checked = true
        check_f_inh.checked = true
        check_f_fa.checked = true
        check_f_fi.checked = true
        check_f_ra.checked = true
        check_f_ri.checked = true
        check_f_maf.checked = true
        check_f_mif.checked = true
    } else {
        button_f_all.innerHTML = "Select All"
        check_f_strength.checked = false
        check_feedness.checked = false
        check_f_act.checked = false
        check_f_inh.checked = false
        check_f_fa.checked = false
        check_f_fi.checked = false
        check_f_ra.checked = false
        check_f_ri.checked = false
        check_f_maf.checked = false
        check_f_mif.checked = false
    }
}

function toggleO() {
    button_o_all = document.getElementById("button_o_all")
    if (button_o_all.innerHTML == "Select All") {
        button_o_all.innerHTML = "Deselect All"
        check_o_ewma.checked = true
        check_o_enc_change.checked = true
    } else {
        button_o_all.innerHTML = "Select All"
        check_o_ewma.checked = false
        check_o_enc_change.checked = false
    }
}



fetch("data/encoding_table.json").
    then(response => response.json()).
    then(data => {
        // table
        console.log(data)
        var table_encoding_data = []

        n_neuron_class = data["class"].length
        for (var i = 0; i < n_neuron_class; i++) {
            table_encoding_data.push(
                {
                    "neuron": data["class"][i],
                    "count": data["count"][i],
                    "strength_v": roundNull(data["enc_strength_v"][i], 2),
                    "strength_hc": roundNull(data["enc_strength_hc"][i], 2),
                    "strength_feeding": roundNull(data["enc_strength_pumping"][i], 2),
                    "fwdness": roundNull(data["enc_v"][i], 2),
                    "dorsalness": roundNull(data["enc_hc"][i], 2),
                    "feedingness": roundNull(data["enc_pumping"][i],2),
                    "ewma": roundNull(data["tau"][i], 2),
                    "enc_change": roundNull(data["encoding_change_abundance"][i], 2),

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
    }).
    catch(error => {
        console.error(error)
        // res.sendStatus(404);
    });

function table_buttons () {
    return {
        btnUsersAdd: {
            text: 'Highlight Users',
            icon: '0-circle',
            event: function () {
              alert('Do some stuff to e.g. search all users which has logged in the last week')
            },
            attributes: {
              title: 'Search all users which has logged in the last week'
            }
          },
    
    }
}    