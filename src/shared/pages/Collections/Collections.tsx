import React from 'react';
import flipTo from 'shared/utils/flipTo';
import getSlider, { SLIDE_EVENTS } from './slider';
import * as styles from './styles';


const slides = ['red', 'blue', 'cyan'];

// What should happen when hook is toggled:
// - FLIP the Slider,
// - Disable the slider? Turn off events, and flip the slider itself

class Collections extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.slideRefs = [];
    this.hookRefs = [];
    this.state = {
      currentSlide: 0,
      showItemDetails: false,
    };
    // Start prefetching images
  }

  createRef = (ref) => {
    this.slideRefs.push(ref);
  }

  createHookRef = (ref) => {
    this.hookRefs.push(ref);
  }

  onSlideChange = (currentSlide) => {
    this.setState({
      currentSlide: currentSlide,
    });
  }

  _toggleSliderOn = (e) => {
    // Toggle body overflow
    console.log("enabling slider");
    this.setState({
      showItemDetails: false,
    }, () => {
      document.body.style.overflow = 'hidden';
    });
  }

  _toggleSliderOff = (e) => {
    this.toggleSliderOff({
      activeHook: e.target,
    });
  }

  toggleSliderOff = ({ activeHook }) => {
    // Toggle body overflow
    this.slideManager.setSliderState(false);
    document.body.style.overflow = 'visible';
    this.setState({
      showItemDetails: true,
    }, () => {
      // Reset transforms completely
      activeHook.style.opacity = 0;
      activeHook.style.transform = '';
      activeHook.style.position = 'absolute';
      activeHook.style.right = '5px';
      activeHook.style.bottom = '0px';
      activeHook.style.left = 'auto';
      activeHook.style.opacity = 1;
      flipTo(this.$slider, ($target) => {
        $target.style.height = '50vh';
        $target.style.width = '100vw';
        $target.style.overflow = 'hidden';
      });
    });
  }

  componentDidMount() {
    this.slideManager = getSlider(this.$slider, {
      slideCount: slides.length,
      slideRefs: this.slideRefs,
      slideHookRefs: this.hookRefs,
    });
    this.slideManager.init();
    this.slideManager.on(SLIDE_EVENTS.HOOK_TOGGLE, this.toggleSliderOff);
  }

  render() {
    console.log("re-rendering");
    return (
      <div ref={ref => this.$sliderWrapper = ref} css={styles.wrapper(this.state)}>
        <div
          ref={ref => this.$slider = ref}
          css={styles.slider}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              ref={this.createRef}
              style={{
                background: slide,
              }}
              css={styles.slide}
            >
              <div
                onClick={this.state.showItemDetails ? this._toggleSliderOn : this._toggleSliderOff}
                ref={this.createHookRef}
                css={styles.hook}
              >

              </div>
            </div>
          ))}
        </div>
        {this.state.showItemDetails && <p>

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacinia facilisis lacus, quis volutpat nunc tincidunt eu. Suspendisse facilisis rhoncus sapien, sodales dictum erat vulputate vel. Vivamus euismod eu nibh eget consectetur. Nullam aliquam scelerisque neque, eget scelerisque felis pharetra vitae. Praesent quis enim et tellus tempor scelerisque in at velit. Phasellus ac odio lectus. In augue est, gravida eu est in, vulputate mattis libero. Nunc consequat commodo pretium.

          Ut sollicitudin ligula tortor, nec tempus magna vulputate vestibulum. Suspendisse nec odio eu ex dapibus finibus. Integer non nisl a est aliquam porta. Nunc sed lectus id urna hendrerit porta. Duis feugiat, lectus non fermentum suscipit, ante ex auctor velit, vitae suscipit velit dolor nec lacus. Phasellus sit amet posuere odio. Integer rutrum orci ut mauris placerat, nec dapibus tellus sagittis. Nam justo enim, interdum nec elit vehicula, malesuada eleifend magna. Curabitur lacinia enim risus, at malesuada massa fringilla vehicula. Quisque efficitur neque non dignissim efficitur. Maecenas tellus sapien, convallis non eros sed, vehicula fringilla lorem. Nullam viverra erat sit amet porttitor facilisis. Aenean cursus ante congue massa lobortis, vitae feugiat nisl pharetra. Sed feugiat eros elit. Maecenas sed aliquam arcu, ac condimentum magna.

          Nunc convallis libero quis quam fringilla porta. Morbi porta massa et erat fringilla tincidunt. Nunc ut euismod ex. Duis imperdiet, arcu eu commodo elementum, orci est vestibulum diam, sit amet varius quam dui a est. Duis tincidunt consectetur ex, sed dapibus erat mattis nec. Nam dignissim nulla turpis, non lobortis orci condimentum in. Aenean dapibus interdum nulla at aliquet. Pellentesque tristique nisl eu justo tempus, ac placerat lacus posuere. Proin et felis sed mauris cursus eleifend. Etiam ut erat scelerisque, pellentesque nisi et, imperdiet diam.

          Suspendisse convallis convallis lectus, nec fermentum enim. Cras sed vehicula sapien. Nulla facilisi. Nulla facilisi. Curabitur sed nisl ac velit scelerisque sagittis ut ut lorem. Nullam dapibus tincidunt euismod. Cras ultrices suscipit commodo. Proin eget pellentesque eros, vitae dictum mi. Vivamus ornare velit vitae neque laoreet, eget sodales orci sodales. Cras ultrices ante diam. In et sem in tellus tincidunt rhoncus at sed massa. Mauris faucibus placerat metus, et sodales purus luctus at. Aliquam hendrerit ullamcorper nulla id vulputate.

          Cras quis leo dignissim, fringilla eros ultrices, placerat ante. Maecenas ornare nisi sit amet massa tincidunt, aliquet convallis dui ornare. In aliquet massa purus, vitae scelerisque erat semper non. Pellentesque venenatis justo quis posuere cursus. Phasellus ut rutrum nisl, sodales posuere leo. Vivamus malesuada, enim vitae sodales ultricies, tortor lectus fermentum augue, non cursus lectus mauris posuere sem. Sed vestibulum molestie erat ac volutpat. Suspendisse potenti. Ut tempor varius risus, sit amet commodo neque dapibus vitae. Cras sodales nulla augue, et dapibus erat faucibus at. Etiam posuere justo fringilla, pellentesque augue in, vestibulum sem. Suspendisse pretium, libero at sagittis scelerisque, tellus nibh dictum ligula, convallis viverra arcu ipsum eu odio. In ac mi eget orci volutpat dictum at quis odio. Vestibulum blandit ligula sit amet varius dapibus. Aliquam ut feugiat nibh, placerat molestie dui. Vestibulum tincidunt iaculis mattis.


        </p>}
      </div>
    )
  }
}

export default Collections;