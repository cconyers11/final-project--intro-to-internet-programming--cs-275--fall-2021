const { src, dest, series, watch } = require(`gulp`);
const imageCompressor = require (`gulp-image`);
const del = require(`del`);
const htmlValidator = require(`gulp-html`);
const htmlCompressor = require(`gulp-htmlmin`);
const jsLinter = require(`gulp-eslint`);
const jsCompressor = require(`gulp-uglify`);
const cssCompressor = require(`gulp-uglifycss`);
const CSSLinter = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;

let browserChoice = `default`;

async function brave () {
    browserChoice = `brave browser`;
}

async function chrome () {
    browserChoice = `google chrome`;
}

async function edge () {
    // In Windows, the value might need to be “microsoft-edge”. Note the dash.
    browserChoice = `microsoft edge`;
}

async function firefox () {
    browserChoice = `firefox`;
}

async function opera () {
    browserChoice = `opera`;
}

async function safari () {
    browserChoice = `safari`;
}

async function vivaldi () {
    browserChoice = `vivaldi`;
}

async function allBrowsers () {
    browserChoice = [
        `brave browser`,
        `google chrome`,
        `microsoft edge`, // Note: In Windows, this might need to be microsoft-edge
        `firefox`,
        `opera`,
        `safari`,
        `vivaldi`
    ];
}

let compressImages = () => {
    return src([`images/*`])
        .pipe(imageCompressor())
        .pipe(dest(`prod/img`));
};

let validateHTML = () => {
    return src([`./*.html`, `html/**/*.html`]).pipe(htmlValidator());
};

let compressHTML = () => {
    return src([`./*.html`,`html/**/*.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};


let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let compressCSS = () => {
    return src(`css/*.css`)
        .pipe(cssCompressor())
        .pipe(dest(`prod/css`));
};

let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        `img/*.*`,
        `!img/*.gitignore`
    ], {dot: true})
        .pipe(dest(`prod`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `./`
            ]
        }
    });

    watch(`js/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`css/*.css`,
        series(CSSLinter)
    ).on(`change`, reload);

    watch(`*.html`,
        series(validateHTML)
    ).on(`change`, reload);
};

async function clean() {
    let fs = require(`fs`),
        i,
        foldersToDelete = [`temp`, `prod`];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory does NOT exist or is NOT accessible.\n`);
        }
    }

    process.stdout.write(`\n`);
}

async function listTasks () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write(`An error was likely generated when invoking ` +
                `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream ` +
                `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does ` +
            `nothing but generate this message. The ` +
            `available tasks are:\n\n${stdout}`);
    });
}

exports.brave = series(brave, serve);
exports.chrome = series(chrome, serve);
exports.edge = series(edge, serve);
exports.firefox = series(firefox, serve);
exports.opera = series(opera, serve);
exports.safari = series(safari, serve);
exports.vivaldi = series(vivaldi, serve);
exports.allBrowsers = series(allBrowsers, serve);
exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.HTMLProcessing = series(validateHTML, compressHTML);
exports.lintJS = lintJS;
exports.lintCSS = CSSLinter;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.compressImages = compressImages;
exports.clean = clean;
exports.listTasks = listTasks;
exports.serve = series(
    compressCSS,
    compressHTML,
    transpileJSForProd
);
exports.build = series(
    lintJS,
    CSSLinter,
    validateHTML,
    transpileJSForDev,
    serve
);
