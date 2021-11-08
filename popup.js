table = document.getElementById('table');

// change cookie domain 
const replaceUrl = (url) =>{
  let result
  let match
  if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
      result = match[1]
      if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
          result = match[1]
      }
  }
  return result
}


// Render table 
const drawHTML = (elem, cookies) => {
  cookies.length > 0 ? 
  elem.innerHTML = cookies.map(({name,value,expirationDate},index)=>
  `<div class='tibleItem'>
     <div class='textContainer'>
      <textarea cookieId=${index} class='cookieName'>${name}</textarea>
      <textarea cookieId=${index} class='cookieValue'>${value} </textarea>
     </div>
     <span class='cookieLiveTime'>${(new Date(expirationDate * 1000)).toLocaleString()}</span>
       <button value=${index} class='deleteButton'>X</button>
    </div>
  ` 
).join(' ')
: elem.innerHTML = `<div class='noContent'>No cookies!</div>`
}

// Cookies actions 
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.cookies.getAll({
      domain: replaceUrl(tabs[0].url)
    }, function (cookies) {
      console.log(cookies);
      drawHTML(table,cookies)
      // Delete 
      const buttonList = document.getElementsByClassName('deleteButton')
      Array.from(buttonList).forEach((element)=>{
        element.addEventListener("click", (e) => {
          const cookie = cookies[e.target.value]
          const protocol = cookie.secure ? "https:" : "http:";
          const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
         
          chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name,
            storeId: cookie.storeId
          })
          window.location.reload()
        });      
      })    
      // Edit value
      const cookieValue = document.getElementsByClassName('cookieValue')
      Array.from(cookieValue).forEach((element)=>{
        
        element.addEventListener("change", (e) => {
          const cookie = cookies[Number(e.target?.attributes?.[0]?.value)]
          const protocol = cookie.secure ? "https:" : "http:";
          const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
          console.log(e.target.value);


          chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name,
            storeId: cookie.storeId
          })
          chrome.cookies.set({
            url:cookieUrl,
            name:cookie.name,
            value:e.target.value,
            storeId: cookie.storeId
          })
          window.location.reload()

        });      
      })    

      // Edit name 
      const cookieName = document.getElementsByClassName('cookieName')
      Array.from(cookieName).forEach((element)=>{
        
        element.addEventListener("change", (e) => {
          const cookie = cookies[Number(e.target?.attributes?.[0]?.value)]
          const protocol = cookie.secure ? "https:" : "http:";
          const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
          chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name,
            storeId: cookie.storeId
          })
          chrome.cookies.set({
            url:cookieUrl,
            name:e.target.value,
            value: cookie.value,
            storeId: cookie.storeId
          })
          window.location.reload()

        });      
      })    
      //Create cookie 
      const nameInput = document.getElementById('nameInput')
      const valueInput = document.getElementById('valueInput')
      const valueDate = document.getElementById('valueDate')
      const createButton = document.getElementById('createButton')
      
      let newCookieName;
      let newCookieValue;
      let newCookieLive;
      nameInput.addEventListener("change", (e) => {
        newCookieName = e.target.value;
      });      
      valueInput.addEventListener("change", (e) => {
        newCookieValue = e.target.value;
      });      
      valueDate.addEventListener("change", (e) => {
        newCookieLive = e.target.value;
        console.log(new Date(newCookieLive).getTime());
      });    
      createButton.addEventListener('click',()=>{
        chrome.cookies.set({
          name: newCookieName,
          value: newCookieValue,
          url: tabs[0].url,
          expirationDate:new Date(newCookieLive).getTime()
        })
        window.location.reload()

      })
      

  }) 
});

