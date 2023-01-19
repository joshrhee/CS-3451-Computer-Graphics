import * as mat from './matrix'

// calls to test your matrix commands
export function mat_test() {
  console.log ("init()");
  mat.init();
  mat.print();
    
  console.log ("translate (3, 2, 1.5)");
  mat.init();
  mat.translate (3, 2, 1.5);
  mat.print();
  
  console.log ("scale (2, 3, 4)");
  mat.init();
  mat.scale (2, 3, 4);
  mat.print();

  console.log ("rotateX (90)");
  mat.init();
  mat.rotateX (90);
  mat.print();

  console.log ("rotateY (-15)");
  mat.init();
  mat.rotateY (-15);
  mat.print();

  console.log ("rotateZ (45) and init()");
  mat.init();
  mat.rotateZ (45);
  mat.print();
  mat.init();
  mat.print();

  console.log ("translate (1.5, 2.5, 3.5) and scale (2, 2, 2)");
  mat.init();
  mat.translate (1.5, 2.5, 3.5);
  mat.scale (2, 2, 2);
  mat.print();

  console.log("currentMatrix() = " + mat.currentMatrix().toLocaleString())
  console.log("")

  console.log ("scale (4, 2, 0.5) and translate (2, -2, 10)");
  mat.init();
  mat.scale (4, 2, 0.5);
  mat.translate (2, -2, 10);
  mat.print();

  console.log ("scale (2, 2, 2), print, init(), and translate (3.14159, 2.71828, 1.61803)");
  mat.init();
  mat.scale (2, 2, 2);
  mat.print();
  mat.init();
  mat.translate (3.14159, 2.71828, 1.61803);
  mat.print();

  console.log("currentMatrix() = " + mat.currentMatrix().toLocaleString())
  console.log("")

  console.log ("Multiple mat.scales and mat.translates");
  mat.init();
  mat.scale (2, 4, 8);
  mat.scale (0.5, 0.25, 0.125);
  mat.print();
  mat.translate (15, -6.5, 42);
  mat.translate (-15, 6.5, -42);
  mat.print();
}

