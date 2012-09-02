(function(window, $, undefined ) {

	$.ToggleTabs 				= function( options, element ) {
		this.$el			= $( element );
		
		/***** thumbs ****/
		
		// thumbs wrapper
		this.$sliderthumbs	= this.$el.find('ul.tz-toggles').hide();
		// slider elements
		this.$listThumbs	= this.$sliderthumbs.children('li');
		// sliding div
		this.$sliderElem	= this.$sliderthumbs.children('li.toggle-element');
		// thumbs
		this.$thumbs		= this.$listThumbs.not('.toggle-element');
		
			
		/***** title ****/
		
		// list of title items
		this.$list			= this.$el.find('ul.tz-titles');
		// image items
		this.$listTitles	= this.$list.children('li');		
		
		/****** content ****/
		
		this.$listContents	= this.$el.find('div.content').children('div');
				
		// initialize ToggleTabs
		this._init( options );
		
	};
	
	$.ToggleTabs.defaults 		= {		
		// "sides" : new slides will slide in from left / right	
		animation			: 'sides', 		
		// speed for the sliding animation
		speed			: 800,
		// percentage of speed for the titles animation. Speed will be speed * titlesFactor
		titlesFactor		: 0.60,
		// titles animation speed
		titlespeed			: 800		
	};
	
	$.ToggleTabs.prototype 		= {
		_init 				: function( options ) {
			
			this.options 		= $.extend( true, {}, $.ToggleTabs.defaults, options );
						
			this.$listTitles.children('div.tz-title > *').css( 'opacity', 0 );
						
			// index of current visible slider
			this.current		= 0;
			
			var _self			= this;
			
			_self._initThumbs();
			
			_self._initContent();		
			
			_self.$listTitles.find('div.tz-title > *').fadeOut( 0, function() {
					// reset style
					$(this).show().css( 'opacity', 0 );	
				}),	
				
			_self.$listTitles.eq(this.current).find('div.tz-title > *').css( 'opacity', 1 );	
								
			// initialize the events
			_self._initEvents();
			
		},
		_resetContent		: function() {
			//Скрываем содержание			
			$("#content div").hide(); 
			//Сбрасываем id
			$("#toggle a").attr("id","");       			
			
		},
		_initContent		: function() {
		
			var myUrl = window.location.href;
			var myUrlTab = myUrl.substring(myUrl.indexOf("#"));     
			var myUrlTabName = myUrlTab.substring(0,4);

			this._resetContent();
			
			$("#content div").hide(); // Скрываем все содержание при инициализации
			$("#toggle li:first a").attr("id","current"); // Активируем первую закладку
			$("#content div:first").fadeIn(); // Показываем содержание первой закладки	

			for (i = 1; i <= $("#toggle li").length; i++) {
				if (myUrlTab == myUrlTabName + i) {
					resetTabs();
				$("a[name='"+myUrlTab+"']").attr("id","current"); // Активируем закладку по url
				$(myUrlTab).fadeIn(); // Показываем содержание закладки
				}
			}				
       },
		_initThumbs			: function() {
				// set the max-width of the slider and show it
			this.$sliderthumbs.css( 'max-width', this.options.thumbMaxWidth * this.itemsCount + 'px' ).show();
			
			this.$sliderElem.css( 'width', this.$thumbs.eq(0).width() + 'px' ).show();			
		},
		_initEvents			: function() {
			
			var _self	= this;
						
			// click the thumbs
			this.$thumbs.on( 'click.switchingtabs', function( event ) {
								
				var $thumb	= $(this),
					idx		= $thumb.index() - 1; // exclude sliding div
								
					
				_self._slideTo( idx );
				
				return false;			
			});			
		},
		
		// shows the clicked thumb's slide
		_slideTo			: function( pos ) {
			
			// return if clicking the same element or if currently animating
			if( pos === this.current || this.isAnimating)
				return false;
			
			this.isAnimating	= true;
			
			this.elWidth		= this.$el.width();
						
			var _self			= this,				
				preCSS			= {zIndex	: 10},
				animCSS			= {opacity	: 1};
						
			// new slide will slide in from left or right side
			if( this.options.animation === 'sides' ) {
				
				preCSS.left		= ( pos > this.current ) ? -1 * this.elWidth : this.elWidth;
				animCSS.left	= 0;		
			}
	
			// content animation			
			_self._resetContent();
			
			var $nextContent		= _self.$listContents.eq(pos);
		
			// Активируем текущую закладку
			$nextContent.attr("id","current"); 
			// Показываем содержание текущей закладки
			$nextContent.fadeIn(); 
			
			// titles animation
			var	$nextSlide		= this.$listTitles.eq( pos ),
				$currentSlide	= this.$listTitles.eq( this.current );
			
			$nextSlide.find('div.tz-title > h2')			
					  .css( 'margin-right', 50 + 'px' )
					  .stop()
					  .delay( this.options.speed * this.options.titlesFactor )
					  .animate({ marginRight : 0 + 'px', opacity : 1 }, this.options.titlespeed)
					  .end()
					  .find('div.tz-title > h3')
					  .css( 'margin-right', -50 + 'px' )
					  .stop()
					  .delay( this.options.speed * this.options.titlesFactor )
					  .animate({ marginRight : 0 + 'px', opacity : 1 }, this.options.titlespeed)					
					
			$.when(		
							
				$currentSlide.css( 'z-index' , 1 ).find('div.tz-title > *').stop().fadeOut( this.options.speed / 2, function() {
					// reset style
					$(this).show().css( 'opacity', 0 );	
				}),
				
				// animate next slide in
				$nextSlide.css( preCSS ).stop().animate( animCSS, this.options.speed, this.options.easing ),
								
				// "sliding div" moves to new position
				this.$sliderElem.stop().animate({
					left	: this.$thumbs.eq( pos ).position().left,
					width	: this.$thumbs.eq( pos ).width() + 'px'
					
				}, this.options.speed )
				
			).done( function() {
			
			$currentSlide.css( 'opacity' , 0 ).children('div.tz-title > *').css( 'opacity', 0 );
			
					_self.current	= pos;
					_self.isAnimating		= false;
				
				});
				
		}
	};
		
	// плагин
	$.fn.switchingtabs			= function( options ) {

			// обязательно для плагина  each
			this.each(function() {
			
				var instance = $.data( this, 'switchingtabs' );
				if ( !instance ) { 
					$.data( this, 'switchingtabs', new $.ToggleTabs( options, this ) );
				}
			
			});
		
		return this; 
		
	};
	
})( window, jQuery );