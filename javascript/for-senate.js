let data = '';
let senateMemberList = '';

fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
        headers: {
            "X-API-Key": "nE4wiAITBHiR1bpD5VEh1w7toMfLcuDW27OgbKYV"
        }
    })
    .then(function (response) {
        return response.json();
    }).then((dataSenate) => {
        data = dataSenate;
        senateMemberList = dataSenate.results[0].members;
        if (window.location.href.indexOf("senate-data") > -1) {
            createSenatorTable(senateMemberList);
            filtered();
            senateListStateSortedUnique = listOfStates();
            createStateList(senateListStateSortedUnique)
        } else if (window.location.href.indexOf("senate-attendance") > -1) {
            leastEngaged();
            mostEngaged();
            document.querySelector('#loaderattendance').className += ' ' + 'hide';
            document.querySelector('#loadermostengaged').className += ' ' + 'hide';
        } else if (window.location.href.indexOf("senate-party-loyalty") > -1) {
            leastLoyal();
            mostLoyal();
            document.querySelector('#loaderatglance').className += ' ' + 'hide';
            document.querySelector('#loadermostloyal').className += ' ' + 'hide';
        }
        if ((window.location.href.indexOf("senate-attendance") > -1) | (window.location.href.indexOf("senate-party-loyalty") > -1)) {
            let countRep = repCounter();
            let indeCount = indeCounter();
            let demoCount = demoCounter();
            avgRep(countRep);
            demAvg(demoCount);
            indeAvg(indeCount);
        }
        document.querySelector('#loader').className += ' ' + 'hide'
    })

function listOfStates() {
    let arraySortedStates = [];
    for (let i = 0; i < senateMemberList.length; i++) {
        arraySortedStates.push(senateMemberList[i].state);
        let senateListStateSorted = arraySortedStates.sort();
        senateListStateSortedUnique = [...new Set(senateListStateSorted)]
    }
    return senateListStateSortedUnique
}

function createStateList(array) {
    if (senateMemberList !== undefined) {
        let statesToAppend = '';
        for (let i = 0; i < array.length; i++) {
            statesToAppend += '<option value="' + array[i] + '">' + array[i] + '</option>';
        }
        document.getElementById("states").innerHTML += statesToAppend;
    }
}

function createSenatorTable(array) {
    if (senateMemberList !== undefined) {
        let dataToAppend = '';

        for (let i = 0; i < array.length; i++) {
            dataToAppend += '<tr><td class="tablecontent"><a href="' + array[i].url + '">' + array[i].first_name +
                ' ' +
                (array[i].middle_name || "") +
                ' ' + array[i].last_name +
                '</td><td class="tablecontent">' + array[i].party +
                '</td><td class="tablecontent">' + array[i].state +
                '</td><td class="tablecontent">' + array[i].seniority +
                '</td><td class="tablecontent">' + array[i].votes_with_party_pct + '%' + '</td><tr>';
        }

        document.getElementById("senate-data").innerHTML += dataToAppend;
    }

}

function filtered() {
    let repFilterButton = document.getElementById("republicanfilterbutton");
    let demoFilterButton = document.getElementById("demofilterbutton");
    let indeFilterButton = document.getElementById("indefilterbutton");
    let filteredList = [];
    let toAppend = '';
    let e = document.getElementById("states");
    let value = e.options[e.selectedIndex].value;
    document.getElementById("senate-data").innerHTML = toAppend;
    if (indeFilterButton.checked == true) {
        for (let i = 0; i < senateMemberList.length; i++) {
            if (senateMemberList[i].party == 'I') {
                filteredList.push(senateMemberList[i])
            }
        }
    }
    if (demoFilterButton.checked == true) {
        for (let i = 0; i < senateMemberList.length; i++) {
            if (senateMemberList[i].party == 'D') {
                filteredList.push(senateMemberList[i])
            }
        }
    }
    if (repFilterButton.checked == true) {
        for (let i = 0; i < senateMemberList.length; i++) {
            if (senateMemberList[i].party == 'R') {
                filteredList.push(senateMemberList[i])
            }
        }
    }
    let resultArray = [];
    for (let i = 0; i < filteredList.length; i++) {
        if (filteredList[i].state == value) {
            resultArray.push(filteredList[i])
        }
    }
    if (repFilterButton.checked == false && demoFilterButton.checked == false && indeFilterButton.checked == false && value == "ALL") {
        createSenatorTable(senateMemberList)
    } else if (repFilterButton.checked == false && demoFilterButton.checked == false && indeFilterButton.checked == false) {
        let provisionalArray = []
        for (let i = 0; i < senateMemberList.length; i++) {
            if (senateMemberList[i].state == value) {
                provisionalArray.push(senateMemberList[i])
            }
        }
        createSenatorTable(provisionalArray)
    } else {
        if (value != "ALL") {
            createSenatorTable(resultArray)
        } else {
            createSenatorTable(filteredList);
        }
    }
}

function repCounter() {
    let republicanCounter = 0
    for (let i = 0; i < senateMemberList.length; i++) {
        if (senateMemberList[i].party == 'R') {
            republicanCounter++
        }
    }
    document.getElementById("republican").innerHTML += '<td class="tablecontent">' + republicanCounter + '</td>'
    return republicanCounter;
}

