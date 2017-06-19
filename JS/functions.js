//  createTable("id",data,["","","",""])
//  headers[0]
// headers[1]
function createTable(id,data,headers) {
    var id = document.getElementById(id);
    var data = data.results;
    var members = data[0].members;
    var addRow;
    var option;
    // REMOVE ALL LINES
    var elmtTable = document.getElementById(id);
    elmtTable.innerHTML = "";
    var allStates = [];
    // ADD LINES
    for (i = 0; i < members.length; i++) {
        var member = members[i];
        var row = document.createElement("tr");
        // Check if I have to add the row or not 
        addRow = filterTable(members[i]["party"], members[i]["state"]);
        //Add state values to array
        allStates[i] = members[i]["state"];
        if (addRow) {
            table.append(row);
            var fullName = members[i]["first_name"];
            if (members[i]["middle_name"] == null) {
                fullName += " " + members[i]["last_name"] + "</a>";
            }
            else {
                fullName += " " + members[i]["middle_name"] + " " + members[i]["last_name"] + "</a>";
            }
            var link = "<a href='" + members[i]['url'] + "' target='+_blank'>" + fullName;
            var party = members[i]["party"];
            var state = members[i]["state"];
            var seniority = members[i]["seniority"];
            var votePercentage = members[i]["votes_with_party_pct"];
            row.insertCell().innerHTML = link;
            row.insertCell().innerHTML = party;
            row.insertCell().innerHTML = state;
            row.insertCell().innerHTML = seniority;
            row.insertCell().innerHTML = votePercentage;
        }
    }
    //Sort and take out repeated values of the array
    var statesSortedUnique = [];
    statesSortedUnique = ordenaryunicos(allStates);
    for (i = 0; i < statesSortedUnique.length; i++) {
        option = document.createElement("option");
        option.value = statesSortedUnique[i];
        option.text = statesSortedUnique[i];
        dropdownStates.appendChild(option);
    }
}

function filterTable(party, state) {
    var chboxArray = [];
    var stateValue = document.getElementById("dropdownStates");
    var addRow = false;
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
    if (stateValue.value == state || stateValue.value == "All") {
        selectValue = true;
    }
    else {
        selectValue = false;
    }
    chboxBool = (chboxArray.indexOf(party) != -1);
    addRow = chboxBool && selectValue;
    
    return addRow;
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