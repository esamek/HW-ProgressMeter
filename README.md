HW-ProgressMeter
================

My own flavor of SVG progress meters...made with Raphaël


Options
=================

    var defaultOptions = {
          'type': 'progress', // meter or progress
          'color': "#0085ca", // color of progress type
          'padding': 5, // container padding
          'progressWidth': 20, // progress stroke width
          'endAngle': 270, // 100% angle
          'startAngle': 0, // 0% angle
          'valueMax' : 100,
          'animationDelay': 500,
          'animationDuration': 500,
          'meterColors': ['red','yellow','green'], // bad -> ok -> good
          'meterHandColor': '#404040',
          'meterKnobColor': '#404040',
          'meterKnobRadius': 10,
          'animateIn': true, // animate progress IN
          'animationEasing': 'bounce',
          'transform': [ // rotate the meter
                          "S", -1, -1, "cx", "cy",
                          "R", -45, "cx", "cy"
                      ]
      };

Usage
=======

    $('#containerID').progressMeter(percentage,options);





