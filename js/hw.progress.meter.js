var HWColor = HWColor || {};

(function(c){c.primary = {}; c.primary.BLUE										="#0085ca"; c.primary.CHARCOAL									="#575a5d"; c.primary.GREEN										="#76c34d"; c.primary.SAND										="#edead6"; c.secondary = {}; c.secondary.RED										="#ea4648"; c.secondary.ORANGE									="#f5871e"; c.secondary.PINK									="#de1c85"; c.secondary.YELLOW									="#f9c031"; c.secondary.NAVY									="#004b77"; c.secondary.TEAL									="#00b2e9"; c.additional = {}; c.additional.DARKSAND								="#999999"; c.additional.LIGHTSAND								="#f7f4ec"; c.getPrimary = function(){var primes = []; for(var color in c.primary){primes.push({'name': color.toLowerCase(),'hex': c.primary[color]}); } return primes; }; c.getPrimaryHex = function(){var primes = []; for(var color in c.primary){primes.push(c.primary[color]); } return primes; }; c.getSecondary = function(){var secs = []; for(var color in c.secondary){secs.push({'name': color.toLowerCase(),'hex': c.secondary[color]}); } return secs; }; c.getSecondaryHex = function(){var secs = []; for(var color in c.secondary){secs.push(c.secondary[color]); } return secs; }; c.getAdditional = function(){var adds = []; for(var color in c.additional){add.push({'name': color.toLowerCase(),'hex': c.additional[color]}); } return adds; };})(HWColor);










function getArcPath(cx,cy,r,startAngle,endAngle,progressWidth){

    var rad = Math.PI / 180;

    var arc1 = {
        x1: cx + r * Math.cos(-startAngle * rad),
        x2: cx + r * Math.cos(-endAngle * rad),
        xm: cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
        y1: cy + r * Math.sin(-startAngle * rad),
        y2: cy + r * Math.sin(-endAngle * rad),
        ym: cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad)
    };

    var r2 = r - progressWidth;

    var arc2 = {
        x1: cx + r2 * Math.cos(-startAngle * rad),
        x2: cx + r2 * Math.cos(-endAngle * rad),
        xm: cx + r2 / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
        y1: cy + r2 * Math.sin(-startAngle * rad),
        y2: cy + r2 * Math.sin(-endAngle * rad),
        ym: cy + r2 / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad)
    };


    var res = [
        "M", arc1.x2, arc1.y2,
        "L", arc2.x2, arc2.y2,
        "A", r2, r2, 0, +(Math.abs(endAngle - startAngle) > 180), 1, arc2.x1, arc2.y1,
        "L", arc1.x1, arc1.y1,
        "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 0, arc1.x2, arc1.y2,
        "Z"
    ];
    res.middle = {
        x: (arc1.xm - arc2.xm) / 2 + arc2.xm,
        y: (arc1.ym - arc2.ym) / 2 + arc2.ym
    };
    return res;

}



function endAngle(endPercent){
	return (360 - 90) * endPercent;
}


var p,$meter,outer,inner,progress;
$(function(){

	p = Raphael('meter');
	$meter = $('#meter');

	var padding = 5;
	var progressWidth = 25;
	var percent = .80;



	var cx = $meter.width() / 2;
	var cy = $meter.height() / 2;
	var R  =  (cy > cx) ? cx - padding : cy - padding;



	var end = endAngle(percent);


    var theStartArc = getArcPath(cx,cy,R,0,5,progressWidth)
	var thearc = getArcPath(cx,cy,R,0,end,progressWidth);

	progress = p.path(theStartArc).attr('fill',HWColor.primary.BLUE);

    var trans = [
        "S", -1, 1, cx, cy,
        "R", 45, cx, cy

    ];
    var transPosition = Raphael.parseTransformString(trans);

	progress.transform(transPosition);



	progress.attr('stroke-width',0);


    $('#go').click(function(){
        progress.animate({
            'path': thearc
        }, 350, '<');
    });


});











