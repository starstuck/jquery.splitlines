/*global jQuery, test, ok, equal*/

(function ($) {
	"use strict";

	test("signle line", function () {
		var $fixture = $('#qunit-fixture');

		$('<p style="width: 200px; font-size: 15px;">single line</p>')
			.appendTo($fixture)
			.splitLines();

		ok(!$fixture.find('p').hasClass('has-lines'), 'Should not have line');
		if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
			equal($fixture.html(), '<P style="WIDTH: 200px; FONT-SIZE: 15px">single line</P>', "Should have not changed html");
		} else {
			equal($fixture.html(), '<p style="width: 200px; font-size: 15px;">single line</p>', "Should have not changed html");
		}
	});

	test("double line", function () {
		var $fixture = $('#qunit-fixture'),
			innerHtml;

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

		innerHtml = $fixture.find('p').html();
		if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
			equal($fixture.find('p').html().slice(0, 27), '<SPAN class=line>Slightly l', 'should have span without text before');
			equal(innerHtml.slice(0, 27), '<SPAN class=line>Slightly l', 'there should be no text before first span');
			equal(innerHtml.slice(-15), '2 lines!</SPAN>', 'there should be no text before last span');
		} else {
			equal($fixture.find('p').html().slice(0, 27), '<span class="line">Slightly', 'should have span without text before');
			equal(innerHtml.slice(0, 27), '<span class="line">Slightly', 'there should be no text before first span');
			equal(innerHtml.slice(-15), '2 lines!</span>', 'there should be no text before last span');
		}
	});

	test("triple line", function () {
		var $fixture = $('#qunit-fixture');

		$([
			'<p style="width: 200px; font-size: 15px;">',
			'Even longer text spanning_across 3 lines! This is paragraph with no nested els',
			'</p>'].join(''))
			.appendTo($fixture)
			.splitLines();

		ok($fixture.find('p').hasClass('has-lines'), 'Should have lines');
		equal($fixture.find('span.line').length, 3, 'Should have exacly 3 lines in: ' + $fixture.find('p').html());
		equal($fixture.find('p').text(),
			  'Even longer text spanning_across 3 lines! This is paragraph with no nested els',
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

	/*
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
	*/

}(jQuery));
