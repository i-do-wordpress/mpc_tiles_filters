/*

>>
Theme & author: Raw Elegance Solution by i-do-wordpress


>>
Timeline:
1. General idea & functional theoretical solutions: 5mins.
2. Rough working prototype: 2hrs.
3. Refractorning, improvments, performance optimalisation, fixes & nifty implementations: 8hrs.
>>
total:
      - working ver.: 2hrs.
      -(almost) bulletproof ver.: 10hrs.

>>
Notes:
1. Traditionally one would/could/should use 'onclick-listening-for-events-and-actions' attitude to modify html
($('node').on('click', function(){
  //do stuff
}))
 
2. Changing provided base html markup is not allowed, however one could always dynamically modify html markup by js.

3. Below I present experimental, more semi-automatic mode, js-canvas-games/angular-like style
watching for events based on loop().
It is also an intended hybrid of pure, oldschool, vanilla js and jQuery.

4. Also intended:
a/ use of camelCase instead of not_camel_case in classes, links, variables etc.
b/ use of global functions/variables instead of OOP-like js style
c/ I am aware of many language/frameworks features/functions which I do not use on purpose in regards of performance or personal preferences:
    for instance, depending on the length of the array, combination of traditional for() loop + use of len=list.length instead of .each() .forEach() etc can bring up to 50% (sic!) speed on loop code execution!

5. I did not want to use this but seems optimal solution
window.requestAnimationFrame(function() {
    // do stuff
});

6. Also tested on android. It would be far-fetched hype to say that is works like a charm, but it is acceptably smooth.

7. This approach may not be recommended for production, stuck sometimes as it is rough&ready solution. It was more about presenting different approach, need more testing and improvments. It was fun anyways.

*/



