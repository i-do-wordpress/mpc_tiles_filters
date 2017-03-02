<?php

/*

Description:

Add JavaScript functionality that will filter displayed tiles to active category.

Active category should be highlighted. (checked)
"All" category should display all tiles. (checked)
Any kind of animation between category swap is welcomed. (checked)

Tips:
- display only tiles from active category. Imagine the grid as a wall of images. You don’t want to display empty white space to the end user. (checked)
- don’t modify existing code. You often won’t have the possibility to adjust markup as you like/need. (checked)
- the categories aren’t set in stone. What if there was an additional category? (checked)
- remember that HTML stands for content, CSS for looks and JS for behavior. Don’t mix them up. (checked)
- #perfmatters (certainly) 
- look at this exercise as a part of a larger dynamic application. Don’t create code that only “works”. Try to use best practices. (done)

*/

$categories = array( 'all', 'red', 'blue', 'green', 'yellow' );

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Tiles filters</title>
	<style>
		/* DEFAULTS - don't modify */
		body {
			width: 800px;
			margin: 0 auto;
			text-align: center;
			padding: 1em;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		li {
			display: inline-block;
		}

		.categories {
			margin-bottom: 1em;
		}

		.categories a {
			display: inline-block;
			text-decoration: none;
			text-transform: uppercase;
			font-weight: bold;
			color: #333333;
			margin: 0 1em;
			padding: .5em;
		}

		.tiles li {
			padding: 1em;
			width: 25%;
			float: left;
			box-sizing: border-box;
			color: #ffffff;
		}

		.cat-red { background: #e74c3c; }
		.cat-blue { background: #3498db; }
		.cat-green { background: #2ecc71; }
		.cat-yellow { background: #f1c40f; }
		/* DEFAULTS - END */

		
		
		/* YOUR STYLES BELOW */
    
    
    /* this prevents flickering before full js-settings for instance tiles, maybe ajax, rest etc is fully set
    normally we could use a kind of wrapper with display none
    or dynamically append wrapper to body
    or use fully covering, absolute positioned preloading screen
    */
    body{
      display: none;
    }
    
    
    .linkActive{
      border-bottom: 3px solid #888;
    }
    
    
    .categories li:hover{
      border-bottom: 3px solid #555;
    }
    
    /*---------END/ YOUR STYLES BELOW-------------*/
    
    
	</style>
</head>

<body>


	<ul class="categories">
		<?php foreach ( $categories as $category ) : ?>
			<?php 
			/*
			Note:
			  if modifing existing code was possible one could add 'data-cat' just for convenience.
			<li data-cat="<?php echo $category; ?>"><a href="#cat-<? php echo $category ?>"><?php echo $category ?></a></li>
			*/
			?>
			<li><a href="#cat-<?php echo $category ?>"><?php echo $category ?></a></li>
		<?php endforeach; ?>
	</ul>
  
  
	
	<ul class="tiles">
		<?php for ( $i = 0; $i < 20; $i++ ) : ?>
		  <?php
		  /* also here - 'data-cat'
		  <li class="cat-<?php echo $randCat = $categories[ rand( 1, 4 ) ]; ?>" data-cat="<?php echo $randCat; ?>">Tile - <?php echo $i; ?></li>
		  */
		  ?>
		  <li class="cat-<?php echo $categories[ rand( 1, 4 ) ]; ?>">Tile - <?php echo $i; ?></li>
		<?php endfor; ?>
	</ul>
  


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script type="text/javascript" src="tiles_filters.js"></script>


</body>
</html>
