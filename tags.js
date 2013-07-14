//Written by Tadesse D. Feyissa. May 17, 2013.

/*
    options {
        items, cssclass, align, displayValue, hideTitle, 
        displayExact, linkTarget, grabble, inActiveLinks,  
        minFactor, randomSort, noOpacity, noRandomColor 
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
    var minFactor = options.minFactor || 0.2;
    var randomSort = (options.sort || '').toLowerCase() == 'random'; 
    var noOpacity = options.noOpacity;   
    var noRandomColor = options.noRandomColor;     

    function calculateBoundaries(items){
    
        var min = items.reduce(function(prev, cur){ 
            return cur ? (prev.val < cur.val ? prev : cur) : prev;
        });
        
        var max = items.reduce(function(prev, cur){ 
            return cur ? (prev.val > cur.val ? prev : cur) : prev;
        });
        
        var diff = (max.val - min.val) || 1;
        return {min: min.val, max: max.val, diff: diff };
        
    }
    
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
    
    function addTag(tag, bnd){
    
        var val = displayValue ? ( '(' + (displayExact ? tag.val : (Math.round(tag.val * 100) / 100)) + ')' ) : '';
        var text = tag.desc + val;
        var factor = (tag.val - bnd.min) / bnd.diff; 
        factor = factor < minFactor ? minFactor : factor;
        var opacity = noOpacity ? 1 : (factor + 0.4);
        var color = noRandomColor ? '' : getColor();
        
        var tagCont = $('<p/>').css(
                          {
                              'font-size': (factor + 'em'),
                              'opacity': opacity,
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
             
        var bnd = calculateBoundaries(items);
       
        for(var i = 0 , len = sortedItems.length ; i < len ; i++){
            addTag(sortedItems[i], bnd);
        }        
        
        return container;
        
    }
};