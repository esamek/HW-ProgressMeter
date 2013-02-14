

(function($){

    var defaultOptions = {
        'type': 'progress', // meter or progress
        'color': "#0085ca", // color of progress type
        'padding': 15, // container padding
        'progressWidth': 20, // progress stroke width
        'endAngle': 359, // 100% angle
        'startAngle': 0, // 0% angle
        'valueMax' : 100,
        'animationDelay': 500,
        'animationDuration': 1200,
        'meterColors': ['red','yellow','green'], // bad -> ok -> good
        'meterHandColor': '#404040',
        'meterKnobColor': '#404040',
        'meterKnobRadius': 10,
        'middleText': function(v,max){
            var percent = (v != 0) ? v / max * 100 : 0;
            return percent.toPrecision(3);
        },
        'animateIn': true, // animate progress IN
        'animationEasing': 'bounce',
        'transform': [ // rotate the meter
                        "S", -1, -1, "cx", "cy",
                        "R", -45, "cx", "cy"
                    ]
    };

    function ProgressMeter(el,value,options){

        this.$el = $(el);
        this._options = options || {};
        this._value = value;
        this.init();

        return this;
    }


    var methods = {

        init: function(){
            var that = this;

            // combine paramter options with defaults
            this.mergeOptions();

            // create paper
            this.paper = new Raphael(that.$el.get(0));


            // define our custom arc function
            // NOTE: have to specify at least one parameter for animation
            this.paper.customAttributes.arc = function(v) {

                var args = Array.prototype.slice.call(arguments);

                var path =  that.arc.apply(that, arguments);
                return this.attr(path);


            };

            this.paper.customAttributes.value = function(v){

                var value =  that.value(v,that.options.valueMax);

                return this.attr(value);

            };
            // set cx
            this.cx = this.$el.innerWidth() / 2;

            // set cy
            this.cy = this.$el.innerHeight() / 2;

            // set R (radius) to fit container - padding - progress width
            this.R = (that.cy > that.cx) ? that.cx - that.options.padding - that.options.progressWidth : that.cy - that.options.padding - that.options.progressWidth;

            if(this.options.type == 'meter'){
                this.drawMeter();
            }else {
                this.drawProgress();
            }


        },



        drawMeter: function(){
            var that        = this,
                cx          = this.cx,
                cy          = this.cy,
                start       = this.options.startAngle,
                end         = this.options.endAngle,
                R           = this.R,
                v           = this.options.valueMax * 0.99999, // reusing full 360 arc to get subpaths
                t           = this.options.valueMax,
                colors      = this.options.meterColors;
            this.meter      = [];
            this.progress   = this.paper.path().attr('arc',[v]); // temp store of progress
            var totalLength = Raphael.getTotalLength(that.progress.attr('path')),
                subLength   = totalLength / 3,
                x           = 0,
                color, _end, subPath, metee;




            for(var i = 0; i < 3; i++){

                color   = colors[i];
                _end    = subLength * (i+1);
                subPath = Raphael.getSubpath(that.progress.attr('path'), x, _end);
                metee   = this.paper.path(subPath)
                            .attr('stroke',color)
                            .attr('stroke-width', that.options.progressWidth );

                this.meter.push(metee);

                x = _end;
            }

            this.progress.remove(); // remove temp progress
            this.progress = null;

            // apply transformation
            if(this.options.transform){

                var orig   = this.options.transform,
                    edited = [];

                for(var i = 0; i < orig.length; i++){
                    if(orig[i] == "cx"){
                        orig[i] = this.cx;
                    }else if(orig[i] == "cy"){
                        orig[i] = this.cy;
                    }

                    edited.push(orig[i]);
                }


                var trans = Raphael.parseTransformString(edited);


                for(var i = 0; i < this.meter.length;i++){
                    var p = this.meter[i];

                    p.transform(trans);
                }
            }

            this.drawMeterHand();
        },


        drawMeterHand: function(){

            var that = this;

            this.progress = [];

            var dot = this.paper.circle(that.cx,that.cy, that.options.meterKnobRadius)
                        .attr('fill',that.options.meterKnobColor);

            var val        = this._value,
                valueAngle = this.options.endAngle / this.options.valueMax * val,
                valueDeg   = valueAngle * Math.PI / 180,
                x          = this.getX(that.R,valueDeg,that.cx),
                y          = this.getY(that.R,valueDeg,that.cy);


            var pathString = [
                ["M",that.cx,that.cy],
                ["L", x, y]
            ];

            var line = this.paper.path(pathString);

            line.attr('stroke-width', that.options.progressWidth / 5);
            line.attr('stroke',that.options.meterHandColor);

            if(this.options.transform){
                var orig   = this.options.transform,
                    edited = [];

                for(var i = 0; i < orig.length; i++){
                    if(orig[i] == "cx"){
                        orig[i] = this.cx;
                    }else if(orig[i] == "cy"){
                        orig[i] = this.cy;
                    }

                    edited.push(orig[i]);
                }


                var trans = Raphael.parseTransformString(edited);

                line.transform(trans);
            }

            this.progress.push(dot);
            this.progress.push(line);



        },

        drawProgress: function(){

            var that  = this,
                v     = (this.options.animateIn > 0) ? 0 : this._value,
                t     = this.options.valueMax,
                cx    = this.cx,
                cy    = this.cy,
                start = this.options.startAngle,
                end   = this.options.endAngle,
                R     = this.R;


            var params = [v,t,R,cx,cy,start,end];


            this.progress = this.paper.path()
                            .attr('arc',params);

            if(this.options.transform){

                var orig   = this.options.transform,
                    edited = [];

                for(var i = 0; i < orig.length; i++){
                    if(orig[i] == "cx"){
                        orig[i] = this.cx;
                    }else if(orig[i] == "cy"){
                        orig[i] = this.cy;
                    }

                    edited.push(orig[i]);
                }


                var trans = Raphael.parseTransformString(edited);

                this.progress.transform(trans);
            }


            this.progress.attr('stroke', that.options.color);
            this.progress.attr('stroke-width', that.options.progressWidth);

            if(this.options.animateIn){







            }

            if(typeof this.options.middleText == "function"){
                this.middle = {};

                this.middle.behind = this.paper.circle(that.cx,that.cy,that.R - that.options.progressWidth / 2)
                                        .attr('fill','#ddd')
                                        .attr('stroke-width',0);

                var format = this.options.middleText,
                    t;

                if(!this.options.animateIn){

                    t = format(that._value,that.options.valueMax);

                }else{
                    t = format(0,that.options.valueMax);
                }

                this.middle.text = this.paper.text(that.cx,that.cy,"")
                                        .attr({
                                            'text-anchor': 'middle',
                                            'font-size': that.getFontSize(),
                                            'font-family':'Proxima Nova Condensed',
                                            'fill': '#444',
                                            'font-weight': 700,
                                            'value': t
                                        });

            }


            var per = Math.floor(that._value / that.options.valueMax * 100);
            var t = this.middle.text;
            var col = that.options.meterColors;
            var c;
            if(per < 33){
                c = col[0];
            } else if (per < 66){
                c = col[1];
            } else {
                c = col[2];
            }

            if(!this.options.animateIn){

                t.attr('fill',c);
            }else {
                var endValue = this._value,
                    aniTime  = this.options.animationDuration,
                    aniDelay = this.options.animationDelay,
                    easing   = this.options.animationEasing;
                this._animate(endValue,aniTime,aniDelay, easing, c);
            }



        },

        getFontSize: function(){
            var R = this.R;
            var area = Math.PI * Math.pow(R,2);
            var arearoot = Math.pow(area, 0.5);
            return  arearoot / 4;

        },

        _animate: function(endValue,aniTime,aniDelay, easing, c){
            var that = this;

                setTimeout(function(){

                    that.progress.animate({
                        'arc': endValue
                    }, aniTime, easing);
                    that.middle.text.animate({
                        'value': endValue
                    }, aniTime, easing, function(){
                        that.middle.text.animate({
                            'fill': Raphael.color(c)
                        });
                    }, 2200, easing);

                }, aniDelay);


        },

        mergeOptions: function(){
            var o = this._options;
            this.options = $.extend(defaultOptions,o);
        },

        // Custom Arc Attr
        arc: function(value){
            var path,
                that = this,
                val = (this.options.animateIn ) ? value : this._value,
                valueAngle = this.options.endAngle / this.options.valueMax * val,
                valueDeg   = valueAngle * Math.PI / 180,
                R = this.R,
                cx = this.cx,
                cy = this.cy,
                startAngle = this.options.startAngle,

                start      = {
                    'x' : that.getX(R, startAngle, cx),
                    'y' : that.getY(R, startAngle, cy)
                },

                end        = {
                    'x' : that.getX(R, valueDeg, cx),
                    'y' : that.getY(R, valueDeg, cy)
                },

                sweepFlag  = +(Math.abs(valueAngle - startAngle) > 180);

                path = [
                    ["M", start.x, start.y],
                    ["A", R, R, 0, sweepFlag, 1, end.x, end.y]
                ];




            return {'path': path};
        },

        value: function(value){

            var that = this;
            var format = (typeof this.options.middleText == "function") ? this.options.middleText : function(v,a){return v;}
            var v = format(value, that.options.valueMax);

            return {'text': v};

        },

        // get X from Radius, angle, and cx
        getX: function(R,angle,cx){

            var offset = (angle > 90 && angle < 270) ? cx * -1 : cx;
            return R * Math.cos(angle) + cx;
        },

        // get Y from Radius, angle and cx
        getY: function(R,angle,cy){
            var offset = (angle > 180) ? cy : cy ;
            return R * Math.sin(angle) + cy;
        }




    };//end methods



    $.extend(ProgressMeter.prototype, methods);

    $.fn.progressMeter = function(value,options){

        return new ProgressMeter(this,value,options);
    }



})(jQuery);


