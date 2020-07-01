// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Step 2: Create scale functions
    // ==============================
  //initial Parameters
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
    // create scales
    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
    // create scales
        var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width])
      .nice();
        return xLinearScale;
    }

    // function used for updating y-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
          .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
            d3.max(healthData, d => d[chosenYAxis]) * 1.2
          ])
          .range([height, 0])
          .nice();
        return yLinearScale;
        }

        // function used for updating xAxis var upon click on axis label
    function renderAxesX(newXScale, xAxis) {
       var bottomAxis = d3.axisBottom(newXScale);
       xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
  }

      //function used for updating yAxis var upon click on axis label
    function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
          .duration(1000)
          .call(leftAxis);
    return yAxis;
  }

      // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale,newYScale, chosenXAxis,  chosenYAxis) {
   
      circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }
 // function used for updating text group with a transition to
//     // new text
    function renderText(textGroup, newXScale, newYScale, chosenXAxis,  chosenYAxis) {
      
        textGroup.transition()
          .duration(1000)
          .attr("x", d => newXScale(d[chosenXAxis]))
          .attr("y", d => newYScale(d[chosenYAxis]));
        return textGroup;
      }

      //function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

  //stylize based on variable chosen
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      return `$${value}`;
  }
  //age (number)
  else {
      return `${value}`;
  }
}

      // function used for updating circles group with new tooltip
      function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        var xlabel;
        var ylabel;

      //Select X label
        if (chosenXAxis === "poverty") {
          xlabel = "In Poverty(%):";
        }
        else if(chosenXAxis === "income"){
          xlabel = "Household income(Median):";
        }
        else{
            xlabel ="Age(Median):";
        }

         //Select y label
         if (chosenYAxis === "healthcare") {
            ylabel = "Lacks Healthcare(%):";
          }
          else if(chosenYAxis === "obesity"){
            ylabel = "Obese(%):";
          }
          else{
              ylabel ="smokes(%):";
          }
         
          //Create tooltip
        var toolTip = d3.tip()
          
          
          .attr("class", "tooltip")
          .offset([80, -60])
          .style("background", "black")
          .style("color", "white")
          .html(function(d) {
              return (`${d.state}<hr>${xlabel}${styleX(d[chosenXAxis])}%<br>${ylabel}${d[chosenYAxis]}%`);
            
          });
          
  circlesGroup.call(toolTip);
 
          // Create "mouseover" event listener to display tool tip.
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this)
      
      
    })
  // onmouseout event
    .on("mouseout", function(data) {
    toolTip.hide();
    });
    
    return circlesGroup;
    }



      function updateToolTipText(chosenXAxis, chosenYAxis, textGroup) {
        var xlabel;
        var ylabel;

      //Select X label
        if (chosenXAxis === "poverty") {
          xlabel = "In Poverty(%):";
        }
        else if(chosenXAxis === "income"){
          xlabel = "Household income(Median):";
        }
        else{
            xlabel ="Age(Median):";
        }

         //Select y label
         if (chosenYAxis === "healthcare") {
            ylabel = "Lacks Healthcare(%):";
          }
          else if(chosenYAxis === "obesity"){
            ylabel = "Obese(%):";
          }
          else{
              ylabel ="smokes(%):";
          }
         console.log(chosenXAxis);
         console.log(chosenYAxis)
          //Create tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .style("background", "black")
          .style("color", "white")
          .html(function(d) {
            return (`${d.state}<hr>${xlabel}${styleX(d[chosenXAxis])}%<br>${ylabel}${d[chosenYAxis]}%`);
          
            
          });
          

  textGroup.call(toolTip);
  
  
            // Create "mouseover" event listener to display tool tip.
    textGroup.on("mouseover", function(data) {
        toolTip.show(data, this)
        
        
      })
    // onmouseout event
      .on("mouseout", function(data) {
      toolTip.hide();
      });
      
      return textGroup;
      }


