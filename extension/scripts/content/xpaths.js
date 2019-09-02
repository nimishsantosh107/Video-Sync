//UTIL FUNCTIONS
function getElementByXpath(path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}

//XPATHS
const youtubeVideoFirefox = `/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[3]/div[1]/div/div[1]/div/div/div/ytd-player/div/div/div[1]/video`;
const youtubeVideoChrome = `//*[@id="movie_player"]/div[1]/video`;