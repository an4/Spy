if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js', {scope: '/'}).then(function(sw) {
        // registration worked!
        console.log("Scope: " + sw.scope);
    }).catch(function(error) {
        // registration failed :(
        console.log("Error: " + error);
    });
}
