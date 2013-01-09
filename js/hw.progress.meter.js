var HWColor = HWColor || {};

(function(c){c.primary = {}; c.primary.BLUE										="#0085ca"; c.primary.CHARCOAL									="#575a5d"; c.primary.GREEN										="#76c34d"; c.primary.SAND										="#edead6"; c.secondary = {}; c.secondary.RED										="#ea4648"; c.secondary.ORANGE									="#f5871e"; c.secondary.PINK									="#de1c85"; c.secondary.YELLOW									="#f9c031"; c.secondary.NAVY									="#004b77"; c.secondary.TEAL									="#00b2e9"; c.additional = {}; c.additional.DARKSAND								="#999999"; c.additional.LIGHTSAND								="#f7f4ec"; c.getPrimary = function(){var primes = []; for(var color in c.primary){primes.push({'name': color.toLowerCase(),'hex': c.primary[color]}); } return primes; }; c.getPrimaryHex = function(){var primes = []; for(var color in c.primary){primes.push(c.primary[color]); } return primes; }; c.getSecondary = function(){var secs = []; for(var color in c.secondary){secs.push({'name': color.toLowerCase(),'hex': c.secondary[color]}); } return secs; }; c.getSecondaryHex = function(){var secs = []; for(var color in c.secondary){secs.push(c.secondary[color]); } return secs; }; c.getAdditional = function(){var adds = []; for(var color in c.additional){add.push({'name': color.toLowerCase(),'hex': c.additional[color]}); } return adds; };})(HWColor);







var p,$meter,outer,inner;



Raphael.el.s = function(){
	this.attr({'stroke-color':'#ccc'});
};


function arc(cx, cy, r, startAngle, endAngle, progressWidth){
	var rad = Math.PI / 180,
        x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad),
        ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad);

    var res = [
            "M", cx, cy,
            "L", x1, y1,
            "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 0, x2, y2,
            "z"
        ];

    res.middle = { x: xm, y: ym };
    return res;
}

function endAngle(endPercent){
	return 360 * endPercent;
}

$(function(){

	p = Raphael('meter');
	$meter = $('#meter');

	var padding = 5;
	var progressWidth = 20;
	var percent = 0.75;

	var angles = {
		'0': 0,
		'100': 360
	};

	var cx = $meter.width() / 2;
	var cy = $meter.height() / 2;
	var R  =  (cy > cx) ? cx - padding : cy - padding;


	outer = p.circle(cx,cy,R);
	outer.attr({'stroke-width':0});
	
	var end = endAngle(percent);
	var thearc = arc(cx,cy,R,0,end,progressWidth);
	var progress = p.path(thearc).attr('fill',HWColor.primary.BLUE);

	progress.transform("r45");
	progress.attr('stroke-width',0);

	inner = p.circle(cx,cy,R - progressWidth);
	inner.attr({
		fill:"#fff",
		'stroke-width': 0.25,
		'stroke':
	});




});











