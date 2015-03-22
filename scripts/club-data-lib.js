(function($) {
	'use strict';
	/*
		CreateClubData() is aconstructor function for clubObject.
	*/
	function CreateClubData(element, options) {
		this.options = options;
		this.element = element;
	};
	CreateClubData.prototype = { 
		constructor: CreateClubData,
		/*
			createPageList() renders the result row and sets page boxes.
		*/
		createPageList: function() {
			var options = this.options,
				pageInfo = options.pageInfo,
				element = this.element,
				resultDiv = element.find('.result_content'),
				noOfPages = Number(pageInfo.noOfPages),
				selectedPage = pageInfo.selectedPage,
				html = [],
				i;
			//If resultContent is not present in DOM then we create it otherwise we just empty its content.
			if(resultDiv.length) {
				resultDiv.html('');
			} else {
				element.append('<div class="result_content box"></div>');
			}
			html.push(
				'<div class="result_header column">Show Results</div>',
				'<div class="result_container column">',
				'Showing ' + pageInfo.startIndex + ' - ' + pageInfo.endIndex + ' out of ' + pageInfo.maxIndex + ' Search Results</div>'
			);
			if(noOfPages) {
				html.push('<div class="page_container"><div class="page_box prev_page"></div>');
			}
			for(i = 1; i <= noOfPages; i = i + 1) {
				if(selectedPage === i) {
					html.push('<div class="page_box selected_box">' +  i + '</div>');
				} else {
					html.push('<div class="page_box">' +  i + '</div>');
				}
			}
			if(noOfPages) {
				html.push('<div class="page_box next_page"></div></div>');
			}
			html = html.join('');
			resultDiv.html(html);
		},
		/*
			createPlayerList() create list of players.
			Each player will have image, information and form data.
		*/
		createPlayerList: function() {
			var options = this.options,
				pageInfo = options.pageInfo,
				dataList = options.playerData,
				dataLength = dataList.length,
				element = this.element,
				contentDiv = element.find('.content'),
				html = [], i, player;
			//If contentDiv is not present in DOM then we create it otherwise we just empty its content.
			if(contentDiv.length) {
				contentDiv.html('');
			} else {
				element.append('<div class="content"></div>');
			}
			for(i = 0; i < dataLength; i = i + 1) {
				player = dataList[i];
				html.push(
					'<div class="info_box box"><div class="row">',
					'<img class="column image_container" src="' + player.imageLink + '">',
					'<div class="column player_bio"><div class="player_name">' + player.name + '</div>',
					'<div class="player_info"><div class="plyer_desc">Age</div><div class="player_age">' + player.age + '</div></div>',
					'<div class="player_info"><div class="plyer_desc">Nationality</div><div class="player_country">' + player.nationality + '</div></div>',
					'<div class="player_info"><div class="plyer_desc">Position</div><div class="player_position">' + player.actualPosition + '</div></div>',
					'<div class="player_info"><div class="plyer_desc">Past Club</div><div class="player_past">' + player.pastClub + '</div></div></div>',
					'<div class="column player_form"><div class="form_text">Recent Form</div><div class="form_value">' + this.createForm(player) + '</div></div>',
					'</div></div>'
				);
			}
			html = html.join('');
			contentDiv.html(html);
		},
		/*
			createForm() method is used to create form of aperticular player.
		*/
		createForm: function(player) {
			var form = player.form,
		    	i, html = [];
			for(i = 1; i <= 10; i = i + 1) {
				if(i <= form) {
					html.push('<div class="form_box filled_box"></div>');
				} else {
					html.push('<div class="form_box"></div>');
				}
			}
			html = html.join('');
			return html;
		}
	};
	/*
		createClubData() is called from javascript file.
		In this function we set options for new object and call createPageList & createplayerList methods.
	*/
	$.fn.createClubData = function() {
		var args = arguments,
			option = arguments[0];
		//overriding the default values with the user input.
		var options = $.extend({}, $.fn.createClubData.defaults, typeof option === 'object' && option),
			clubObject = new CreateClubData($(this), options);
		clubObject.createPageList();
		clubObject.createPlayerList();
	};
	//default values of library function.
	$.fn.createClubData.defaults = {
		playerData: [],
		pageInfo: {}
	};
}(jQuery));