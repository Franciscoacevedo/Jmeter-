/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.55072463768116, "KoPercent": 1.4492753623188406};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9492753623188406, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "DEMO-Pague/canonical.html-61"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/jquery/jquery-1.12.2.min.js-17"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-40"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-41"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-60"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-62"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/application/view/image/demonstration/store-admin.png-50"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-35"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-34"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-37"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-38"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-63"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/index.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-12"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/canonical.html-52"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-31"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/canonical.html-55"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-32"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/common.js-16"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/canonical.html-58"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-18"], "isController": false}, {"data": [0.0, 500, 1500, "Home-Pague/canonical.html-3"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/bootstrap/js/bootstrap.min.js-2"], "isController": false}, {"data": [0.5, 500, 1500, "Home-Pague/canonical.html-6"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/image/icon/opencart-logo-white.png-23"], "isController": false}, {"data": [0.5, 500, 1500, "Home-Pague/canonical.html-6-2"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/jquery/datetimepicker/moment.js-15"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-6-0"], "isController": false}, {"data": [0.5, 500, 1500, "Home-Pague/canonical.html-9"], "isController": false}, {"data": [0.5, 500, 1500, "Home-Pague/canonical.html-6-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-25"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-28"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/application/view/image/banner/demonstration.jpg-49"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-27"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-29"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-22"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/index.php-42"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-20"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-4"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/canonical.html-43"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-26"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/canonical.html-46"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-21"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-7"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-8"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/image/feature/admin/dashboard.png-19"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/application/view/image/demonstration/store-front.png-51"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-13"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/image/icon/facebook_marketing_partner.png-24"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-45"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-48"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-14"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-47"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-44"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-33"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-39"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-11"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-10"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-36"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-57"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-9-0"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-56"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-59"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-53"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-30"], "isController": false}, {"data": [0.5, 500, 1500, "Home-Pague/canonical.html-9-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-9-2"], "isController": false}, {"data": [1.0, 500, 1500, "DEMO-Pague/success.txt-54"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 69, 1, 1.4492753623188406, 150.21739130434779, 25, 1318, 56.0, 432.0, 551.0, 1318.0, 8.402338041889918, 61.94583764612762, 3.084995661836337], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DEMO-Pague/canonical.html-61", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 6.018813775510204, 6.576849489795918], "isController": false}, {"data": ["Home-Pague/application/view/javascript/jquery/jquery-1.12.2.min.js-17", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 268.0390625, 3.6328125], "isController": false}, {"data": ["Home-Pague/success.txt-40", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 5.508814102564102, 8.313301282051283], "isController": false}, {"data": ["Home-Pague/success.txt-41", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 4.1316105769230775, 6.234975961538462], "isController": false}, {"data": ["DEMO-Pague/success.txt-60", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 5.240091463414634, 7.907774390243902], "isController": false}, {"data": ["DEMO-Pague/success.txt-62", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 4.774305555555555, 7.204861111111112], "isController": false}, {"data": ["DEMO-Pague/application/view/image/demonstration/store-admin.png-50", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 437.3352301954733, 1.9290123456790125], "isController": false}, {"data": ["Home-Pague/success.txt-35", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 4.774305555555555, 7.204861111111112], "isController": false}, {"data": ["Home-Pague/success.txt-34", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 4.053655660377359, 6.117334905660377], "isController": false}, {"data": ["Home-Pague/success.txt-37", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-38", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["DEMO-Pague/success.txt-63", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 5.967881944444445, 9.00607638888889], "isController": false}, {"data": ["Home-Pague/index.php-1", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 14.946169969512196, 1.135353150406504], "isController": false}, {"data": ["Home-Pague/canonical.html-12", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 6.702769886363637, 7.32421875], "isController": false}, {"data": ["DEMO-Pague/canonical.html-52", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 6.553819444444445, 7.161458333333334], "isController": false}, {"data": ["Home-Pague/success.txt-31", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 3.8364955357142856, 5.789620535714286], "isController": false}, {"data": ["DEMO-Pague/canonical.html-55", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 7.373046875, 8.056640625], "isController": false}, {"data": ["Home-Pague/success.txt-32", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 4.1316105769230775, 6.234975961538462], "isController": false}, {"data": ["Home-Pague/application/view/javascript/common.js-16", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 28.23591820987654, 5.3891782407407405], "isController": false}, {"data": ["DEMO-Pague/canonical.html-58", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 4.401819029850746, 4.809934701492537], "isController": false}, {"data": ["Home-Pague/canonical.html-18", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.9669569672131147, 1.056608606557377], "isController": false}, {"data": ["Home-Pague/canonical.html-3", 1, 1, 100.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 98.7890625, 0.0], "isController": false}, {"data": ["Home-Pague/application/view/javascript/bootstrap/js/bootstrap.min.js-2", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 88.99681969026548, 4.035882190265487], "isController": false}, {"data": ["Home-Pague/canonical.html-6", 1, 0, 0.0, 1318.0, 1318, 1318, 1318.0, 1318.0, 1318.0, 1318.0, 0.7587253414264037, 6.368402646054628, 0.7661347685887708], "isController": false}, {"data": ["Home-Pague/application/view/image/icon/opencart-logo-white.png-23", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 49.23624067164179, 7.025419776119403], "isController": false}, {"data": ["Home-Pague/canonical.html-6-2", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 13.329487802245252, 0.6341753022452504], "isController": false}, {"data": ["Home-Pague/application/view/javascript/jquery/datetimepicker/moment.js-15", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 73.55244954427083, 2.3854573567708335], "isController": false}, {"data": ["Home-Pague/canonical.html-6-0", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4739705023364487, 1.5013507593457944], "isController": false}, {"data": ["Home-Pague/canonical.html-9", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 2.83203125, 1.1496803977272727], "isController": false}, {"data": ["Home-Pague/canonical.html-6-1", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.689008723709369, 0.614319431166348], "isController": false}, {"data": ["Home-Pague/success.txt-25", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 5.240091463414634, 7.907774390243902], "isController": false}, {"data": ["Home-Pague/success.txt-28", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.9855217889908257, 1.4872419724770642], "isController": false}, {"data": ["DEMO-Pague/application/view/image/banner/demonstration.jpg-49", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 383.36780024509807, 2.360026041666667], "isController": false}, {"data": ["Home-Pague/success.txt-27", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 4.571143617021277, 6.898271276595745], "isController": false}, {"data": ["Home-Pague/success.txt-29", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 5.806587837837838, 8.76266891891892], "isController": false}, {"data": ["Home-Pague/canonical.html-22", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 6.411345108695652, 7.005774456521739], "isController": false}, {"data": ["DEMO-Pague/index.php-42", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 9.966777408637874, 1.846060008305648], "isController": false}, {"data": ["Home-Pague/success.txt-20", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 4.053655660377359, 6.117334905660377], "isController": false}, {"data": ["Home-Pague/success.txt-4", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 1.4228062913907285, 2.1471440397350996], "isController": false}, {"data": ["DEMO-Pague/canonical.html-43", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 7.562099358974359, 8.263221153846153], "isController": false}, {"data": ["Home-Pague/canonical.html-26", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 5.17406798245614, 5.653782894736842], "isController": false}, {"data": ["DEMO-Pague/canonical.html-46", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 7.021949404761904, 7.672991071428571], "isController": false}, {"data": ["Home-Pague/success.txt-21", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 3.8364955357142856, 5.789620535714286], "isController": false}, {"data": ["Home-Pague/success.txt-7", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 3.5220286885245904, 5.315061475409836], "isController": false}, {"data": ["Home-Pague/success.txt-8", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 4.8828125, 7.368607954545455], "isController": false}, {"data": ["Home-Pague/application/view/image/feature/admin/dashboard.png-19", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 206.35986328125, 1.087330005787037], "isController": false}, {"data": ["DEMO-Pague/application/view/image/demonstration/store-front.png-51", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 804.9108966503268, 3.0637254901960786], "isController": false}, {"data": ["Home-Pague/success.txt-13", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.7021037581699346, 1.0595383986928104], "isController": false}, {"data": ["Home-Pague/application/view/image/icon/facebook_marketing_partner.png-24", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 40.985107421875, 7.4615478515625], "isController": false}, {"data": ["DEMO-Pague/success.txt-45", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 3.4652217741935485, 5.229334677419355], "isController": false}, {"data": ["DEMO-Pague/success.txt-48", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.3100228658536586, 1.9769435975609755], "isController": false}, {"data": ["Home-Pague/success.txt-14", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 4.670516304347826, 7.048233695652174], "isController": false}, {"data": ["DEMO-Pague/success.txt-47", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 4.8828125, 7.368607954545455], "isController": false}, {"data": ["DEMO-Pague/success.txt-44", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 5.508814102564102, 8.313301282051283], "isController": false}, {"data": ["Home-Pague/canonical.html-33", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 2.9790088383838382, 3.255208333333333], "isController": false}, {"data": ["Home-Pague/canonical.html-39", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.9765625, 1.0671047185430464], "isController": false}, {"data": ["Home-Pague/success.txt-11", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 4.296875, 6.484375], "isController": false}, {"data": ["Home-Pague/success.txt-10", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 3.025968309859155, 4.566461267605634], "isController": false}, {"data": ["Home-Pague/canonical.html-36", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 6.411345108695652, 7.005774456521739], "isController": false}, {"data": ["Home-Pague/success.txt", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 4.996366279069768, 7.539970930232559], "isController": false}, {"data": ["DEMO-Pague/success.txt-57", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 4.996366279069768, 7.539970930232559], "isController": false}, {"data": ["Home-Pague/canonical.html-9-0", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4808905516431925, 1.508399354460094], "isController": false}, {"data": ["DEMO-Pague/success.txt-56", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 5.508814102564102, 8.313301282051283], "isController": false}, {"data": ["DEMO-Pague/success.txt-59", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 3.3052884615384612, 4.987980769230769], "isController": false}, {"data": ["DEMO-Pague/success.txt-53", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/canonical.html-30", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 6.411345108695652, 7.005774456521739], "isController": false}, {"data": ["Home-Pague/canonical.html-9-1", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.7035042475728155, 0.6238622572815534], "isController": false}, {"data": ["Home-Pague/canonical.html-9-2", 1, 0, 0.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 11.937191611842106, 2.4285567434210527], "isController": false}, {"data": ["DEMO-Pague/success.txt-54", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 5.508814102564102, 8.313301282051283], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 1, 100.0, 1.4492753623188406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 69, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-3", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