function demoCounter() {
    let democratCounter = 0
    for (let i = 0; i < senateMemberList.length; i++) {
        if (senateMemberList[i].party == 'D') {
            democratCounter++
        }
    }
    document.getElementById("democrat").innerHTML += '<td class="tablecontent">' + democratCounter + '</td>'
    return democratCounter
}

function indeCounter() {
    let indeCounter = 0
    for (let i = 0; i < senateMemberList.length; i++) {
        if (senateMemberList[i].party == 'I') {
            indeCounter++
        }
    }
    document.getElementById("independent").innerHTML += '<td class="tablecontent">' + indeCounter + '</td>'
    return indeCounter;
}

function avgRep(republicanCounter) {
    let sumVotedRep = 0;
    for (let i = 0; i < senateMemberList.length; i++) {
        if (senateMemberList[i].party == 'R') {
            sumVotedRep += senateMemberList[i].votes_with_party_pct;
        }
    }
    let avgVotedRep = Math.round(sumVotedRep / republicanCounter)
    document.getElementById("republican").innerHTML += '<td class="tablecontent">' + avgVotedRep + '%' + '</td>';
}

function demAvg(democratCounter) {
    let sumVotedDem = 0;
    for (let i = 0; i < senateMemberList.length; i++) {
        if (senateMemberList[i].party == 'D') {
            sumVotedDem += senateMemberList[i].votes_with_party_pct;
        }
    }
    let avgVotedDem = Math.round(sumVotedDem / democratCounter)
    document.getElementById("democrat").innerHTML += '<td class="tablecontent">' + avgVotedDem + '%' + '</td>';
}

function indeAvg(indeCounter) {
    let sumVotedInd = 0;
    for (let i = 0; i < senateMemberList.length; i++) {
        if (senateMemberList[i].party == 'I') {
            sumVotedInd += senateMemberList[i].votes_with_party_pct;
        }
    }
    let avgVotedInd = Math.round(sumVotedInd / indeCounter) || "0"
    document.getElementById("independent").innerHTML += '<td class="tablecontent">' + (avgVotedInd || '0') + '%' + '</td>';
}

function leastEngaged() {
    let tempWholeArray = [];
    for (let i = 0; i < senateMemberList.length; i++) {
        tempWholeArray.push(senateMemberList[i])
    }
    let sortedArray = tempWholeArray.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct); //Members list sorted by percentage (high to low)
    let leastEngagedAppend = '';
    for (let i = 0; i < sortedArray.length * 0.1; i++) {
        leastEngagedAppend += '<tr><td class="tablecontent"><a href="' + sortedArray[i].url + '">' + sortedArray[i].first_name + ' ' + sortedArray[i].last_name + '</td><td class="tablecontent">' +
            sortedArray[i].missed_votes + '</td><td class="tablecontent">' +
            sortedArray[i].missed_votes_pct + '%' + '</tr></td>'
    }

    document.getElementById("leastengaged").innerHTML += leastEngagedAppend;
}

function mostEngaged() {
    let tempWholeArray = [];
    for (let i = 0; i < senateMemberList.length; i++) {
        tempWholeArray.push(senateMemberList[i])
    };

    let mostEngagedSorted = tempWholeArray.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct); //Members list sorted by percentage (low to high)
    let mostEngagedAppend = '';
    for (let i = 0; i < mostEngagedSorted.length * 0.1; i++) {
        mostEngagedAppend += '<tr><td class="tablecontent"><a href="' + mostEngagedSorted[i].url + '">' + mostEngagedSorted[i].first_name + ' ' + mostEngagedSorted[i].last_name +
            '</td><td class="tablecontent">' + mostEngagedSorted[i].missed_votes + '</td><td class="tablecontent">' + mostEngagedSorted[i].missed_votes_pct + '%' + '</tr></td>'

    }
    document.getElementById("mostengaged").innerHTML += mostEngagedAppend;
}


function leastLoyal() {
    let tempWholeArray = []; // array showing all the percentages
    for (let i = 0; i < senateMemberList.length; i++) {
        tempWholeArray.push(senateMemberList[i])
    }
    leastLoyalSorted = tempWholeArray.sort((a, b) => (b.total_votes * b.votes_with_party_pct / 100) - (a.total_votes * a.votes_with_party_pct / 100));
    let leastLoyalAppend = '';
    for (let i = 0; i < leastLoyalSorted.length * .1; i++) {
        leastLoyalAppend += '<tr><td class="tablecontent"><a href="' + leastLoyalSorted[i].url + '">' + leastLoyalSorted[i].first_name + ' ' + leastLoyalSorted[i].last_name + '</td><td class="tablecontent">' +
            leastLoyalSorted[i].total_votes + '</td><td class="tablecontent">' +
            (((leastLoyalSorted[i].total_votes) * (leastLoyalSorted[i].votes_with_party_pct / 100) / 100).toFixed(2)) + '%' + '</tr></td>'
    }
    document.getElementById("leastloyal").innerHTML += leastLoyalAppend;
}

function mostLoyal() {
    let tempWholeArray = []; // array showing all the percentages
    for (let i = 0; i < senateMemberList.length; i++) {
        tempWholeArray.push(senateMemberList[i])
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