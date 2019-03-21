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

        properties.MarginTop = {
            'description': 'Top Margin',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 100,
            'isBindingTarget': false
        };

        properties.MarginBottom = {
            'description': 'Bottom Margin',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 80,
            'isBindingTarget': false
        };

        properties.MarginLeft = {
            'description': 'Left Margin',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 80,
            'isBindingTarget': false
        };

        properties.MarginRight = {
            'description': 'Right Margin',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 80,
            'isBindingTarget': false
        };

        properties.ShowTitle =  {
            'description': 'Show title',
            'baseType': 'BOOLEAN',
            'defaultValue': true
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
            'defaultValue': 0.5,
            'isBindingTarget': false
        };

        properties.ChartTitleY = {
            'description': 'Position from 0-1 or auto',
            'baseType': 'STRING',
            'isVisible': true,
            'defaultValue': 'auto',
            'isBindingTarget': false
        };

        properties.ShowLegend =  {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.show-legend.description'),
            'baseType': 'BOOLEAN',
            'defaultValue': true
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
            'defaultValue': 400,
            'isBindingTarget': false
        };

        properties.Height =  {
            'description': 'Total height of the widget',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 400,
            'isBindingTarget': false
        };

        if (type != 'pie') {
            
            properties.NumberOfXAxes =  {
                'description': 'Number of X Axes',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 1,
                'isBindingTarget': false
            };

            properties.NumberOfYAxes =  {
                'description': 'Number of Y Axes',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 1,
                'isBindingTarget': false
            };

            properties.XAxisField = {
                'description': TW.IDE.I18NController.translate('tw.xychart-ide.properties.x-axis-field.description'),
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };
            //Need to get properties for X and Y unless I am a pie chart
            //TODO: Add something for Z for 3d charts. It should be similar
            properties = getAxisProperties(properties,'X');
            properties = getAxisProperties(properties,'Y');

        }

        for (let seriesNumber = 1; seriesNumber <= chart.MAX_SERIES; seriesNumber++) {
            let dataSourceProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-set-property.description') + seriesNumber,
                'isBindingTarget': true,
                'isEditable': false,
                'baseType': 'INFOTABLE',
                'warnIfNotBoundAsTarget': false,
                'isVisible': true
            };

            let dataXProperty = {
                'description': 'X Axis Field ' + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };

            let axisXProperty = {
                'description': '',
                'baseType': 'STRING',
                'defaultValue': 'x1',
                'isVisible' : true,
                'selectOptions': [
                    { value: 'x1', text: 'x1' }
                ]
            };

            let dataYProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-field-property.description') + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };  
            let axisYProperty = {
                'description': '',
                'baseType': 'STRING',
                'defaultValue': 'x1',
                'isVisible' : true,
                'selectOptions': [
                    { value: 'y1', text: 'y1' }
                ]
            };
            
            let dataZProperty = {
                'description': 'Z Axis ' + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };  

            let dataLabelProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-label-property.description') + seriesNumber,
                'baseType': 'STRING',
                'isBindingTarget': true,
                'isVisible': true,
                'isLocalizable': true
            };

            let seriesType = {
                'description': '',
                'baseType': 'STRING',
                'isVisible' : true,
                'selectOptions': [
                ]
            };
                
            let seriesStyleProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-style-property.description') + seriesNumber,
                'baseType': 'STYLEDEFINITION',
                'isVisible': true
            };

            let seriesTooltipVisible = {
                'description': '',
                'baseType': 'BOOLEAN',
                'defaultValue': true
            };

            let seriesTooltipStyle = {
                'description': '',
                'baseType': 'STYLEDEFINITION',
                'isVisible': true
            };

            let seriesTooltipFormat = {
                'description': '',
                'baseType': 'STRING',
                'isBindingTarget': true,
                'isVisible': true,
                'isLocalizable': true
            };

            let tooltipText = {
                'description': '',
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };

            
            if(multipleData) { properties['DataSource' + seriesNumber] = dataSourceProperty };
            if (type !== 'pie') { 
                properties['XDataField' + seriesNumber] = dataXProperty;
                properties['XAxis' + seriesNumber] = axisXProperty;
                properties['YDataField' + seriesNumber] = dataYProperty;
                properties['YAxis' + seriesNumber] = axisYProperty;
                properties['SeriesType' + seriesNumber] = seriesType;
                properties['SeriesLabel' + seriesNumber] = dataLabelProperty;
                properties['SeriesStyle' + seriesNumber] = seriesStyleProperty;
                properties['SeriesStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;
                properties['ShowTooltip' + seriesNumber] = seriesTooltipVisible;
                properties['TooltipStyle' + seriesNumber] = seriesTooltipStyle;
                properties['TooltipStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;
                properties['TooltipFormat' + seriesNumber] = seriesTooltipFormat;
                properties['TooltipText' + seriesNumber] = tooltipText;
                
            };
            if (type === '3d') { properties['ZDataField' + seriesNumber] = dataZProperty };
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

        //for some reason, afterLoad doesn't get called when the chart first initialized. This makes sure my axis and series properties
        //are set correctly on the initial render
        chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
        chart.setAxesProperties(widget.getProperty('NumberOfAxes'))

    }

    //this function is somewhat duplicated in the runtime, which isn't great
    //this just draws the data onto the chart div
    this.draw = function(data) {
        Plotly.react(chartId,data,layout,{displayModeBar: false});
    }

    //show or hide axis properties based on other settings
    //its kind of dumb that allWidgetProperties doesn't have the values;
    this.setAxesProperties = function (name,value) {
        let properties = widget.allWidgetProperties();

        if (name === 'XAxesVisible') {
            properties['properties']['XAxesAuto']['isVisible'] = value;
            properties['properties']['XAxesTicks']['isVisible'] = value;
            properties['properties']['XAxesTickMax']['isVisible'] = value;
            properties['properties']['XAxesTickWidth']['isVisible'] = value;
            properties['properties']['XAxesTickStyle']['isVisible'] = value;
            properties['properties']['XAxesTickAngle']['isVisible'] = value;
            properties['properties']['XAxesShowGrid']['isVisible'] = value;
            properties['properties']['XAxesGridStyle']['isVisible'] = value;
            properties['properties']['XAxesShowLine']['isVisible'] = value;
            properties['properties']['XAxesLineStyle']['isVisible'] = value;

            let axes = widget.getProperty('NumberOfXAxes');
            chart.setAxesProperties('NumberOfXAxes',axes);

            return;
        }

        if (name === 'YAxesVisible') {
            properties['properties']['YAxesAuto']['isVisible'] = value;
            properties['properties']['YAxesTicks']['isVisible'] = value;
            properties['properties']['YAxesTickMax']['isVisible'] = value;
            properties['properties']['YAxesTickWidth']['isVisible'] = value;
            properties['properties']['YAxesTickStyle']['isVisible'] = value;
            properties['properties']['YAxesTickAngle']['isVisible'] = value;
            properties['properties']['YAxesShowGrid']['isVisible'] = value;
            properties['properties']['YAxesGridStyle']['isVisible'] = value;
            properties['properties']['YAxesShowLine']['isVisible'] = value;
            properties['properties']['YAxesLineStyle']['isVisible'] = value;

            let axes = widget.getProperty('NumberOfYAxes');
            chart.setAxesProperties('NumberOfYAxes',axes);
            return;
        }

        if (name === 'NumberOfXAxes') {
            let xVis = widget.getProperty('XAxesVisible');
            let xValues = [];
            for (let axis = 1; axis <= value; axis++) {
                properties['properties']['XAxisStyle' + axis]['isVisible'] = xVis;
                properties['properties']['XAxisTitle' + axis]['isVisible'] = xVis;
                properties['properties']['XAxisType' + axis]['isVisible'] = xVis;
                properties['properties']['XAxisTickFormat' + axis]['isVisible'] = xVis;
                if (axis>1) { properties['properties']['XAxisPosition' + axis]['isVisible'] = xVis };
                xValues.push({ value: 'x' + axis, text: 'x' + axis });
            }

            for (let axis = value + 1; axis <= chart.MAX_AXES; axis++) {
                properties['properties']['XAxisStyle' + axis]['isVisible'] = false;
                properties['properties']['XAxisTitle' + axis]['isVisible'] = false;
                properties['properties']['XAxisType' + axis]['isVisible'] = false;
                properties['properties']['XAxisTickFormat' + axis]['isVisible'] = false;
                properties['properties']['XAxisPosition' + axis]['isVisible'] = false;
            }

            //This is really clever. It sets up the drop down for which x axis to use 
            //based on the values created above, only for the number of axis the user has configured
            //we do the same thing for Y below. This is nice, because that way you dont need to configure
            //the axis settings for every series, like in the label chart
            for (let seriesNumber = 1; seriesNumber <= this.MAX_SERIES;seriesNumber++) {
                properties['properties']['XAxis' + seriesNumber]['selectOptions'] = xValues;
            }
            return;
        }

        if (name === 'NumberOfYAxes') {
            let yVis = widget.getProperty('YAxesVisible');
            let yValues = [];
            for (let axis = 1; axis <= value; axis++) {

                properties['properties']['YAxisStyle' + axis]['isVisible'] = yVis;
                properties['properties']['YAxisTitle' + axis]['isVisible'] = yVis;
                properties['properties']['YAxisType' + axis]['isVisible'] = yVis;
                properties['properties']['YAxisTickFormat' + axis]['isVisible'] = yVis;
                if (axis>1) { properties['properties']['YAxisPosition' + axis]['isVisible'] = yVis };
                yValues.push({ value: 'y' + axis, text: 'y' + axis });
            }

            for (let axis = value + 1; axis <= chart.MAX_AXES; axis++) {
                properties['properties']['YAxisStyle' + axis]['isVisible'] = false;
                properties['properties']['YAxisTitle' + axis]['isVisible'] = false;
                properties['properties']['YAxisType' + axis]['isVisible'] = false;
                properties['properties']['YAxisTickFormat' + axis]['isVisible'] = false;
                properties['properties']['YAxisPosition' + axis]['isVisible'] = false;
            }

            
            for (let seriesNumber = 1; seriesNumber <= this.MAX_SERIES;seriesNumber++) {
                properties['properties']['YAxis' + seriesNumber]['selectOptions'] = yValues;
            }
            return;
        }

        
    }

    //Same thing as above, but for series instead of axes.
    this.setSeriesProperties = function (value) {
        let properties = widget.allWidgetProperties();
        let seriesNumber;
        let singleSource = true; 
        let showTooltip = widget.getProperty('ShowTooltip');
        if (multipleData) { singleSource = widget.getProperty('SingleDataSource') };
        if (type !== 'pie') {
            for (seriesNumber = 1; seriesNumber <= value; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['isVisible'] = !singleSource
                properties['properties']['XAxis' + seriesNumber]['isVisible'] = true;
                properties['properties']['YDataField' + seriesNumber]['isVisible'] = true;
                properties['properties']['YAxis' + seriesNumber]['isVisible'] = true;
                properties['properties']['SeriesLabel' + seriesNumber]['isVisible'] = true;
                properties['properties']['SeriesStyle' + seriesNumber]['isVisible'] = true;  
                properties['properties']['ShowTooltip' + seriesNumber]['isVisible'] = true;  
                properties['properties']['TooltipStyle' + seriesNumber]['isVisible'] = true;
                properties['properties']['TooltipFormat' + seriesNumber]['isVisible'] = true;    
                properties['properties']['TooltipText' + seriesNumber]['isVisible'] = true; 
                //this property doesnt exist if there isn't multiple data sources, so you cant set the isVisible of undefined
                if (multipleData) {
                    properties['properties']['DataSource' + seriesNumber]['isVisible'] = !singleSource
                }
            }

            for (seriesNumber = value + 1; seriesNumber <= chart.MAX_SERIES; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['isVisible'] = false;
                properties['properties']['XAxis' + seriesNumber]['isVisible'] = false;
                properties['properties']['YDataField' + seriesNumber]['isVisible'] = false;
                properties['properties']['YAxis' + seriesNumber]['isVisible']= false;
                properties['properties']['SeriesLabel' + seriesNumber]['isVisible'] = false;
                properties['properties']['SeriesStyle' + seriesNumber]['isVisible'] = false;
                properties['properties']['ShowTooltip' + seriesNumber]['isVisible'] = false;  
                properties['properties']['TooltipStyle' + seriesNumber]['isVisible'] = false;
                properties['properties']['TooltipFormat' + seriesNumber]['isVisible'] = false; 
                properties['properties']['TooltipText' + seriesNumber]['isVisible'] = false; 
                if (multipleData) {
                    properties['properties']['DataSource' + seriesNumber]['isVisible'] = false;
                }
            }
        }

        //This changes the source property data field when there are multiple sources.
        if (singleSource) {
            for (seriesNumber = 1; seriesNumber <= chart.MAX_SERIES; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['sourcePropertyName'] = 'Data';
                properties['properties']['YDataField' + seriesNumber]['sourcePropertyName'] = 'Data';
                properties['properties']['TooltipText' + seriesNumber]['sourcePropertyName'] = 'Data';
            }
            properties['properties']['Data']['isVisible'] = true;
            properties['properties']['XAxisField']['isVisible'] = true;
        } else {
            for (seriesNumber = 1; seriesNumber <= chart.MAX_SERIES; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
                properties['properties']['YDataField' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
                properties['properties']['TooltipText' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
            }
            properties['properties']['Data']['isVisible'] = false;
            properties['properties']['XAxisField']['isVisible'] = false;
        }
    }

    //I dont think this actually works in the IDE. Need to test.
    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(widget.jqElementId, update);
    }

    //This gets called when the widget is 'loaded', but apparently not on initial render. It makes sure when you go back into editing the mashup,
    //that all of the properties are visible that need to be for the axis and series.
    widget.afterLoad = function() {
        chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
        chart.setAxesProperties('NumberOfXAxes', widget.getProperty('NumberOfXAxes'));
        chart.setAxesProperties('NumberOfYAxes', widget.getProperty('NumberOfYAxes'));
    };

    //If you change some of these properties, other properties become available.
    widget.afterSetProperty = function (name, value) {
        let properties = widget.allWidgetProperties();

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
            'defaultValue': true
        };

        properties[axis + "AxesAuto"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true
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
            ]
        };
       
        properties[axis + "AxesTickMax"] = {
            'description': 'Max number of X Axis Ticks, if tick mode is auto',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0,
            'isBindingTarget': false
        };

        properties[axis + "AxesTickWidth"] = {
            'description': '',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0,
            'isBindingTarget': false
        };
        
        properties[axis + "AxesTickStyle"] = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'isVisible': true,
            'defaultValue': 'DefaultChartTitleStyle'
        };
       
        properties[axis + "AxesTickAngle"] = {
            'description': '',
            'baseType': 'STRING',
            'isVisible': true,
            'defaultValue': 'auto',
            'isBindingTarget': false
        };
       
        properties[axis + "AxesShowGrid"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true
        };
       
        properties[axis + "AxesGridStyle"] = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'isVisible': true,
            'defaultValue': 'DefaultChartTitleStyle'
        };

        
        properties[axis + "AxesShowLine"] =  {
            'description': '',
            'baseType': 'BOOLEAN',
            'isVisible': true,
            'defaultValue': true
        };

        properties[axis + "AxesLineStyle"] = {
            'description': '',
            'baseType': 'STYLEDEFINITION',
            'isVisible': true,
            'defaultValue': 'DefaultChartTitleStyle'
        };

        for (let i = 1; i <= chart.MAX_AXES; i++) {

            let axisStyle =  {
                'description': '',
                'baseType': 'STYLEDEFINITION',
                'isVisible': true,
                'defaultValue': 'DefaultChartTitleStyle'
            };

            let axisTitle = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'isBindingTarget': true
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
                ]
            };

            let axisTickFormat = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'isBindingTarget': false
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
                    ]
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
                    ]
                };
            };

            let axisAnchor = {
                'description': '',
                'baseType': 'STRING',
                'isVisible': true,
                'defaultValue': 'free',
                'selectOptions': [
                    { value: 'free', text: 'Free' }
                ]
            };

            let axisPosition = {
                'description': '',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 0,
                'isBindingTarget': false
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
}