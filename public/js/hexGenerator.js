const hexGenerator = () => {
  this.hexValues = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
  const hex = [];
  for (let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * 16);
    hex.push(hexValues[index])
  }
  return `#${hex.join('')}`;
};

