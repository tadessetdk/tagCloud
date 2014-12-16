//Written by Tadesse D. Feyissa. May 17, 2013.

/*
    options {
        items, cssclass, align, displayValue, hideTitle, 
        displayExact, linkTarget, grabble, inActiveLinks,  
        randomSort, noRandomColor, minFontSizeRatio
    }   
*/
function tagCloud(options){

    var items = options.items; 
    var cssclass = options.cssclass; 
    var align = options.align || 'center';
    var displayValue = options.displayValue;
    var hideTitle = options.hideTitle;
    var displayExact = options.displayExact;
    var linkTarget = options.linkTarget || '_blank';
    var inActiveLinks = options.inActiveLinks;
    var container = $('<div/>');
    var valigns = options.grabble ? { 0: 'sub', 1: 'super', 2: 'middle' } : { 0: '', 1: '', 2: '' };
    var randomSort = (options.sort || '').toLowerCase() == 'random'; 
    var noRandomColor = options.noRandomColor; 
	var minFontSizeRatio = Math.min((options.minFontSizeRatio || .3), 0.7);    
    
    function centerSort(items){
    
        var temp = items.clone().sort(function(a,b){ 
            return a.val - b.val; 
        });
     
        var result = [];     
        for(var i = temp.length - 1 ; i >= 0 ; i--){
            (i % 2) ? result.push(temp[i]):
                      result.unshift(temp[i]);
        }
        
        return result;
        
    }
    
    function getColor(){
    
        var threshold = 200;
        var getRandomColor = function () { return parseInt(Math.random() * threshold); }
        return 'rgb(' + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ')';
    
    }
    
    function addTag(tag, diff){
    
        var val = displayValue ? ( '(' + (displayExact ? tag.val : (Math.round(tag.val * 100) / 100)) + ')' ) : '';
        var text = tag.desc + val;
		var factor = (1 - minFontSizeRatio) / diff; // max value maps to 1em and min to 0.3em 
		var fontSize = factor * tag.val;
        var color = noRandomColor ? '' : getColor();
        
        var tagCont = $('<p/>').css(
                          {
                              'font-size': (fontSize + 'em'),
                              'vertical-align': tag.valign,
                              color: color
                          }
                      );
        
        if(tag.id) tagCont.attr('id', tag.id);
        inActiveLinks ? tagCont.html(text) : tagCont.append($('<a/>').attr('href', tag.url).css({ color: color }).attr('target', linkTarget).html(text));
        if(!hideTitle) tagCont.attr('title', tag.desc + ' (' + (Math.round(tag.val * 100) / 100) + ')');
        if(tag.cssclass || cssclass) tagCont.addClass(tag.cssclass || cssclass);
        
        container.append(tagCont).append(' ');
    }
    
    this.build = function(){
           
        var sortedItems = randomSort ? items.randomize() : centerSort(items);
        
        sortedItems = sortedItems.map(function(t){ 
        
            var pos = parseInt((Math.random() * 10) / Math.sqrt(10));
            t['valign'] = valigns[pos];
            return t;
            
        });
         
		var values = items.pluck("val");
        var diff = (values.max() - values.min()) || 1;
       
        for(var i = 0 , len = sortedItems.length ; i < len ; i++){
            addTag(sortedItems[i], diff);
        }        
        
        return container;
        
    }
};