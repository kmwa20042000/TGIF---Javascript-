let data = '';
let houseMemberList = '';

fetch("https://api.propublica.org/congress/v1/103/house/members.json", {
        headers: {
            "X-API-Key": "nE4wiAITBHiR1bpD5VEh1w7toMfLcuDW27OgbKYV"
        }
    })
    .then(function (response) {
        return response.json();
    }).then((dataHouse) => {
        data = dataHouse;
        houseMemberList = dataHouse.results[0].members;
        houseMemList = dataHouse.results[0].members;
        if (window.location.href.indexOf("house-data") > -1) {
            createHouseTable(houseMemberList);
            filteredHouse();
            senateListStateSortedUnique = listOfStates();
            createStateList(senateListStateSortedUnique);
        } else if (window.location.href.indexOf("house-party-loyalty") > -1) {
            lesatLoyal();
            mostLoyal();
            document.querySelector('#loaderatglance').className += ' ' + 'hide';
            document.querySelector('#loadermostloyal').className += ' ' + 'hide';
        } else if (window.location.href.indexOf("house-attendance") > -1) {
            leastEngaged();
            mostEngaged();
            document.querySelector('#loaderattendance').className += ' ' + 'hide';
            document.querySelector('#loadermostengaged').className += ' ' + 'hide';
        }
        if ((window.location.href.indexOf("house-attendance") > -1) | (window.location.href.indexOf("house-party-loyalty") > -1)) {
            let countRep = repCounter();
            let countHouse = houseCounter();
            let countInde = indeCounter();
            sumAvgRepHouse(countRep);
            sumAvgHouse(countHouse);
            indeHouseAvg(countInde);
        }
        document.querySelector('#loader').className += ' ' + 'hide';
    })

function listOfStates() {
    let arraySortedStates = [];
    for (let i = 0; i < houseMemberList.length; i++) {
        arraySortedStates.push(houseMemberList[i].state);
        let houseListStateSorted = arraySortedStates.sort();
        houseListStateSortedUnique = [...new Set(houseListStateSorted)]
    }
    return houseListStateSortedUnique
}

function createStateList(array) {
    if (houseMemberList !== undefined) {
        let statesToAppend = '';
        for (let i = 0; i < array.length; i++) {
            statesToAppend += '<option value="' + array[i] + '">' + array[i] + '</option>';
        }
        document.getElementById("states").innerHTML += statesToAppend;
    }
}

function createHouseTable(array) {
    if (houseMemberList !== undefined) {
        let dataToAppend = '';

        for (let i = 0; i < array.length; i++) {
            dataToAppend += '<tr class="tablecontent"><td class="tablecontent"><a href="' + array[i].url + '">' +
                array[i].first_name + ' ' +
                (array[i].middle_name || "") + ' ' +
                array[i].last_name + '</td><td class="tablecontent">' + array[i].party + '</td><td>' + array[i].state + '</td><td>' + array[i].seniority + '</td><td>' + array[i].votes_with_party_pct + '%' + '</td><tr>';
        }
        document.getElementById("house-data").innerHTML += dataToAppend;
    }
};


