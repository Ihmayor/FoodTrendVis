﻿//Outside Sources Used (Put in Report) :
//Initial Bubbles Base: https://bl.ocks.org/lshir200/9e15800ee4434db7c9076bcd72f779ad#flare.json
//Coded used for polygon collision and creation: http://bl.ocks.org/pbellon/raw/4b875d2ab7019c0029b636523b34e074/
//Packing Triangles: https://roadtolarissa.com/zoomable-sierpinski-triangle-with-d3-js/
//https://bl.ocks.org/mbostock/4699541

var treeJson = {};
var years = ["1974", "1975",
"1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988",
"1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001",
"2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"]




function getRandomInPolygon(polygonPoints) {
    var minX = polygonPoints[polygonPoints.length - 2][0];
    var maxX = polygonPoints[polygonPoints.length - 1][0];
    var numX = Math.random() * (maxX - minX) + minX;


    var minY = polygonPoints[0][1];
    var maxY = polygonPoints[polygonPoints.length - 1][1];
    var numY = Math.random() * (maxY - minY) + minY;

    var point = [numX, numY]
    var loop = 0;
    while (!pointInPolygon(point, polygonPoints)) {
        if (loop > 100)
            break;
        numX = Math.random() * (maxX - minX) + minX;
        numY = Math.random() * (maxY - minY) + minY;
        point = [numX, numY]
        loop++;
    }
    return point;
}


// from https://github.com/substack/point-in-polygon
pointInPolygon = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var xi, xj, i, intersect,
        x = point[0],
        y = point[1],
        inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        xi = vs[i][0],
        yi = vs[i][1],
        xj = vs[j][0],
        yj = vs[j][1],
        intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

pointInCircle = function (point, radius, center) {
    var diffX = center[0] - point[0];
    var diffY = center[1] - point[1];
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    return Math.abs(dist) <= radius
}


function findPolygon(name, clusters) {
    return clusters.filter(function (cluster) {
        return cluster.name === name;
    })[0].polygon;
}

function findPolygonBound(polygon) {
    if (polygon.length == 3) {
        return [[polyon[0].y, polygon[1].x], [polygon[0].y, polygon[2].x], polygon[1], polygon[2]];
    }
    else {
        return [polyon[0], polygon[1], polygon[2], polygon[3]];
    }
}


function findGroupPolygonLayout(desc1Name, clusters) {
    var foundPolygon;
    for (var i = 0 ; i < foodPyramidMapping.length; i++) {
        if (foodPyramidMapping[i].list.indexOf(desc1Name) > -1) {
            foundPolygon = findPolygonLayout(foodPyramidMapping[i].name, clusters);
        }
    }
    return foundPolygon;
}

function findPolygonLayout(name, clusters) {
    return clusters.filter(function (cluster) {
        return cluster.name === name;
    })[0].layout;
}

function findGroupPolygon(desc1Name, clusters) {
    var foundPolygon;
    for (var i = 0 ; i < foodPyramidMapping.length; i++) {
        if (foodPyramidMapping[i].list.indexOf(desc1Name) > -1) {
            foundPolygon = findPolygon(foodPyramidMapping[i].name, clusters);
        }
    }
    return foundPolygon;
}

var foodPyramidMapping =
[
    {
        "name": "FatsOilsSugarAlcohol", "list": ["Fats",
                               "Cakes, buns and pastries",
                               "Biscuits and crispbreads",
                               "Other food and drink",
                               "Beverages",
                               "Sugar and preserves"]
    },
    {
        "name": "MeatPoultry", "list": ["Carcase meat",
                               "Non-carcase meat and meat products"
        ]
    },

    {
        "name": "MilkEggsFish", "list": [
                                   "Fish",
                                   "Milk and milk products excluding cheese",
                                   "Eggs",
                                   "Cheese"
        ]
    },
    {
        "name": "VegetablesFruit",
        "list": ["Fresh and processed vegetables, excluding potatoes",
                 "Fresh and processed potatoes",
                 "Fresh and processed fruit"
        ]
    },
    {
        "name": "Grain",
        "list": ["Bread",
                "Other cereals and cereal products",
                "Flour"]
    }
]



var placementMapping =

{
    "Fats": [541.5399059651087, 81.95739998353346],
    "Non-carcase meat and meat products": [551.417479683941, 198.63270109897886],
    "Fish": [827.8972579255391, 374.8491067276424],
    "Milk and milk products excluding cheese": [467.1595732816739, 359.0432414386874],
    "Eggs": [643.70661659431494, 344.2900202729286],
    "Cheese": [655.9747695470521, 383.36218425414626],
    "Fresh and processed vegetables, excluding potatoes": [844.2067410904847, 512.222091255751],
    "Cakes, buns and pastries": [625.2439458928304, 126.91196561300958],
    "Biscuits and crispbreads": [565.9400270276133, 32.412238548416646],
    "Other food and drink": [510.8644355817935, 121.16498779525614],
    "Beverages": [582.7287796150976, 99.25140512832795],
    "Sugar and preserves": [600.3752913182295, 68.9114040154967],
    "Carcase meat": [640.9138463520368, 225.6355006646258],
    "Fresh and processed potatoes": [358.4625170531575, 521.3699861211574],
    "Fresh and processed fruit": [621.8666417807942, 522.4167693499593],
    "Bread": [192.68827567927914, 652.7952308237622],
    "Other cereals and cereal products": [676.825537052069, 676.6877163523523],
    "Flour": [924.6119167881425, 658.1777819589929]
}


