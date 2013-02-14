(function($){

    var defaultLabelText = {
        'font-family': "'Proxima Nova',sans-serif",
        'font-weight':400,
        'fill': '#575a5d',
        'font-size':'11px'
    };

    var defaultCenterText = {
        'font-family': "'Proxima Nova Condensed',sans-serif",
        'font-weight':600,
        'fill': '#575a5d'

    };


    var centerText = function(value, fontSizeFunction, centerEl, paper){
        var r    = centerEl.attr('r'),
            size = (this.centerFontSize != null) ? this.centerFontSize : this.fontSizeFunction(r),
            cx   = centerEl.attr('cx'),
            cy   = centerEl.attr('cy'),
            text;

            if(value < 33){
                text = '<3 \n months';
            }else if (value < 66){
                text = '3 \n months';
            }else if (value < 99){
                text = '3+ \n months';
            }else {
                text = '6 \n months';
            }

        return paper.text(cx,cy,text.toUpperCase()).attr('font-size',size);


    };



    var defaultOptions = {
        'thickness': 40,
        'centerRadius': null,
        'R': null,
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
        'labelOffset' : {
            'x':0,
            'y':0
        },
        'centerFontSize': null,
        'showTopLabel': false

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
            this.cy = this.$el.height() / 2 ;
            this.R = this.$el.width() / 4 - this.options.thickness;

            this.backArc = this.paper.path()
                               .attr("arc", 100)
                               .attr('stroke-width', that.options.thickness)
                               .attr('stroke', that.options.outerColor);
                               //.attr('transform','S-1,-1T0,-' + that.R); // moved to arc function

            var centerRadius = (this.options.centerRadius != null) ? this.options.centerRadius : this.R - this.options.thickness / 2;

            this.center = this.paper.circle(that.cx,that.cy,centerRadius)
                              .attr('fill',that.options.centerColor)
                              .attr('stroke-width',0);


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





        },



        showLabels: function(){
            var that       = this,
                labels     = this.options.dataLabels,
                last       = labels.length - 1,
                leftLabel  = this.options.dataLabels[0],
                rightLabel = this.options.dataLabels[last],
                oX         = this.options.labelOffset.x,
                oY         = this.options.labelOffset.y,
                thickness  = this.options.thickness;


            var left  = {},
                right = {},
                top   = {},
                c     = [];

            left.x = this.cx - this.R - thickness;
            left.x += oX * -1;
            left.y = this.cy;
            left.y += oY;
            c.push(left);


            top.x = this.cx;
            top.x += oX;
            top.y = this.cy - this.R - thickness;
            top.y += oY * -1;
            c.push(top);

            right.x = this.cx + this.R + thickness;
            right.x += oX ;
            right.y = this.cy;
            right.y += oY;

            c.push(right);

            for(var i = 0;i < labels.length;i++){
                var l = c[i];
                var anchor = (i == 0) ? 'end' : (i == 1) ? 'middle' : 'start';
                if(i != 1){
                    this.paper.text(l.x,l.y,labels[i]).attr('text-anchor',anchor).attr(that.options.labelAttrs);
                }else if (this.options.showTopLabel){
                    this.paper.text(l.x,l.y,labels[i]).attr('text-anchor',anchor).attr(that.options.labelAttrs);
                }

            }


        },

        arc: function(value){
            var path,
                that = this,
                startAngle = 0,
                endAngle = 270,
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
                    transform += 'R-45,'+that.cx + ',' + that.cy;



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



   // it = $('#meter').scoreMeter(20, {'showStars': false});
    it2 = $('#meter2').scoreMeter(40, {
        'thickness': 15,
        'labelOffset': {
            'x': -10,
            'y': 35
        },
        'centerRadius': 31,
        'centerColor': '#fff',
        'centerFontSize': '14px',
        'scoreColor': '#004b77',
        'labelAttrs': {
            'font-weight': 'normal',
            'font-size': '10px'
        }
    });










});

