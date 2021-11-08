table = document.getElementById('table');
const ids = {
  nameInput: 'nameInput',
  valueInput: 'valueInput',
  valueDate: 'valueDate',
  createButton:'createButton',
}





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
     <span class='cookieLiveTime'>${(new Date(expirationDate)).toLocaleString()}</span>
       <button value=${index} class='deleteButton'>X</button>
    </div>
  ` 
).join(' ')
: elem.innerHTML = `<div class='noContent'>No cookies!</div>`
}

const updateCookie = (cookieData) =>{
  chrome.cookies.set(cookieData)
}

const remomeCookie = (cookieData) =>{
  chrome.cookies.remove(cookieData)
}

// Cookies actions 
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.cookies.getAll({
      domain: replaceUrl(tabs[0].url)
    }, function (cookies) {
      drawHTML(table,cookies)
      // Delete 
      const buttonList = document.getElementsByClassName('deleteButton')
      Array.from(buttonList).forEach((element)=>{
        element.addEventListener("click", (e) => {
          const {name, storeId, secure, domain, path} = cookies[e.target.value]
          const protocol = secure ? "https:" : "http:";
          const cookieUrl = `${protocol}//${domain}${path}`;
          remomeCookie({
            url: cookieUrl,
            name,
            storeId
          })
          
          window.location.reload()
        });      
      })    
      // Edit value
      const cookieValue = document.getElementsByClassName('cookieValue')
      Array.from(cookieValue).forEach((element)=>{
        
        element.addEventListener("change", (e) => {
          const {name, storeId, secure, domain, path, expirationDate} = cookies[Number(e.target?.attributes?.[0]?.value)]
          const protocol = secure ? "https:" : "http:";
          const cookieUrl = `${protocol}//${domain}${path}`;
          chrome.cookies.remove({
            url: cookieUrl,
            name: name,
            storeId: storeId
          })
          updateCookie({
            url: cookieUrl,
            value: e.target.value,
            name,
            storeId,
            expirationDate
          })
          window.location.reload()

        });      
      })    

      // Edit name 
      const cookieName = document.getElementsByClassName('cookieName')
      Array.from(cookieName).forEach((element)=>{
        
        element.addEventListener("change", (e) => {
          const {name, storeId, value, secure, domain, path, expirationDate} = cookies[Number(e.target?.attributes?.[0]?.value)]
          const protocol = secure ? "https:" : "http:";
          const cookieUrl = `${protocol}//${domain}${path}`;
          chrome.cookies.remove({
            url: cookieUrl,
            name,
            storeId,
          })
          updateCookie({
            url: cookieUrl,
            name: e.target.value,
            storeId,
            value,
            expirationDate
          })
          window.location.reload()

        });      
      })    
      //Create cookie 
      let newCookieName;
      let newCookieValue;
      let newCookieLive;


     document.getElementById(ids.nameInput).addEventListener("change", (e) => {
        newCookieName = e.target.value;
      });      
      document.getElementById(ids.valueInput).addEventListener("change", (e) => {
        newCookieValue = e.target.value;
      });      
      document.getElementById(ids.valueDate).addEventListener("change", (e) => {
        newCookieLive = e.target.value;
        console.log(new Date(newCookieLive).getTime());
      });    
      document.getElementById(ids.createButton).addEventListener('click',()=>{

        updateCookie({
          name: newCookieName,
          value: newCookieValue,
          url: tabs[0].url,
          expirationDate: new Date(newCookieLive).getTime()
        })
   
        window.location.reload()

      })
      

  }) 
});
