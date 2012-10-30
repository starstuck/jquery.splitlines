/*global jQuery, test, ok, equal*/

(function ($) {
	"use strict";

	test("signle line", function () {
		var $fixture = $('#qunit-fixture');

		$('<p style="width: 200px; font-size: 15px;">single line</p>')
			.appendTo($fixture)
			.splitLines();

		ok(!$fixture.find('p').hasClass('has-lines'), 'Should not have line');
		equal($fixture.html(), '<p style="width: 200px; font-size: 15px;">single line</p>', "Should have not changed html");
	});

	test("double line", function () {
		var $fixture = $('#qunit-fixture');

		$([
			'<p style="width: 200px; font-size: 15px;">',
			'Slightly longer paragraph spanning_across 2 lines!',
			'</p>'].join(''))
			.appendTo($fixture)
			.splitLines();

		ok($fixture.find('p').hasClass('has-lines'), 'Should have lines');
		equal($fixture.find('span.line').length, 2, 'Should have exacly 2 lines');
		equal($fixture.find('p').text(),
			  'Slightly longer paragraph spanning_across 2 lines!',
			  'Should have the same text');
	});

	test("quadruple line", function () {
		var $fixture = $('#qunit-fixture');

		$([
			'<p style="width: 200px; font-size: 15px;">',
			'Even longer text spanning_across 3 lines! This is paragraph without nested elements',
			'</p>'].join(''))
			.appendTo($fixture)
			.splitLines();

		ok($fixture.find('p').hasClass('has-lines'), 'Should have lines');
		equal($fixture.find('span.line').length, 4, 'Should have exacly 4 lines');
		equal($fixture.find('p').text(),
			  'Even longer text spanning_across 3 lines! This is paragraph without nested elements',
			  'Should have the same text');
	});

	test("double line with span in first line", function () {
		var $fixture = $('#qunit-fixture');

		$([
			'<p style="width: 200px; font-size: 15px;">',
			'Slightly <strong>longer</strong> paragraph spanning_across 2 lines!',
			'</p>'].join(''))
			.appendTo($fixture)
			.splitLines();

		ok($fixture.find('p').hasClass('has-lines'), 'Should have lines');
		equal($fixture.find('p span.line').length, 2, 'Should have exacly 2 lines');
		equal($fixture.find('p strong').text(), 'longer', 'Should keep markup');
		equal($fixture.find('p').text(),
			  'Slightly longer paragraph spanning_across 2 lines!',
			  'Should have the same text');
	});

	test("double line with span across lines", function () {
		var $fixture = $('#qunit-fixture');

		$([
			'<p style="width: 200px; font-size: 15px;">',
			'Slightly <strong>longer paragraph spanning_across</strong> 2 lines!',
			'</p>'].join(''))
			.appendTo($fixture)
			.splitLines();

		ok($fixture.find('p').hasClass('has-lines'), 'Should have lines');
		equal($fixture.find('p span.line').length, 2, 'Should have exacly 2 lines');
		equal($fixture.find('p strong').text(), 'longer paragraph spanning_across', 'Should keep markup');
		equal($fixture.find('p').text(),
			  'Slightly longer paragraph spanning_across 2 lines!',
			  'Should have the same text');
	});

}(jQuery));
