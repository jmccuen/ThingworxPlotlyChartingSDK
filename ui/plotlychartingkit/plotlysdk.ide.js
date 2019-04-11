/*
    This file is essentially a partial class for a charting widget in the mashup builder
    it has functions to help generate standard chart properties and it
    extends the widget by adding additional function callbacks so they 
    do not need to be called by the instance of the chart widget for every chart.

    All chart settings can be found in the Plotly reference documentation: https://plot.ly/javascript/reference
*/ 
function TWIDEChart(widget, maxSeries, type, maxAxes, multipleData) {

    this.MAX_SERIES = maxSeries;
    this.MAX_AXES = maxAxes;
    let layout = new Object();
    let chartId;
    let chart = this;

    //Get all the standard properties for charts. These properties are shared across all charts by types
    //Sometimes I will not group together things in if statements, such as if !== pie. This is because
    //the order the properties are added is the order they appear in the composer
    this.getProperties = function() {
        let properties = new Object();

        if (type !== 'pie') {
            properties.NumberOfSeries = {
                'description': 'Number of series in the chart',
                'defaultValue': 1,
                'baseType': 'NUMBER',
                'isVisible': true
            };
        };

        if (multipleData) { 
            properties.SingleDataSource = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.single-data-source.description'),
                'defaultValue': true,
                'baseType': 'BOOLEAN',
                'isVisible': true
            };
        };

        properties.Data = {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.data.description'),
            'isBindingTarget': true,
            'isEditable': false,
            'baseType': 'INFOTABLE',
            'warnIfNotBoundAsTarget': true
        };

        properties.ChartImage = {
            'description': '',
            'baseType': 'IMAGE',
            'isBindingSource': true,
            'defaultValue': ''
        };

        properties.ImageWidth = {
            'description': '',
            'baseType': 'INTEGER',
            'isBindingSource': true,
            'defaultValue': 400
        };

        properties.ImageHeight = {
            'description': '',
            'baseType': 'INTEGER',
            'isBindingSource': true,
            'defaultValue': 400
        };

        properties.ChartMargin = {
            'description': 'Top, Right, Bottom, Left',
            'baseType': 'STRING',
            'isVisible': true,
            'defaultValue': '100, 80, 80, 80'
        };

        properties.ShowAnimation =  {
            'description': 'Show animation',
            'baseType': 'BOOLEAN',
            'defaultValue': false
        };

        properties.ShowTitle =  {
            'description': 'Show title',
            'baseType': 'BOOLEAN',
            'defaultValue': true
        };

        properties.SelectedItemStyle = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'defaultValue': 'DefaultChartSelectionStyle'
        };

        properties.ChartTitle = {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.chart-title.description'),
            'baseType': 'STRING',
            'isBindingTarget': true,
            'defaultValue': '',
            'isLocalizable': true
        };

        properties.ChartTitleStyle = {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.chart-title-style.description'),
            'baseType': 'STYLEDEFINITION',
            'defaultValue': 'DefaultChartTitleStyle'
        };

        properties.ChartTitleX = {
            'description': 'Position from 0-1',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0.5
        };

        properties.ChartTitleY = {
            'description': 'Position from 0-1 or auto',
            'baseType': 'STRING',
            'isVisible': true,
            'defaultValue': 'auto'
        };

        properties.ShowLegend =  {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.show-legend.description'),
            'baseType': 'BOOLEAN',
            'defaultValue': true
        };

        properties.LegendOrientation = {
            'description': '',
            'baseType': 'STRING',
            'defaultValue': 'h',
            'selectOptions': [
                {'value': 'h', 'text': 'Horizontal'},
                {'value': 'v', 'text': 'Vertical'}
            ]
        };

        properties.LegendStyle = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'defaultValue': 'DefaultChartTitleStyle'
        };

        properties.AllowSelection =  {
            'description': 'Allow Selection',
            'baseType': 'BOOLEAN',
            'defaultValue': false
        };

        properties.Width = {
            'description': 'Total width of the widget',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 400
        };

        properties.Height =  {
            'description': 'Total height of the widget',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 400
        };

        if (type != 'pie') {
            
            properties.NumberOfXAxes =  {
                'description': 'Number of X Axes',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 1
            };

            properties.NumberOfYAxes =  {
                'description': 'Number of Y Axes',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 1
            };

            properties.XAxisField = {
                'description': TW.IDE.I18NController.translate('tw.xychart-ide.properties.x-axis-field.description'),
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isVisible': true
            };
            //Need to get properties for X and Y unless I am a pie chart
            //TODO: Add something for Z for 3d charts. It should be similar
            properties = getAxisProperties(properties,'X');
            properties = getAxisProperties(properties,'Y');
            properties = getSeriesProperties(properties);

        }

        let result = {
            'category': ['Data', 'Charts'],
            'supportsLabel': false,
            'supportsAutoResize': true,
            'borderWidth': '1',
            'defaultBindingTargetProperty': 'Data',
            'properties': properties
        }

        return result;

    }
    //This renders an example chart, so you can see it in the mashup builder. May replace with a static image later
    //it would be cool if the styles and everything updated, here, too, but I would need to build a helper class that handled
    //that for the ide and runtime.
    this.render = function() {
        chartId = widget.jqElementId;

        let chartData = [];

        layout = {
			showlegend: true,
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
			},
			plot_bgcolor: '#fff'
        };
        
        Plotly.newPlot(chartId, chartData, layout, {displayModeBar: false});
        widget.resize(widget.getProperty('Width'),widget.getProperty('Height'));
        //for some reason, afterLoad doesn't get called when the chart first initialized. This makes sure my axis and series properties
        //are set correctly on the initial render
        if (type !== 'pie') {
            chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
            chart.setAxesProperties('NumberOfXAxes', widget.getProperty('NumberOfXAxes'));
            chart.setAxesProperties('NumberOfYAxes', widget.getProperty('NumberOfYAxes'));
        }

    }

    //this function is somewhat duplicated in the runtime, which isn't great
    //this just draws the data onto the chart div
    this.draw = function(data) {
        Plotly.react(chartId,data,layout,{displayModeBar: false});
    }

    //show or hide axis properties based on other settings
    this.setAxesProperties = function (name,value) {
        let properties = widget.allWidgetProperties().properties;
        
        for (key in properties) {
            let property = properties[key];
            if (property.axis) {
                let visible = widget.getProperty(property.axis + 'AxesVisible');
                property['isVisible'] = visible;
                if (property['isBindingTarget'] !== undefined) {
                    property['isBindingTarget'] = visible;
                }
                let numberOfAxes = widget.getProperty('NumberOf' + property.axis + 'Axes');
                if (property['axisNumber'] && property['axisNumber'] > numberOfAxes) {
                    property['isVisible'] = false;
                    if (property['isBindingTarget'] !== undefined) {
                        property['isBindingTarget'] = false;
                    }
                };
            };
        };
        
        let xAxes = widget.getProperty('NumberOfXAxes');
        let xValues = [];
        for (let i = 1; i<= xAxes;i++) {
            xValues.push({ value: 'x' + i, text: 'x' + i });
        }

        let yAxes = widget.getProperty('NumberOfYAxes');
        let yValues = [];
        for (let i = 1; i<= yAxes;i++) {
            yValues.push({ value: 'y' + i, text: 'y' + i });
        }

        for (let i = 1; i<= chart.MAX_SERIES;i++) {
            properties['XAxis' + i]['selectOptions'] = xValues;
            properties['YAxis' + i]['selectOptions'] = yValues;
        }
        
    }

    //Same thing as above, but for series instead of axes.
    this.setSeriesProperties = function (value) {
        let properties = widget.allWidgetProperties().properties;
        let singleSource = true; 
        if (multipleData) { singleSource = widget.getProperty('SingleDataSource') };

        for (key in properties) {
            let property = properties[key];
            if (property.series && property.series <= value) {
                if (property['isMulti']) {
                    property['isVisible'] = !singleSource;
                    if (property['isBindingTarget'] !== undefined) {
                        property['isBindingTarget'] = !singleSource;
                    }
                    properties['Data']['isBindingTarget'] = singleSource;
                } else {
                    property['isVisible'] = true;
                    if (property['isBindingTarget'] !== undefined) {
                        property['isBindingTarget'] = true;
                    }
                };
            } else if(property.series) {
                property['isVisible'] = false;
                if (property['isBindingTarget'] !== undefined) {
                    property['isBindingTarget'] = false;
                }
            }
            let source = property['source'];
            if (source) {
                let dataSource = 'Data';
                if (!singleSource) {
                    dataSource = 'DataSource' + key.slice(-1);
                }
                property[source] = dataSource; 
            };
        };
        if (singleSource) {
            properties['Data']['isVisible'] = true;
            properties['XAxisField']['isVisible'] = true;
        } else {
            properties['Data']['isVisible'] = false;
            properties['XAxisField']['isVisible'] = false;
        };
    }

    //I dont think this actually works in the IDE. Need to test.
    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(widget.jqElementId, update);
    };

    widget.widgetEvents = function () {
        return {
        	'DoubleClicked': {}
        };
    };

    //This gets called when the widget is 'loaded', but apparently not on initial render. It makes sure when you go back into editing the mashup,
    //that all of the properties are visible that need to be for the axis and series.
    this.afterLoad = function() {
        if (type !== 'pie') {
            chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
            chart.setAxesProperties('NumberOfXAxes', widget.getProperty('NumberOfXAxes'));
            chart.setAxesProperties('NumberOfYAxes', widget.getProperty('NumberOfYAxes'));
        }
    };

    //If you change some of these properties, other properties become available.
    this.afterSetProperty = function (name, value) {
        let properties = widget.allWidgetProperties().properties;
        if (name === 'NumberOfSeries' || name === 'SingleDataSource') {
            chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
            widget.updatedProperties();
            return true;
        };

        if (name === 'NumberOfXAxes' || name === 'NumberOfYAxes' || name === 'XAxesVisible' || name === 'YAxesVisible') {
            chart.setAxesProperties(name, value);
            widget.updatedProperties();
            return true;
        };

        if (name.includes('SeriesMode')) {
            let series = name.slice(-1);
            if (value === 'spline') {
                properties['SeriesSmoothing' + series]['isVisible'] = true;
            } else {
                properties['SeriesSmoothing' + series]['isVisible'] = false;
            }
            widget.updatedProperties();
            return true;
        };

        if (name === 'Width' || name === 'Height') {
            let width = widget.getProperty('Width');
            let height = widget.getProperty('Height');
            widget.resize(width,height);
            return true;
        }
        return true;
    };

    //validate property values before setting them. Still need to add a bunch of these for the number properties that go from 0-1;
    widget.beforeSetProperty = function (name, value) {
        if (name === 'NumberOfSeries') {
            value = parseInt(value, 10);
            if (value < 0 || value > chart.MAX_SERIES)
                return 'Error - Max number of series is ' + chart.MAX_SERIES;
        }
        if (name === 'NumberOfXAxes' || name === 'NumberOfYAxes') {
            value = parseInt(value, 10);
            if (value < 0 || value > chart.MAX_AXES)
                return 'Error - Max number of axes is ' + chart.MAX_AXES
        }
    };


    //Gets the X and Y properties. The axis settings can all be per axis, but some other them I decided to be shared across all axes
    //This is just so the widget doesnt get too bloated and config heavy
    function getAxisProperties(properties, axis) {
        properties[axis + "AxesVisible"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true,
            'axis': axis
        };

        properties[axis + "AxesAuto"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true,
            'axis': axis
        };

       
        properties[axis + "AxesTicks"] =  {
            'description': '',
            'baseType': 'STRING',
            'defaultValue': 'auto',
            'isVisible' : true,
            'selectOptions': [
                { value: 'auto', text: 'Auto' },
                { value: 'linear', text: 'Linear' },
                { value: 'array', text: 'InfoTable' }
            ],
            'axis': axis
        };
       
        properties[axis + "AxesTickMax"] = {
            'description': 'Max number of X Axis Ticks, if tick mode is auto',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0,
            'axis': axis
        };

        properties[axis + "AxesTickWidth"] = {
            'description': '',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0,
            'axis': axis
        };
        
        properties[axis + "AxesTickStyle"] = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'isVisible': true,
            'defaultValue': 'DefaultChartTitleStyle',
            'axis': axis
        };
       
        properties[axis + "AxesTickAngle"] = {
            'description': '',
            'baseType': 'STRING',
            'isVisible': true,
            'defaultValue': 'auto',
            'axis': axis
        };
       
        properties[axis + "AxesShowGrid"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true,
            'axis': axis
        };
       
        properties[axis + "AxesGridStyle"] = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'isVisible': true,
            'defaultValue': 'DefaultChartTitleStyle',
            'axis': axis
        };

        
        properties[axis + "AxesShowLine"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true,
            'axis': axis
        };

        properties[axis + "AxesLineStyle"] = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'isVisible': true,
            'defaultValue': 'DefaultChartTitleStyle',
            'axis': axis
        };

        for (let i = 1; i <= chart.MAX_AXES; i++) {

            let axisStyle =  {
                'description': '',
                'baseType': 'STYLEDEFINITION',
                'isVisible': true,
                'defaultValue': 'DefaultChartTitleStyle',
                'axis': axis,
                'axisNumber': i
            };

            let axisTitle = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'isBindingTarget': true,
                'axis': axis,
                'axisNumber': i
            };

            let axisType = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'defaultValue': '-',
                'selectOptions': [
                    { value: '-', text: 'Auto' },
                    { value: 'linear', text: 'Linear' },
                    { value: 'log', text: 'Logarithmic' },
                    { value: 'date', text: 'Date' },
                    { value: 'category', text: 'Category' },
                    { value: 'multicategory', text: 'Multicategory' },
                ],
                'axis': axis,
                'axisNumber': i
            };

            let axisTickFormat = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'axis': axis,
                'axisNumber': i
            };

            let axisSide;
            if (axis === 'X') { 
                axisSide = {
                    'description': '',
                    'baseType': 'STRING',
                    'isVisible': true,
                    'defaultValue': 'top',
                    'selectOptions': [
                        { value: 'top', text: 'Top' },
                        { value: 'bottom', text: 'Bottom' }
                    ],
                    'axis': axis,
                    'axisNumber': i
                };
            } else {
                axisSide = {
                    'description': '',
                    'baseType': 'STRING',
                    'isVisible': true,
                    'defaultValue': 'right',
                    'selectOptions': [
                        { value: 'right', text: 'Right' },
                        { value: 'left', text: 'Left' }
                    ],
                    'axis': axis,
                    'axisNumber': i
                };
            };

            let axisAnchor = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'defaultValue': 'free',
                'selectOptions': [
                    { value: 'free', text: 'Free' }
                ],
                'axis': axis,
                'axisNumber': i
            };

            let axisPosition = {
                'description': '',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 0,
                'axis': axis,
                'axisNumber': i
            };
            
            //        anchor='free', overlaying='y',side='left',position=0.15
            properties[axis + 'AxisStyle' + i] = axisStyle;
            properties[axis + 'AxisTitle' + i] = axisTitle;
            properties[axis + 'AxisType' + i] = axisType;
            properties[axis + 'AxisTickFormat' + i] = axisTickFormat;
            if (i>1) {
                properties[axis + 'AxisPosition' + i] = axisPosition;
            }

        };
        return properties;
    }

    function getSeriesProperties(properties) {
        for (let seriesNumber = 1; seriesNumber <= chart.MAX_SERIES; seriesNumber++) {
            let dataSourceProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-set-property.description') + seriesNumber,
                'isBindingTarget': true,
                'isEditable': false,
                'baseType': 'INFOTABLE',
                'warnIfNotBoundAsTarget': false,
                'isVisible': true,
                'series': seriesNumber,
                'isMulti': true
            };

            let dataXProperty = {
                'description': 'X Axis Field ' + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isVisible': true,
                'series': seriesNumber,
                'isMulti': true,
                'source': 'sourcePropertyName'
            };

            let axisXProperty = {
                'description': '',
                'baseType': 'STRING',
                'defaultValue': 'x1',
                'isVisible' : true,
                'selectOptions': [
                    { value: 'x1', text: 'x1' }
                ],
                'isBindingTarget': true,
                'series': seriesNumber,
            };

            let dataYProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-field-property.description') + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isVisible': true,
                'series': seriesNumber,
                'source': 'sourcePropertyName'
            };  
            let axisYProperty = {
                'description': '',
                'baseType': 'STRING',
                'defaultValue': 'y1',
                'isVisible' : true,
                'selectOptions': [
                    { value: 'y1', text: 'y1' }
                ],
                'isBindingTarget': true,
                'series': seriesNumber
            };
            
            let dataZProperty = {
                'description': 'Z Axis ' + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isVisible': true,
                'series': seriesNumber,
                'source': 'sourcePropertyName'
            };  

            let dataLabelProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-label-property.description') + seriesNumber,
                'baseType': 'STRING',
                'isBindingTarget': true,
                'isVisible': true,
                'isLocalizable': true,
                'series': seriesNumber
            };

            let seriesMode = {
                'description': '',
                'baseType': 'STRING',
                'isVisible' : false,
                'selectOptions': [
                ],
                'series': seriesNumber
            };

            let seriesSmoothing = {
                'description': '',
                'baseType': 'NUMBER',
                'isVisible' : false,
                'defaultValue': 1,
                'series': seriesNumber
            };
                
            let seriesStyleProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-style-property.description') + seriesNumber,
                'baseType': 'STYLEDEFINITION',
                'isVisible': true,
                'series': seriesNumber
            };

            let seriesDataProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-state-property.description') + seriesNumber,
                'baseType': 'STATEFORMATTING',
                'baseTypeInfotableProperty': 'Data',
                'isVisible': true,
                'series': seriesNumber,
                'source': 'baseTypeInfotableProperty'
            };

            let seriesTooltipVisible = {
                'description': '',
                'baseType': 'BOOLEAN',
                'defaultValue': true,
                'series': seriesNumber
            };

            let seriesTooltipStyle = {
                'description': '',
                'baseType': 'STYLEDEFINITION',
                'isVisible': true,
                'series': seriesNumber
            };

            let seriesTooltipFormat = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'isLocalizable': true,
                'series': seriesNumber
            };

            let tooltipText = {
                'description': '',
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isVisible': true,
                'series': seriesNumber,
                'source': 'sourcePropertyName'
            };

            
            if(multipleData) { properties['DataSource' + seriesNumber] = dataSourceProperty; };
            properties['XDataField' + seriesNumber] = dataXProperty;
            properties['XAxis' + seriesNumber] = axisXProperty;
            properties['YDataField' + seriesNumber] = dataYProperty;
            properties['YAxis' + seriesNumber] = axisYProperty;
            properties['SeriesMode' + seriesNumber] = seriesMode;
            properties['SeriesSmoothing' + seriesNumber] = seriesSmoothing;
            properties['SeriesLabel' + seriesNumber] = dataLabelProperty;
            properties['SeriesStyle' + seriesNumber] = seriesStyleProperty;
            properties['SeriesStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;
            properties['SeriesDataStyle' + seriesNumber] = seriesDataProperty;
            properties['ShowTooltip' + seriesNumber] = seriesTooltipVisible;
            properties['TooltipStyle' + seriesNumber] = seriesTooltipStyle;
            properties['TooltipStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;
            properties['TooltipFormat' + seriesNumber] = seriesTooltipFormat;
            properties['TooltipText' + seriesNumber] = tooltipText;
                
            if (type === '3d') { properties['ZDataField' + seriesNumber] = dataZProperty };
        }
        return properties;
    }
}