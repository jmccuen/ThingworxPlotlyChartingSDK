function TWIDEChart(widget, maxSeries, type, maxAxes, multipleData) {

    this.MAX_SERIES = maxSeries;
    this.MAX_AXES = maxAxes;
    let layout = new Object();
    let chartId;
    let chart = this;

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
            
            properties.NumberOfAxes =  {
                'description': 'Number of Axes',
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

            for (let axis = 1; axis <= this.MAX_AXES; axis++) {
            
                let xTickMode = {
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

                let xTickMax =  {
                    'description': 'Max number of X Axis Ticks, if tick mode is auto',
                    'baseType': 'NUMBER',
                    'isVisible': true,
                    'defaultValue': 0,
                    'isBindingTarget': false
                };

                let yTickMode = {
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

                let yTickMax =  {
                    'description': 'Max number of X Axis Ticks, if tick mode is auto',
                    'baseType': 'NUMBER',
                    'isVisible': true,
                    'defaultValue': 0,
                    'isBindingTarget': false
                };

                properties['XAxisTickMode' + axis] = xTickMode;
                properties['XAxisTickMax' + axis] = xTickMax;

                properties['YAxisTickMode' + axis] = yTickMode;
                properties['YAxisTickMax' + axis] = yTickMax;

            }

        }

        for (let seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
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

            var dataLabelProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-label-property.description') + seriesNumber,
                'baseType': 'STRING',
                'isBindingTarget': true,
                'isVisible': true,
                'isLocalizable': true
            };
                
            let seriesStyleProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-style-property.description') + seriesNumber,
                'baseType': 'STYLEDEFINITION',
                'isVisible': true
            };

            
            if(multipleData) { properties['DataSource' + seriesNumber] = dataSourceProperty };
            if (type !== 'pie') { 
                properties['XDataField' + seriesNumber] = dataXProperty;
                properties['XAxis' + seriesNumber] = axisXProperty;
                properties['YDataField' + seriesNumber] = dataYProperty;
                properties['YAxis' + seriesNumber] = axisYProperty;
                properties['SeriesLabel' + seriesNumber] = dataLabelProperty;
                properties['SeriesStyle' + seriesNumber] = seriesStyleProperty;
                properties['SeriesStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;
                
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

        chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
        chart.setAxesProperties(widget.getProperty('NumberOfAxes'))

    }

    this.draw = function(data) {
        Plotly.react(chartId,data,layout,{displayModeBar: false});
    }

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(widget.jqElementId, update);
    }

    widget.afterLoad = function() {
        chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
        chart.setAxesProperties(widget.getProperty('NumberOfAxes'))
    };

    widget.afterSetProperty = function (name, value) {
        let properties = widget.allWidgetProperties();

        if (name === 'NumberOfSeries' || name === 'SingleDataSource') {
            chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
            widget.updatedProperties();
            return true;
        };

        if (name === 'NumberOfAxes') {
            chart.setAxesProperties(value);
            widget.updatedProperties();
            return true;
        };
    };

    widget.beforeSetProperty = function (name, value) {
        if (name === 'NumberOfSeries') {
            value = parseInt(value, 10);
            if (value < 0 || value > chart.MAX_SERIES)
                return 'Error - Max number of series is ' + chart.MAX_SERIES;
        }
        if (name === 'NumberOfAxes') {
            value = parseInt(value, 10);
            if (value < 0 || value > chart.MAX_AXES)
                return 'Error - Max number of axes is ' + chart.MAX_AXES
        }
    };

    this.setAxesProperties = function (value) {
        let properties = widget.allWidgetProperties();

        let xValues = [];
        let yValues = [];
        for (let axis = 1; axis <= value; axis++) {
            properties['properties']['XAxisTickMode' + axis]['isVisible'] = true
            properties['properties']['XAxisTickMax' + axis]['isVisible'] = true;

            properties['properties']['YAxisTickMode' + axis]['isVisible'] = true;
            properties['properties']['YAxisTickMax' + axis]['isVisible'] = true;
            xValues.push({ value: 'x' + axis, text: 'x' + axis });
            yValues.push({ value: 'y' + axis, text: 'y' + axis });
        }

        for (axis = value + 1; axis <= this.MAX_AXES; axis++) {
            properties['properties']['XAxisTickMode' + axis]['isVisible'] = false;
            properties['properties']['XAxisTickMax' + axis]['isVisible'] = false;

            properties['properties']['YAxisTickMode' + axis]['isVisible'] = false
            properties['properties']['YAxisTickMax' + axis]['isVisible'] = false;
        }

        for (let seriesNumber = 1; seriesNumber <= this.MAX_SERIES;seriesNumber++) {
            properties['properties']['XAxis' + seriesNumber]['selectOptions'] = xValues;
            properties['properties']['YAxis' + seriesNumber]['selectOptions'] = yValues;
        }
    }

    this.setSeriesProperties = function (value) {
        let properties = widget.allWidgetProperties();
        let seriesNumber;
        let singleSource = true; 
        if (multipleData) { singleSource = widget.getProperty('SingleDataSource') };
        if (type !== 'pie') {
            for (seriesNumber = 1; seriesNumber <= value; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['isVisible'] = !singleSource
                properties['properties']['XAxis' + seriesNumber]['isVisible'] = true;
                properties['properties']['YDataField' + seriesNumber]['isVisible'] = true;
                properties['properties']['YAxis' + seriesNumber]['isVisible'] = true;
                properties['properties']['SeriesLabel' + seriesNumber]['isVisible'] = true;
                properties['properties']['SeriesStyle' + seriesNumber]['isVisible'] = true;  
                if (multipleData) {
                    properties['properties']['DataSource' + seriesNumber]['isVisible'] = !singleSource
                }
            }

            for (seriesNumber = value + 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['isVisible'] = false;
                properties['properties']['XAxis' + seriesNumber]['isVisible'] = false;
                properties['properties']['YDataField' + seriesNumber]['isVisible'] = false;
                properties['properties']['YAxis' + seriesNumber]['isVisible']= false;
                properties['properties']['SeriesLabel' + seriesNumber]['isVisible'] = false;
                properties['properties']['SeriesStyle' + seriesNumber]['isVisible'] = false;
                if (multipleData) {
                    properties['properties']['DataSource' + seriesNumber]['isVisible'] = false;
                }
            }
        }

        if (singleSource) {
            for (seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['sourcePropertyName'] = 'Data';
                properties['properties']['YDataField' + seriesNumber]['sourcePropertyName'] = 'Data';
            }
            properties['properties']['Data']['isVisible'] = true;
            properties['properties']['XAxisField']['isVisible'] = true;
        } else {
            for (seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
                properties['properties']['XDataField' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
                properties['properties']['YDataField' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
            }
            properties['properties']['Data']['isVisible'] = false;
            properties['properties']['XAxisField']['isVisible'] = false;
        }
    }
}

function TWRuntimeChart(widget) {
    let properties = widget.properties;
    let chartId;
    let chart = this;
    

    this.layout = new Object;
    this.chartData = [];
    this.chartInfo = {};
    this.chartDiv;
    this.plotted = false;

    this.render = function() {
        chartId = widget.jqElementId;

        chart.chartData = [];
        let chartDiv = document.getElementById(widget.jqElementId);

        chart.layout = {
			showlegend: properties['ShowLegend'],
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
            },
            plot_bgcolor: '#fff'
        };

        if (properties['ShowTitle']) {
            let titleStyle = TW.getStyleFromStyleDefinition(properties['ChartTitleStyle'],'DefaultChartTitleStyle');
            let title = new Object();
            title.text = properties['ChartTitle'];
            title.font = new Object();
            title.font.size = Number(getFontSize(titleStyle.textSize));
            title.font.color = titleStyle.foregroundColor;
            title.x = properties['ChartTitleX'];
            title.y = properties['ChartTitleY'];
            chart.layout.title = title;
        }

        let margin = new Object();
        margin.t = properties['MarginTop'];
        margin.b = properties['MarginBottom'];
        margin.l = properties['MarginLeft'];
        margin.r = properties['MarginRight'];

        chart.layout.margin = margin;
        
        Plotly.newPlot(chartDiv, chart.chartData, chart.layout, {displayModeBar: false});
        if (properties['AllowSelection']) {
            chartDiv.on('plotly_click', chart.handleClick);
        }

    }

    this.extend = function(data) {
        Plotly.extendTraces(chartId,data, [0]);

    }


    this.draw = function(data) {
        chart.plotted = true;
        for (let i=1;i<=data.length;i++) {
            trace = data[i-1];
            let series = trace.series;
            if (trace.type == "scatter") {
                let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + series],'DefaultChartStyle' + series);
                let line = new Object();
                line.color = style.lineColor;
                trace.line = line;
                trace.name = properties['SeriesLabel' + series];
                //trace.xaxis = properties['XAxis' + series];
                //trace.yaxis = properties['YAxis' + series];
            }

            let exists = false;
            for (let i = 0; i<chart.chartData.length;i++) {
                if (trace.series === chart.chartData[i].series) {
                    chart.chartData[i] = trace;
                    exists = chart;
                }
            }
            if (!exists) {
                chart.chartData.push(trace);
            }
            
        }

        

        Plotly.react(chartId,chart.chartData,chart.layout,{displayModeBar: false});
    }

    this.handleClick = function(data)
    {
        let pn='',
        tn='',
        series = '',
        source = '';
        for(let i=0; i < data.points.length; i++){
            pn = data.points[i].pointNumber;
            tn = data.points[i].curveNumber;
            series = data.points[i].data.series;
            source = data.points[i].data.dataSource;
        };
        let colors = [];
        if (!chart.chartInfo[source]['SeriesStyle' + series]) {
            colors = Array(chart.chartInfo[source].length);
            let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + series],'DefaultChartStyle' + series);
            for (let i = 0; i<chart.chartInfo[source].length;i++) {
                colors[i] = style.lineColor;
            }
            chart.chartInfo[source]['SeriesStyle' + series] = colors.splice(0);
        }
        colors = chart.chartInfo[source]['SeriesStyle' + series].slice(0);
        colors[pn] = '#FF0000';

        var update = {'marker':{color: colors}};
        Plotly.restyle(chartId, update, [tn]);
    };

    this.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {
    
    };

    function getFontSize(text) {
    	return TW.getTextSize(text).split(": ")[1].replace("px;","");
    };

    this.getXY = function(it) {
		const rows = it.ActualDataRows;
		let values = new Object();
        let x = [];       
        let y = new Object();
        
        for (let i=0;i<rows.length;i++) {
        	x.push(rows[i][properties['XAxisField']]);
       	for (let j=1;j<=properties['NumberOfSeries'];j++) {
       		if (properties['YDataField' + j]) {
					if (!y[j]) {	
						y[j] = new Object();
						y[j].values = [];
					};
		    		y[j].values.push(rows[i][properties['YDataField' + j]]);
       		};
       	};
        };
        
        values.x = x;
        values.y = y;
        
        return values;
	}
	this.getDynamicXY = function(it) {
		const rows = it.ActualDataRows;
		let values = new Object();
        let x = [];
        let y = {};
		let shape = it.DataShape;
		
		for (let i=0;i<rows.length;i++) {
			let count = 1;
			x.push(rows[i][properties['XAxisField']]);
			for (let key in shape) {
				if (shape[key].baseType === 'NUMBER' || shape[key].baseType === 'INTEGER') {
					if (!y[count]) {	
						y[count] = new Object();
						y[count].values = [];
					};
					y[count].values.push(rows[i][key]);
					count++;
				};
			};
		};
		values.x = x;
		values.y = y;
		
        return values
	};

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(chartId, update);
    };

    widget.runtimeProperties = function () {
        return {
            'needsDataLoadingAndError': true,
	        'supportsAutoResize': true
        };
    };


}