# \<d2l-bar-chart>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i d2l-bar-chart
```

## Usage

```html
<script type="module">
  import 'd2l-bar-chart/d2l-bar-chart.js';
</script>

<d2l-bar-chart></d2l-bar-chart>
```

## Properties

### Events

- `@point-click` -> Point : Event is triggered when a bar in the chart is clicked. Parameter is the selected bars index.

### Attributes

- `data` : Array to be displayed
- `x-header` : Header drawn on the x axis
- `y-header` : Header drawn on the y axis
- `color` : Object
  - `color` : Color for all Bars when no Bars are selected
  - `active-color` : Color of a Bar when it is selected
  - `inactive-color` : Color of a Bar when it is not selected
- `tooltip` : Object
  - `formatter (Point) -> String` : Callback function that takes the hovered bar's index and returns a tooltip message
  - `style` : Class overrides for the tooltip
- `options` : Object (All of the above in JSON)

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
- [ ] Hovering shows tooltips
- [ ] Color change when selected
- [ ] Updates when data changes
- [ ] Animates when data changes