function findArray(desc1Name) {
    var returnArray = null;
    if (treeJson == {} || treeJson.root == null) {
    }
    else {
        treeJson.root.children.forEach(function (array) {
            if (array.name == desc1Name) {
                returnArray = array;
            }
        });
    }
    return returnArray;
}

function findChild(name, parent) {
    name = name.trim();
    var returnArray = null;
    parent.children.forEach(function (array) {
        var arrayName = array.name.trim();
        if (arrayName == name) {
            returnArray = array;
        }
    })
    return returnArray;
}

function createItemObject(d) {
    return {
        "name": d.desc2 != "" && d.desc2 != null ? d.desc2.trim() : d.desc1,
        "fullName": d.desc2 + d.desc3 + d.desc4,
        "children": [],
        "desc1": d.desc1,
        "desc2": d.desc2 != null && d.desc2 != "" ? d.desc2.trim() : "",
        "desc3": d.desc3 != null && d.desc3 != "" ? d.desc3.trim() : "",
        "desc4": d.desc4 != null && d.desc4 != "" ? d.desc4.trim() : "",
        "code": d.code,
        "unit": d.unit,
        "1974": d.year1974,
        "1975": d.year1975,
        "1976": d.year1976,
        "1977": d.year1977,
        "1978": d.year1978,
        "1979": d.year1979,
        "1980": d.year1980,
        "1981": d.year1981,
        "1982": d.year1982,
        "1983": d.year1983,
        "1984": d.year1984,
        "1985": d.year1985,
        "1986": d.year1986,
        "1987": d.year1987,
        "1988": d.year1988,
        "1989": d.year1989,
        "1990": d.year1990,
        "1991": d.year1991,
        "1992": d.year1992,
        "1993": d.year1993,
        "1994": d.year1994,
        "1995": d.year1995,
        "1996": d.year1996,
        "1997": d.year1997,
        "1998": d.year1998,
        "1999": d.year1999,
        "2000": d.year2000,
        "2001": d.year2001,
        "2002": d.year2002,
        "2003": d.year2003,
        "2004": d.year2004,
        "2005": d.year2005,
        "2006": d.year2006,
        "2007": d.year2007,
        "2008": d.year2008,
        "2009": d.year2009,
        "2010": d.year2010,
        "2011": d.year2011,
        "2012": d.year2012,
        "2013": d.year2013,
        "2014": d.year2014,
        "size": d.year1974
    }

}

function createNestedChild(d) {
    var deep = createDeepChild(d.desc2, d);
    var deep3 = null;
    var deep4 = null;
    if (d.desc3 != "" && d.desc3 != null) {
        //console.log("Desc3 " + d.desc3);
        deep3 = createDeepChild(d.desc3, d);
        if (d.desc4 != '' && d.desc4 != null) {
            //  console.log("Desc4 " + d.desc4);
            deep4 = createDeepChild(d.desc4, d);
            deep3.children.push(deep4);
            deep3.size = deep3.size + d.year1974;
        }
        deep.children.push(deep3);
        deep.size = deep.size + d.year1974;
    }
    return deep;
}

function createDeepChild(name, d) {
    return {
        "name": name.trim(),
        "children": [],
        "desc1": d.desc1,
        "desc2": d.desc2,
        "desc3": d.desc3,
        "desc4": d.desc4,
        "code": d.code,
        "unit": d.unit,
        "1974": d.year1974,
        "1975": d.year1975,
        "1976": d.year1976,
        "1977": d.year1977,
        "1978": d.year1978,
        "1979": d.year1979,
        "1980": d.year1980,
        "1981": d.year1981,
        "1982": d.year1982,
        "1983": d.year1983,
        "1984": d.year1984,
        "1985": d.year1985,
        "1986": d.year1986,
        "1987": d.year1987,
        "1988": d.year1988,
        "1989": d.year1989,
        "1990": d.year1990,
        "1991": d.year1991,
        "1992": d.year1992,
        "1993": d.year1993,
        "1994": d.year1994,
        "1995": d.year1995,
        "1996": d.year1996,
        "1997": d.year1997,
        "1998": d.year1998,
        "1999": d.year1999,
        "2000": d.year2000,
        "2001": d.year2001,
        "2002": d.year2002,
        "2003": d.year2003,
        "2004": d.year2004,
        "2005": d.year2005,
        "2006": d.year2006,
        "2007": d.year2007,
        "2008": d.year2008,
        "2009": d.year2009,
        "2010": d.year2010,
        "2011": d.year2011,
        "2012": d.year2012,
        "2013": d.year2013,
        "2014": d.year2014,
        "size": d.year1974
    }
}