;(function(){

$(document).ready(function(){

  /*global $*/    

  var
    nowActiveLink = '',
    oldActiveLink = '',
    allTiles = [],
    allTilesLen = 0;
  
  var
    renderMenuLinks = false,
    renderTiles = false,
    renderActiveTiles = false;
    
  var  
    oldActiveTiles = [],
    activeTiles = [];
  
  //not to fast, let allow browser fully render (may take 4 - 50ms)
  //games usually 1000/30 or 1000/60
  var refreshRate = 1000/20; //100ms 
    
  init();
  //watch();
  requestAnimationFrame(watch);
  
  
  //ok
  /*
  function watch(){
    setInterval(function(){
      _update();
      _render();
    }, refreshRate);
  }
  */
  
  /*
  //ok
  function watch(){
    setInterval(function(){
      var dfd = $.Deferred();
      dfd.done(_update).done(_render);
      dfd.resolve();
    }, refreshRate);
  }
  */
  
  /*
  //ok
  function watch(){
    var dfd = $.Deferred();
    dfd.done(_update).done(_render);
    dfd.resolve();
    requestAnimationFrame(watch);
  }
  */
  
  //seems optimal
  function watch(){
    var deferred = $.Deferred();
    deferred.done(function(render){
     render();
     requestAnimationFrame(watch);
    });
    _update();
    deferred.resolve(_render);
  }
  
  
  
  function _update(){
    
    /*links*/  
    updateNowActiveLink();
    
    /*tiles*/
    //updateAllTiles(); //not in use in this case (harcoded)
    getActiveTiles();

  }


  
  function _render(){
  
    /*links*/
    if(renderMenuLinks){
      renderNowActiveLink();
      renderMenuLinks = false;
    }
  
    /*tiles*/
    if(renderActiveTiles){
      _renderActiveTiles();
      renderActiveTiles = false;
    }
  }


  function init(){
    var render = false;
  
    if(!renderTiles){
      hideAllTiles();
    }
  
    var dfd = $.Deferred();
    dfd.done(updateNowActiveLink,_initAllTiles,getActiveTiles)
      .done(function(){
      render = true;
    });
    dfd.resolve();

    //also ok
    //updateNowActiveLink();
    //_initAllTiles();
    //getActiveTiles();
    //render = true;
  
  
    /*'checkIfRenderYet' sets aside parallel stack, allow all func to complete first*/
    /*here pushing rendering checks - long operation - to webapis/task queue/event loop
    prevents blocking main app loop - setInterval function execution from checking 
    @ each refreshRate (eg. 1000/10 ms)
    for updates
    
    fires only once on page load
    */
  var checkIfRenderYet = function(){
    
    var stopRender = setTimeout(function(){
      if(render){
        _renderBody();
        renderNowActiveLink();
        _renderActiveTiles();
        render = false;
        clearTimeout(stopRender); //main looop takes over checks, browser webapi/event queue emptied
      }else{
        checkIfRenderYet();
      }  
    }, 0);
  
  };
  
  checkIfRenderYet();
  
}



/*----------------------body----------------------------------*/

/*body hidden by default in css

in this particular case i wanted prevent potential tiles flickering 
before all data is set ex. coming from js, DB, ajax, REST etc.
normally one could use a wrapper or absolute positioned covering preloader page

*/
function _renderBody(){
  $('body').css('display', 'block');
}

/*-----------------------------------------------------------*/




/*---------------------------------menu link----------------------------------*/

function getNowActiveLink(){
  return window.location.hash.substr(5);
}



function updateNowActiveLink(){

  nowActiveLink = getNowActiveLink();
  
  if(!nowActiveLink){
    window.location.hash = '#cat-all';
    nowActiveLink = getNowActiveLink();
  }
  
  if(nowActiveLink !== oldActiveLink){
    renderMenuLinks = true;
  }

  oldActiveLink = nowActiveLink;
}



function renderNowActiveLink(){
  var links = $('.categories li');
  
  for(var i=0, len=links.length; i<len; i++){
    
    var link = $(links[i]);
    link.removeClass('linkActive');
    
    var linkCat = link.children('a').attr('href').substr(5);
    if(linkCat === nowActiveLink){
      link.addClass('linkActive');
    }
      
  }
  
}


/*--------------------------------------------------------------------------*/






/*-----------------------------  tiles  ---------------------------------------*/


function hideAllTiles(){
  
  $("ul.tiles").css('display', 'none');

}

/*normally this comes from ajax/rest database,
in this case set from html on page load*/

function _initAllTiles(){
  
  allTiles = $("ul.tiles").children();
  allTilesLen = allTiles.length;
  
}


/*not in use in this case
normally we could also watch all tiles for changes
in this case they are hardcoded in html and won't change during app use
thus is does not make much sense
*/
function updateAllTiles(){
}



function getActiveTiles(){
  
  renderActiveTiles = false;
  activeTiles = [];
  
  //all tiles for loop:
  for(var i=0, len=allTiles.length; i<len; i++){
    
    var tileNode = allTiles[i]; 
    var $tile = $(tileNode);
  
    var _tileClassesStr = $tile.attr('class'); 
    var _tileClassesArr = _tileClassesStr.split(" "); 
    
    if(nowActiveLink === 'all'){
      activeTiles.push(tileNode);
    }else{ 
      
      /*check classes in each node*/
      for(var n=0, _len=_tileClassesArr.length; n<_len; n++){
      
        var _class = _tileClassesArr[n];
      
        if(_class.indexOf('cat-') === 0){
          var cat = _class.substr(4); 
  
          /*adding extra convinient attribute to node, 
          as html markup couldnt get modified by hand*/
          $tile.attr('data-cat', cat); 
        
          if(cat === nowActiveLink){
            activeTiles.push(tileNode);
          }
          break; //break if cat class found 
        }
      }  
    }
  } // end all tiles for loop
  
  
  
  /*
  comparing two arrays
  we could use more sophisticated way and compare each element of arrays
  array1.length === array2.length
   &&
  iterate thru arr1, arr2
    if array1[index] === array2[index] 
  but this is ok for this project:
  */
  
  if((oldActiveTiles.length !== activeTiles.length)||(oldActiveTiles.toString() !== activeTiles.toString())){
    renderActiveTiles = true;
  }
  
  oldActiveTiles = activeTiles;
  
}//end get active tiles




/*display*/
function _renderActiveTiles(){

  var delay = 200;
  var tileDelay = 100;
  
  var allNodesVisible = false;
  var makeSureNodeFinalOpacityIs1 = false;
  
  var ul = $('ul.tiles');
  ul.css('display', 'block');
  ul.empty();
  
  setTimeout(function(){
    ul.empty(); //mighty spruces stuff up
    for(var i=0, len=activeTiles.length; i<len; i++){
      var node = activeTiles[i];
      var $node = $(node);
      $node.css('display', 'none');
      $node.css('width', 0);
      $node.css('height', 0);
      $node.css('outline', '0.3px solid #eee');//just for clarity
      
      $node.fadeIn(delay + (i * tileDelay));
      
      $node.animate({
        width: '25%',
        height: '100%',
      }, refreshRate);
      
      ul.append(node);
    }
    
    var _allNodesVisible = function(){
      var _len = activeTiles.length;
      var num = 0;
      var stop = setTimeout(function(){
        for(var i=0, len=_len; i<len; i++){
          if(document.body.contains(activeTiles[i])){
            num++;
          }
        }
        if(_len === num){
          clearTimeout(stop);
          allNodesVisible = true;
        }else{
          _allNodesVisible();
        }
      },0);
    };
    _allNodesVisible();
    
    //allow nodes to fully render
    setTimeout(function(){
      makeSureNodeFinalOpacityIs1 = true;
    },(delay+(i*tileDelay)));  
    
  },0);
  
  //double check if fully render is ok
  
  var checkNodesOpacity = function(){
    
    var nodesOpacity = setTimeout(function(){
      
      if(makeSureNodeFinalOpacityIs1 && allNodesVisible){
        var ul = $('ul.tiles');
        var nodes = ul.children();
        
        var _loop = function(){
          for(var n=0, _len=nodes.length; n<_len; n++){
            var node = nodes[n];
            var op = $(node).css('opacity');
            if(op !== 1){
              $(node).css('opacity', '1');
            }
          }
        };//end loop  
      _loop();
      
      allNodesVisible = false;
      makeSureNodeFinalOpacityIs1 = false;
      clearTimeout(nodesOpacity);
      
      }else{
        checkNodesOpacity();
      }
    },0);  
  };
  
  checkNodesOpacity();

}// end _renderActiveTiles()


/*---------------------end tiles---------------------------------------*/


}); //end document ready

    
})(); //end iffe