'use strict';

angular.module('TheApp', ['ngMaterial', 'googlechart']);

angular.module('TheApp').controller('controller', ['$scope', '$http', '$location', '$timeout',
    function($scope, $http, $location, $timeout) {
        $scope.graph = {};
        $scope.graph.random = false;
        $scope.graph.Xaxis = 30;
        $scope.graph.progress = 0;

        $scope.guess = {};
        $scope.guess.ranges = [];
        $scope.guess.answer = 0;

        $scope.constants = {};
        $scope.constants.chunk = 100;
        $scope.constants.rounds = 10;

        var base_url = "https://raw.githubusercontent.com/an4/Data-Storage/master/";
        // var base_url = "http://localhost:3000/";

///////////////////////////////////////////////////////////////
///////////////////// TIME VIDEO METHODS //////////////////////
///////////////////////////////////////////////////////////////
        function measureTimeVideo(url, index) {
            return new Promise(function(resolve, reject) {
                var video = document.createElement('video');
                // The error is only triggered when the file has finished parsing
                video.onerror = function() {
                    timeError = window.performance.now();
                    var time = timeError - timeSuspend;
                    var response = {'index': index, 'time': time};
                    resolve(response);
                };
                // Start timing once the resource is loaded and parsing begins.
                video.onsuspend = function() {
                    timeSuspend = window.performance.now();
                };

                var timeSuspend, timeError;
                video.src = url;
            });
        };

///////////////////////////////////////////////////////////////
////////////////////// TIME IMAGE METHOD //////////////////////
///////////////////////////////////////////////////////////////
        function measureTimeImage(url, index) {
            return new Promise(function(resolve, reject) {
                var img = new Image();
                img.onerror = function() {
                    var end = window.performance.now();
                    var time = end-start;
                    var response = {'index': index, 'time': time};
                    resolve(response);
                }
                var start = window.performance.now();
                img.src = url;
            });
        };

///////////////////////////////////////////////////////////////
/////////////////////// Mutliple Files ////////////////////////
///////////////////////////////////////////////////////////////
        /**
         * Get measurements for an array of files - Once for each files.
         */
        function getMeasurementArray(files, method) {
            return new Promise(function(resolve, reject) {
                var promises = [];
                var len = files.length;
                var times = [];
                for(var i=0; i<len; i++) {
                    times.push(0);
                }

                var currentFile = files.shift();
                promises[0] = method(currentFile.url, currentFile.index);
                for(var i=1; i<len; i++) {
                    promises[i] = promises[i-1].then(function(result) {
                        times[result.index] = result.time;
                        currentFile = files.shift();
                        return method(currentFile.url, currentFile.index);
                    }, function() {
                        console.log("3rr0r");
                    });
                }

                promises[i-1].then(function(result) {
                    times[result.index] = result.time;
                    resolve(times);
                });
            });
        };

        /**
         * Get measurements for all files. Shuffle files before each round.
         */
        function getMeasurementShuffle(files, rounds, method) {
            return new Promise(function(resolve, reject) {
                $scope.graph.progressPart = 100/rounds;
                $scope.graph.progress = 0;
                var sortedFiles = files;
                var promises = [];
                var results = [];
                var fileResult = [];
                for(var i=0; i<files.length; i++) {
                    var temp = {'file': files[i], 'times': []};
                    fileResult.push(temp);
                }

                promises[0] = getMeasurementArray(shuffle(files.slice(0)), method);
                for(var i=1; i<rounds; i++) {
                    promises[i] = promises[i-1].then(function(arrayResult) {
                        for(var j=0; j<files.length; j++) {
                            fileResult[j].times.push(arrayResult[j]);
                        }
                        $scope.graph.progress += $scope.graph.progressPart;
                        $scope.$apply();

                        // console.log("Before");
                        // for(var k=0; k<2000000000;) {
                        //     k++;
                        // }
                        // console.log("After");

                        return getMeasurementArray(shuffle(files.slice(0)), method);
                    }, function() {
                        console.log("3rr0r");
                    });
                }

                promises[i-1].then(function(arrayResult) {
                    for(var j=0; j<files.length; j++) {
                        fileResult[j].times.push(arrayResult[j]);
                    }

                    $scope.graph.progress += $scope.graph.progressPart;
                    $scope.$apply();

                    // Build all files result.
                    for(var j=0; j<files.length; j++) {
                        results[j] = buildResult(fileResult[j].times, fileResult[j].file);
                    }

                    $scope.graph.progress = 100;
                    resolve(results);
                });
            });
        };

        /**
         * Get multiple measurements for the same file
         * file - file to be measured
         * rounds - how many measurements
         * method - function used for measurement (image/video)
         */
        function getMeasurementFile(file, rounds, method) {
            return new Promise(function(resolve, reject) {
                // Array of all promises to be resolved;
                var promises = [];
                // Array of times for current file.
                var times = [];

                promises[0] = method(file.url);
                for(var i=1; i<rounds; i++) {
                    promises[i] = promises[i-1].then(function(result) {
                        times.push(result.time);
                        return method(file.url);
                    }, function() {
                        console.log("Something went wrong.");
                    });
                }

                promises[i-1].then(function(result) {
                    times.push(result.time);
                    resolve(buildResult(times, file));
                });
            });
        };

        function getMeasurementFileRandom(file, rounds, method) {
            return new Promise(function(resolve, reject) {
                // Array of all promises to be resolved;
                var promises = [];
                // Array of times for current file.
                var times = [];

                promises[0] = method(file.url);
                for(var i=1; i<2*rounds; i++) {
                    promises[i] = promises[i-1].then(function(result) {
                        times.push(result.time);
                        return method(file.url);
                    }, function() {
                        console.log("Something went wrong");
                    });
                }

                promises[i-1].then(function(result) {
                    times.push(result.time);

                    var sample = getRandom(times, rounds);

                    // Construct result
                    var result = {};
                    resolve(buildResult(times, file));
                });
            });
        };

        /**
         * Get multiple measurement for a list of files
         * files - array of files
         * rounds - the number of measurements for each files
         * method - function used to measure the time
         */
        function getMeasurementAll(files, rounds, method) {
            return new Promise(function(resolve, reject) {
                var promises = [];
                var results = [];

                var fileMethod = getMeasurementFile;
                if($scope.graph.random === true) {
                    fileMethod = getMeasurementFileRandom;
                }

                promises[0] = fileMethod(files.shift(), rounds, method);

                for(var i=0; i<files.length; i++) {
                    promises[i+1] = promises[i].then(function(result) {
                        console.log(result.name + ". Avg: " + result.mean + ". Std: " + result.std);
                        results[result.index] = result;
                        $scope.graph.progress += $scope.graph.progressPart;
                        $scope.$apply();
                        return fileMethod(files.shift(), rounds, method);
                    });
                }

                promises[i].then(function(result) {
                    console.log(result.name + ". Avg: " + result.mean + ". Std: " + result.std);
                    results[result.index] = result;
                    $scope.graph.progress = 100;
                    resolve(results);
                });
            });
        };

/////////////////////////////////////////////////////////
//////////////////////// HELPER /////////////////////////
/////////////////////////////////////////////////////////

        /* https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
        /* Fisher-Yates shuffle */
        function shuffle(array) {
            for(var counter=array.length-1; counter > 0; counter--) {
                let index = Math.floor(Math.random() * counter);
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        };

        /* Select n random values from the given array. */
        function getRandom(array, n) {
            var sample = [];
            var length = array.length;
            while(sample.length < n) {
                var value = array[Math.floor(Math.random() * length)];
                sample.push(value);
            }
            return sample;
        };

        function removeOutliers(data) {
            var median = math.median(data);
            for(var i=0; i<data.length; i++) {
                if(Math.abs(data[i] - median) < median * 0.5) {
                    data.splice(i,1);
                }
            }
            return data;
        };

        /**
         * Build the results for each file.
         */
        function buildResult(times, file) {
            var result = {};
            result.median = math.median(times);
            var timingData = removeOutliers(times);
            result.url = file.url;
            result.times = times;
            result.name = file.name;
            result.size = file.size;
            result.index = file.index;
            result.mean = parseFloat(math.mean(timingData).toFixed(4));
            result.std = parseFloat(math.std(timingData).toFixed(4));
            result.min = getMinimum(times);
            console.log("File: " + file.name + ". min: " + result.min + ". mean: " + result.mean + ". median: " + result.median);
            return result;
        };

        /**
         * Returns the mean and original file size for each file object in the data
         * array.
         */
        function getMeans(data) {
            var output = [];
            data.forEach(function(file) {
                var el = {};
                el.mean = file.mean;
                el.name = file.name;
                output.push(el);
            });
            return output;
        };

        function getMinimum(data) {
            data.sort();
            return data[0];
        }

/////////////////////////////////////////////////////////
/////////////////////// KNOWN RANGE /////////////////////
/////////////////////////////////////////////////////////
        /**
         * Calculates the average time to load a n KB file.
         */
        function getMinTime(n) {
            return new Promise(function(resolve, reject) {
                // Build the file object.
                var file = {size: "" + n, url: base_url + n + "kB.html", name: n + "kB"};
                var rounds = $scope.constants.rounds;
                getMeasurementFileRandom(file, rounds, measureTimeVideo).then(function(result) {
                    resolve(result.min);
                });
            });
        };

        /**
         * Calculates the average time it takes to parse 100kB.
         */
        function getBaseCase() {
            return new Promise(function(resolve, reject) {
                getMinTime($scope.constants.chunk).then(function(result) {
                    resolve(result);
                }, function() {
                    console.log("Base case promise failse");
                });
            });
        };

        /**
         * Return the difference between the average times of parsing a 100kB file and a 200kB file.
         */
        function getTimeStep(resultA) {
            return new Promise(function(resolve, reject) {
                getMinTime(2 * $scope.constants.chunk).then(function(resultB) {
                    resolve(resultB - resultA);
                }, function() {
                    console.log("Time Step promise failed;");
                });
            });
        };

        function guessSize() {
            return new Promise(function(resolve, reject) {
                var guess_file_url = $scope.guess.path;
                var guess = {size: "unknown", url: guess_file_url, name: "unknown"};
                var rounds = $scope.constants.rounds;
                getMeasurementFileRandom(guess, rounds, measureTimeVideo).then(function(guessResult) {
                    getBaseCase().then(function(baseCase) {
                        getTimeStep(baseCase).then(function(timeStep) {
                            var guessMin = guessResult.min;

                            // Guess size
                            var size = 0;
                            if(guessMin > baseCase) {
                                guessMin -= baseCase;
                                var x = guessMin / timeStep;
                                size += $scope.constants.chunk * x;

                            }
                            size += $scope.constants.chunk;
                            resolve(size);
                        });
                    });
                });
            });
        };

        $scope.guessSizeChunk = function() {
            guessSize().then(function(result) {
                $scope.guess.answer = result + " kB";
                $scope.$apply();
                console.log("Guess: " + result);
            });
        };


/////////////////////////////////////////////////////////
////////////////////////// GUESS ////////////////////////
/////////////////////////////////////////////////////////
        /**
         * Given the path to the file, the method returns the range in which the size of the file
         * might be.
         */
        function getRange(data, guess) {
            return new Promise(function(resolve, reject) {
                var range = {l: "0", h: "0"};
                console.log("Guess mean: " + guess.mean);
                if(guess.mean <= data[0].mean) {
                    range.h = data[0].name;
                    resolve(range);
                }
                for(var i=1; i<data.length; i++) {
                    if(data[i-1].mean <= guess.mean && guess.mean <= data[i].mean) {
                        range.l = data[i-1].name;
                        range.h = data[i].name;
                        resolve(range);
                    }
                }
                if(guess.mean > data[data.length-1].mean) {
                    range.l = data[data.length-1].name;
                    resolve(range);
                }
            });
        };


        /**
         * Given the path to a file, the method returns the file size with the closest mean to the
         * input file mean.
         */
        function closestMean(data, guess) {
            return new Promise(function(resolve, reject) {
                var mean = guess.mean;
                var closest = data[0].name;
                var diff = Math.abs(data[0].mean, mean);
                for(var i=1; i<data.length; i++) {
                    if(Math.abs(data[i].mean - mean) < diff) {
                        diff = Math.abs(data[i].mean - mean);
                        closest = data[i].name;
                    }
                }
                resolve(closest);
            });
        };

        /**
         * Returns a promise that resolves to an array of means for each file.
         */
        function computeMeans() {
            return new Promise(function(resolve, reject) {
                var files = getFiles(true);
                var rounds = 100;
                getMeasurementAll(files, rounds, measureTimeVideo).then(function(results) {
                    var means = getMeans(results);
                    resolve(means);
                });
            });
        };

/////////////////////////////////////////////////////////
//////////////////// COLOURS & LINES ////////////////////
/////////////////////////////////////////////////////////

        var totalResults = [];

        function getPDF(input, bin_size) {
            var arr = [];
            for(var i=0; i<$scope.graph.Xaxis * bin_size; i++) {
                arr[i] = 0;
            }
            input.forEach(function(el) {
                var x = Math.floor(el * bin_size);
                if(x < arr.length) {
                    arr[x]++;
                }
            });
            return arr;
        };

        function draw(files) {
            var bin_size = 1/$scope.graph.binSize;

            $scope.chartObject.type = "LineChart";
            $scope.chartObject.displayed = false;
            $scope.chartObject.data = {"cols": [], "rows": []};

            // Add labels
            $scope.chartObject.data.cols.push({id: "Seconds", label: "Time", type: "string"});

            // Add chart data for each file
            files.forEach(function(file) {
                var col = {};
                col.id = file.name;
                col.label = file.name;
                col.type = "number";
                $scope.chartObject.data.cols.push(col);
            });

            //  Add more colours;
            $scope.chartObject.options = {
                "title": "External resource load time. Samples: " + $scope.graph.rounds ,
                "isStacked": "true",
                "vAxis": {
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Time (ms)"
                }
            };

            // X-axis labels
            var label_data = [];
            for(var i=0; i<$scope.graph.Xaxis*bin_size; i++) {
                label_data.push(i/bin_size);
            }

            // Get array of times for each file.
            var times = [];
            files.forEach(function(file) {
                times.push(getPDF(file.times, bin_size));
            });

            // Add times for each file at each time step.
            for(var i=0; i<$scope.graph.Xaxis*bin_size; i++) {
                var row = {};
                row.c = [];
                // Add time step value
                row.c.push({v: label_data[i]});
                // Add times for each file at current time step.
                for(var j=0; j<times.length; j++) {
                    row.c.push({v: times[j][i]})
                }
                $scope.chartObject.data.rows.push(row);
            }

            $scope.$apply();
        };

/////////////////////////////////////////////////////////
////////////////////// DATA /////////////////////////////
/////////////////////////////////////////////////////////

        /**
         * Returns an array of file objects, containing the size, path, index, and
         * name of the file. By default the file paths are from the GitHub repository
         * (remote is true). If remore is false the files paths link to a server
         * running locally. The files are shuffeled before being returned.
         */
        function getFiles(remote) {
            var files = [
                // {size: "50", url: base_url + "50kB.html", name: "50kB"},
                {size: "100", url: base_url + "100kB.html", name: "100kB"},
                // {size: "150", url: base_url + "150kB.html", name: "150kB"},
                {size: "200", url: base_url + "200kB.html", name: "200kB"},
                // {size: "250", url: base_url + "250kB.html", name: "250kB"},
                {size: "300", url: base_url + "300kB.html", name: "300kB"},
                // {size: "350", url: base_url + "350kB.html", name: "350kB"},
                {size: "400", url: base_url + "400kB.html", name: "400kB"},
                // {size: "450", url: base_url + "450kB.html", name: "450kB"},
                {size: "500", url: base_url + "500kB.html", name: "500kB"},
                // {size: "550", url: base_url + "550kB.html", name: "550kB"},
                {size: "600", url: base_url + "600kB.html", name: "600kB"},
                // {size: "650", url: base_url + "650kB.html", name: "650kB"},
                {size: "700", url: base_url + "700kB.html", name: "700kB"},
                // {size: "750", url: base_url + "750kB.html", name: "750kB"},
                {size: "800", url: base_url + "800kB.html", name: "800kB"},
                // {size: "850", url: base_url + "850kB.html", name: "850kB"},
                {size: "900", url: base_url + "900kB.html", name: "900kB"},
                // {size: "950", url: base_url + "950kB.html", name: "950kB"},
                {size: "1000", url: base_url + "1000kB.html", name: "1000kB"},
                // {size: "1100", url: base_url + "1100kB.html", name: "1100kB"},
                // {size: "1200", url: base_url + "1200kB.html", name: "1200kB"},
                // {size: "1300", url: base_url + "1300kB.html", name: "1300kB"},
                // {size: "1400", url: base_url + "1400kB.html", name: "1400kB"},
                // {size: "1500", url: base_url + "1500kB.html", name: "1500kB"},
                // {size: "1600", url: base_url + "1600kB.html", name: "1600kB"},
                // {size: "1700", url: base_url + "1700kB.html", name: "1700kB"},
                // {size: "1800", url: base_url + "1800kB.html", name: "1800kB"},
                // {size: "1900", url: base_url + "1900kB.html", name: "1900kB"},
                // {size: "2000", url: base_url + "2000kB.html", name: "2000kB"},
                // {size: "16", url: base_url + "16kB.html", name: "16kB"},
                // {size: "32", url: base_url + "32kB.html", name: "32kB"},
                // {size: "64", url: base_url + "64kB.html", name: "64kB"},
                // {size: "128", url: base_url + "128kB.html", name: "128kB"},
                // {size: "256", url: base_url + "256kB.html", name: "256kB"},
                // {size: "512", url: base_url + "512kB.html", name: "512kB"},
                // {size: "1024", url: base_url + "1024kB.html", name: "1024kB"},
                // {size: "2048", url: base_url + "2048kB.html", name: "2048kB"},
                // {size: "4096", url: base_url + "4096kB.html", name: "4096kB"}
            ];

            // Add original index for each file
            for(var i=0; i<files.length; i++) {
                files[i].index = i;
            }

            $scope.graph.progressPart = 100/files.length;

            return files;
        };

/////////////////////////////////////////////////////////
////////////////// BUTTONS & UI /////////////////////////
/////////////////////////////////////////////////////////

        $scope.run = function() {
            var path = "/Files/";

            $scope.graph.progress = 0;

            var tag = $scope.graph.type;
            var method = measureTimeVideo;
            if(tag === 'video') {
                method = measureTimeVideo;
            }
            if(tag === 'image') {
                method = measureTimeImage;
            }

            var rounds = $scope.graph.rounds;

            var files = getFiles(true);

            // getMeasurementAll(files, rounds, method).then(function(results) {
            //     $scope.chartObject = {};
            //     draw(results);
            // });

            getMeasurementShuffle(files, rounds, method).then(function(results) {
                $scope.chartObject = {};
                draw(results);
            });
        };

        $scope.computeAndDisplayRanges = function() {
            $scope.graph.progress = 0;
            computeMeans().then(function(means) {
                $scope.guess.means = means;
                $scope.guess.ranges = [];
                var range = {};
                // 0 - first
                range.size = '0kB - ' + means[0].name;
                range.time = '0s - ' + means[0].mean + 's';
                $scope.guess.ranges.push(range);

                for(var i=1; i<means.length; i++) {
                    range = {};
                    range.size = means[i-1].name + ' - ' + means[i].name;
                    range.time = means[i-1].mean + 's - ' + means[i].mean + 's';
                    $scope.guess.ranges.push(range);
                }

                // > last
                range = {};
                range.size = '>' + means[means.length-1].name;
                range.time = '>' + means[means.length-1].mean + 's';
                $scope.guess.ranges.push(range);
                $scope.$apply();
            });
        };

        $scope.showGuess = function() {
            if($scope.guess.ranges === undefined || $scope.guess.ranges.length == 0) {
                return true;
            }
            return false;
        };

        $scope.guess = function() {
            var guess_file_url = $scope.guess.path;
            var guess = {size: "unknown", url: guess_file_url, name: "unknown"};

            var rounds = 50;

            getMeasurementFile(guess, rounds, measureTimeVideo).then(function(guessResult) {
                getRange($scope.guess.means, guessResult).then(function(result) {
                    $scope.guess.answer = result;
                    $scope.$apply();
                    console.log(result);
                });
            });
        };
}]);