function updateAllNodeYear(currentYear) {
    (function updateNodeYear(node) {
        if (node.name == null || node.name == '')
            node.r = 0;
        if (node.size) {
            if (node.children.length == 0) {
                node.size = node[currentYear];
            }
            else {
                node.size = d3.sum(node.children.map(function (d) {
                    if (d.children.length == 0)
                        return d[currentYear];
                    else
                        return d3.sum(node.children.map(function (d) {
                            if (d.children.length == 0)
                                return d[currentYear]
                            else
                                return d3.sum(node.children.map(function (d) { return d[currentYear] }));
                        }))
                }));
            }
        }
        if (node.children) {
            node.children.forEach(function (childNode) {
                updateNodeYear(childNode);
            });
        }
    }(treeJson.root));


}

function shiftNodeSubTree(node, polygonCluster, diffX, diffY) {
    node.x += diffX;
    node.y += diffY;
    node.polygon = polygonCluster;
    node.children.forEach(function (childNode) {
        childNode.x += diffX;
        childNode.y += diffY;
        childNode.polygon = polygonCluster;
        childNode.children.forEach(function (childNode) {
            childNode.x += diffX;
            childNode.y += diffY;
            childNode.polygon = polygonCluster;
            if (childNode.children != null) {
                childNode.children.forEach(function (childNode) {
                    childNode.x += diffX;
                    childNode.y += diffY;
                    childNode.polygon = polygonCluster;
                    if (childNode.children != null) {
                        childNode.children.forEach(function (childNode) {
                            childNode.x += diffX;
                            childNode.y += diffY;
                            childNode.polygon = polygonCluster;
                        })
                    }
                })
            }
        })
    })

}
var totalPolygons = [];//Load Up Data Points
d3.csv("FoodTrendData.csv",
       function (d) {
           //Format Dates
           d.year1974 = +d.year1974;
           d.year1975 = +d.year1975;
           d.year1976 = +d.year1976;
           d.year1977 = +d.year1977;
           d.year1978 = +d.year1978;
           d.year1979 = +d.year1979
           d.year1980 = +d.year1980
           d.year1981 = +d.year1981
           d.year1982 = +d.year1982
           d.year1983 = +d.year1983
           d.year1984 = +d.year1984
           d.year1985 = +d.year1985
           d.year1986 = +d.year1986
           d.year1987 = +d.year1987
           d.year1988 = +d.year1988
           d.year1989 = +d.year1989
           d.year1990 = +d.year1990
           d.year1991 = +d.year1991
           d.year1992 = +d.year1992
           d.year1993 = +d.year1993
           d.year1994 = +d.year1994
           d.year1995 = +d.year1995
           d.year1996 = +d.year1996
           d.year1997 = +d.year1997
           d.year1998 = +d.year1998
           d.year1999 = +d.year1999
           d.year2000 = +d.year2000
           d.year2001 = +d.year2001
           d.year2002 = +d.year2002
           d.year2003 = +d.year2003
           d.year2004 = +d.year2004
           d.year2005 = +d.year2005;
           d.year2006 = +d.year2006;
           d.year2007 = +d.year2007;
           d.year2008 = +d.year2008;
           d.year2009 = +d.year2009;
           d.year2010 = +d.year2010;
           d.year2011 = +d.year2011;
           d.year2012 = +d.year2012;
           d.year2013 = +d.year2013;
           d.year2014 = +d.year2014;

           var foundArray;

           if (typeof treeJson.root === 'undefined' || treeJson.root === null) {
               var item = createItemObject(d);
               var arrayObj = createDeepChild(d.desc1, d);
               arrayObj.children.push(item);
               var root = {
                   "name": "root", "children": [arrayObj], "size": d.year1974
               };
               treeJson.root = root;
               var nested = createNestedChild(d);
               item.children.push(nested);

           }
           else {
               //Get Desc 1 Array 
               foundArray = findArray(d.desc1);
               //If it does not exist creat the entire sub tree
               if (foundArray == null) {
                   //Create D.desc1 layer Object
                   var item = createItemObject(d);
                   //Create Children for this object;
                   var nested = createNestedChild(d);
                   var newArray = createDeepChild(d.desc1, d);
                   item.children.push(nested);
                   item.size = item.size + nested.size;
                   newArray.children.push(item);
                   newArray.size = newArray.size + item.size;
                   treeJson.root.children.push(newArray);
               }
                   //If it does then add to the branches in sub tree
               else {
                   //               console.log("found array")
                   //              console.log(foundArray.size);
                   var item = createItemObject(d);
                   //Depth 
                   var desc2Child = null;
                   //Second Depth 
                   var desc3Child = null;
                   //Indiv Row
                   var desc4Child = null;

                   //Set References
                   foundArray.children.forEach(function (child) {
                       child.desc2 = child.desc2.trim();
                       if (desc2Child == null)
                           desc2Child = findChild(d.desc2, child);

                       if (desc2Child != null &&
                           (desc2Child.children.length > 0) &&
                           (d.desc3 != '' && d.desc3 != null)) {
                           if (desc3Child == null)
                               desc3Child = findChild(d.desc3.trim(), child);
                       }
                   });

                   if (desc2Child == null) {
                       var nested = createNestedChild(d);
                       item.children.push(nested);
                       foundArray.children.push(item);
                       foundArray.size = foundArray.size + d.year1974;
                       //              console.log("Push new Desc2 child");
                       //              console.log(item);
                   }
                   else {
                       if (desc3Child != null) {
                           if (d.desc4 != '' && d.desc4 != null) {
                               desc4Child = createDeepChild(d.desc4, d);
                               desc3Child.children.push(desc4Child);
                               desc3Child.size = desc3Child.size + d.year1974;
                           }
                       }
                       else {
                           if (d.desc3 != '' && d.desc3 != null) {
                               desc3Child = createDeepChild(d.desc3, d);
                               if (d.desc4 != '' && d.desc4 != null) {
                                   desc4Child = createDeepChild(d.desc4, d);
                                   desc3Child.children.push(desc4Child);
                                   desc3Child.size = desc3Child.size + d.year1974;
                               }
                               desc2Child.children.push(desc3Child);
                               desc2Child.size = desc2Child.size + d.year1974;
                           }
                       }
                   }
               }
           }

           return d;
       },
        function (data) {
            var svg = d3.select("svg").attr('transform', "translate(0,0)scale(0.9,0.9)"),
            margin = 20,
            diameter = 480,
            g2 = svg.append("g"),
            g = svg.append("g").attr("transform", "translate(600," + diameter / 2 + ")");
            updateAllNodeYear(1974);
            ///Define Patterns
            var defs = svg.append('svg:defs');



            defs.append("svg:pattern")
            .attr("id", "dairy_image")
            .attr("width", 500)
            .attr("height", 500)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", 'images/dairy.png')
            .attr("width", 700)
            .attr("height", 700)
            .attr("x", 0)
            .attr("y", 0);

            defs.append("svg:pattern")
            .attr("id", "dessert_image")
            .attr("width", 200)
            .attr("height", 300)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", 'images/dessert.jpg')
            .attr("width", 300)
            .attr("height", 300)
            .attr("x", 0)
            .attr("y", -50);


            defs.append("svg:pattern")
            .attr("id", "grain_image")
            .attr("width", 500)
            .attr("height", 500)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", 'images/grain.jpg')
            .attr("width", 500)
            .attr("height", 500)
            .attr("x", 0)
            .attr("y", 0);



            defs.append("svg:pattern")
            .attr("id", "meat_image")
            .attr("width", 500)
            .attr("height", 500)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", 'images/meat.jpg')
            .attr("width", 500)
            .attr("height", 500)
            .attr("x", 0)
            .attr("y", 0);


            defs.append("svg:pattern")
            .attr("id", "veggie_image")
            .attr("width", 500)
            .attr("height", 500)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", 'images/veggie.jpg')
            .attr("width", 500)
            .attr("height", 500)
            .attr("x", 0)
            .attr("y", 0);




            //Polygon Code

            //Initial Values
            var width = +svg.attr("width"),
                height = +svg.attr("height"),
                radius = 10;

            //Main Visualization stsructure
            var viz = {
                originalSize: { width: width, height: height },
                size: { width: width, height: height },
                clusters: [{ name: 'MilkEggsFish' }, { name: 'VegetablesFruit' }, { name: 'Grain' }, { name: 'FatsOilsSugarAlcohol' }, { name: 'MeatPoultry' }],
                colors: d3.scale,
                polygons_params: {
                    ta: 1 / 9, // the height of the top middle segment (in proportion of height)
                    tb: 7 / 9 // the height of the 2 bottom left & right segments (in proportion of height)
                }
            };

            var polygons = initPolygons();
            var debugStop = 0;
            var accent = d3.scaleOrdinal(d3.schemeSet3);
            viz.clusters = viz.clusters.map(function (c, i) {
                //Determines Bubble Size
                c.data = d3.range(50).map(function () {
                    return { size: 0.2 };
                });
                c.polygon = polygons[c.name];
                c.layout = initLayout(c, i, accent);
                return c;
            });




            //initializes the pyramid
            function initLayout(cluster, i, accent) {

                var radius = function (d) {
                    return d.size + 2.2;
                }

                //Place Pyramid Shape. Give fill and color.
                var polygon = g2.append('polygon')
                  .attr('points', cluster.polygon)
                  .attr('stroke', '#000')
                  .attr('fill', function () { return accent(i); })
                    .attr('fill', function () {
                        if (cluster.name == "MilkEggsFish") {
                            return "url(#dairy_image)";
                        }
                        else if (cluster.name.trim() == "VegetablesFruit") {
                            return "url(#veggie_image)";

                        }
                        else if (cluster.name == "Grain") {
                            return "url(#grain_image)";

                        }
                        else if (cluster.name == "FatsOilsSugarAlcohol") {
                            return "url(#dessert_image)";

                        }
                        else if (cluster.name == "MeatPoultry") {
                            return "url(#meat_image)";
                        }
                        else {
                            return "#eb1"
                        }
                    })
                    .on('mouseover', function () {
                        if ($(".selected").length == 0)
                            d3.select(this).style('opacity', 0.9)
                    }
                    )
                    .on('mouseleave', function () {
                        if (d3.select(this).attr("class") != "selected")
                            d3.select(this).style('opacity', 0.3)

                    }
                    )
                    .attr('stroke-width', 10)
                  .attr('stroke', '#0b2949')
                  .style('opacity', 0.3);


                //Find Center
                var center = d3.polygonCentroid(cluster.polygon);
                polygon.center = center;
                totalPolygons.push(polygon);
                return polygon;
            }



            //Initializes Polygons themselves. This is the shapes definitions.
            function initPolygons() {
                // pseudo-triangles parameters
                var ta = viz.polygons_params.ta, tb = viz.polygons_params.tb;
                var w = viz.size.width, h = viz.size.height;

                //Height Split By 
                var h2 = h / 5;

                //Current Polygon Height Level
                var h3 = h2 * 1;

                //Degree for level split calculation
                var angDeg = 59;

                //Degree conversion
                var angRad = angDeg * (Math.PI / 180)

                //Calculate Angle
                var cotanAng = 1 / Math.tan(angRad);

                //Calculate Right-Most Point For Width
                var w2 = (cotanAng * h3) + (w * 0.5);

                //Calculate Left Most Point Width
                var w3 = (w * 0.5) - cotanAng * h3;

                var tc = 7 / 9;
                var points = {
                    a: [0, 0],
                    b: [w, 0],
                    c: [w, h],
                    d: [0, h],
                    e: [w / 2, 0],
                    f: [w, tc * h],
                    g: [0, tc * h],
                    h: [w / 2, ta * h],
                    i: [(w * 0.5) - cotanAng * h2, tc * h2],
                    j: [(cotanAng * h2 + w / 2), tc * h2],
                    k: [(w * 0.5) - cotanAng * h2 * 2, tc * h2 * 2],
                    l: [(cotanAng * h2 * 2 + w / 2), tc * h2 * 2],
                    m: [(w * 0.5) - cotanAng * h2 * 3, tc * h2 * 3],
                    n: [(cotanAng * h2 * 3 + w / 2), tc * h2 * 3],
                    o: [(w * 0.5) - cotanAng * h2 * 4, tc * h2 * 4],
                    p: [(cotanAng * h2 * 4 + w / 2), tc * h2 * 4]
                };
                return {
                    FatsOilsSugarAlcohol: [points.e, points.j, points.i],
                    MeatPoultry: [points.i, points.j, points.l, points.k],
                    MilkEggsFish: [points.k, points.l, points.n, points.m],
                    VegetablesFruit: [points.n, points.m, points.o, points.p],
                    Grain: [points.p, points.o, points.g, points.f]
                };
            }


            //Handles Node Code for circles
            var color = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);

            var color2 = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(350,90%,90%)", "hsl(390,50%,30%)"])
                .interpolate(d3.interpolateHcl);

            var color3 = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(290,90%,60%)", "hsl(310,90%,20%)"])
                .interpolate(d3.interpolateHcl);



            var pack = d3.pack()
                .size([diameter - margin, diameter - margin])
                .padding(2);

            var root = d3.hierarchy(treeJson.root)
                    .sum(function (d) { return d.size; })
                    .sort(function (a, b) { return b.value - a.value; });

            root.each(function (node) {
                if (node.data.name == "" || node.data.name == null)
                { node.r = 0; }
            })

            var focus = root,
                nodes = pack(root).descendants(),
                view;

            nodes.shift();

            //Create tooltip div
            var div = d3.select("body").append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);


            //Append Circle
            var circle = g.selectAll("circle")
                  .data(nodes)
                  .enter()
                    .append("circle")
                    .on("mouseover", function (d) {
                        //Highlight the bar hovered over at this moment
                        d3.select(this).style("stroke-width", 5).style("stroke",
                            function (d) {
                                return d.parent ? d.children ? "red" : "white" : "grey";

                            })
                        //Show the tool tip with associated data
                        div.transition()
                       .duration(200)
                       .style("opacity", .6);
                        div.html("Code: " + d.data.code + "<br/>Amount: " + d.data.size + d.data.unit + "<br/>Item Name: <br/>" + d.data.name)
                            .style("left", (d3.event.pageX) + 100 + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style('font-size', '10px')
                    })
                    .on("mousemove", function (d) {
                        div.transition()
                       .duration(200)
                       .style("opacity", .6);
                        div.html("Code: " + d.data.code + "<br/>Amount: " + d.data.size + d.data.unit + "<br/>Item Name: <br/>" + d.data.name)
                            .style("left", (d3.event.pageX)+20 + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                            .style('font-size', '10px')
                    })
                    .on("mouseleave", function () {
                        //Remove highlight when no longer hovered over
                        d3.select(this).style("stroke-width", 0).style("stroke", "red")

                        //Fade away the tooltip
                        div.transition()
                                    .style('opacity', 0)
                                    .duration(500)

                    })
                    .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                    .attr("z", function (d) { return d.parent ? d.children ? 1 * d.depth : 100 : 1; })
                    .style("fill", function (d) {
                        var cleanName = d.data.code.replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace(" ", "")
                            .replace("-", "")
                            .replace(" ", "")
                            .replace(",", "")
                            .replace(",", "")
                            .replace(",", "")
                            .replace(" ", "")
                            .replace("-", "");
                        defs.append("svg:radialGradient")
                        .attr("id", "area-" + cleanName)
                        .attr("gradientUnits", "userSpaceOnUse")
                        .attr("x1", "0%").attr("y1", "0%")
                        .attr("x2", "0%").attr("y2", "0.1")
                        .selectAll("stop")
                        .data([
                        { offset: "0%", color: d.children ? color(d.depth) : "blue" },
                        { offset: "50%", color: d.children ? color(d.depth) : "blue" },
                        { offset: "100%", color: d.data.unit.indexOf("ml") > -1 || d.data.unit.indexOf("eq") > -1 ? d.data.unit.indexOf("no") > -1 ? color3(d.depth) :color2(d.depth) : color(d.depth) }
                        ])
                        .enter().append("stop")
                        .attr("offset", function (d) { return d.offset; })
                        .attr("stop-color", function (d) { return d.color; });
                        var str = "url(#area-" + cleanName + ")";
                        if (d.data.unit.indexOf("no") > -1) {
                            console.log(d);
                            str = "purple";
                            console.log(d.data.unit.indexOf("no"));
                        }
                        if (d.data.unit == 'undefined')
                        {
                            console.log(d);
                        }

                        return str;
                        //                        return d.children ? color(d.depth) : null;
                    })
                    .style("opacity", 0.5)
                    .on("click", function (d) {
                        var className = $(this)[0].className.baseVal;
                        if (className.indexOf('leaf') > -1 || className.indexOf('label') > -1) {
                            d3.event.stopPropagation()
                            return;
                        }

                        //Make 
                        var poly = findGroupPolygonLayout(d.data.desc1, viz.clusters);

                        console.log(poly);
                        if (poly != null || typeof poly != undefined) {
                            $(poly._groups[0]).css('opacity', 0.9);
                            $(poly._groups[0]).addClass("selected");
                        }
                        if (focus !== d) zoom(d, circle, g.selectAll("circle,text")), d3.event.stopPropagation();
                    });

            //Adjust Nodes to match  the right position
            nodes.forEach(function (node) {
                if (node.parent.data.name == "root") {
                    var polygonCluster = findGroupPolygon(node.data.name, viz.clusters);
                    var nodeName = node.data.name;
                    var point = placementMapping[nodeName];

                    var offsetX = 350;
                    var diffX = (point[0] - offsetX) - node.x;
                    var diffY = point[1] - node.y;
                    shiftNodeSubTree(node, polygonCluster, diffX, diffY);
                }
            })


            //
            var text = g.selectAll("text")
                        .data(nodes)
                        .enter().append("text")
                        .attr("class", "label")
                        .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
                        .style("display", function (d) { return d.parent === root || d.parent.parent === root ? "inline" : "none"; })
                        .text(function (d) {
                            return d.data.name;
                        });

            var node = g.selectAll("circle,text");

            svg
            .style("background-color", "#f8faf9")
            .on("click", function () {
                zoom(root, circle, node);
                $(".selected").css("opacity", 0.3);
                $(".selected").removeClass("selected");
                zoomToBox([0, 0], 1)

            });

            g2.on("click", function () {
                $(".selected").css("opacity", 0.3);
                $(".selected").removeClass("selected");
                zoom(root, circle, node);
                zoomToBox([0, 0], 1);
            })
            zoomTo([root.x, root.y, root.r * 2 + margin], node, circle);
            zoomToBox([0, 0], 1);

            function zoom(d, circle, node) {
                var focus0 = focus; focus = d;
                var transition = d3.transition()
                    .duration(d3.event.altKey ? 7500 : 750)
                    .tween("zoom", function (d) {
                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                        return function (t) {
                            [node.x, node.y]
                            zoomTo(i(t), node, circle);
                        };
                    });

                transition.selectAll("text")
                  .filter(function (d) { if (d == null) return false; return (d.parent === focus || this.style.display === "inline") })
                    .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
                    .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                    .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });

            }




            function zoomToBox(translate, scale) {
                d3.selectAll('polygon')
                .transition()
                    .duration(750)
                    .style("stroke-width", 10 + "px")
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            }

            function zoomTo(v, node, circle) {
                var k = diameter / v[2]; view = v;
                node.attr("transform", function (d) {
                    return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
                });
                circle.attr("r", function (d) { return d.r * k; });
            }

            //Step One Get nested nodes (Check) 
            //Step Two Get Nested Notes inside force layout into triangle areas .
            //Step Three Change triangle ares to polygons mathing food pyramid
            //Step Four change insides to circles/squares

            var x = d3.scaleLinear()
                .domain([0, 40])
                .range([0, width - 45])
                .clamp(true);

            var x2 = d3.scaleLinear()
                .domain([0, width - 45])
                .range([0, 40, 1])
                .clamp(true);


            var slider = svg.append("g").attr("y", 600)
                .attr("class", "slider")
                .attr("transform", "translate(" + 20 + "," + (height - 150) + ")");

            slider.append("line")
                .attr("class", "track")
                .attr("x1", x.range()[0])
                .attr("x2", x.range()[1])
              .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-inset")
              .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-overlay")
                .on("drag", function (d) {
                    hue(x.invert(d3.event.x))
                })
                .call(d3.drag()
                    .on("start.interrupt", function () { slider.interrupt(); })
                    .on("start drag", function (t) {
                        hue(x.invert(d3.event.x));
                    }));



            slider.insert("g", ".track-overlay")
                .attr("class", "ticks")
                .attr("transform", "translate(0," + 18 + ")")
              .selectAll("text")
              .data(x.ticks(40))
              .enter().append("text")
                .attr("x", x)
                .attr("text-anchor", "middle")
                .text(function (d, i) { return "|"; })

            var axisText = slider.insert("text", ".track-overlay")
            .attr("class", "axisText")
            .attr("y", 50)
            .attr("x", -8)
            .text(function () { return "Year"; })



            var handle = slider.insert("circle", ".track-overlay")
                .attr("class", "handle")
                .attr("r", 9)

            var textLabel = slider.insert("text", ".track-overlay")
             .attr("class", "sliderLabel")
             .attr("y", -30)
             .attr("x", -8)
             .text(function () { return "1974"; })

            slider.transition() // Gratuitous intro!
                .duration(750)
                .tween("hue", function () {
                    var i = d3.interpolate(0, 70);
                    return function (t) { hue(i(t)); };
                });

            function hue(h) {
                if (d3.event != null) {
                    handle.attr("cx",
                        function (d) {
                            var currentYear = Math.round(x2(d3.event.x)) + 1974;
                            updateAllNodeYear(currentYear);
                            var sums = [0, 0, 0, 0, 0];
                            var sums2 = [0, 0, 0, 0, 0];
                            treeJson.root.children.forEach(function (child) {

                                for (var i = 0; i < foodPyramidMapping.length; i++) {
                                    if (foodPyramidMapping[i].list.indexOf(child.desc1) > -1) {
                                        sums[i] = sums[i] + child[currentYear];
                                        break;
                                    }
                                }
                            });

                            treeJson.root.children.forEach(function (child) {
                                for (var i = 0; i < foodPyramidMapping.length; i++) {
                                    if (foodPyramidMapping[i].list.indexOf(child.desc1) > -1) {
                                        sums2[i] = sums2[i] + child[currentYear - 1];
                                        break;
                                    }
                                }
                            });



                            for (var i = 0; i < foodPyramidMapping.length; i++) {
                                var polygonName = foodPyramidMapping[i].name;
                                var polygon = viz.clusters.filter(function (d) { if (d.name == polygonName) return d; })[0].layout;
                                if (currentYear == 1974)
                                    polygon.attr("stroke", "grey")
                                else if (sums[i] > sums2[i])
                                    polygon.attr("stroke", "green")
                                else if (sums[i] == sums2[i])
                                    polygon.attr("stroke", "blue")
                                else
                                    polygon.attr("stroke", "orange")
                            }
                            var root5 = d3.hierarchy(data)
                                  .sum(function (d) {
                                      return d.size;
                                  })
                                  .sort(function (a, b) {
                                      return b.value - a.value;
                                  });
                            root5.each(function (node) {

                            });

                            updateVis(treeJson.root);

                            return x(Math.round(x2(d3.event.x)));
                        }
                    );
                    textLabel.attr("x", x(Math.round(x2(d3.event.x))) - 8);
                    textLabel.text(
                        function (d) {
                            return Math.round(x2(d3.event.x)) + 1974;
                        }
                    );
                }
                svg.style("background-color", "#f8faf9");
            }


            function updateVis(data) {

                var pack2 = d3.pack()
                .size([diameter - margin, diameter - margin])
                .padding(2);

                var root2 = d3.hierarchy(data)
                      .sum(function (d) {
                          return d.size;
                      })
                      .sort(function (a, b) {
                          return b.value - a.value;
                      });

                var nodes2 = pack2(root2).descendants();
                root.each(function (node) {
                    var foundNode = nodes2.filter(function (n) {
                        return n.data.name == node.data.name;
                    });
                    if (node.data.name == "" || node.data.name == null)
                        node.r = 0;
                    else
                        node.r = foundNode[0].r;
                    node.x = foundNode[0].x;
                    node.y = foundNode[0].y;
                })


                nodes.forEach(function (node) {
                    if (node.parent.data.name == "root") {
                        var polygonCluster = findGroupPolygon(node.data.name, viz.clusters);
                        var nodeName = node.data.name;
                        var point = placementMapping[nodeName];

                        var offsetX = 350;
                        var diffX = (point[0] - offsetX) - node.x;
                        var diffY = point[1] - node.y;
                        shiftNodeSubTree(node, polygonCluster, diffX, diffY);
                    }
                })


                zoom(root, circle, node);
            };


            fillReferences = [{
                Key: "ml/eq",
                Value: color2(3)
            },
            {
                Key: "g",
                Value: color(1)
            },
            {
                Key: "no",
                Value: "purple"
            }
            ]

            var trendReferences = [
                {
                    Key: "Rise",
                    Value: "green"
                },
                {
                    Key: "Same",
                    Value: "blue"
                },
                {
                    Key: "Lower",
                    Value: "orange"
                }
            ]


            //Scheme for the unit differences

            //Scheme for the trend differences
            var barsOnly = fillReferences.filter(function (fillItem) { if (fillItem.Key.indexOf('circle') < 0) return fillItem; });

            g3 = svg.append("g").attr('class', "legend").attr("width", 600).attr("y", -400);
            var legendOffsetX = 950;
            var legendOffsetY = 100;

            //Create the behaviors/bars legend
            g3.append("text")
                 .attr("class", "label")
                 .attr('x', legendOffsetX - 890)
                 .attr('y', legendOffsetY - 30)
                 .style('font-size', '22px')
                 .style('font-weight', 'bold')
                 .attr('fill', 'black')
                 .style('font-family', 'sans-serif')
                 .text("Food Trend")

            g3.append("text")
                 .attr("class", "label")
                 .attr('x', legendOffsetX - 860)
                 .attr('y', legendOffsetY)
                 .style('font-size', '22px')
                 .style('font-weight', 'bold')
                 .attr('fill', 'black')
                 .style('font-family', 'sans-serif')
                 .text("Pyramid Bubbles")

            g3.append("text")
                  .attr("class", "label")
                  .attr('x', legendOffsetX - 840)
                  .attr('y', legendOffsetY + 80)
                  .style('font-size', '18px')
                  .style('font-weight', 'bold')
                  .attr('fill', 'black')
                  .style('font-family', 'sans-serif')
                  .text("by Irene Mayor: 10126658")

            g3.append("text")
                  .attr("class", "label")
                  .attr('x', legendOffsetX - 870)
                  .attr('y', legendOffsetY + 20)
                  .style('font-size', '12px')
                  .style('font-weight', 'bold')
                  .attr('fill', 'black')
                  .style('font-family', 'sans-serif')
                  .text("UK Food Trends 1974-2014")

            //Create the behaviors/bars legend
            g3.append("text")
                 .attr("class", "label")
                 .attr('x', legendOffsetX - 60)
                 .attr('y', legendOffsetY - 30)
                 .style('font-size', '22px')
                 .style('font-weight', 'bold')
                 .attr('fill', 'black')
                 .style('font-family', 'sans-serif')
                 .text("Legend")

            g3.append("text")
                .attr('x', legendOffsetX)
                .attr('y', legendOffsetY)
                 .attr("class", "label")
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .attr('fill', 'black')
                .style('font-family', 'sans-serif')
                .text("Color Scheme Per Unit")


            fillReferences.forEach(function (fill, i) {
                var offsetX = 105;
                var offsetY = 50;

                var legendX = legendOffsetX - 100 + 50 * i;
                var legendY = 130;

                g3.append("text")
                     .attr('x', legendX + 10)
                     .attr('y', legendY - 8)
                 .attr("class", "label")
                     .text(fill.Key.replace("bar", ""))
                     .attr('fill', 'black')
                     .attr('font-size', '18px')
                     .attr('font-family', 'sans-serif')

                g3.append("circle")
                    .attr('cx', legendX + 15)
                    .attr('cy', legendY + 20)
                    .attr("class", "label")
                    .attr('fill', fill.Value)
                    .attr('r', 20)
            })


            g3.append("text")
                .attr('x', legendOffsetX + 30)
                .attr('y', legendOffsetY + 130)
                 .attr("class", "label")
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .attr('fill', 'black')
                .style('font-family', 'sans-serif')
                .text("Trend Scheme")

            g3.append("text")
              .attr('x', legendOffsetX + 90)
              .attr('y', legendOffsetY + 160)
               .attr("class", "label")
              .style('font-size', '18px')
              .style('font-weight', 'bold')
              .attr('fill', 'black')
              .style('font-family', 'sans-serif')
              .text("Compared To Previous Year")



            trendReferences.forEach(function (fill, i) {
                var offsetX = 75;
                var offsetY = 50;

                var legendX = legendOffsetX - 20 + 40 * i;
                var legendY = 300;

                g3.append("text")
                     .attr('x', legendX + 10)
                     .attr('y', legendY - 8)
                 .attr("class", "label")
                     .text(fill.Key.replace("bar", ""))
                     .attr('fill', 'black')
                     .attr('font-size', '18px')
                     .attr('font-family', 'sans-serif')

                g3.append("rect")
                    .attr('x', legendX)
                    .attr('y', legendY)
                    .attr("class", "label")
                    .attr('fill', fill.Value)
                    .attr('height', 20)
                    .attr('width', 20)
            })


        });

