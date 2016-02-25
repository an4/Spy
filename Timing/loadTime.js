function time_image(url) {
    var img = new Image();
    img.onerror = function() {
        var end = window.performance.now();
        console.log("Time image: " + (end - start));
    }
    var start = window.performance.now();
    img.src = url;
};

function time_video(url, name) {
    var s = document.createElement('video');

    s.onerror = function() {
        timeError = window.performance.now();
        console.log("Time video error: " + (timeError - timeLoad) + " " + name);
        return 1;
    }

    s.onloadstart = function() {
        timeLoad = window.performance.now();
    };

    var start = window.performance.now(), timeLoad, timeCanPlay, timeError;
    s.src = url;
}

function time_script(url) {
    window.onerror = function() {
        var d = performance.now() - window.start;
        console.log("parsing done " + d);
    };
    var s = document.createElement('script');
    s.type = "text/javascript";
    document.body.appendChild(s);
    s.onload = function() {
        console.log("script downloaded");
        window.start = window.performance.now();
    };
    s.src = url;
};

// time_video('https://www.facebook.com/kristianTonef');
// time_video('https://www.facebook.com/alina.ivan.946');
// time_video('https://www.facebook.com/logan.lerman.37');
// time_video('https://www.facebook.com/jzelikovic');

var getThings = function() {
    // time_video('https://www.facebook.com/groups/208547725916026', 'In');
    // time_video('https://www.facebook.com/groups/852392078107320', 'Out');
    time_video("http://www.example.com/index.html", "Example");
}
