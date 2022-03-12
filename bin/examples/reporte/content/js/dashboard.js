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

    var data = {"OkPercent": 97.5609756097561, "KoPercent": 2.4390243902439024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9634146341463414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/jquery/jquery-1.12.2.min.js-17"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-22"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-40"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-20"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-4"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-41"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-5"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-26"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-21"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-7"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-8"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/image/feature/admin/dashboard.png-19"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-13"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/image/icon/facebook_marketing_partner.png-24"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-35"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-34"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-37"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-14"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-38"], "isController": false}, {"data": [0.5, 500, 1500, "Home-Pague/index.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-12"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-33"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-31"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-39"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-11"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-10"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-32"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-36"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/common.js-16"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-18"], "isController": false}, {"data": [0.0, 500, 1500, "Home-Pague/canonical.html-3"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/bootstrap/js/bootstrap.min.js-2"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-6"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/image/icon/opencart-logo-white.png-23"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/application/view/javascript/jquery/datetimepicker/moment.js-15"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-9"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-25"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-28"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-27"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-30"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/success.txt-29"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 1, 2.4390243902439024, 63.6829268292683, 12, 623, 38.0, 106.20000000000013, 162.39999999999992, 623.0, 15.536187949981054, 65.35863785998485, 5.356846816976128], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Home-Pague/application/view/javascript/jquery/jquery-1.12.2.min.js-17", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 299.15073939732144, 4.054478236607142], "isController": false}, {"data": ["Home-Pague/canonical.html-22", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 7.970861486486487, 8.709881756756758], "isController": false}, {"data": ["Home-Pague/success.txt-40", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-20", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-4", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 2.8268914473684212, 4.2660361842105265], "isController": false}, {"data": ["Home-Pague/success.txt-41", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 5.806587837837838, 8.76266891891892], "isController": false}, {"data": ["Home-Pague/success.txt-5", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 4.384566326530612, 6.6167091836734695], "isController": false}, {"data": ["Home-Pague/canonical.html-26", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 7.970861486486487, 8.709881756756758], "isController": false}, {"data": ["Home-Pague/success.txt-21", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 5.806587837837838, 8.76266891891892], "isController": false}, {"data": ["Home-Pague/success.txt-7", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 5.967881944444445, 9.00607638888889], "isController": false}, {"data": ["Home-Pague/success.txt-8", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/application/view/image/feature/admin/dashboard.png-19", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 533.8112836826347, 2.8127339071856285], "isController": false}, {"data": ["Home-Pague/success.txt-13", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 5.37109375, 8.10546875], "isController": false}, {"data": ["Home-Pague/application/view/image/icon/facebook_marketing_partner.png-24", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 38.001019021739125, 6.920855978260869], "isController": false}, {"data": ["Home-Pague/success.txt-35", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-34", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-37", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 5.967881944444445, 9.00607638888889], "isController": false}, {"data": ["Home-Pague/success.txt-14", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 4.384566326530612, 6.6167091836734695], "isController": false}, {"data": ["Home-Pague/success.txt-38", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/index.php-1", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 11.720317516051365, 0.8966191813804173], "isController": false}, {"data": ["Home-Pague/canonical.html-12", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 6.702769886363637, 7.32421875], "isController": false}, {"data": ["Home-Pague/canonical.html-33", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 7.970861486486487, 8.709881756756758], "isController": false}, {"data": ["Home-Pague/success.txt-31", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/canonical.html-39", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 7.373046875, 8.056640625], "isController": false}, {"data": ["Home-Pague/success.txt-11", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 5.806587837837838, 8.76266891891892], "isController": false}, {"data": ["Home-Pague/success.txt-10", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 5.806587837837838, 8.76266891891892], "isController": false}, {"data": ["Home-Pague/success.txt-32", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 5.508814102564102, 8.313301282051283], "isController": false}, {"data": ["Home-Pague/canonical.html-36", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 7.193216463414634, 7.8601371951219505], "isController": false}, {"data": ["Home-Pague/application/view/javascript/common.js-16", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 28.938390031645568, 5.525613132911392], "isController": false}, {"data": ["Home-Pague/canonical.html-18", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 7.761101973684211, 8.480674342105264], "isController": false}, {"data": ["Home-Pague/canonical.html-3", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 205.810546875, 0.0], "isController": false}, {"data": ["Home-Pague/application/view/javascript/bootstrap/js/bootstrap.min.js-2", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 83.10466167355372, 3.7690470041322315], "isController": false}, {"data": ["Home-Pague/canonical.html-6", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 7.761101973684211, 8.480674342105264], "isController": false}, {"data": ["Home-Pague/application/view/image/icon/opencart-logo-white.png-23", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 47.794950181159415, 6.8217844202898545], "isController": false}, {"data": ["Home-Pague/application/view/javascript/jquery/datetimepicker/moment.js-15", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 170.1336596385542, 5.51816641566265], "isController": false}, {"data": ["Home-Pague/canonical.html-9", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 7.970861486486487, 8.709881756756758], "isController": false}, {"data": ["Home-Pague/success.txt-25", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-28", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 5.6537828947368425, 8.532072368421053], "isController": false}, {"data": ["Home-Pague/success.txt-27", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 5.967881944444445, 9.00607638888889], "isController": false}, {"data": ["Home-Pague/canonical.html-30", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 7.970861486486487, 8.709881756756758], "isController": false}, {"data": ["Home-Pague/success.txt-29", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 5.508814102564102, 8.313301282051283], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 1, 100.0, 2.4390243902439024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-3", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