function filteredHouse() {
    let repFilterButton = document.getElementById("repubhousefilterbutton");
    let demoFilterButton = document.getElementById("demohousefilterbutton");
    let indeFilterButton = document.getElementById("indehousefilterbutton");
    let filteredList = [];
    let toAppend = '';
    let e = document.getElementById("states");
    let value = e.options[e.selectedIndex].value;
    let filteredListByStates = [];

    document.getElementById("house-data").innerHTML = toAppend;
    if (indeFilterButton.checked == true) {
        for (let i = 0; i < houseMemberList.length; i++) {
            if (houseMemberList[i].party == 'ID') {
                filteredList.push(houseMemberList[i])
            }
        }
    }
    if (demoFilterButton.checked == true) {
        for (let i = 0; i < houseMemberList.length; i++) {
            if (houseMemberList[i].party == 'D') {
                filteredList.push(houseMemberList[i])
            }
        }
    }
    if (repFilterButton.checked == true) {
        for (let i = 0; i < houseMemberList.length; i++) {
            if (houseMemberList[i].party == 'R') {
                filteredList.push(houseMemberList[i])
            }
        }
    }
    if (value != "ALL") {
        for (let i = 0; i < filteredList.length; i++) {
            if (filteredList[i].state == value) {
                filteredListByStates.push(filteredList[i])
            }
        }
        createHouseTable(filteredListByStates)
    } else {
        createHouseTable(filteredList);
    }
    if (repFilterButton.checked == false && demoFilterButton.checked == false && indeFilterButton.checked == false && value == "ALL") {
        createHouseTable(houseMemberList)
    } else if (repFilterButton.checked == false && demoFilterButton.checked == false && indeFilterButton.checked == false) {
        let provisionalArray = [];
        let resultArray = [];
        for (let i = 0; i < houseMemberList.length; i++) {
            if (houseMemberList[i].state == value) {
                provisionalArray.push(houseMemberList[i])
            }
        }
        createHouseTable(provisionalArray)
    } else {
        if (value != "ALL") {
            createHouseTable(resultArray)
        } else {
            createHouseTable(filteredList);
        }
    }
}

function repCounter() {
    let repHouseCounter = 0;
    for (let i = 0; i < houseMemList.length; i++) {
        if (houseMemList[i].party == 'R') {
            repHouseCounter++
        }
    }
    document.getElementById("republican-house").innerHTML += '<td class="tablecontent">' + repHouseCounter + '</td>'
    return repHouseCounter;
}

function houseCounter() {
    let demoHouseCounter = 0;
    for (let i = 0; i < houseMemList.length; i++) {
        if (houseMemList[i].party == 'D') {
            demoHouseCounter++
        }
    }
    document.getElementById("democrat-house").innerHTML += '<td class="tablecontent">' + demoHouseCounter + '</td>';
    return demoHouseCounter;
}

function indeCounter() {
    let indeHouseCounter = 0;
    for (let i = 0; i < houseMemList.length; i++) {
        if (houseMemList[i].party == 'I') {
            indeHouseCounter++
        }
    }
    document.getElementById("independent-house").innerHTML += '<td class="tablecontent">' + indeHouseCounter + '</td>';
    return indeHouseCounter;
}

function sumAvgRepHouse(republicanCounter) {
    let sumVotedRepHouse = 0;

    for (let i = 0; i < houseMemList.length; i++) {
        if (houseMemList[i].party == 'R' && houseMemList[i].votes_with_party_pct != null) {
            sumVotedRepHouse += houseMemList[i].votes_with_party_pct;
        }
    }

    let avgVotedRepHouse = Math.round(sumVotedRepHouse / republicanCounter)
    document.getElementById("republican-house").innerHTML += '<td class="tablecontent">' + avgVotedRepHouse + '%' + '</td>';
}

function sumAvgHouse(demoHouseCounter) {
    let sumVotedDemoHouse = 0;
    for (let i = 0; i < houseMemList.length; i++) {
        if (houseMemList[i].party == 'D' && houseMemList[i].votes_with_party_pct != null) {
            sumVotedDemoHouse += houseMemList[i].votes_with_party_pct;
        }
    }
    let avgVotedDemoHouse = Math.round(sumVotedDemoHouse / demoHouseCounter)
    document.getElementById("democrat-house").innerHTML += '<td class="tablecontent">' + avgVotedDemoHouse + '%' + '</td>';
}

function indeHouseAvg(indeHouseCounter) {
    let sumVotedIndeHouse = 0;
    for (let i = 0; i < houseMemList.length; i++) {
        if (houseMemList[i].party == 'I' && houseMemList[i].votes_with_party_pct != null) {
            sumVotedIndeHouse += houseMemList[i].votes_with_party_pct;
        }
    }
    let avgVotedIndeHouse = Math.round(sumVotedIndeHouse / indeHouseCounter) || "0";
    document.getElementById("independent-house").innerHTML += '<td class="tablecontent">' + avgVotedIndeHouse + '%' + '</td>';
}

