const randomNum = (max) => {
  return Math.floor(Math.random() * max)
}

const randomColor = () => {
  const arrColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
  let color = '#';
  for (let i = 0; i < 6; i++) {
    const index = randomNum(16)
    const element = arrColors[index];
    color = `${color}${element}`
  }
  return color;
}

export default randomColor;
