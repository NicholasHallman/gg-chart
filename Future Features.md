# Features

Currently gg-chart support a reasonable number of features but has some limitations. This document looks to acknowledge these limitations, demonstrate how they can be overcome, and propose ways they can be fixed and encourage discussion as to whether they should or shouldn't be.

# Additional data types

## Strings (1)

ggplot2 could support grouping and showing data by string types. Currently, gg-chart supports grouping by strings but has not good way of showing string data on the axis due to the way that the axis calculate defaults. Currently axis are calculated by
 - Finding the minimum and maximum value in an aesthetic (Impossible with strings)
 - Finding the difference between those and the finding a number between 2 and 10 the can evenly divide the difference
 - If this is not possible (because the difference is prime) increase the maximum value by 1.
 - Use the found reasonable break size to generate the breaks array.

A work around for string categories is to
 - Replace the strings in the data with number id's that increment from 0
 - In the scale, define the breaks array as an array of strings, with the last value an empty string
 - If you are using categories hope that the reasonable breaks system doesn't hide any essential labels.

For strings we could
 - Find out how many unique strings there are in the data and store them in a set.
 - We don't calculate reasonable breaks for strings since they are categories and can't be excluded.
 - Show all the categories on the axis in order of appearance. Otherwise, if the breaks array is defined use it to reference the placement on the axis.

## Dates (1)

highcharts seems to have native support for dates somehow. If it sees a date timestamp number it shows a formatted date in the tooltip. gg-chart doesn't do this and would require you to use the tooltip formatter and format the date. Highcharts also has a breaks formatter and places dates on the axis simply by parsing the number which is compatible with how gg-chart would interpret dates (using the existing reasonable breaks detection system). 

Currently to show dates in the axis you would
 - Ensure that dates are stored as a number timestamp in the record
 - Write a function to produce the wanted breaks for the number of days yourself (complicated. prone to failure)
 - Use the tooltip formatter to format the dates to the correct format

Improvement
 - Ensure the dates are a number timestamp still
 - Give gg-chart a break formatter that takes the current value as input and returns the formatted date (much simpler)
 - Give gg-chart a tooltip formatter that takes the point as input and returns the formatted tooltip string

# Positions (5 - 13)

Better support for positions across geom types. Currently the only supported positions are `stacked` and `dodged` for bar charts which produce the stacked bar chart and dodged bar chart respectively. It would be useful for the default position to be `Neither` instead of `stacked` so that line charts can show multiple different data groups in one plot. E.g. Grade Trends in Learner Engagement

AQ
 - Change the default pos to none
 - Allow other geoms to render grouped data.
 - Allow other geoms to render stacked data (stacked area charts)
 - Allow other geoms to render dodged data (dodged box and whisker plot) (???)

# Accessibility

Accessibility is crucial to our goals at D2L for helping the world learn. Part of that mission is making sure that everyone has the same access to information and it is our job to remove those barriers. Leveraging keyboard controls and screen readers is a goo first step to implementing accessibility in gg-chart to ensure compatibility with Highcharts.

### Stage 1 (5)
 - Aria Labels
   - Chart component label will read the title, and names of the x and y axis along with any other groupings
     - `Time in Content vs Grade. X Grades, Y Time in Content`
     - `Grades Over Time. X Date, Y Current Grade (%), Color Courses`
   - Point label will have the same terms as the tooltip unless an point accessibility formatter is provided
     - `Friday, Feb 7, 2020. French Literature: 82%`
   - Area labels will have the same terms as the tooltip unless an area accessibility formatter is provided
     - `3 user enrollments are getting an above average grade and spending above average time in content.`
   - Legend aria labels are the next element in the tab index after the chart and will read out `Legend, {legend name}, {group type}`
     - Group type is excluded if only one legend is drawn.
   - Legend label aria labels read out the label value. `French Literature`
 - Keyboard navigation
   - The chart is tab indexable, the chart title (h3) is indexible with h (the header navigation shortcut)
   - Legends are tab indexable, the next legend title (h4) is indexible with h (the header navigation shortcut)
   - Make the title header level over-ridable by allowing the user to provide a header using an html block. Or by introducing a gg-chart master config
   - The chart entires are arrow key navigable.
     - Left and right arrow goes to the next value in a grouping.
     - Up and down arrows move between groupings
       - In current grade, up and down do nothing, left and right move to the next number of students in a grade bin
       - In Grades over Time, up and down move between courses, left and right move between days in a course.
   - Legend labels are arrow key navigable.

### Stage 2 

Proposal: Charts as applications inside a document flow.

The hope with stage 2 is we can provide tools that allow screen reader and keyboard navigators the ability to summaries the data by giving them quick access to statistically important data points.
  - Provide keyboard shortcuts that communicate additional points of interest for the chart
  - Chart component will now read the title, aesthetics, and any additional statistical features the chart uses.
    - x: Focuses the x axis
    - y: Focuses the y axis
    - t: Reads the trend in the data for line of best fit (up, down, flat)
    - a: Focuses the max value for the focused axis (xa focuses the largest value on the x axis, reading that points label)
    - i: Focuses the min value for the focused axis (xi focuses the smallest value on the x axis, reading that points label)

Planning on working closely with UX to understand their goals in a "Better than highcharts" accessible system. 

# Testing (5)

Currently there are no tests that guarantee the consistent behavior of charts or the outcome of a grammar term. 

Unit tests
 - Aes parser
 - Coord parser
 - Pos parser
 - Scale
   - Should create limits if they don't exist
   - Should create breaks if they don't exist
   - Should not calculate limits if they are given
   - Should not calculate breaks if they are given
 - Stats
   - Should parse properly
   - Should calculate xmean if specified
   - Should calculate ymean if specified
   - Should calculate area aggregates when xmean or ymean are defined
   - Should calculate bins when a bin width is given
 - Coord
   - Should parse properly
   - Should flip aes if flip is defined
   - Should parse records into points when polar is defined
   - Should calculate X as theta when polar X is defined
   - Should calculate Y as theta when polar Y is defined
 - Prefabs
   - Should pass accessibility tests

Visual Diff
 - Row chart
 - Column chart
 - Line chart
 - Area chart
 - Pie chart
 - Scatter plot

# Optimization (5)
 - Run the performance observer in dev tools and find long running scripts. (Spike)
 - Add the ability to add the data as an attribute instead of copying it.
 - Create a sub object inside the host to store the original attributes and modify a main object instead of deep copying the host between pipeline steps.
 - Detect when a tooltip property is updated, and if it is, don't rerun the pipeline.

# Prefabs (13)

It would be great to have some prebuilt chart types that developers can just import. E.g
```javascript
  html`
    <d2l-bar-chart
      data="${data}"
    ></d2l-bar-chart>
  `
```

The `d2l-bar-chart` component would implement all the defaults for the bar chart and expose some additional options. For developers that want more control it also gives them an example of the grammar terms that make up a chart archetype, serving as an educational tool. 

Preferably we would make
 - row
 - column
 - scatter plot
 - line
 - area
 - pie

charts and offer them as imports through the library like 

`import '@brightspaceuilabs/gg-chart/prefabs/row.js'` 

# Known bugs
 - Pie chart NaN bug. [Major]
 - Pie chart visual flickering. [Minor]
 - Grouping complications
