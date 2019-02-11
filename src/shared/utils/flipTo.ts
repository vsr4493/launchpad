const flipTo = (el: HTMLElement, setFinalPos: Function, onFinish?: Function) => {
  const currentPos = el.getBoundingClientRect();
  setFinalPos(el);
  const nextPos = el.getBoundingClientRect();
  // Now the element is at the final position
  // We want to the get the delta that allows us to get it back to its original position
  // This means -(x2 - x1) and -(y2 - y1), as the direction is inverted
  const deltaX =  -(nextPos.left - currentPos.left);
  const deltaY =  -(nextPos.top - currentPos.top);
  const deltaW = currentPos.width/nextPos.width;
  const deltaH = currentPos.height/nextPos.height;
  // Now that we have the delta values, we can move the element back to the original position
  // Using transform, with animate API...set to original pos with transform

  const a = el.animate([{
    transformOrigin: 'top left',
    transform: `
      translate3d(${deltaX}px, ${deltaY}px, 0px)
      scale(${deltaW}, ${deltaH})
    `
  }, {
    transformOrigin: 'top left',
    transform: 'none',
  }], {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'both',
  });
  a.onfinish = onFinish;
}

export default flipTo;