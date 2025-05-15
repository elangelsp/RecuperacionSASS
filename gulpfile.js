const { src, dest, watch, series, parallel } = require("gulp");
const sass = require ('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss')
const autoprefixer  = require('autoprefixer')

const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");



function imagenes() {
 return src("src/img/**/*")
 .pipe(imagemin({optimizationLevel: 3}))
 .pipe(dest("build/img"));
}

function versionWebp() {
 const opciones = { quality: 50 };
 return src("src/img/**/*.{png,jpg}")
 .pipe(webp(opciones))
 .pipe(dest("build/img"));
}

function versionAvif() {
 return src("src/img/**/*.{png,jpg}")
 .pipe(avif())
 .pipe(dest("build/img"));
}


function css(done) {
 //compilar sass
 //pasos: 1 - identificar archivo, 2 - Compilarla, 3 - Guardar el .css
 src('src/scss/app.scss')
   .pipe(sass())
   //.pipe(sass({outputStyle: 'compressed'})) // con esto le decimos que queremos que el css nos lo haga comprimido, que ocupe lo mínimo
   .pipe(postcss([autoprefixer()])) // para dar soporte a navegadores antiguos que he tenido que especificar en el package.json
   .pipe(dest('build/css')) // este es el archivo que debe compilar
   done();
}
function dev(){
 watch('src/scss/**/*.scss',css) // atento a cambios del archivo app.scss y si cambia vuelve a llamar a la función css
 watch("src/img/**/*", imagenes);
}

exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;

exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
