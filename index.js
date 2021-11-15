import { BarChart } from './src/charts/bar-chart.js';
import { BarLineChart } from './src/charts/bar-line-chart.js';
import './src/chart-changer.js';

window.customElements.define('bar-chart', BarChart);
window.customElements.define('bar-line-chart', BarLineChart);
