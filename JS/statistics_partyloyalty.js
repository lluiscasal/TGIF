console.log(apidata);
var statistics = {
    dem_reps_total: 0
    , dem_voted_total: 0
    , rep_reps_total: 0
    , rep_voted_total: 0
    , ind_reps_total: 0
    , ind_voted_total: 0
    , total_reps_total: 0
    , total_voted_total: 0
}

function analyze_apidata_reps() {
    var array_reps = [];
    var dem_reps = 0;
    var rep_reps = 0;
    var ind_reps = 0;
    var total_reps = 0;
    for (var i = 0; i < apidata.results[0].members.length; i++) {
        if (apidata.results[0].members[i]["party"] == "D") {
            dem_reps++;
        }
        if (apidata.results[0].members[i]["party"] == "R") {
            rep_reps++;
        }
        if (apidata.results[0].members[i]["party"] == "I") {
            ind_reps++;
        }
    }
    var total_reps = (dem_reps + rep_reps + ind_reps);
    array_reps.push(dem_reps);
    array_reps.push(rep_reps);
    array_reps.push(ind_reps);
    array_reps.push(total_reps);
    statistics.dem_reps_total = dem_reps;
    statistics.rep_reps_total = rep_reps;
    statistics.ind_reps_total = ind_reps;
    statistics.total_reps_total = total_reps;
    return array_reps;
}

function analyze_apidata_votes() {
    var dem_total_votes = 0;
    var rep_total_votes = 0;
    var ind_total_votes = 0;
    var num_dem = parseFloat(analyze_apidata_reps()[0]);
    var num_rep = parseFloat(analyze_apidata_reps()[1]);
    var num_ind = parseFloat(analyze_apidata_reps()[2]);
    for (var i = 0; i < apidata.results[0].members.length; i++) {
        if (apidata.results[0].members[i]["party"] == "D") {
            dem_total_votes += parseFloat(apidata.results[0].members[i]["votes_with_party_pct"]);
        }
        if (apidata.results[0].members[i]["party"] == "R") {
            rep_total_votes += parseFloat(apidata.results[0].members[i]["votes_with_party_pct"]);
        }
        if (apidata.results[0].members[i]["party"] == "I") {
            ind_total_votes += parseFloat(apidata.results[0].members[i]["votes_with_party_pct"]);
        }
    }
    var totalPerc_dem = (dem_total_votes / num_dem).toFixed(2);
    var totalPerc_rep = (rep_total_votes / num_rep).toFixed(2);
    var totalPerc_ind = (ind_total_votes / num_ind).toFixed(2);
    var total_voted_total = ((dem_total_votes / num_dem) + (rep_total_votes / num_rep) + (ind_total_votes / num_ind)) / 3;
    var totalPerc_total = (total_voted_total).toFixed(2);
    statistics.dem_voted_total = totalPerc_dem;
    statistics.rep_voted_total = totalPerc_rep;
    statistics.ind_voted_total = totalPerc_ind;
    statistics.total_voted_total = totalPerc_total;
}

function least_engaged() {
    var listData = [];
    // go to every member and create an object with desired data and add it to listData
    for (var i = 0; i < apidata.results[0].members.length; i++) {
        var obj = {
            name: ""
            , total_votes: ""
            , votes_with_party_pct: ""
        };
        obj.name = apidata.results[0].members[i]["first_name"] + " " + apidata.results[0].members[i]["last_name"];
        obj.total_votes = apidata.results[0].members[i]["total_votes"];
        obj.votes_with_party_pct = apidata.results[0].members[i]["votes_with_party_pct"];
        listData.push(obj);
    }
    // TODO: order by the lowest values (sorting array of objects by attribute)
    listData.sort(function (obj1, obj2) {
        return obj2.votes_with_party_pct - obj1.votes_with_party_pct;
    });
    // TODO: get only the 10% first members  
    var mlen = apidata.results[0].members.length;
    var perc = 10;
    var corte = mlen * (perc / 100);
    var listdataFiltered = [];
    for (i = 0; i < corte; i++) {
        listdataFiltered.push(listData[i]);
    };
    return listdataFiltered;
}

function most_engaged() {
    var listData = [];
    // go to every member and create an object with desired data and add it to listData
    for (var i = 0; i < apidata.results[0].members.length; i++) {
        var obj = {
            name: ""
            , total_votes: ""
            , votes_with_party_pct: ""
        };
        obj.name = apidata.results[0].members[i]["first_name"] + " " + apidata.results[0].members[i]["last_name"];
        obj.total_votes = apidata.results[0].members[i]["total_votes"];
        obj.votes_with_party_pct = apidata.results[0].members[i]["votes_with_party_pct"];
        listData.push(obj);
    }
    // TODO: order by the lowest values (sorting array of objects by attribute)
    listData.sort(function (obj1, obj2) {
        return obj1.votes_with_party_pct - obj2.votes_with_party_pct;
    });
    // TODO: get only the 10% first members  
    var mlen = apidata.results[0].members.length;
    var perc = 10;
    var corte = mlen * (perc / 100);
    var listdataFiltered = [];
    for (i = 0; i < corte; i++) {
        listdataFiltered.push(listData[i]);
    };
    return listdataFiltered;
}

function createTable(tbody_id, data) {
    var table = document.getElementById(tbody_id);
    var members = data[0].members;
    var addRow;
    var option;
    // REMOVE ALL LINES
    table.innerHTML = "";
    // var allStates = [];
    // ADD LINES
    for (i = 0; i < data.length; i++) {
        // var member = members[i];
        var row = document.createElement("tr");
        table.append(row);
        var name = data[i].name;
        var votes = data[i].total_votes;
        var votes_perc = data[i].votes_with_party_pct;
        row.insertCell().innerHTML = name;
        row.insertCell().innerHTML = votes;
        row.insertCell().innerHTML = votes_perc;
    }
}

function createGlanceTable() {
    var dem_reps = document.getElementById("dem_reps");
    var dem_voted = document.getElementById("dem_voted");
    var rep_reps = document.getElementById("rep_reps");
    var rep_voted = document.getElementById("rep_voted");
    var ind_reps = document.getElementById("ind_reps");
    var ind_voted = document.getElementById("ind_voted");
    var total_reps = document.getElementById("total_reps");
    var total_voted = document.getElementById("total_voted");
    dem_reps.innerHTML = statistics.dem_reps_total;
    dem_voted.innerHTML = statistics.dem_voted_total;
    rep_reps.innerHTML = statistics.rep_reps_total;
    rep_voted.innerHTML = statistics.rep_voted_total;
    ind_reps.innerHTML = statistics.ind_reps_total;
    ind_voted.innerHTML = statistics.ind_voted_total;
    total_reps.innerHTML = statistics.total_reps_total;
    total_voted.innerHTML = statistics.total_voted_total;
}
var apidata = 0;
switch (window.location.pathname) {
case "/house_partyloyalty.html":
    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function (data) {
        apidata = data;
        analyze_apidata_reps();
        analyze_apidata_votes();
        least_engaged();
        most_engaged();
        createTable("most_engaged", most_engaged());
        createTable("least_engaged", least_engaged());
        createGlanceTable();
    });
    break;
case "/senate_partyloyalty.html":
    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function (data) {
        apidata = data;
        analyze_apidata_reps();
        analyze_apidata_votes();
        least_engaged();
        most_engaged();
        createTable("most_engaged", most_engaged());
        createTable("least_engaged", least_engaged());
        createGlanceTable();
    });
}