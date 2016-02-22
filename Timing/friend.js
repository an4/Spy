function time_image(url) {
    var img = new Image();
    img.onerror = function() {
        var end = window.performance.now();
        console.log("Time image: " + (end - start));
    }
    var start = window.performance.now();
    img.src = url;
};


function time_script(url) {
    window.onerror = function() {
        var d = performance.now() - window.start;
        console.log("parsing done " + d);
    };
    var s = document.createElement('script');
    document.body.appendChild(s);
    s.onload = function() {
        console.log("script downloaded");
        window.start = window.performance.now();
    };
    s.src = url;
};
