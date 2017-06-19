var data1 = null;
var data2 = null;
switch (window.location.pathname) {
case "/senate_data.html":
    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function (dataSenateNYT) {
        data1 = dataSenateNYT.results[0].members;
        $.getJSON("JS/senateSunlight.json", function (dataSenateSLL) {
            data2 = dataSenateSLL.results;
            creartabla();
        });
    });
case "/house_data.html":
    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function (dataHouseSLL) {
        data1 = dataHouseSLL.results[0].members;
        $.getJSON("JS/houseSunlight.json", function (dataHouseSLL) {
            data2 = dataHouseSLL.results;
            creartabla();
        });
    });
}

function montarObj() {
    var data3 = data1.concat(data2);
    var array = [];
    var allStates = [];
    for (i = 0; i < data3.length; i++) {
        var obj = {};
        if (data3[i].first_name != null && data3[i].website != null) {
            obj.name = "<a href='" + data3[i].website + "' target='_blank'>" + data3[i].first_name + " " + data3[i].last_name + "</a>";
        }
        else if (data3[i].first_name != null && data3[i].url != undefined) {
            obj.name = "<a href='" + data3[i].url + "' target='_blank'>" + data3[i].first_name + " " + data3[i].last_name + "</a>";
        }
        else {
            obj.name = data3[i].first_name + " " + data3[i].last_name;
        }
        if (data3[i].bioguide_id != null) {
            obj.id = data3[i].bioguide_id;
        }
        if (data3[i].id != null) {
            obj.id = data3[i].id;
        }
        if (data3[i].id == null && data3[i].bioguide_id == null) {
            obj.id = "--";
        }
        if (data3[i].birthday != null) {
            obj.birthday = data3[i].birthday;
            obj.api = "SLL";
        }
        else {
            obj.birthday = "--";
            obj.api = "NYT";
        };
        if (data3[i].party != null) {
            obj.party = data3[i].party;
        }
        else {
            obj.party = "--";
        };
        if (data3[i].state != null) {
            obj.state = data3[i].state;
        }
        else {
            obj.state = "--";
        }
        if (data3[i].seniority != null) {
            obj.years = data3[i].seniority;
        }
        else {
            obj.years = "--";
        };
        if (data3[i].votes_with_party_pct != null) {
            obj.votes = data3[i].votes_with_party_pct;
        }
        else {
            obj.votes = "--";
        };
        array.push(obj);
        allStates.push(data3[i].state);
    }
    var cont;
    var k;
    for (cont = 0; cont < array.length; cont++) {
        for (k = (cont + 1); k < array.length; k++) {
            var id1 = array[cont].id;
            var id2 = array[k].id;
            if (id1 == id2) {
                array[cont].birthday = array[k].birthday;
                array.splice(k, 1);
            }
        }
    }
    statesSortedUnique = ordenaryunicos(allStates);
    var dropdownStates = document.getElementById("dropdownStates");
    for (i = 0; i < statesSortedUnique.length; i++) {
        option = document.createElement("option");
        option.value = statesSortedUnique[i];
        option.text = statesSortedUnique[i];
        dropdownStates.appendChild(option);
    }
    return array;
}

function creartabla() {
    $("#tbody").empty();
    var arrayObj = montarObj();
    $.each(arrayObj, function (index, value) {
        if (filterTable(value) && filterApi(value)) {
            var row = document.createElement("tr");
            for (key in value) {
                row.insertCell().innerHTML = value[key];
            }
            $("#tbody").append(row);
        }
    })
    $('td:nth-child(2),th:nth-child(2)').hide();
    $('td:nth-child(4),th:nth-child(4)').hide();
    hideColumns();
}

function hideColumns() {
    if (checkapiNYT.checked) {
        $('td:nth-child(3),th:nth-child(3)').hide();
        $('td:nth-child(8),th:nth-child(8)').show();
        $('td:nth-child(7),th:nth-child(7)').show();
    }
    if (checkapiSLL.checked) {
        $('td:nth-child(8),th:nth-child(8)').hide();
        $('td:nth-child(7),th:nth-child(7)').hide();
        $('td:nth-child(3),th:nth-child(3)').show();
    }
    if ((checkapiNYT.checked && checkapiSLL.checked) || (!checkapiNYT.checked && !checkapiSLL.checked)) {
        $('td:nth-child(8),th:nth-child(8)').show();
        $('td:nth-child(7),th:nth-child(7)').show();
        $('td:nth-child(3),th:nth-child(3)').show();
    }
}

function filterTable(value) {
    var chboxArray = [];
    var stateValue = document.getElementById("dropdownStates");
    var chboxD = document.getElementById("check_democrat").checked;
    if (chboxD) {
        chboxArray.push("D");
    }
    var chboxR = document.getElementById("check_republican").checked;
    if (chboxR) {
        chboxArray.push("R");
    }
    var chboxI = document.getElementById("check_independent").checked;
    if (chboxI) {
        chboxArray.push("I");
    }
    // Tres seleccionats o tres desclicats
    if (!chboxD && !chboxR && !chboxI) {
        chboxArray.push("D");
        chboxArray.push("R");
        chboxArray.push("I");
    }
    if (stateValue.value == value.state || stateValue.value == "All") {
        var selectValue = true;
    }
    else {
        var selectValue = false;
    }
    var chboxBool = (chboxArray.indexOf(value.party) != -1);
    var addRow = chboxBool && selectValue;
    return addRow;
}

function filterApi(value) {
    var dataSourceNYT = document.getElementById("checkapi_NYT").checked;
    var dataSourceSLL = document.getElementById("checkapi_SLL").checked;
    var dataSource = [];
    if (dataSourceNYT) {
        dataSource.push("NYT");
    }
    if (dataSourceSLL) {
        dataSource.push("SLL");
    }
    if (!dataSourceNYT && !dataSourceSLL) {
        dataSource.push("NYT");
        dataSource.push("SLL");
    }
    return dataSource.indexOf(value.api) != -1;
}

function ordenaryunicos(allStates) {
    var statesSortedUnique = [];
    var j = 0;
    allStates.sort();
    for (i = 0; i < allStates.length; i++) {
        if (allStates[i] != allStates[i + 1]) {
            statesSortedUnique[j] = allStates[i];
            j++;
        }
    }
    return statesSortedUnique;
}
var buttond = document.getElementById("check_democrat");
buttond.addEventListener("click", creartabla);
var buttonr = document.getElementById("check_republican");
buttonr.addEventListener("click", creartabla);
var buttoni = document.getElementById("check_independent");
buttoni.addEventListener("click", creartabla);
var dropdown = document.getElementById("dropdownStates");
dropdown.addEventListener("change", creartabla);
var checkapiNYT = document.getElementById("checkapi_NYT");
checkapiNYT.addEventListener("click", creartabla);
var checkapiSLL = document.getElementById("checkapi_SLL");
checkapiSLL.addEventListener("click", creartabla);