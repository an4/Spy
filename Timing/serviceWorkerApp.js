// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('serviceWorker.js').then(function(registration) {
//         console.log('ServiceWorker registration successful with scope: ',  registration.scope);
//     }).catch(function(err) {
//         console.log('ServiceWorker registration failed: ', err);
//     });
// }

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js', {scope: '/'}).then(function(sw) {
        // registration worked!
        console.log("Scope: " + sw.scope);
    }).catch(function(error) {
        // registration failed :(
        console.log("Error: " + error);
    });
}
