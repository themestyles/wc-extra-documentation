( function( $ ) {
	'use strict';

	var loaded = false;

	// Add jQuery plugins
	$.fn.extend( {
		// Scroll container to a specific element
		tcScrollTo: function( obj, duration, offset ) {
			var element = this;

			obj = $( obj );
			if ( obj.length === 0 ) {
				return this;
			}
			if ( ! duration ) {
				duration = 0;
			}
			if ( ! offset ) {
				offset = 0;
			}
			if ( element[ 0 ].self === window ) {
				element = $( 'html, body' );
			} else {
				if ( element.find( '.woodmart-scroll-content' ).length ) {
					element = element.find( '.woodmart-scroll-content' );
				}
				if ( ! element.offset() ) {
					element = $( 'html, body' );
				} else {
					offset = offset + ( element.scrollTop() - element.offset().top );
				}
			}

			return element.animate(
				{
					scrollTop: $( obj ).offset().top + offset
				},
				duration
			);
		}
	} );

	// Disable empty links and submit buttons
	document.querySelectorAll( '[href="#"], [type="submit"]' )
		.forEach( link => {
			link.addEventListener( 'click', event => {
				event.preventDefault();
			} );
		} );

	function setActiveItem( usehash, useevent ) {
		var link;
		var { hash } = window.location;
		var active;
		var parents;

		if ( ! usehash && ! useevent ) {
			usehash = true;
		}

		if ( usehash ) {
			if ( hash === '' ) {
				return;
			}
		}

		if ( useevent ) {
			link = $( useevent.target );
		} else {
			link = $( `.bd-aside a[href="${hash}"]:not(.active)` );
		}

		if ( ! link.length || link.is( '.active' ) ) {
			return;
		}

		active = $( '.bd-aside .active' );
		parents = $( link[ 0 ].parentNode.parentNode.previousElementSibling );
		parents = link.parents( 'ul' );

		link.addClass( 'active' );
		active.removeClass( 'active' );

		if ( parents.length ) {
			parents.each( function( index, parent ) {
				parent = parent.previousElementSibling;
				$( parent ).addClass( 'active' );
				if ( parent && parent.classList.contains( 'collapsed' ) ) {
					parent.click();
				}
			} );
		}

		if ( loaded ) {
			$( window ).tcScrollTo( $( hash ), undefined, -90 );
		}
	}
	window.addEventListener( 'hashchange', setActiveItem );

	$( document ).on( 'click', '.bd-aside a', function( e ) {
		setActiveItem( false, e );
	} );

	$( document ).on( 'click', '.dd-item-btn', function( e ) {
		var btn = $( this );

		if ( undefined !== btn.attr( 'aria-controls' ) ) {
			e.preventDefault();
			if ( btn.is( '.collapsed' ) ) {
				btn.attr( 'aria-expanded', 'true' );
				btn.removeClass( 'collapsed' );
			} else {
				btn.attr( 'aria-expanded', 'false' );
				btn.addClass( 'collapsed' );
			}
		}
	} );

	setActiveItem();

	function checkTopBar() {
		var e = $( window ).scrollTop(),
			t = $( '.navbar' ).height(),
			body = $( 'body' );
		if ( e >= t ) {
			body.addClass( 'pinned-top-bar' );
		} else if ( e <= 0 ) {
			body.removeClass( 'pinned-top-bar' );
		}
	}
	$( window ).on( 'scroll', function() {
		checkTopBar();
	} );
	checkTopBar();

	$( document ).on( 'click', '[data-sidebar-toggle]', function() {
		return $( document.body ).toggleClass( 'sidebar-hidden' );
	} );

	loaded = true;
}( window.jQuery ) );
