let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


// set query param in all page 

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         chrome.tabs.query({currentWindow: true, active: true}, function (tab) {  
//             if(tab[0].url.split('?')[1] !== request.message){
//                 chrome.tabs.update(tab.id, {url:`${tab[0].url}?${request.message}`});
//             }
//     });       
// });


// get all window info 

// chrome.tabs.getAllInWindow(function(i){
//     console.log(i);
// })
