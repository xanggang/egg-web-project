
/*
*@param Number NameLength 要获取的名字长度
*/
export function getRandomName(nameLength: number) {

  function randomAccess(min, max){
    return Math.floor(Math.random() * (min - max) + max)
  }

  function decodeUnicode(str) {
    //Unicode显示方式是\u4e00
    str = "\\u"+str
    str = str.replace(/\\/g, "%");
    //转换中文
    str = unescape(str);
    //将其他受影响的转换回原来
    str = str.replace(/%/g, "\\");
    return str;
  }

  let name = ""
  for(let i = 0;i < nameLength; i++){
    let unicodeNum  = ""
    unicodeNum = randomAccess(0x4e00,0x9fa5).toString(16)
    name += decodeUnicode(unicodeNum)
  }

  return name
}