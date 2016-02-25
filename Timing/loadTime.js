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



function getThings() {
    time_video('https://www.facebook.com/kristianTonef', "Chris");
    time_video('https://www.facebook.com/alina.ivan.946', "Alina");
    time_video('https://www.facebook.com/logan.lerman.37', "Not 1");
    time_video('https://www.facebook.com/jzelikovic', "Not 2");

    time_video('https://www.facebook.com/groups/208547725916026', 'In');
    time_video('https://www.facebook.com/groups/852392078107320', 'Out');
}
