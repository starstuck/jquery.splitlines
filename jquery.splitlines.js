/**
* @preserve jQUery.splitlines 0.1.0 - jQUery plugin to split lines within single tag in placesehre browser brakes line
* Available via MIT license.
* See http://github.com/szarsti/jquery.splitlines for details.
*/

/*global document, jQuery*/

(function ($) {
	"use strict";

	function Pointer(node, offset) {
		this.node = node;
		this.offset = offset;
	}

	Pointer.prototype.isPointer = true;

	/**
	 * Get next character within parent element
	 *
	 * Returns null if there are no more characters within parent
	 */
	function getNextCharPointer(pointer, parent) {
		if (!pointer) {
			return null;
		}

		var node = pointer.isPointer ? pointer.node : pointer,
			offset = pointer.isPointer ? pointer.offset : 0,
			result;

		if (!parent) {
			parent = node;
		}

		function getNext() {
			var result;
			if (node.nextSibling) {
				// Try to get sibling
				result = getNextCharPointer(node.nextSibling, parent);
			} else {
				// Or go up to first parent siblingsibling
				while (node.parentNode !== parent) {
					if (!node.parentNode.nextSibling) {
						node = node.parentNode;
					} else {
						break;
					}
				}
				if (node) {
					result = getNextCharPointer(node.parentNode.nextSibling, parent);
				}
			}
			return result;
		}

		switch (node.nodeType) {
		case (1): // If it is element, find first inner, or go to next sibling
			node = node.childNodes[offset];
			if (node.nodeType === 3) {
				result = new Pointer(node, 0);
			} else {
				if (node.childNodes.length) {
					// Try going down the tree
					result = getNextCharPointer(node, parent);
				} else {
					result = getNext();
				}
			}
			break;
		case (3): // If it is text node
		case (4): // Or CDATA node
			offset += 1;
			if (offset < node.nodeValue.length) {
				result = new Pointer(node, offset);
			} else {
				result = getNext();
			}
			break;
		default:
			result = getNext();
		}

		return result;
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
	 * @returns wrapping EL
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
	 */
	function interate(k, el) {
		try {
			splitLines(el);
		} catch (err) {
			if (window.console) {
				console.error(err);
				console.debug(el.innerHTML);
			}
		}
	}

    $.fn.splitLines = function () {
        return this.each(interate);
    };
}(jQuery));
