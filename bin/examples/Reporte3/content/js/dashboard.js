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

    var data = {"OkPercent": 93.47343378271214, "KoPercent": 6.526566217287867};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5984139571768438, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7552083333333334, 500, 1500, "DEMO-Pague/canonical.html-61"], "isController": false}, {"data": [0.605, 500, 1500, "Home-Pague/application/view/javascript/jquery/jquery-1.12.2.min.js-17"], "isController": false}, {"data": [0.565, 500, 1500, "Home-Pague/success.txt-40"], "isController": false}, {"data": [0.6075, 500, 1500, "Home-Pague/success.txt-41"], "isController": false}, {"data": [0.7447916666666666, 500, 1500, "DEMO-Pague/success.txt-60"], "isController": false}, {"data": [0.7670157068062827, 500, 1500, "DEMO-Pague/success.txt-62"], "isController": false}, {"data": [0.3880208333333333, 500, 1500, "DEMO-Pague/application/view/image/demonstration/store-admin.png-50"], "isController": false}, {"data": [0.5925, 500, 1500, "Home-Pague/success.txt-35"], "isController": false}, {"data": [0.595, 500, 1500, "Home-Pague/success.txt-34"], "isController": false}, {"data": [0.5775, 500, 1500, "Home-Pague/success.txt-37"], "isController": false}, {"data": [0.585, 500, 1500, "Home-Pague/success.txt-38"], "isController": false}, {"data": [0.7172774869109948, 500, 1500, "DEMO-Pague/success.txt-63"], "isController": false}, {"data": [0.1925, 500, 1500, "Home-Pague/index.php-1"], "isController": false}, {"data": [0.715, 500, 1500, "Home-Pague/canonical.html-12"], "isController": false}, {"data": [0.6015625, 500, 1500, "DEMO-Pague/canonical.html-52"], "isController": false}, {"data": [0.61, 500, 1500, "Home-Pague/success.txt-31"], "isController": false}, {"data": [0.7161458333333334, 500, 1500, "DEMO-Pague/canonical.html-55"], "isController": false}, {"data": [0.6125, 500, 1500, "Home-Pague/success.txt-32"], "isController": false}, {"data": [0.7175, 500, 1500, "Home-Pague/application/view/javascript/common.js-16"], "isController": false}, {"data": [0.7135416666666666, 500, 1500, "DEMO-Pague/canonical.html-58"], "isController": false}, {"data": [0.6725, 500, 1500, "Home-Pague/canonical.html-18"], "isController": false}, {"data": [0.0, 500, 1500, "Home-Pague/canonical.html-3"], "isController": false}, {"data": [0.9575, 500, 1500, "Home-Pague/application/view/javascript/bootstrap/js/bootstrap.min.js-2"], "isController": false}, {"data": [0.0075, 500, 1500, "Home-Pague/canonical.html-6"], "isController": false}, {"data": [0.64, 500, 1500, "Home-Pague/application/view/image/icon/opencart-logo-white.png-23"], "isController": false}, {"data": [0.7586206896551724, 500, 1500, "Home-Pague/canonical.html-6-2"], "isController": false}, {"data": [0.675, 500, 1500, "Home-Pague/application/view/javascript/jquery/datetimepicker/moment.js-15"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "Home-Pague/canonical.html-6-0"], "isController": false}, {"data": [0.0, 500, 1500, "Home-Pague/canonical.html-9"], "isController": false}, {"data": [0.08888888888888889, 500, 1500, "Home-Pague/canonical.html-6-1"], "isController": false}, {"data": [0.6175, 500, 1500, "Home-Pague/success.txt-25"], "isController": false}, {"data": [0.59, 500, 1500, "Home-Pague/success.txt-28"], "isController": false}, {"data": [0.4895833333333333, 500, 1500, "DEMO-Pague/application/view/image/banner/demonstration.jpg-49"], "isController": false}, {"data": [0.5975, 500, 1500, "Home-Pague/success.txt-27"], "isController": false}, {"data": [0.605, 500, 1500, "Home-Pague/success.txt-29"], "isController": false}, {"data": [0.6325, 500, 1500, "Home-Pague/canonical.html-22"], "isController": false}, {"data": [0.3125, 500, 1500, "DEMO-Pague/index.php-42"], "isController": false}, {"data": [0.63, 500, 1500, "Home-Pague/success.txt-20"], "isController": false}, {"data": [0.6675, 500, 1500, "Home-Pague/success.txt-4"], "isController": false}, {"data": [0.5150753768844221, 500, 1500, "DEMO-Pague/canonical.html-43"], "isController": false}, {"data": [0.595, 500, 1500, "Home-Pague/canonical.html-26"], "isController": false}, {"data": [0.592964824120603, 500, 1500, "DEMO-Pague/canonical.html-46"], "isController": false}, {"data": [0.6375, 500, 1500, "Home-Pague/success.txt-21"], "isController": false}, {"data": [0.8875, 500, 1500, "Home-Pague/success.txt-7"], "isController": false}, {"data": [0.7325, 500, 1500, "Home-Pague/success.txt-8"], "isController": false}, {"data": [0.3, 500, 1500, "Home-Pague/application/view/image/feature/admin/dashboard.png-19"], "isController": false}, {"data": [0.1884422110552764, 500, 1500, "DEMO-Pague/application/view/image/demonstration/store-front.png-51"], "isController": false}, {"data": [0.6875, 500, 1500, "Home-Pague/success.txt-13"], "isController": false}, {"data": [0.655, 500, 1500, "Home-Pague/application/view/image/icon/facebook_marketing_partner.png-24"], "isController": false}, {"data": [0.5678391959798995, 500, 1500, "DEMO-Pague/success.txt-45"], "isController": false}, {"data": [0.6633165829145728, 500, 1500, "DEMO-Pague/success.txt-48"], "isController": false}, {"data": [0.695, 500, 1500, "Home-Pague/success.txt-14"], "isController": false}, {"data": [0.6608040201005025, 500, 1500, "DEMO-Pague/success.txt-47"], "isController": false}, {"data": [0.6055276381909548, 500, 1500, "DEMO-Pague/success.txt-44"], "isController": false}, {"data": [0.6075, 500, 1500, "Home-Pague/canonical.html-33"], "isController": false}, {"data": [0.5925, 500, 1500, "Home-Pague/canonical.html-39"], "isController": false}, {"data": [0.71, 500, 1500, "Home-Pague/success.txt-11"], "isController": false}, {"data": [0.725, 500, 1500, "Home-Pague/success.txt-10"], "isController": false}, {"data": [0.5825, 500, 1500, "Home-Pague/canonical.html-36"], "isController": false}, {"data": [0.9375, 500, 1500, "Home-Pague/success.txt"], "isController": false}, {"data": [0.7369791666666666, 500, 1500, "DEMO-Pague/success.txt-57"], "isController": false}, {"data": [0.7, 500, 1500, "Home-Pague/canonical.html-9-0"], "isController": false}, {"data": [0.7213541666666666, 500, 1500, "DEMO-Pague/success.txt-56"], "isController": false}, {"data": [0.7526041666666666, 500, 1500, "DEMO-Pague/success.txt-59"], "isController": false}, {"data": [0.6927083333333334, 500, 1500, "DEMO-Pague/success.txt-53"], "isController": false}, {"data": [0.6, 500, 1500, "Home-Pague/canonical.html-30"], "isController": false}, {"data": [0.1, 500, 1500, "Home-Pague/canonical.html-9-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home-Pague/canonical.html-9-2"], "isController": false}, {"data": [0.7239583333333334, 500, 1500, "DEMO-Pague/success.txt-54"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12610, 823, 6.526566217287867, 1955.2631245043626, 0, 491230, 759.0, 1553.0, 3258.3499999999967, 33094.90999999999, 22.355817387897368, 152.40114301540265, 7.607415624961219], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DEMO-Pague/canonical.html-61", 192, 1, 0.5208333333333334, 1357.9062499999998, 36, 90915, 471.0, 1152.5000000000007, 1457.7499999999995, 40408.55999999963, 0.8161911927869103, 0.25106613646121606, 0.26166041504597454], "isController": false}, {"data": ["Home-Pague/application/view/javascript/jquery/jquery-1.12.2.min.js-17", 200, 0, 0.0, 867.3650000000006, 72, 3545, 770.0, 1912.8000000000002, 2511.6499999999974, 3119.350000000002, 4.321614555197822, 144.79727829442078, 1.9624519220380732], "isController": false}, {"data": ["Home-Pague/success.txt-40", 200, 2, 1.0, 1267.4050000000004, 60, 33097, 869.5, 1391.6, 1651.8499999999997, 20976.760000000053, 1.8396894604190812, 0.43862400714259436, 0.5904971990727965], "isController": false}, {"data": ["Home-Pague/success.txt-41", 200, 2, 1.0, 1006.9949999999995, 83, 21043, 832.0, 1322.9, 1415.1, 20848.910000000174, 1.8445760242008373, 0.43987013608359615, 0.5920656715179016], "isController": false}, {"data": ["DEMO-Pague/success.txt-60", 192, 4, 2.0833333333333335, 1794.4166666666663, 37, 60064, 482.5, 1184.5000000000005, 1569.5499999999995, 44336.76999999989, 0.8152554679439001, 0.215125801986336, 0.2588144189818648], "isController": false}, {"data": ["DEMO-Pague/success.txt-62", 191, 1, 0.5235602094240838, 1129.816753926702, 35, 73502, 482.0, 1183.4, 1282.3999999999999, 38196.99999999939, 0.8113193922325727, 0.18430403610158907, 0.2616677604611352], "isController": false}, {"data": ["DEMO-Pague/application/view/image/demonstration/store-admin.png-50", 192, 34, 17.708333333333332, 4505.78125, 49, 489965, 701.5, 3455.8, 4428.249999999999, 86502.16999999704, 0.3556214113724764, 31.3585523650213, 0.13717818114465644], "isController": false}, {"data": ["Home-Pague/success.txt-35", 200, 0, 0.0, 854.1950000000002, 46, 3901, 911.5, 1318.9, 1368.0, 2037.590000000004, 3.3856988082340194, 0.7273962283315276, 1.0977070354821234], "isController": false}, {"data": ["Home-Pague/success.txt-34", 200, 0, 0.0, 855.5599999999998, 74, 3021, 917.0, 1334.7, 1428.9499999999998, 2213.230000000004, 3.4399724802201583, 0.7390565875472996, 1.1153035775713793], "isController": false}, {"data": ["Home-Pague/success.txt-37", 200, 3, 1.5, 1337.695, 51, 34421, 899.0, 1311.7, 1359.0, 34283.18, 2.1234352936180154, 0.5311698734963424, 0.6781306735536752], "isController": false}, {"data": ["Home-Pague/success.txt-38", 200, 1, 0.5, 1130.4150000000002, 41, 47725, 924.5, 1362.1000000000001, 1711.7999999999997, 5109.510000000005, 1.8564758518903564, 0.4206984584288645, 0.5988947587045512], "isController": false}, {"data": ["DEMO-Pague/success.txt-63", 191, 4, 2.094240837696335, 1177.6596858638738, 36, 46695, 483.0, 1333.4, 1789.5999999999945, 41356.23999999991, 0.8104828101263675, 0.21407447424701478, 0.2572706089653826], "isController": false}, {"data": ["Home-Pague/index.php-1", 200, 0, 0.0, 4945.1849999999995, 496, 23304, 1769.5, 15914.0, 18610.599999999973, 23240.020000000008, 6.679580522343197, 49.02215246351279, 3.731171932402645], "isController": false}, {"data": ["Home-Pague/canonical.html-12", 200, 0, 0.0, 623.9349999999997, 40, 1639, 722.0, 1050.9, 1202.0999999999995, 1387.4800000000005, 4.787323168250473, 1.4118863250113698, 1.5427896928932188], "isController": false}, {"data": ["DEMO-Pague/canonical.html-52", 192, 20, 10.416666666666666, 2702.473958333332, 38, 45066, 655.5, 1472.8000000000002, 33744.64999999999, 44269.91999999999, 1.225803156443128, 0.6518064635578936, 0.35388482238623015], "isController": false}, {"data": ["Home-Pague/success.txt-31", 200, 0, 0.0, 810.0450000000004, 39, 1757, 872.5, 1253.2, 1331.6999999999998, 1563.980000000001, 3.614218334929613, 0.7764922203950341, 1.1717973507779604], "isController": false}, {"data": ["DEMO-Pague/canonical.html-55", 192, 8, 4.166666666666667, 2576.5572916666674, 39, 72946, 485.5, 1491.8000000000004, 18053.9, 54125.589999999866, 0.9992661639108779, 0.39025194225854976, 0.30861125423517105], "isController": false}, {"data": ["Home-Pague/success.txt-32", 200, 0, 0.0, 823.6199999999998, 39, 1898, 937.0, 1242.0, 1304.0, 1680.99, 3.578265614656576, 0.7687680031488737, 1.1601408047519368], "isController": false}, {"data": ["Home-Pague/application/view/javascript/common.js-16", 200, 0, 0.0, 640.8049999999995, 54, 1922, 710.5, 1140.8, 1313.3999999999999, 1748.6500000000003, 4.484908283625599, 10.256972105272009, 1.9577675808404718], "isController": false}, {"data": ["DEMO-Pague/canonical.html-58", 192, 3, 1.5625, 1808.7239583333337, 39, 97260, 512.5, 1252.0, 2257.3499999999985, 42986.129999999604, 0.8505661580989846, 0.2810647692839296, 0.26982529337887406], "isController": false}, {"data": ["Home-Pague/canonical.html-18", 200, 0, 0.0, 720.6100000000006, 42, 1933, 806.0, 1225.7, 1386.7499999999998, 1637.95, 4.24601405430652, 1.2522424261724305, 1.3683443729698745], "isController": false}, {"data": ["Home-Pague/canonical.html-3", 200, 200, 100.0, 1.0349999999999997, 0, 88, 0.0, 1.0, 1.0, 83.2300000000007, 7.1622976650909616, 15.721418235657499, 0.0], "isController": false}, {"data": ["Home-Pague/application/view/javascript/bootstrap/js/bootstrap.min.js-2", 200, 0, 0.0, 257.0850000000001, 56, 3196, 146.0, 447.00000000000017, 702.7999999999993, 3176.8200000000065, 7.070385689539364, 71.10353392238484, 3.224482536147347], "isController": false}, {"data": ["Home-Pague/canonical.html-6", 200, 171, 85.5, 11216.135000000004, 188, 24378, 8349.0, 21060.8, 21372.0, 24367.0, 4.858260257001968, 6.639424668120096, 1.6960262467510383], "isController": false}, {"data": ["Home-Pague/application/view/image/icon/opencart-logo-white.png-23", 200, 0, 0.0, 816.4499999999998, 51, 3111, 890.0, 1392.0, 1754.699999999999, 2792.7200000000003, 3.506803198204517, 11.56834101907701, 1.6506632241548604], "isController": false}, {"data": ["Home-Pague/canonical.html-6-2", 29, 0, 0.0, 1095.5172413793102, 119, 15525, 387.0, 1621.0, 8580.5, 15525.0, 1.3818736300390737, 2.7889686874583055, 0.5100126274659297], "isController": false}, {"data": ["Home-Pague/application/view/javascript/jquery/datetimepicker/moment.js-15", 200, 0, 0.0, 715.185, 82, 2238, 804.0, 1296.0, 1492.1499999999996, 2007.97, 4.148172729912473, 58.580321100976896, 1.8998955178993653], "isController": false}, {"data": ["Home-Pague/canonical.html-6-0", 45, 0, 0.0, 1180.7333333333333, 195, 4664, 607.0, 3292.8, 3336.1, 4664.0, 5.580357142857143, 1.7602103097098214, 1.79290771484375], "isController": false}, {"data": ["Home-Pague/canonical.html-9", 200, 198, 99.0, 5902.229999999997, 183, 22328, 3209.5, 21020.5, 21042.9, 21069.9, 5.089447031580018, 2.5115228261699367, 1.5231561887675906], "isController": false}, {"data": ["Home-Pague/canonical.html-6-1", 45, 16, 35.55555555555556, 11517.488888888887, 612, 21063, 15543.0, 21049.6, 21060.8, 21063.0, 1.5714485263304931, 2.047589245180891, 0.3365928158611538], "isController": false}, {"data": ["Home-Pague/success.txt-25", 200, 0, 0.0, 840.2899999999997, 64, 3056, 961.5, 1325.4, 1431.8, 2067.770000000003, 3.8231414753502957, 0.82137805134479, 1.2395341502112285], "isController": false}, {"data": ["Home-Pague/success.txt-28", 200, 0, 0.0, 861.3449999999992, 50, 3907, 933.0, 1314.4, 1394.0, 1938.1300000000017, 3.633654911793027, 0.7806680474555332, 1.1780990534328954], "isController": false}, {"data": ["DEMO-Pague/application/view/image/banner/demonstration.jpg-49", 192, 4, 2.0833333333333335, 1832.8437500000002, 125, 46117, 1074.0, 1688.3000000000009, 3133.5999999999995, 37303.389999999934, 1.2244351336356156, 93.87232020294057, 0.5772173356419038], "isController": false}, {"data": ["Home-Pague/success.txt-27", 200, 0, 0.0, 852.6850000000003, 65, 1880, 956.0, 1296.0, 1454.6499999999996, 1845.890000000001, 3.6773493665765713, 0.7900555279754353, 1.192265614944748], "isController": false}, {"data": ["Home-Pague/success.txt-29", 200, 0, 0.0, 811.7450000000001, 59, 1776, 924.5, 1225.5, 1303.9499999999998, 1706.6000000000004, 3.4445937101718855, 0.740049429919741, 1.116801866969791], "isController": false}, {"data": ["Home-Pague/canonical.html-22", 200, 0, 0.0, 777.12, 44, 1898, 870.5, 1296.6, 1423.35, 1846.1300000000008, 3.9251089217725794, 1.1576004827883974, 1.2649276798681164], "isController": false}, {"data": ["DEMO-Pague/index.php-42", 200, 16, 8.0, 5914.45, 330, 489817, 1353.0, 4077.7000000000003, 15954.399999999867, 50715.62, 0.36657630560733445, 1.1383393537763773, 0.18739781685481194], "isController": false}, {"data": ["Home-Pague/success.txt-20", 200, 0, 0.0, 828.3299999999998, 46, 4878, 889.5, 1308.4, 1642.6499999999999, 3629.360000000014, 3.9802579207132625, 0.85513353765324, 1.290474247731253], "isController": false}, {"data": ["Home-Pague/success.txt-4", 200, 3, 1.5, 2004.6249999999995, 72, 21062, 486.5, 7113.1, 11493.299999999977, 21058.98, 6.945650286508075, 1.7383456871852752, 2.2181314030213577], "isController": false}, {"data": ["DEMO-Pague/canonical.html-43", 199, 15, 7.5376884422110555, 2504.135678391959, 70, 50604, 956.0, 2053.0, 2694.0, 49379.0, 1.8060534555520262, 0.8422978967191541, 0.5381574170712892], "isController": false}, {"data": ["Home-Pague/canonical.html-26", 200, 0, 0.0, 863.5, 58, 5740, 906.0, 1388.4, 1621.1999999999991, 2232.620000000003, 3.781790677885979, 1.115332797579654, 1.2187411364280987], "isController": false}, {"data": ["DEMO-Pague/canonical.html-46", 199, 13, 6.532663316582915, 3291.6834170854268, 39, 47008, 816.0, 1587.0, 36441.0, 44493.0, 1.2651467951733697, 0.5610699053206097, 0.38107878399684664], "isController": false}, {"data": ["Home-Pague/success.txt-21", 200, 0, 0.0, 774.9399999999996, 42, 1963, 812.5, 1281.2, 1627.9499999999985, 1897.0800000000008, 4.056795131845842, 0.8715770791075051, 1.3152890466531442], "isController": false}, {"data": ["Home-Pague/success.txt-7", 200, 0, 0.0, 397.0949999999999, 39, 5158, 330.5, 864.7, 1004.0999999999998, 1187.7700000000002, 5.156366823935855, 1.1078131848299688, 1.671790806197953], "isController": false}, {"data": ["Home-Pague/success.txt-8", 200, 0, 0.0, 593.5549999999998, 40, 2899, 591.0, 1045.6, 1191.35, 1292.96, 5.315190815350271, 1.1419355267354099, 1.7232845221643458], "isController": false}, {"data": ["Home-Pague/application/view/image/feature/admin/dashboard.png-19", 200, 0, 0.0, 1564.1600000000005, 107, 5886, 1904.0, 2651.5, 2980.6499999999996, 3279.720000000001, 3.8079281063173527, 339.46665727576067, 1.7886849796275848], "isController": false}, {"data": ["DEMO-Pague/application/view/image/demonstration/store-front.png-51", 199, 57, 28.64321608040201, 20477.693467336685, 49, 491230, 1403.0, 4608.0, 50274.0, 489953.0, 0.3664642826231476, 32.622322200944886, 0.12257677795026765], "isController": false}, {"data": ["Home-Pague/success.txt-13", 200, 0, 0.0, 668.1750000000001, 43, 5162, 737.0, 1070.0, 1127.8, 1940.1300000000017, 4.58936643796324, 0.9859966956561647, 1.4879586498083939], "isController": false}, {"data": ["Home-Pague/application/view/image/icon/facebook_marketing_partner.png-24", 200, 0, 0.0, 788.0699999999999, 70, 4087, 845.5, 1312.6, 1504.9999999999998, 2008.96, 3.7396458555374803, 9.809266374974289, 1.7858269759353789], "isController": false}, {"data": ["DEMO-Pague/success.txt-45", 199, 6, 3.0150753768844223, 2409.2060301507545, 39, 99837, 907.0, 1453.0, 2275.0, 41646.0, 1.2607144893472793, 0.3613442724600404, 0.39642323737543317], "isController": false}, {"data": ["DEMO-Pague/success.txt-48", 199, 3, 1.5075376884422111, 1417.4924623115576, 36, 42154, 714.0, 1352.0, 1408.0, 37788.0, 1.2722971677002748, 0.3184863699571639, 0.40628396521961513], "isController": false}, {"data": ["Home-Pague/success.txt-14", 200, 0, 0.0, 646.3550000000005, 40, 1847, 725.5, 1048.2, 1182.8999999999992, 1739.870000000001, 4.688892014816899, 1.007379143808318, 1.5202267079289162], "isController": false}, {"data": ["DEMO-Pague/success.txt-47", 199, 6, 3.0150753768844223, 1950.9296482412071, 37, 45558, 652.0, 1299.0, 1517.0, 44847.0, 1.2735429452760516, 0.36398369353052984, 0.40045705952373334], "isController": false}, {"data": ["DEMO-Pague/success.txt-44", 199, 9, 4.522613065326633, 2638.165829145729, 40, 51311, 832.0, 1404.0, 2876.0, 51233.0, 1.2641984092699412, 0.4062227526332173, 0.39133968503036615], "isController": false}, {"data": ["Home-Pague/canonical.html-33", 200, 0, 0.0, 809.51, 70, 2234, 873.5, 1292.7, 1385.2999999999997, 1713.2100000000007, 3.5033632286995515, 1.0332184522141254, 1.1290135404988788], "isController": false}, {"data": ["Home-Pague/canonical.html-39", 200, 2, 1.0, 1195.3549999999998, 104, 41265, 861.0, 1306.0, 1391.6, 33939.290000000285, 1.8485142566662045, 0.587192106844124, 0.5897554762234855], "isController": false}, {"data": ["Home-Pague/success.txt-11", 200, 0, 0.0, 606.4949999999998, 39, 1466, 687.0, 1026.2, 1146.9999999999998, 1341.96, 4.941932295527551, 1.0617432666172473, 1.6022671114405733], "isController": false}, {"data": ["Home-Pague/success.txt-10", 200, 0, 0.0, 617.2750000000002, 53, 7265, 657.0, 1069.7000000000003, 1212.7999999999993, 1635.99, 5.10217097374933, 1.0961695451414577, 1.6542194953952907], "isController": false}, {"data": ["Home-Pague/canonical.html-36", 200, 0, 0.0, 871.335, 42, 5543, 869.5, 1323.4, 1485.9, 2226.4300000000003, 3.3347784039750556, 0.983499099609831, 1.074684446593524], "isController": false}, {"data": ["Home-Pague/success.txt", 200, 0, 0.0, 325.90999999999997, 37, 17479, 117.5, 523.4000000000001, 670.8499999999999, 3467.2300000000077, 6.891561283208711, 1.4806088694393715, 2.234373384790324], "isController": false}, {"data": ["DEMO-Pague/success.txt-57", 192, 2, 1.0416666666666667, 1147.0781249999998, 37, 54444, 496.5, 1210.6000000000001, 1379.0, 45106.79999999993, 0.8507659108734087, 0.20363893516897894, 0.27296098662259227], "isController": false}, {"data": ["Home-Pague/canonical.html-9-0", 5, 0, 0.0, 798.8, 263, 1293, 888.0, 1293.0, 1293.0, 1293.0, 1.2973533990659056, 0.4092237772444214, 0.41682545731707316], "isController": false}, {"data": ["DEMO-Pague/success.txt-56", 192, 2, 1.0416666666666667, 1362.1614583333335, 37, 55081, 491.0, 1365.3000000000004, 1658.85, 40877.1099999999, 0.8510034749308559, 0.203695798391958, 0.2730372070243245], "isController": false}, {"data": ["DEMO-Pague/success.txt-59", 192, 2, 1.0416666666666667, 1506.5625000000007, 36, 96061, 474.0, 1320.0000000000005, 1561.4499999999994, 42831.51999999961, 0.8161877231763306, 0.19539967825412344, 0.26186687000510117], "isController": false}, {"data": ["DEMO-Pague/success.txt-53", 192, 9, 4.6875, 2811.4687500000014, 37, 54695, 520.5, 1378.800000000001, 28965.59999999994, 51330.25999999997, 1.2273468213635057, 0.39908997746667946, 0.37927593729024833], "isController": false}, {"data": ["Home-Pague/canonical.html-30", 200, 0, 0.0, 867.7199999999998, 47, 4491, 928.5, 1309.6000000000001, 1422.9499999999998, 2665.6100000000097, 3.480379361350387, 1.0264400069607587, 1.1216066301226832], "isController": false}, {"data": ["Home-Pague/canonical.html-9-1", 5, 3, 60.0, 9137.6, 884, 21035, 7669.0, 21035.0, 21035.0, 21035.0, 0.20931011386470194, 0.1820425658280308, 0.05379924020428667], "isController": false}, {"data": ["Home-Pague/canonical.html-9-2", 2, 0, 0.0, 149.5, 144, 155, 149.5, 155.0, 155.0, 155.0, 0.20590960568310512, 0.3736133274992279, 0.07600960053536499], "isController": false}, {"data": ["DEMO-Pague/success.txt-54", 192, 3, 1.5625, 1616.9375000000005, 38, 56480, 506.5, 1274.5000000000002, 1431.499999999999, 54234.97999999998, 1.0011314871495387, 0.2527474085294317, 0.3195139493594323], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 3, 0.3645200486026732, 0.023790642347343377], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 108, 13.122721749696233, 0.8564631245043616], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 12, 1.4580801944106927, 0.09516256938937351], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:443 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 32, 3.8882138517618468, 0.253766851704996], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 9, 1.0935601458080195, 0.07137192704203013], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 102, 12.393681652490887, 0.8088818398096749], "isController": false}, {"data": ["429/Too Many Requests", 290, 35.23693803159174, 2.2997620935765264], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: detectportal.firefox.c", 197, 23.93681652490887, 1.5622521808088818], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 4, 0.48602673147023084, 0.0317208564631245], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:80 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 66, 8.019441069258809, 0.5233941316415543], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12610, 823, "429/Too Many Requests", 290, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: detectportal.firefox.c", 197, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 108, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 102, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:80 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 66], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["DEMO-Pague/canonical.html-61", 192, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/success.txt-40", 200, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Home-Pague/success.txt-41", 200, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-60", 192, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-62", 191, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/application/view/image/demonstration/store-admin.png-50", 192, 34, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 33, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/success.txt-37", 200, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-Pague/success.txt-38", 200, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-63", 191, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/canonical.html-52", 192, 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/canonical.html-55", 192, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/canonical.html-58", 192, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-3", 200, 200, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: detectportal.firefox.c", 197, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (detectportal.firefox.c)", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-6", 200, 171, "429/Too Many Requests", 110, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:80 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 46, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:443 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 15, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-9", 200, 198, "429/Too Many Requests", 177, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:80 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:443 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 1, null, null, null, null], "isController": false}, {"data": ["Home-Pague/canonical.html-6-1", 45, 16, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:443 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 15, "429/Too Many Requests", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/application/view/image/banner/demonstration.jpg-49", 192, 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/index.php-42", 200, 16, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 15, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/success.txt-4", 200, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/canonical.html-43", 199, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/canonical.html-46", 199, 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/application/view/image/demonstration/store-front.png-51", 199, 57, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 50, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 7, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/success.txt-45", 199, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-48", 199, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/success.txt-47", 199, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-44", 199, 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-39", 200, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/success.txt-57", 192, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/success.txt-56", 192, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-59", 192, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.com:80 [detectportal.firefox.com/34.107.221.82] failed: Connection timed out: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["DEMO-Pague/success.txt-53", 192, 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-Pague/canonical.html-9-1", 5, 3, "429/Too Many Requests", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to detectportal.firefox.co:443 [detectportal.firefox.co/103.224.182.241] failed: Connection timed out: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["DEMO-Pague/success.txt-54", 192, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