var astar;



(function($){
    var starPath = "M18.831,23.497l-7.728-5.904l-7.728,5.904l2.655-9.838l-7.522-5.676h9.23l3.366-9.476l3.366,9.476h9.229l-7.522,5.676L18.831,23.497z M1.493,8.982l5.679,4.285l-2.064,7.648l5.996-4.581l5.996,4.581l-2.064-7.648l5.679-4.285h-6.95l-2.66-7.488l-2.66,7.488H1.493z";

    var defaultLabelText = {
        'font-family': "'Proxima Nova Condensed',sans-serif",
        'font-weight':600,
        'fill': '#999999',
        'font-size':'12px'
    };

    var defaultCenterText = {
        'font-family': "'Proxima Nova Condensed',sans-serif",
        'font-weight':600,
        'fill': '#575a5d '

    };


    var centerText = function(value, fontSizeFunction, centerEl, paper){
        var r    = centerEl.attr('r'),
            size = fontSizeFunction(r),
            cx   = centerEl.attr('cx'),
            cy   = centerEl.attr('cy'),
            text;

            if(value < 33){
                text = '<3 months';
            }else if (value < 66){
                text = '3 months';
            }else if (value < 99){
                text = '3+ months';
            }else {
                text = '6 months';
            }

        return paper.text(cx,cy,text.toUpperCase()).attr('font-size',size);


    };



    var defaultOptions = {
        'thickness': 40,
        'value' : 40,
        'maxValue': 100,
        'outerColor': '#f7f7f7',
        'centerColor': '#f9f8ee',
        'scoreColor' : '#0085ca',
        'dataLabels': ['0 months', '3 months', '6 months'],
        'labelAttrs': defaultLabelText,
        'centerTitleAttrs': defaultCenterText,
        'middleText': centerText,
        'showStars' : true,
        'updateDuration': 800,
        'updateEasing' : 'bounce',
        'labelOffset' : 30

    };

    function scoreMeter(el,value,options){
        this.$el = $(el);
        options = options || {};
        this.VAL = value;
        this.options = $.extend(true,{},defaultOptions,options);
        this.init();

        return this;
    }

    var methods = {

        init: function(){

            var that = this;

            this.paper = new Raphael(that.$el.get(0));
            this.paper.customAttributes.arc = function(v){
                var p = that.arc(v);
                return this.attr(p);
            }
            this.cx = this.$el.width() / 2;
            this.cy = this.$el.height() / 2;
            this.R = this.$el.width() / 4 - this.options.thickness;

            this.backArc = this.paper.path()
                               .attr("arc", 100)
                               .attr('stroke-width', that.options.thickness)
                               .attr('stroke', that.options.outerColor);
                               //.attr('transform','S-1,-1T0,-' + that.R); // moved to arc function

            var centerRadius = this.R - this.options.thickness / 2;

            this.center = this.paper.circle(that.cx,that.cy,centerRadius)
                              .attr('fill',that.options.centerColor)
                              .attr('stroke-width',1)
                              .attr('stroke', '#edead6');


            this.showLabels();

            this.showScore();



        },

        updateScore: function(value){
            var that = this;
            this.scoreArc.animate({
                'arc': value
            },that.options.updateDuration, that.options.updateEasing, function(){
                // after animation
                that.VAL = value;
                $.each(that.stars, function(i,v){
                    that.paper.getById(v).remove();
                });
                that.showStars();
                that.centerContent.remove()
                that.centerContent = that.options.middleText(that.VAL,that.getFontSize, that.center, that.paper);
                that.centerContent.attr(that.options.centerTitleAttrs);
            });

        },

        showScore: function(){
            var that = this;


            // show score as progress

            this.scoreArc = this.paper.path().attr('arc',that.VAL)
                                .attr('stroke',that.options.scoreColor)
                                .attr('stroke-width', that.options.thickness);
                                //.attr('transform','S-1,-1,'+that.cx + ',' + that.cy); // moved to arc function



            // final middle statement


            this.centerContent = this.options.middleText(that.VAL,that.getFontSize, that.center, that.paper);

            this.centerContent.attr(that.options.centerTitleAttrs);


            // show stars?

            if(this.options.showStars){

                this.showStars();

            }



        },

        showStars: function(){
            this.stars = [];
            var numStars = 5,
                that = this,
                spacing = 10,
                STAR_PATH_WIDTH = 25, // w/o trans
                starsWon = Math.floor((this.VAL / this.options.maxValue) * numStars),
                x = this.centerContent.attr('x'),
                y = this.centerContent.attr('y'),
                r = this.center.attr('r'),
                space = (r * 0.7 * 2) - (spacing * numStars),
                scale = space / (numStars * STAR_PATH_WIDTH),
                trans = [
                    ["T", x - r / 1.5, (y + r / 4)],
                    ["S",0.3]
                ],
                star = this.paper.path(starPath).attr({
                    'transform': trans,
                    'stroke-width': 5,
                    'stroke': '#f9c031'

                });

                astar = star;
                for(var i = 0; i < numStars; i++){
                    var move = i * (star.getBBox().width + space);
                    //console.log(move);
                    var s = star.clone().attr('transform','...t' + move + ',0');
                    s.attr('stroke', (i <= starsWon) ? '#f9c031' : '#ccc');
                    s.id = 'star' + i;
                    this.stars.push(s.id);
                }



        },

        showLabels: function(){
            var that       = this,
                labels     = this.options.dataLabels,
                last       = labels.length - 1,
                leftLabel  = this.options.dataLabels[0],
                rightLabel = this.options.dataLabels[last],
                offset     = this.options.labelOffset;


            var left  = {},
                right = {},
                top   = {},
                c     = [];

            left.x = this.cx - this.R - offset;
            left.y = this.cy;
            c.push(left);


            top.x = this.cx;
            top.y = this.cy - this.R - offset;
            c.push(top);

            right.x = this.cx + this.R + offset;
            right.y = this.cy;
            c.push(right);

            for(var i = 0;i < labels.length;i++){
                var l = c[i];
                var anchor = (i == 0) ? 'end': (i==1) ? 'middle' : 'start';

                this.paper.text(l.x,l.y,labels[i].toUpperCase())
                          .attr('text-anchor',anchor)
                          .attr(that.options.labelAttrs);
            }


        },

        arc: function(value){
            var path,
                that = this,
                startAngle = 0,
                endAngle = 180,
                val = value,
                valueAngle = endAngle / this.options.maxValue * val,
                valueDeg   = valueAngle * Math.PI / 180,


                start      = {
                    'x' : that.getX(that.R, startAngle, that.cx),
                    'y' : that.getY(that.R, startAngle, that.cy)
                },

                end        = {
                    'x' : that.getX(that.R, valueDeg, that.cx),
                    'y' : that.getY(that.R, valueDeg, that.cy)
                },

                sweepFlag  = +(Math.abs(valueAngle - startAngle) > 180);

                path = [
                    ["M", start.x, start.y],
                    ["A", that.R, that.R, 0, sweepFlag, 1, end.x, end.y]
                ];

                // this makes arc go from left => right
                var transform = 'S-1,-1,'+that.cx + ',' + that.cy;



            return {'path': path, 'transform': transform};
        },

         // get X from Radius, angle, and cx
        getX: function(R,angle,cx){

            var offset = (angle > 90 && angle < 270) ? cx * -1 : cx;
            return R * Math.cos(angle) + cx;
        },

        // get Y from Radius, angle and cx
        getY: function(R,angle,cy){
            var offset = (angle > 180) ? cy : cy ;
            return R * Math.sin(angle) + cy;
        },
        getFontSize: function(r){
            var R = r;
            var area = Math.PI * Math.pow(R,2);
            var arearoot = Math.pow(area, 0.5);
            var padding = 5;
            return  arearoot / 4 - padding;

        }
    };



    $.extend(scoreMeter.prototype,methods);


    $.fn.scoreMeter = function(value,options){

        return new scoreMeter(this,value,options);
    };





})(jQuery);



























var it,it2;

$(function(){

    // it = $('#meter').progressMeter(90,{'type':'meter','progressWidth':50});

    // it2 = $('#progress').progressMeter(100,{'type':'progress','progressWidth':50});

    // var sdiv = $('#star').get(0);
    // var star = Raphael($('#star').get(0));

    // star.path(starPath).transform('t100,100');

    it = $('#meter').scoreMeter(20, {'showStars': false});


    // it2 = $('#meter2').scoreMeter(60, {
    //     'thickness': 10,
    //     'labelOffset': 10,
    //     'labelAttrs': {'font-size': '9px'}
    // });
});








// real dollar translation

/*





    emergency (0, 3, 6 months)
    & starter fund

    health savings
        initially, no insurance
        can add insurance before you get to that step
        then just $$$ amt

    debt
        creditcard debt
            checking > cc debt
        other debt
            $0 balance


    insurnace



*/














