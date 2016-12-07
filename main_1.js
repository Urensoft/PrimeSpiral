   
      var unit      = 10;
      var numPrimes = 2000;
      var canvas    = document.getElementById('myCanvas');
      var context   = canvas.getContext('2d');
      var originX   = canvas.width / 2;
      var originY   = canvas.height / 2;
      var lastX,lastY;
      var newX, newY;
      var elevation;
      var circles       = [];
      var index         = 0;
      var restingCircle = {"radius":2,"centerX":0,"centerY":0};;
        var lastCircle;
        var lastAngle   =0;
      var point_origin  = {"x":0,"y":0};
      
      function dist(x1,y1,x2,y2){
          
        var a = x1 - x2
        var b = y1 - y2

        return Math.sqrt( a*a + b*b );

      }
      function toDegrees (angle) {
        return angle * (180 / Math.PI);
      }
      function toRadians (angle) {
        return angle * (Math.PI / 180);
      }
      
      function drawCircleAt(x,y,r)
      {
        var red     = 0;
        var green   = 0;
        var blue    = 0;
          
        var cs      = 1/r;
        var colour  = 765;
        
        for(var c =0; c< colour*cs; c++)
        {
            if(red<255) red++;
            else if(green<255) green++;
            else if(blue<255) blue++;
            
            
        }
        
        

          
        context.beginPath();
        context.arc(originX +(x*unit), originY +(y*unit), (r*unit), 0, 2 * Math.PI, false);
        context.fillStyle = 'rgb('+red+','+green+','+blue+')';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
        lastX = x;
        lastY = y;
        lastCircle = {"radius":r,"centerX":x,"centerY":y};
        circles.push(lastCircle);
        index++;
        
      }  
      
      function drawNextCircle()
      {
          getNewPoint();
          var r = 1;
          drawCircleAt(newX,newY,r);
          
      }
      
    function distanceBetweenPoints(x1,y1,x2,y2)
    {

        return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );

    }
      
    function getAngle(s1,s2,s3)
    {

         var x = (s2*s2 + s3*s3 - s1*s1) / (2*s2*s3) ;
         return Math.acos(x);

    }
    function circleContainsPoint(circle,point,newRadius)
    {
        var d = dist(circle.centerX,circle.centerY,point.x,point.y);
        
        if(d<circle.radius+newRadius) return true;
        else return false;
      
        
    }
    
    function ciclesWithinRange(origin,r)
    {
        var outArray = [];
        
        for(var i =0; i<circles.length; i++)
        {
            var circleA = circles[i];
            var d = dist(circleA.centerX,circleA.centerY,origin.centerX,origin.centerY);
            if(d < origin.radius+r)
            {
                outArray.push(circleA);
            }
        }
        
        return outArray;
    }
    
    function findCirclesInRadius(newRadius)
    {
        var origin      = {"x":lastCircle.centerX,"y":lastCircle.centerY};
        var selection   = [];
        

        /*var a = 0.5 ;
        var ar;
        var freeSpace = false;
       
        for(var i = 0; i<270; i+=a)
        {
            ar = toRadians(i);

            //tX  = originX*Math.cos(ar) - originY * Math.sin(ar);
            //tY  = originY*Math.cos(ar) - originX * Math.sin(ar);
            
            rX = origin.x + (point.x-origin.x)*Math.cos(ar) - (point.y-origin.y)*Math.sin(ar);
            rY = origin.y + (point.x-origin.x)*Math.sin(ar) + (point.y-origin.y)*Math.cos(ar);
            
            var inCircle = circleContainsPoint(rX,rY,radius);
            if(inCircle != false) selection.push(inCircle);

        }   
        */
       
        for(var i = 0; i<circles.length; i++)
        {
            var cX  = circles[i].centerX;
            var cY  = circles[i].centerY;
            var d   = dist(origin.x,origin.y,cX,cY);
            var r   = circles[i].radius;
                        
            var isSelf      = (cX == origin.x &&  cY == origin.y);
            
            if (isSelf)
            {
                continue;
            }
            else if(d<=(r+lastCircle.radius+newRadius))
            {
                selection.push(circles[i]);
            }
        }
        
        //var relTheta = Math.atan2(origin.y,origin.x);
        //var theta;
        
        var restingCircle   = false;
        var lowestdist      = 0;
        
        if(selection.length == 0)
        {
            
            
        }
        
        for(var i = 0; i<selection.length; i++)
        {
            var cc = selection[i];
            var pe = dist(cc.centerX,cc.centerY,0,0);

            
            if(pe<lowestdist)
            {
                restingCircle = cc;
                lowestdist = pe;
            }
            //theta = Math.atan2(origin.y,origin.x);            
        }
        return restingCircle;

    }
    
    function rotatePointAbout(origin,point,radians)
    {
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var p = point;
        
        // translate point back to origin:
        p.x -= origin.x;
        p.y -= origin.y;

        // rotate point
        var xnew = p.x * c - p.y * s;
        var ynew = p.x * s + p.y * c;

        // translate point back:
        p.x = xnew + origin.x;
        p.y = ynew + origin.y;
        return p;
    }
    var lastAngle =0;
    
    function findNextPoint(rc,newRadius)
    {
                    
            var a       = dist(rc.centerX,rc.centerY,lastCircle.centerX,lastCircle.centerY); //rc.radius + lastCircle.radius;
            var b       = rc.radius + newRadius;
            var c       = lastCircle.radius + newRadius;
            
            
            var refA    = dist(rc.centerX,  rc.centerY,0,0);
            var refB    = dist(lastCircle.centerX,lastCircle.centerY,    0,0);
            var refC    = dist(rc.centerX,  rc.centerY,    lastCircle.centerX,lastCircle.centerY);
            
            var refAngle    = getAngle(refB,refA,refC);
            if(isNaN(refAngle)) refAngle = 0;
                    
            var newAngle    = getAngle(c,b,a);
            lastAngle       += newAngle+refAngle;
            var px          = b*Math.cos(lastAngle); //+ (rc.centerX);
            var py          = b*Math.sin(lastAngle);// + (rc.centerY);
            var np          = {"x":px,"y":py};
            
            //rotatePointAbout(point_origin,np,)
            
            lastAngle = Math.atan2(py,px);
            return np;
   
    }
    
    function circlesNear(circle, newRadius)
    {
        
        var touchingDist = circle.radius + newRadius;
        var selected = [];
        
        for(var i =0; i<circles.length; i++)
        {
            var sc = circles[i];
            //var r2  = sc.radius;
            //var a   = Math.abs( x1 - sc.centerX );
            //var b   = Math.abs( y1 - sc.centerY );
            
            var d = dist(circle.centerX,circle.centerY,sc.centerX,sc.centerY);
            
            if(d < touchingDist)
            {
                if(circle == sc) continue;
                if(sc == lastCircle) continue;
                selected.push(sc);
                
            }
            
             
        }
        
        return selected;
        
    }
    
    function findRestingCircle(newRadius){
        
        
        var a = lastCircle.centerX;
        var b = lastCircle.centerY;
        var R       = {"x":a,  "y":b};
        
        var rad     = Math.atan2(R.y, R.x);
        
        var length = Math.sqrt((a*a)+(b*b));
        
        length += lastCircle.radius;
        length += newRadius;
        
        var Q = {"x":length* Math.cos(rad),  "y":length*Math.sin(rad)};
        
        var arr = circlesNear(lastCircle,newRadius);
        
        
        for(var i =0; i <180; i+=0.5)
        {
            var np = rotatePointAbout(R,Q, i*(Math.PI/180));
            
            for (var index = 0, len = arr.length; index < len; index++) 
            {
                var found = circleContainsPoint(arr[index],np,newRadius);
                
                if(found) return arr[index];
            }
            //var ic = circleContainsPoint(np.x,np.y)
            //if()
        }
        
        
        return false;
        
        
    }
    
    function findIntersectingCircles(x1,y1,r)
    {
         
        for(var i =0; i<circles.length; i++)
        {
            var r2  = circles[i].radius;
            var a   = Math.abs( x1 - circles[i].centerX );
            var b   = Math.abs( y1 - circles[i].centerY );

            var dist    = Math.sqrt( a*a + b*b );
            var spacing = dist - (r+r2);
            
            if( Math.abs(spacing) > 0.000000001 )
            {
                if(spacing<0)
                {
                    console.log(i + " " + spacing);
                    return circles[i];
                }
                
            }
             
        }
        
        return false;
    }
    
    function getNewPoint2(newRadius){
              
        if (circles.length == 0)    return {"x":0,"y":0};
        if (circles.length == 1)    return {"x":lastCircle.radius+newRadius,"y":0}
        
        //var magnitude       = distanceBetweenPoints(lastCircle.centerX,lastCircle.centerY,0,0);
        //magnitude           += lastCircle.radius + newRadius;
        
        //var projectedX      = magnitude*Math.cos(lastAngle) ;
        //var projectedY      = magnitude*Math.sin(lastAngle);
        
        //var p2 = {"x":projectedX,"y":projectedY};
        
        var supportCircle   = findCirclesInRadius(newRadius);

        var p1 = findNextPoint(lastCircle,supportCircle,newRadius);
        
        if(p1 == false)
        {
            var a       = supportCircle.radius + lastCircle.radius;
            var b       = supportCircle.radius + newRadius;
            var c       = lastCircle.radius + newRadius;
            
            lastAngle   += getAngle(c,b,a);
            
            x       = b*Math.cos(lastAngle);
            y       = b*Math.sin(lastAngle);
            return {"x":x,"y":y};

        }
        else
        {
            lastAngle = Math.atan2(p1.y,p1.x);
            return p1;
            //var d = distanceBetweenPoints(p1.x,p1.y,0,0);
            //d += elevation;
            
            //x = elevation*Math.cos(lastAngle);
            //y = elevation*Math.sin(lastAngle);
        }

  
        
    }
    
    function zeta(n)
    {
        var result =0;
        for(var q = 1;q<1000; q++)
        {
            result += 1/Math.pow(q,n);
        }
        
        return result;
    }
      
    function getNewPoint(newRadius)
    {
      var a,b,c,x,y,theta;
      
        

        a       = restingCircle.radius + lastCircle.radius;
        b       = restingCircle.radius + newRadius;
        c       = lastCircle.radius + newRadius;

        var magnitude = distanceBetweenPoints(restingCircle.centerX,restingCircle.centerY,0,0);
        magnitude += restingCircle.radius + newRadius;
        theta   = getAngle(c,b,a);
        x       = magnitude*Math.cos(lastAngle+theta);
        y       = magnitude*Math.sin(lastAngle+theta);

        intersecting = findIntersectingCircles(x,y,newRadius);
        if(intersecting)
        {      
            //wedge new circle between
          restingCircle = intersecting;

          var midX = (intersecting.centerX+lastCircle.centerX)/2;
          var midY = (intersecting.centerY+lastCircle.centerY)/2;
          var gap = distanceBetweenPoints(intersecting.centerX,intersecting.centerY,lastCircle.centerX,lastCircle.centerY);
          var height = Math.sqrt(Math.abs(c*c - Math.pow(gap/2,2)) ) ;
          var toOrigin = distanceBetweenPoints(midX,midY,0,0);
          theta = 0;
          lastAngle = Math.atan2(midY,midX);
          
          x       = (height+toOrigin)*Math.cos(lastAngle);
          y       = (height+toOrigin)*Math.sin(lastAngle);
        }



      lastAngle += theta;

      return {"x":x,"y":y};
      
    }
      
   
      //var radius    = 70;
      
      
    /*  var r1 = zeta(2);
    drawCircleAt(0,0,2);
    
    var r2 = zeta(2);
    drawCircleAt(4,0,2);
    
    var g =0;    
    */
    
    var p = 0;
    
    function drawPrime()
    {
        /*if(p%2 == 0)
        {
            p++;
            return;
        }*/
        
        var prime       = primes[p];
        var g           = prime - primes[p-1]; 
        
        if(isNaN(g)) g = 2;

        console.log(g);

        //var r = Math.floor((Math.random() * 3) + 1); 

        var np          = getNewPoint2(g);
        drawCircleAt(np.x,np.y,g);
        p++;
        
    }
    
    drawCircleAt(0,0,1);
    drawCircleAt(3,0,2);

    var cn = 3;

    function drawNumber(){
        
        var rc          = findRestingCircle(cn);
        var np          = findNextPoint(rc,cn);
        drawCircleAt(np.x,np.y,cn);
        
        cn++;
    }
    
      
        //var z           = zeta(g);
    setInterval(function(){

      drawNumber();
    },100);
       

    
    
 