import { css } from '@emotion/core';

export const wrapper = css`
  position: relative;
  transform: translate3d(0px, 0px, 0px);
`

export const slider = css`
  width: auto;
  overflow: visible;
  background-color: #000;
  height: 100vh;
  &:after, &:before {
    content: '';
    display: table;
  }
  &:after {
    clear: both;
  }
`;

export const slide = css`
  width: 100vw;
  margin-left: 20px;
  margin-right: 20px;
  width: 100vw;
  height: 100%;
  min-width: 100vw;
  position: relative;
  float: left;

  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;


export const hook = css`
  border: 1px solid #efefef;
  background: #fff;
  border-radius: 10px;
  width: 120px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  position: absolute;
  margin: auto;
  bottom: 10px;
  left: 0px;
  right: 0px;
`;