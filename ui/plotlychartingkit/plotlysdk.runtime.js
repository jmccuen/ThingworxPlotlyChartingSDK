/*
    This file is essentially a partial class for a charting widget in the runtime
    it has functions to help render and draw a chart and extends the widget by adding 
    additional function callbacks so they do not need to be called by the instance of 
    the chart widget and thus repeated for every chart.

    All chart settings can be found in the Plotly reference documentation: https://plot.ly/javascript/reference
*/ 
function TWRuntimeChart(widget) {
    let properties = widget.properties;
    let id;
    let chart = this;
    
    //expose the layout and chart data so you can access them from within the source widget
    //This gives the user more control over the chart and allows overriding the sdk
    this.layout = new Object;
    this.data = [];
    this.seriesMap = {};
    this.info = {};
    this.div;

    //this just lets the chart widget know if its already drawn the chart at least once
    //this is useful for streaming charts that might want to draw once and then extend after the first draw
    this.plotted = false;

    //This should be called in afterRender and it renders the chart onto the div with the appropriate layout settings
    this.render = function() {
        id = widget.jqElementId;

        chart.data = [];
        //need the actual div to add events
        let div = document.getElementById(widget.jqElementId);

        chart.layout = {
			showlegend: properties['ShowLegend'],
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
            },
            plot_bgcolor: '#fff'
        };

        //set up the layout
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
        
        let margins = properties['Margin'].split(",");

        let margin = new Object();
        margin.t = Number(margins[0].trim());
        margin.r = Number(margins[1].trim());
        margin.b = Number(margins[2].trim());
        margin.l = Number(margins[3].trim());
       

        chart.layout.margin = margin;

        //Set up the axes. Axis 1 is a bit different from the others, because there is no trailing number for them
        chart.layout.xaxis = getAxisObject('X',1);
        chart.layout.yaxis = getAxisObject('Y',1);

        for (let i = 2; i <= properties['NumberOfXAxes'];i++) {
            chart.layout['xaxis' + i] = getAxisObject('X',i);
        }
        for (let i = 2; i <= properties['NumberOfYAxes'];i++) {
            chart.layout['yaxis' + i] = getAxisObject('Y',i);
        }

        if (properties['AllowSelection']) {
            chart.layout.clickmode = 'event+select';
        };
        
        //draw the chart
        Plotly.newPlot(id, chart.data, chart.layout, {displayModeBar: false});

        //Add our click event
        if (properties['AllowSelection']) {
            div.on('plotly_click', chart.handleClick);
        }

    }

    //extend takes in just new data and adds it to the trace. Need to pass in trace number here, right now this only works for index 0.
    this.extend = function(data) {
        Plotly.extendTraces(id,data, [0]);

    }

    this.update = function(info) {
        if (info.TargetProperty === "ChartTitle") {
            let update = {
                title: info.SinglePropertyValue
            };
            Plotly.relayout(id, update);
        };

        for (let i=1;i<=properties['NumberOfSeries'];i++) {
            if (info.TargetProperty === 'XAxis' + i) {
                let update = new Object();
                update.xaxis = info.SinglePropertyValue;
                chart.data[chart.seriesMap[i].index].xaxis = info.SinglePropertyValue;
                Plotly.react(id,chart.data,chart.layout,{displayModeBar: false});
            };

            if (info.TargetProperty === 'YAxis' + i) {
                let update = new Object();
                update.yaxis = info.SinglePropertyValue;
                Plottly.restyle(id, update, chart.seriesMap[i].index);
            };

            if (info.TargetProperty === "SeriesLabel" + i) {
                let update = new Object();
                update.name = info.SinglePropertyValue;
                Plotly.restyle(id, update, chart.seriesMap[i].index);
            };
        };

        for (let i=1;i<=properties['NumberOfXAxes'];i++) {
            if (info.TargetProperty === 'XAxisTitle' + i) {
                let update = new Object();
                if (i===1) {
                    update['xaxis'] = { title: info.SinglePropertyValue };
                } else {
                    update['xaxis' + i] = { title: info.SinglePropertyValue };
                }
                Plotly.relayout(id, update);
            };
        };

        for (let i=1;i<=properties['NumberOfYAxes'];i++) {
            if (info.TargetProperty === 'YAxisTitle' + i) {
                let update = new Object();
                if (i===1) {  update['yaxis'] = { title: info.SinglePropertyValue } }
                else { update['yaxis' + i] = { title: info.SinglePropertyValue } };
                Plotly.relayout(id, update);
            };
        }
    };


    //this is where we actually get in data and draw it onto the chart
    this.draw = function(data) {
        chart.plotted = true;
        for (let i=1;i<=data.length;i++) {
            trace = data[i-1];
            let series = trace.series;

            let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + series],'DefaultChartStyle' + series);
            let hoverStyle = TW.getStyleFromStyleDefinition(properties['TooltipStyle' + series],'DefaultChartStyle' + series);
            if (!trace.line) {
                trace.line = new Object();
            }
            trace.line.color = style.lineColor;
            trace.fillcolor = style.backgroundColor;
            switch(style.lineStyle) {
                case 'dotted':
                    trace.line.dash = 'dot';
                    break;
                case 'dashed': 
                    trace.line.dash = 'dash';
                    break;
                default:   
                    trace.line.dash = 'solid';
            };
            trace.name = properties['SeriesLabel' + series];
            trace.hoverinfo = 'none';
            if (properties['ShowTooltip' + series]) {
                trace.hoverinfo = properties['TooltipFormat' + series];
            }
            trace.hoverlabel = new Object();
            trace.hoverlabel.bgcolor = hoverStyle.backgroundColor;
            trace.hoverlabel.bordercolor = hoverStyle.lineColor;
            trace.hoverlabel.font = {
                color: hoverStyle.foregroundColor,
                size: Number(getFontSize(hoverStyle.textSize))
            }
            if (properties['XAxis' + series] !== 'x1') {
                trace.xaxis = properties['XAxis' + series];
            };
            if (properties['YAxis' + series] !== 'y1') {
                trace.yaxis = properties['YAxis' + series];
            };
            //}

            if (properties['AllowSelection']) {
                let selectedStyle = TW.getStyleFromStyleDefinition(properties['SelectedItemStyle'],'DefaultChartSelectionStyle');
                trace.selected = new Object();
                trace.selected.marker = new Object();
                trace.selected.marker.color = selectedStyle.backgroundColor;
            };

            if (chart.seriesMap[trace.series]) {
                chart.data[chart.seriesMap[trace.series].index] = trace;
            } else {
                let index = chart.data.length;
                chart.data.push(trace);
                chart.seriesMap[trace.series] = new Object();
                chart.seriesMap[trace.series].index = index;
            };
        };

        if (properties['ShowAnimation'] && chart.plotted) {
            Plotly.animate(id,
                {
                    'data': chart.data, 
                    'layout': chart.layout
                },
                {
                    transition: {
                        duration: 500,
                        easing: 'cubic-in-out'
                    },
                    frame: {
                        duration: 500
                    }
                }
            );
        } else {
            Plotly.react(id,chart.data,chart.layout,{displayModeBar: false});
        };
    };

    
    this.handleClick = function(data)
    {   
        for (let i=0;i<data.points.length;i++) {
            let point = data.points[i];
            let selected = [point.pointIndex];
            if (!point.pointIndex) {
                selected = [point.i];
            }
            for (let i=0;i<chart.data.length;i++) {
                let item = chart.data[i];
                if (point.data.dataSource === item.dataSource && point.data.series !== item.series) {
                    let update = {selectedpoints: [selected]};
                    Plotly.restyle(id,update,i);
                }
            }
            widget.updateSelection(point.data.dataSource,selected);
        } 
    };


    //This needs to handle the case where some other widget is being selected and we need to select our chart as well.
    widget.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {
        if (properties['AllowSelection']) {
            for (let i=0;i<chart.data.length;i++) {
                let data = chart.data[i];
                if (data.dataSource === propertyName) {
                    let update = { selectedpoints: [selectedRowIndices]};
                    Plotly.restyle(id,update,i);
                };
            };
        }
    };

    //its really dumb that the style definition adds px to the font size...
    function getFontSize(text) {
    	return TW.getTextSize(text).split(": ")[1].replace("px;","");
    };

    //this is just a helper function that translates an infotable with fields into an x y object for plotly
    this.getXY = function(it,multi) {
		const rows = it.ActualDataRows;
		let values = new Object(),
        x = [],
        y = new Object(),
        xField = 'XAxisField',
        nSeries = properties['NumberOfSeries']
               
        for (let i=0;i<rows.length;i++) {
            let j = 1;

            //this is kind of a hack. If we don't do this and the InfoTable coming in has the same YDataField, it will update the chart with the wrong source data
            //this way it wont do that and will only update the series for the multi data coming in
            if (multi) { 
                nSeries = Number(it.TargetProperty.slice(-1));
                j = nSeries;
                xField = 'XDataField' + nSeries;
            };
        	x.push(rows[i][properties[xField]]);
            for (j;j<=nSeries;j++) {
                if (properties['YDataField' + j]) {
                        if (!y[j]) {	
                            y[j] = new Object();
                            y[j].values = [];
                            y[j].markerColors = [];
                            if (properties['ShowTooltip' + j] && properties['TooltipText' + j]) {
                                y[j].text = [];
                            };
                        };

                        let formatter = properties['SeriesDataStyle'+j];
                        if (formatter) {
                            formatResult = TW.getStyleFromStateFormatting({ DataRow: rows[i], StateFormatting: formatter });
                            y[j].markerColors.push(formatResult.backgroundColor);
                        }
                        
                        y[j].values.push(rows[i][properties['YDataField' + j]]);
                        if (properties['ShowTooltip' + j] && properties['TooltipText' + j]) {
                            y[j].text.push(rows[i][properties['TooltipText' + j]]);
                        };
                };
            };
        };
        
        for (key in y) {
            let hasValues = y[key].values.every(function(value) { return value });
            if (!hasValues) { delete y[key] };
        }

        values.x = x;
        values.y = y;
        
        return values;
    }
    
    //This is another helper function that translates an infotable with no fields into an x y object for plotly
    //we use this when we want to dynamically generate a chart without setting each series field. In that case we
    //render every field up to our field count, as long as its a number or integer value
	this.getDynamicXY = function(it) {
		const rows = it.ActualDataRows;
		let values = new Object();
        let x = [];
        let y = new Object();
        let shape = it.DataShape;
        let xField = 'XAxisField';
		
		for (let i=0;i<rows.length;i++) {
			let count = 1;
			x.push(rows[i][properties[xField]]);
			for (let key in shape) {
				if (shape[key].baseType === 'NUMBER' || shape[key].baseType === 'INTEGER') {
					if (!y[count]) {	
						y[count] = new Object();
                        y[count].values = [];
                        y[count].markerColors = [];
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
    
    //This actually builds out axis object for each of our axes. This is called when the chart is rendered.
    function getAxisObject(xy,i) {
        
        let style = TW.getStyleFromStyleDefinition(properties[xy + 'AxisStyle' + i],'DefaultChartStyle' + i);
        let tickStyle = TW.getStyleFromStyleDefinition(properties[xy + 'AxisTickStyle' + i],'DefaultChartStyle' + i);
        let lineStyle = TW.getStyleFromStyleDefinition(properties[xy + 'AxesLineStyle'],'DefaultChartStyle');
        let gridStyle = TW.getStyleFromStyleDefinition(properties[xy + 'AxesGridStyle'],'DefaultChartStyle');

        let axis = new Object();
        axis.visible = properties[xy + 'AxesVisible'];
        axis.title = {
            text: properties[xy + 'AxisTitle' + i],
            font: {
                color: style.foregroundColor,
                size: getFontSize(style.textSize)
            }
        },
        axis.type = properties[xy + 'AxisType' + i];
        axis.autorange = properties[xy + 'AxesAuto'];
        axis.tickmode = properties[xy + 'AxesTicks'];
        axis.nticks = properties[xy + 'AxesTickMax'];
        axis.tickwidth = properties[xy + 'AxesTickWidth'];
        axis.tickcolor = tickStyle.backgroundColor;
        axis.tickfont = {
            color: tickStyle.backgroundColor,
            size: getFontSize(tickStyle.textSize)
        };
        axis.tickangle = properties[xy + 'AxesTickAngle'];
        axis.tickformat = properties[xy + 'AxisTickFormat' + i];
        axis.showline = properties[xy + 'AxesShowLine'];
        axis.linecolor = lineStyle.backgroundColor;
        axis.showgrid = properties[xy + 'AxesShowGrid'];
        axis.gridstyle = gridStyle.backgroundColor;
        if (i>1) {
            axis.overlaying = xy.toLowerCase();
            axis.position = properties[xy + 'AxisPosition' + i];
            axis.anchor = 'free';
        }
        return axis;
    }

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(id, update);
    };

    widget.runtimeProperties = function () {
        return {
            'needsDataLoadingAndError': true,
	        'supportsAutoResize': true
        };
    };

    widget.beforeDestroy = function () {
       Plotly.purge(id);
       chart= undefined;
    };


}