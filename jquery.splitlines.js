/*!
 * jQUery.splitlines 0.1.1 - jQUery plugin to split lines within single tag in placesehre browser brakes line
 * Available via MIT license.
 * See http://github.com/szarsti/jquery.splitlines for details.
 */

/*global window, document, jQuery*/

(function ($) {
	"use strict";

	/**
	 * Internal object beeing reference to character/node in dom tree
	 *
	 * @private
	 * @constructor
	 * @param {Node} node
	 * @param {Number} offset
	 */
	function Pointer(node, offset) {
		this.node = node;
		this.offset = offset;
	}

	Pointer.prototype.isPointer = true;

	/**
	 * Get next character within parent element
	 *
	 * Returns null if there are no more characters within top node
	 *
	 * @private
	 * @param {Pointer/Node} pointer Pointer to node, or node
	 * @param {Node} [top] top most node of search. Once search goes through all characters inside this element, ti will return null.
	 * @param {Boolean} [upOnly=false] If true, traversing will
	 * @return {Pointer} Next Character pointer or null, when reached last character
	 */
	function getNextCharPointer(pointer, top, upOnly) {
		// Methd may get called with null pointer in recursion, when it reach branch end
		if (!pointer) {
			return null;
		}

		var node = pointer.isPointer ? pointer.node : pointer,
			offset = pointer.isPointer ? pointer.offset : 0,
			result;

		if (!top) {
			top = node;
		}

		switch (node.nodeType) {
		case (1):
			// If there is child to explore, go ther
			if (!upOnly && node.childNodes[offset]) {
				return getNextCharPointer(node.childNodes[offset], top);
			}
			// If top node is reached, there is nothing more to go
			if (node === top) {
				return null;
			}
			// Try exploring siblings if any
			if (node.nextSibling) {
				return getNextCharPointer(node.nextSibling, top);
			}
			// Only options left it to try searching futher above parent, withour recursing down the tree
			return getNextCharPointer(node.parentNode, top, true);
		case (3): // If it is text node
		case (4): // Or CDATA node
			offset += 1;
			if (offset < node.nodeValue.length) {
				return new Pointer(node, offset);
			}
			// If no characters left, tru continuing in sibling node, or parent
			//return getNextCharPointer(node.nextSibling || new, top);
		default:
			pointer.node = node.parentNode;
			pointer.node
		}

		// Move forward to next sibling
		if (node.nextSibling) {
			return getNextCharPointer(node.nextSibling, top);
		}
		// If all sibling are traversed start moving up
		return getNextCharPointer(node.parentNode, top, true);
	}

	function getRangeHeight(range) {
		var rect = range.getBoundingClientRect();
		return rect.bottom - rect.top;
	}

	function setRangeStart(range, pointer) {
		range.setStart(pointer.node, pointer.offset);
	}

	function setRangeEnd(range, pointer) {
		range.setEnd(pointer.node, pointer.offset);
	}

	/**
	 * @private
	 * @param {Range} document range, which will be wrapped
	 * @returns {Element} wrapping element
	 */
	function wrapRange(range) {
		var wrapEl = document.createElement('span');
		wrapEl.className = 'line';
		range.surroundContents(wrapEl);
		return wrapEl;
	}

	/**
	 * Traverse through each character and wrap each line once you notice that
	 * range bounding box is growing in height
	 *
	 * @param {Element} el
	 */
    function splitLines(el) {
        var range = document.createRange(),
			endPointer = new Pointer(el, 0),
			traverseParent = el,
			lastPointer,
			lineHeight,
			hasLines;

		// Make sure last pointer is pointing to character in text node
		if (endPointer.node.nodeType !== 3) {
			endPointer = getNextCharPointer(endPointer);
		}
		setRangeStart(range, endPointer);

		while (endPointer) {

			// If line height is growing, then wrap range up to last characte
			if (lineHeight && (getRangeHeight(range) > lineHeight)) {
				// Select range up to last character
				setRangeEnd(range, lastPointer);

				// Wrap it and move to first node after new element
				hasLines = true;
				endPointer = new Pointer(wrapRange(range).nextSibling, 0);
				setRangeStart(range, endPointer);
				lineHeight = 0;
			}

			// Move range end one char futher
			lastPointer = endPointer;
			endPointer = getNextCharPointer(lastPointer, traverseParent);
			if (endPointer) {
				setRangeEnd(range, endPointer);
			} else {
				// If last character is selected, move range to whole string
				range.setEnd(el, el.childNodes.length);
			}

			// Empty line height means, that it is first iteration within new line.
			// Grab first character height as line size reference for futher comparison
			if (!lineHeight) {
				lineHeight = getRangeHeight(range);
			}
		}

		if (hasLines) {
			// Wrap if there is not empty range left
			if (range.toString()) {
				wrapRange(range);
			}
			$(el).addClass('has-lines');
		}

		// Detach range to save resources
		range.detach();
    }

	/**
	 * Try to iterate through each element.
	 *
	 * Report errors, but do not brake the loop, so elements not caousing problems
	 * will still get split
	 *
	 * @private
	 * @param {Number} k The key in iteration array
	 * @param {Element} el
	 */
	function interate(k, el) {
		try {
			splitLines(el);
		} catch (err) {
			if (window.console) {
				console.error(err);
			}
		}
	}

    $.fn.splitLines = function () {
        return this.each(interate);
    };
}(jQuery));