// Import Data
d3.csv("./assets/data/data.csv").then(function(healthData) {
 
  // parse data as numbers
  healthData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.healthCare = +data.healthcare;
  data.age = +data.age;
  data.income = +data.income;
  data.smokes = +data.smokes;
  data.obesity = +data.obesity;
  //console.log(data);
  });

  //Step 3: Create axis functions
  // ==============================

  // Create x scale function.
  // xLinearScale function above csv import.
    var xLinearScale = xScale(healthData, chosenXAxis);
    
  // Create y scale function.
  // yLinearScale function above csv import.
    var yLinearScale = yScale(healthData, chosenYAxis);

    //Create axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    
    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  

      // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("opacity", "0.5")
    .attr("r", "15")
    .attr("fill", "blue")
    ;
    
    var textGroup = chartGroup.append("g")
    .selectAll('.stateText')
    .data(healthData)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("alignment-baseline","central");
    
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener.
    .attr("class","aText active")
    .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener.
    .attr("class","aText inactive")
    .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener.
    .attr("class","aText inactive")
    .text("Household Income (Median)");

    var healthcareLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0- 450)
    .attr("value", "healthcare") // value to grab for event listener.
    .attr("class","aText active")
    .text("Lacks Healthcare (%)");

    var smokeLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0-470)
    .attr("value", "smokes") // value to grab for event listener.
    .attr("class","aText inactive")
    .text("Smokes (%)");

    var obesityLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0-490)
    .attr("value", "obesity") // value to grab for event listener.
    .attr("class","aText inactive")
    .text("Obesity (%)");

  // Update tool tip function above csv import.
   var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
   var textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);

  // X Axis labels event listener.
  labelsGroup.selectAll(".aText")
  .on("click", function() {
      // Get value of selection.
      var value = d3.select(this).attr("value");

      
          if (value === "poverty" || value === "age" || value === "income") {

              // Replaces chosenXAxis with value.
              chosenXAxis = value;

              
              // Update x scale for new data.
              xLinearScale = xScale(healthData, chosenXAxis);

              // Updates x axis with transition.
              xAxis = renderAxesX(xLinearScale, xAxis);

              // Changes classes to change bold text.
              if (chosenXAxis === "poverty") {
                  povertyLabel
                      .classed("active", true)
                      .classed("inactive", false);

                  ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  
                  incomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
              }
              else if (chosenXAxis === "age"){
                  povertyLabel
                      .classed("active", false)
                      .classed("inactive", true);

                  ageLabel
                      .classed("active", true)
                      .classed("inactive", false);

                  incomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
              }
              else {
                  povertyLabel
                      .classed("active", false)
                      .classed("inactive", true);

                  ageLabel
                      .classed("active", false)
                      .classed("inactive", true)

                  incomeLabel
                      .classed("active", true)
                      .classed("inactive", false);
              }
          
          } else {

              chosenYAxis = value;

              // Update y scale for new data.
              yLinearScale = yScale(healthData, chosenYAxis);

              // Updates y axis with transition.
              yAxis = renderAxesY(yLinearScale, yAxis);

              // Changes classes to change bold text.
              if (chosenYAxis === "healthcare") {
                  healthcareLabel
                      .classed("active", true)
                      .classed("inactive", false);

                  smokeLabel
                      .classed("active", false)
                      .classed("inactive", true);

                  obesityLabel
                      .classed("active", false)
                      .classed("inactive", true);
              }
              else if (chosenYAxis === "smokes"){
                  healthcareLabel
                      .classed("active", false)
                      .classed("inactive", true);

                  smokeLabel
                      .classed("active", true)
                      .classed("inactive", false);

                  obesityLabel
                      .classed("active", false)
                      .classed("inactive", true);
              }
              else {
                  healthcareLabel
                      .classed("active", false)
                      .classed("inactive", true);

                  smokeLabel
                      .classed("active", false)
                      .classed("inactive", true);

                  obesityLabel
                      .classed("active", true)
                      .classed("inactive", false);
              }
          
          
  
         
          // Update circles with new x values.
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          // Update tool tips with new info.
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // Update circles text with new values.
          textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);

      }
      
  });

});