function leastEngaged() {
    let tempWholeArray = [];
    for (let i = 0; i < houseMemList.length; i++) {
        tempWholeArray.push(houseMemList[i])
    }
    let sortedArray = tempWholeArray.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct);
    let append = '';
    for (let i = 0; i < sortedArray.length * .1; i++) {
        append += '<tr><td class="tablecontent"><a href="' + sortedArray[i].url + '">' + sortedArray[i].first_name + ' ' + sortedArray[i].last_name + '</td><td class="tablecontent">' +
            sortedArray[i].missed_votes + '</td><td class="tablecontent">' +
            sortedArray[i].missed_votes_pct + '%' + '</tr></td>'
    }
    document.getElementById("leastengagedhouse").innerHTML += append
}

function mostEngaged() {
    let tempWholeArray = [];
    for (let i = 0; i < houseMemList.length; i++) {
        tempWholeArray.push(houseMemList[i])
    }
    let mostEngagedHouseSorted = tempWholeArray.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);
    let mostEngagedHouseAppend = '';
    for (let i = 0; i < mostEngagedHouseSorted.length * .1; i++) {
        mostEngagedHouseAppend += '<tr><td class="tablecontent"><a href="' + mostEngagedHouseSorted[i].url + '">' + mostEngagedHouseSorted[i].first_name + ' ' + mostEngagedHouseSorted[i].last_name + '</td><td class="tablecontent">' +
            mostEngagedHouseSorted[i].missed_votes + '</td><td class="tablecontent">' +
            mostEngagedHouseSorted[i].missed_votes_pct + '%' + '</tr></td>'
    }
    document.getElementById("mostengagedhouse").innerHTML += mostEngagedHouseAppend
}

function lesatLoyal() {
    let tempWholeArray = [];
    for (let i = 0; i < houseMemList.length; i++) {
        tempWholeArray.push(houseMemList[i])
    }
    for (let i = 0; i < tempWholeArray.length; i++) {
        tempWholeArray[i].numberPartyVotes = tempWholeArray[i].total_votes * tempWholeArray[i].votes_with_party_pct / 100
    }
    leastLoyalSorted = tempWholeArray.sort((a, b) => (b.total_votes * b.votes_with_party_pct / 100) - (a.total_votes * a.votes_with_party_pct / 100));
    let leastLoyalAppend = '';
    for (let i = 0; i < leastLoyalSorted.length * .1; i++) {
        leastLoyalAppend += '<tr><td class="tablecontent"><a href="' + tempWholeArray[i].url + '">' + leastLoyalSorted[i].first_name + ' ' + leastLoyalSorted[i].last_name + '</td><td class="tablecontent">' +
            leastLoyalSorted[i].total_votes + '</td><td class="tablecontent">' +
            (((leastLoyalSorted[i].total_votes) * (leastLoyalSorted[i].votes_with_party_pct / 100) / 100).toFixed(2)) + '%' + '</tr></td>'
    }
    document.getElementById("leastloyal").innerHTML += leastLoyalAppend;
}

function mostLoyal() {
    let tempWholeArray = [];
    for (let i = 0; i < houseMemList.length; i++) {
        tempWholeArray.push(houseMemList[i])
    }
    for (let i = 0; i < tempWholeArray.length; i++) {
        tempWholeArray[i].numberPartyVotes = tempWholeArray[i].total_votes * tempWholeArray[i].votes_with_party_pct / 100
    }
    mostLoyalSorted = tempWholeArray.sort((a, b) => (a.total_votes * a.votes_with_party_pct / 100) - (b.total_votes * b.votes_with_party_pct / 100));
    let mostLoyalAppend = '';

    for (let i = 0; i < mostLoyalSorted.length * .1; i++) {
        mostLoyalAppend += '<tr><td class="tablecontent"><a href="' + mostLoyalSorted[i].url + '">' + mostLoyalSorted[i].first_name + ' ' + mostLoyalSorted[i].last_name + '</td><td class="tablecontent">' +
            mostLoyalSorted[i].total_votes + '</td><td class="tablecontent">' +
            (((mostLoyalSorted[i].total_votes) * (mostLoyalSorted[i].votes_with_party_pct / 100)) / 100).toFixed(2) + '%' + '</tr></td>'
    }
    document.getElementById("mostloyal").innerHTML += mostLoyalAppend;
}