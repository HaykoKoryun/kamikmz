(function()
{
  var PI_2 = 2*Math.PI;

  var canvas = document.querySelector("#bg");
  var ctx = canvas.getContext("2d");

  var start = 0;
  var ltime = 0;
  var centre;
  var radius;
  var step = 11.25 * (Math.PI / 180);

  window.onresize = recalc;

  recalc();

  requestAnimationFrame(render);

  function recalc()
  {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    centre =
    {
      x : (canvas.width / 2),
      y : (canvas.height / 2)
    };

    radius = Math.max(canvas.width, canvas.height) * 1.2;
  }

  function render(time)
  {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    var delta = time - ltime;
    ltime = time;

    start = start + (0.00005 * delta);

    ctx.beginPath();
    ctx.fillStyle = "#e8292e";
    ctx.arc(centre.x, centre.y, 100, 0, PI_2);
    ctx.fill();

    for(var i = 0; i < 33; i+=2)
    {
      var p1 = getXY(centre.x, centre.x, radius, start + (i * step));
      var p2 = getXY(centre.x, centre.x, radius, start + (i * step) + step);

      ctx.beginPath();
      ctx.moveTo(centre.x, centre.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(centre.x, centre.y);
      ctx.fill();
      ctx.closePath();
    }

    requestAnimationFrame(render);
  }

  function getXY(x, y, r, a)
  {
  	return {
  		x: x + r * Math.cos(a),
  		y: y + r * Math.sin(a)
  	};
  };
})();
