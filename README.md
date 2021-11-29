# \<gg-chart>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i @brightspaceuilabs/gg-chart
```

## Usage

```html
<script type="module">
  import 'gg-chart/src/gg-chart.js';
</script>

<d2l-bar-chart></d2l-bar-chart>
```

## Properties

### Events

- `@point-click` -> Point : Event is triggered when a bar in the chart is clicked. Parameter is the selected bars index.

### Attributes

- `aes` : The charts aesthetics, keys from the data records in axis order. 0 -> x, 1 -> y
- `geom` : The visual data representation. `bar`, `line`, `point`
- `scale` : A JSON string that defines the axis names, limits, and breaks.
- `stats` : Statistical additions, `xmean`, `ymean`, `bin:{width}`
- `coord` : Coordinate system, `polar:x`, `polar:y`, `flip`
- `tooltip` : Which elements you want the tooltip to show on, `point`, `area` 
- `pos` : Where the geoms should be positioned. `stacked`, `dodged`
- `theme` : The charts styling theme 
- `legend` : Toggles the legend, `hidden`
- `data` : The data as a JSON string
- `width` : The width in pixels
- `height` : The height in pixels
- `.style` : A css object for selective styles.


## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

## Tasks
Proof of Concept
- [x] Draws Axis
- [x] Draws labels and numbers
- [x] Draws headings
- [x] Accepts data
- [x] Keyboard navigable
- [x] Hovering shows tooltips
- [x] Updates when data changes
- [x] Animates when data changes
