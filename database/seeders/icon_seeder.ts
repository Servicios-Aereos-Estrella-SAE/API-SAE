import Icon from '#models/icon'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Icon.createMany([
      {
        iconName: 'Holiday Tree',
        iconSvg:
          '<?xml version="1.0" ?><svg id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">.st0{fill:#333333;}</style><g><path class="st0" d="M350.9,364.4c-3.2-0.3-6.4-0.5-9.7-0.5c-15.1,0-29.5,3.4-42.3,9.4c-16.1-19-36.9-33.9-60.8-42.7   c-4-1.5-8.2-2.8-12.4-3.9c-12.1-3.3-24.7-5-37.8-5c-17,0-33.2,2.9-48.3,8.3c-55.4,19.6-95.4,71.9-96.7,133.8H441   C441,411.9,401.5,369.3,350.9,364.4z M153.8,370.3c-28.2,10-50.6,31.9-61.5,60.1c-1.1,2.8-3.7,4.5-6.5,4.5c-0.8,0-1.7-0.1-2.5-0.5   c-3.6-1.4-5.4-5.4-4-9c12.3-32.1,37.8-56.9,69.9-68.3c3.7-1.3,7.6,0.6,8.9,4.3C159.4,365.1,157.5,369,153.8,370.3z"/><path class="st0" d="M322.9,235.9c15.3,0,27.2,5.8,32.4,8.8c3.9-20.7,8.8-39.8,13.3-55.6l-30.4-12.3l-0.2-0.8   c-50.5,41.2-79.2,95.5-95.5,141.3c0.1,0,0.3,0.1,0.4,0.2c22.5,8.3,43,21.7,59.7,39.1c12.3-4.5,25.2-6.7,38.5-6.7   c2.5,0,5.1,0.1,7.6,0.3c-1.1-10.3-1.6-20.9-1.5-31.6c-0.7,0.2-1.4,0.3-2,0.3c-1.1,0-2.2-0.3-3.3-0.8c-0.3-0.2-21.5-11.3-41.5-11.3   c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7c21.4,0,42.6,10.2,47.2,12.5c0.8-15.7,2.6-31.3,5-46.3c-1-0.2-2-0.6-2.9-1.2   c-0.2-0.2-11.5-7.9-27-7.9c-3.9,0-7-3.1-7-7C315.9,239,319.1,235.9,322.9,235.9z"/><path class="st0" d="M413.4,95.4c0,0-22.8-57.2-94.8-45.6c0,0,30.5,17.5,27.4,42.5c0,0-48.5-26.7-98.7,30.2c0,0,92.3-4.9,103,44.1   l22.3,9c0,0,61.7,7.8,63.8,58.8c0,0,27.9-31.1,15.8-69.5c0,0,24.8-1.6,32.1,20C484.4,185,505.8,92.3,413.4,95.4z"/><path class="st0" d="M171.9,233.6c-6.8-7.6-14.3-14.9-22.6-21.8l-0.2,0.7l-26.4,10.7c6.9,24.5,14.6,58.3,16.4,92.1   c15.7-5,32.1-7.6,48.7-7.6c10.7,0,21.4,1.1,31.8,3.2c-2-5-4.3-10-6.7-15.1c-1.1,0.5-2.3,0.8-3.6,0.7c-0.3,0-26.8-1.8-39.1-0.1   c-0.3,0-0.6,0.1-1,0.1c-3.4,0-6.4-2.5-6.9-6c-0.5-3.8,2.1-7.4,6-7.9c10.6-1.5,29.3-0.7,37.6-0.3c-6.8-12.6-15-25.2-24.6-37.3   c-0.8,0.7-1.8,1.2-2.8,1.4c-7.9,1.9-16.3,4.7-18.1,6.1c-1.4,1.3-3.1,2-4.9,2c-1.8,0-3.6-0.7-4.9-2.1c-2.7-2.7-2.7-7.2,0-9.9   C154.6,238.7,164.6,235.5,171.9,233.6z"/><path class="st0" d="M53.6,201c-9.9,31.5,13,57,13,57c1.7-41.9,52.3-48.2,52.3-48.2l18.3-7.4c8.7-40.2,84.4-36.2,84.4-36.2   c-41.2-46.6-80.9-24.8-80.9-24.8c-2.6-20.4,22.5-34.8,22.5-34.8c-59-9.5-77.7,37.4-77.7,37.4c-75.7-2.6-58.1,73.4-58.1,73.4   C33.3,199.7,53.6,201,53.6,201z"/></g></svg>',
      },
      {
        iconName: 'Birthday Cake',
        iconSvg:
          '<?xml version="1.0" ?><svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M232 160c-4.42 0-8 3.58-8 8v120h32V168c0-4.42-3.58-8-8-8h-16zm-64 0c-4.42 0-8 3.58-8 8v120h32V168c0-4.42-3.58-8-8-8h-16zm224 0c-4.42 0-8 3.58-8 8v120h32V168c0-4.42-3.58-8-8-8h-16zm64 0c-4.42 0-8 3.58-8 8v120h32V168c0-4.42-3.58-8-8-8h-16zm88 8c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v120h32V168zm-440-8c-4.42 0-8 3.58-8 8v120h32V168c0-4.42-3.58-8-8-8h-16zm520 0h-32c-8.84 0-16 7.16-16 16v112c0 17.67-14.33 32-32 32H352V128c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v192H96c-17.67 0-32-14.33-32-32V176c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v112c0 53.02 42.98 96 96 96h192v64H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16H352v-64h192c53.02 0 96-42.98 96-96V176c0-8.84-7.16-16-16-16zm-16-32c13.25 0 24-11.94 24-26.67S608 48 608 48s-24 38.61-24 53.33S594.75 128 608 128zm-576 0c13.25 0 24-11.94 24-26.67S32 48 32 48 8 86.61 8 101.33 18.75 128 32 128zm288-48c13.25 0 24-11.94 24-26.67S320 0 320 0s-24 38.61-24 53.33S306.75 80 320 80zm-208 48c13.25 0 24-11.94 24-26.67S112 48 112 48s-24 38.61-24 53.33S98.75 128 112 128zm64 0c13.25 0 24-11.94 24-26.67S176 48 176 48s-24 38.61-24 53.33S162.75 128 176 128zm64 0c13.25 0 24-11.94 24-26.67S240 48 240 48s-24 38.61-24 53.33S226.75 128 240 128zm160 0c13.25 0 24-11.94 24-26.67S400 48 400 48s-24 38.61-24 53.33S386.75 128 400 128zm64 0c13.25 0 24-11.94 24-26.67S464 48 464 48s-24 38.61-24 53.33S450.75 128 464 128zm64 0c13.25 0 24-11.94 24-26.67S528 48 528 48s-24 38.61-24 53.33S514.75 128 528 128z"/></svg>',
      },
      {
        iconName: 'Fireworks',
        iconSvg:
          '<?xml version="1.0" ?><svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:#0072ff;}</style></defs><title/><g data-name="Layer 2" id="Layer_2"><circle class="cls-1" cx="51.97" cy="39.16" r="2.16"/><circle class="cls-1" cx="47.06" cy="48.32" r="1.08"/><circle class="cls-1" cx="10.52" cy="11.68" r="1.08"/><circle class="cls-1" cx="57.67" cy="44.59" r="1.08"/><circle class="cls-1" cx="17.19" cy="6" r="1.08"/><circle class="cls-1" cx="58.75" cy="56.96" r="1.08"/><path class="cls-1" d="M22.54,15.73a.68.68,0,0,0,0-1L22,14.2a.68.68,0,0,0-1,0l-.57.57a.68.68,0,0,1-1,0l-.57-.57a.68.68,0,0,0-1,0l-.57.57a.68.68,0,0,0,0,1l.57.57a.68.68,0,0,1,0,1l-.57.57a.68.68,0,0,0,0,1l.57.57a.68.68,0,0,0,1,0l.57-.57a.68.68,0,0,1,1,0l.57.57a.68.68,0,0,0,1,0l.57-.57a.68.68,0,0,0,0-1L22,17.26a.68.68,0,0,1,0-1Z"/><path class="cls-1" d="M49.29,54.52l-.3.3a.36.36,0,0,1-.51,0l-.3-.3a.36.36,0,0,0-.51,0l-.3.3a.36.36,0,0,0,0,.51l.3.3a.36.36,0,0,1,0,.51l-.3.3a.36.36,0,0,0,0,.51l.3.3a.36.36,0,0,0,.51,0l.3-.3A.36.36,0,0,1,49,57l.3.3a.36.36,0,0,0,.51,0l.3-.3a.36.36,0,0,0,0-.51l-.3-.3a.36.36,0,0,1,0-.51l.3-.3a.36.36,0,0,0,0-.51l-.3-.3A.36.36,0,0,0,49.29,54.52Z"/><path class="cls-1" d="M27.93,11.68h.55a.47.47,0,0,0,.47-.47v-.55a.47.47,0,0,1,.47-.47H30a.47.47,0,0,0,.47-.47V9.16A.47.47,0,0,0,30,8.69h-.55A.47.47,0,0,1,29,8.22V7.67a.47.47,0,0,0-.47-.47h-.55a.47.47,0,0,0-.47.47v.55a.47.47,0,0,1-.47.47h-.55a.47.47,0,0,0-.47.47v.55a.47.47,0,0,0,.47.47H27a.47.47,0,0,1,.47.47v.55A.47.47,0,0,0,27.93,11.68Z"/><path class="cls-1" d="M36.53,53.64H36a.47.47,0,0,0-.47.47v.55a.47.47,0,0,1-.47.47h-.55a.47.47,0,0,0-.47.47v.55a.47.47,0,0,0,.47.47H35a.47.47,0,0,1,.47.47v.55a.47.47,0,0,0,.47.47h.55a.47.47,0,0,0,.47-.47V57.1a.47.47,0,0,1,.47-.47H38a.47.47,0,0,0,.47-.47v-.55a.47.47,0,0,0-.47-.47h-.55a.47.47,0,0,1-.47-.47v-.55A.47.47,0,0,0,36.53,53.64Z"/><path class="cls-1" d="M12.23,27.57h.48a.41.41,0,0,0,.41-.41v-.48a.41.41,0,0,1,.41-.41H14a.41.41,0,0,0,.41-.41v-.48A.41.41,0,0,0,14,25h-.48a.41.41,0,0,1-.41-.41v-.48a.41.41,0,0,0-.41-.41h-.48a.41.41,0,0,0-.41.41v.48a.41.41,0,0,1-.41.41h-.48a.41.41,0,0,0-.41.41v.48a.41.41,0,0,0,.41.41h.48a.41.41,0,0,1,.41.41v.48A.41.41,0,0,0,12.23,27.57Z"/><path class="cls-1" d="M56.66,4,37.47,6.13a1.11,1.11,0,0,0-.84,1.66A53,53,0,0,0,44,17.57l0,0a1.68,1.68,0,0,1,0,2.34l-.69.69a1.68,1.68,0,0,1-2.4,0,57.31,57.31,0,0,1-4.63-5.54,1.67,1.67,0,0,0-2.53-.18l-20.6,20.6a4,4,0,0,0-.39,5.23A55.13,55.13,0,0,0,23.3,51.19a4,4,0,0,0,5.23-.39l24.7-24.7a1.66,1.66,0,0,0,.29-.41q1.38.93,2.72,1.71a1.11,1.11,0,0,0,1.66-.84L60,7.37A3,3,0,0,0,56.66,4ZM34.31,37.71H27.52a1.23,1.23,0,0,1-1.23-1.23v-6.6a3.53,3.53,0,0,1,3.22-3.59,3.4,3.4,0,0,1,3.59,3.4V30.9h1a3.53,3.53,0,0,1,3.59,3.22A3.4,3.4,0,0,1,34.31,37.71Z"/><path class="cls-1" d="M5.21,59.11a3.53,3.53,0,0,0,4.89-.2c2-2.07,4.29-4.33,6.11-6a1.76,1.76,0,0,0,0-2.6q-.59-.55-1.17-1.12t-1.24-1.3a1.78,1.78,0,0,0-2.52-.17c-1.18,1.06-2.59,2.4-4.29,4.1C6.26,52.62,5.58,53.32,5,54a3.54,3.54,0,0,0,.19,5.11Z"/></g></svg>',
      },
    ])
  }
}