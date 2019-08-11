function addCookie(cookieKey, cookieValue, overSeconds) {
  document.cookie = `${cookieKey}=${cookieValue};path=/;max-age=${overSeconds}`;
}
function deleteCookie(cookieKey) {
  // 方式一
  document.cookie = `${cookieKey}=;max-age=-1`;
  // 方式二 addCookie(cookieKey,"",-1)
}
function getCookie(cookieKey) {
  const arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    const arr2 = arr[i].split('='); // 遍历时，arr2[0]存储此时的key，arr[1]存储key对应的value值
    if (arr2[0].trim() === cookieKey) {
      // 找出该key值
      return arr2[1];
    }
  }
}
function isCookieKey(cookieKey) {
  const arr = document.cookie.split(';');
  for (let i = 0; i < arr.length; i++) {
    const arr2 = arr[i].split('=');
    if (arr2[0].trim() === cookieKey) { // 找出该key值
      return true;
    }
  } return false;
}
export { addCookie, deleteCookie, getCookie, isCookieKey }
