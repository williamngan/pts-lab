Pts.namespace(this);

let data, drawings;

(async () => {
  const res = await fetch("./angel.json");
  data = await res.json();
  drawings = getDrawings(data, 5);
})();

function getDrawings(data, max=10) {
  return data.map( (d, i) => {
    if (i >= max) return;
    // for each drawing, map each stroke to a generator function
    // zip the array to get x,y pairs, then divide by 255 to get normalized values
    // then use Curve.cardinal to get a smooth curve
    // then use drawStrokeFn to get a generator function for drawing the stroke
    return d.drawing.map( (s, i) => drawStrokeFn(
      Curve.cardinal( 
        Util.zip(s).map( p => new Pt(p).divide(255) ), 5
      )
    ));
  }).filter( d => d );
}

// A generator function that returns a function to produce a series of points
function* drawStrokeFn(g) {
  for (let i=0, len=g.length; i<len; i++) {
    yield (scale, anchor=[0,0]) => g[i].$multiply(scale).add(anchor);
  }
}

let drawID = 0;
let lineIndex = 0;
let prevPt;
let pause = 0;

function drawNext( id, prev ) {
  if (!drawings[id]) return; // all drawing done
  if (lineIndex >= drawings[id].length) {
    pause = pause < 100 ? pause+1 : 0;
    return pause === 0 ? "done" : prevPt; // current drawing done
  }

  const genPt = drawings[id][lineIndex].next(); // iterate to next point function
  if (genPt && !genPt.done) {
    const next = genPt.value(space.size.x/1.5, space.size.$divide(6));
    if (prev) form.stroke("#000", 12, "round", "round").line( [prev, next] );
    return next;
  } else {
    lineIndex++; // current line done
  }
}

const space = new CanvasSpace("#pts").setup({bgcolor: "#fff", });
const form = space.getForm();
space.add( {
  animate: (time) => {
    if (!drawings) return;
    space.refresh(false);
    
    prevPt = drawNext( drawID, prevPt );
    if (prevPt === "done") { // reset and start next drawing
      drawID++;
      lineIndex = 0;
      prevPt = null;
      space.clear();
    }
  }, 
  action: (type, px, py) => {
    if (type === "click") Util.download( space, "quickdraw" );
  }
});
space.bindMouse().bindTouch().play();


