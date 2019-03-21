# Plotly Charting SDK

## Disclaimer
This SDK is a work in process. Please open an issue as you encounter them and let me know if you have any feedback. Not all features are implemented at this time and bugs may be common for the time being.

## Purpose
The purpose of this SDK is to ease the process of building charting widgets. 
Charts share many things in common:

* Chart Area Styling
* Chart Title
* Chart Axes
    * Styling
    * Naming
    * Position
    * Multiple Axes
* Legends
    * Styling
    * Position
* Data fields
    * Styling
    * Tooltips
* Events
    * Selection
    * Double-click
    * Data bindings
* Services
    * Zoom
    * Pan
    * Resize

Many of these items are the same across charts of all types, or are shared by several subtypes. When creating widgets in Thingworx, every new widget has to solve these problems again for themsevles. This causes a lot of boilerplate code, repetition, large file size of the combined widget javascript files, and makes many things -- such as fixing bugs, improving performance, maintaining old charts, creating new charts, and implementing new features across charts -- very difficult.

This SDK simplifies all of these things by putting common functionality in one place. Contained in this package is a widget extension with a common charting library -- plotly.js, a popular open-source MIT licensed library -- and two custom Thingworx wrapper libraries for the IDE and Runtime, respectively.

## How to use

First, install the current build of the extension, kit.zip, on your instance of Thingworx. This will install Plotly and the two Thingworx libraries. 

Begin widget development as normal.

Example implementations are available in the link at the top of this repository: http://roicentersvn.ptcnet.ptc.com/jmccuen/PlotlyPlots


### IDE
At the beginning of your widget ide.js, add the following:

```javascript
let chart = new TWIDEChart(this,MAX_SERIES,TYPE,MAX_AXES,MULTIPLE_DATASOURCES);
```
Where 'this' is your widget instance and the rest are the parameters as named. Currently supported types are 'pie', '2d', and '3d' -- these may be extended as needs arise. This call will create a new widget for you based on the type of widget you are creating. All you need to do now is implement widgetIconUrl, widgetProperties, renderHtml, and afterRender. Some of these may be moved to the SDK at a later date.

#### widgetIconUrl
Choose the location of your icon url as normal

#### widgetProperties
Most of the standard widget properties are already available and can be grabbed using the following:
```javascript
    this.widgetProperties = function () {
		
		let properties = chart.getProperties();
		properties.name = "Timeseries Plot";
		return properties;
		
	};
```

The chart from above contains the service getProperties() which should return most of the properties that charts have in common. Make sure to set the name of your chart using properties.name. **Additional properties can be added directly to properties.properties**.

*Note*: Thingworx orders properties in the mashup builder based on the order in which they are added to the JSON object. This means extended properties will come at the bottom of the properties object. We are currently working on an approach to solve this problem, so that properties can be inserted in logical places.


#### renderHtml
Render html as normal.

#### afterRender
At the begining of afterRender, makes sure to render the chart:
```javascript
    chart.render();
```
Otherwise, process your after render as normal.

#### Other callbacks
All other callbacks for the IDE are optional and are handled by the SDK. They can be overriden in your widget as you see fit.

### Runtime
At the beginning of your widget runtime.js, add the following:

```javascript	
    let chart = new TWRuntimeChart(this);
```
This will create an instance of the runtime chart with your widget. 

#### renderHtml
Render html as normal.

#### afterRender
At the begining of afterRender, makes sure to render the chart:
```javascript
    chart.render();
```

#### updateProperty

First, make sure to tell the chart a property has been updated:
```javascript
    chart.update(updatePropertyInfo);
```
This ensures that common bindings -- such as Chart Title or Axis Title -- are updated automatically.

Then, handle the update as it relates specifically to your chart. Update property is where most of the work for your widget will happen. Here, you will need to take in an InfoTable and produce the correct format for Plotly to render. Please see https://plot.ly/javascript/ for details. When you have created your data array, call chart.draw(data).

Example data format:
```javascript
var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  mode: 'markers',
  type: 'scatter'
};

var trace2 = {
  x: [2, 3, 4, 5],
  y: [16, 5, 11, 9],
  mode: 'lines',
  type: 'scatter'
};

var trace3 = {
  x: [1, 2, 3, 4],
  y: [12, 9, 15, 12],
  mode: 'lines+markers',
  type: 'scatter'
};

var data = [trace1, trace2, trace3];

chart.draw(data);
```

#### Other Callbacks

All other callbacks are handled by the SDK, but can be overrriden as you see fit


## Helper functions and properties
There are many helper functions exposed to make translating your chart into the correct data format easier. 

### Runtime

```javascript
chart.getXY(it);
```
getXY will take in an infotable and make the data to a values object that is returned. The values object will have a single X axis array and an array of Y Arrays, one for each trace, which are correctly mapped from the YDataField properties.

```javascript
chart.getDynamicXY(it);
```

GetDynamicXY will take an InfoTable and, as long as an X Axis is mapped, will map the remaining items that are NUMBERS or INTEGERS to corresponding traces, even if no selection has been made for the series. The NumberOfSeries properties are still enforced.

```javascript
chart.layout
chart.chartData
chart.chartInfo
```

chart.layout is the layout object that the charting SDK uses when rendering Plotly. You have full access to this and can update it at any time. You can also call Plotly directly on the chart div, using functions such as relayout, as necessary.

chart.chartData is the actual dataset that Plotly is rendering. You can make modifications directly to this item and update any changes with Plotly.react

chart.chartInfo is an object you can use to store any additional information you would like to about your chart for future reference. This object is not used by the charting SDK.


