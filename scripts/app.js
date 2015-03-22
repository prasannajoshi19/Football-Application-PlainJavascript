var CLUB = window.CLUB || {};
CLUB.highValue = 40;
CLUB.lowValue = 20;
CLUB.defaultCountry = 'All Countries';
CLUB.defaultPosition = 'All Positions';
CLUB.pageData = {
	pageSize: 4,
	selectedPage: 1
};
$(document).ready(function() {
	initialize();
});
/*
	DropdownSelect will called when user changes country or position dropdown value.
	In this function we set country/position values of the controller.
*/
function dropdownSelect(div) {
	var elem = $(div).eq(0),
		value = elem.multipleSelect('getSelects');
	if(elem.hasClass('country_list')) {
		CLUB.countryValue = value;
	} else if(elem.hasClass('position_list')) {
		CLUB.positionValue = value;
	}
	setSelectedData();
}
/*
	filterFunction() checks the value of key and compare it with the given input.
	It returns true if the value matches the given input else returns false.
*/
function filterFunction(obj, key, value){
	if(obj[key] === value) {
		return true;
	} else {
		return false;
	}
}
/*
	filterData() filters the data based on country and position filters.
*/
function filterData(selectedData, list, key) {
	var array = [],
		listLength = list.length,
		i;
	if(listLength) {
		for(i = 0; i < listLength; i =  i + 1) {
			array = array.concat(selectedData.filter(function(element){
				return filterFunction(element, key, list[i]);
			}));
		}
	}
	return array;
}
/*
	initialize() function is called on document ready function.
	It initializes all UI components on load of the data.
*/
function initialize(){
	$.getJSON('json/data.json', function(data){
		initializeData(data);
		initializeDropDown('.country_list', CLUB.countryList, CLUB.defaultCountry);
		initializeDropDown('.position_list', CLUB.positionList, CLUB.defaultPosition);
		initializeSlider('.age_slider');
		setSelectedData();
		resizeHandler();
		$('.container').css('visibility', 'visibility');
		$('body').removeClass('loading_class');
	});
}
/*
	intializeData() sets initial data for playerList and dropdowns.
*/
function initializeData(data) {
	var model = data.playerData;
	if(typeof model !== 'undefined') {
		var modelLength = model.length,
	    	countryList = [],
	    	positionList = [],
	    	countryValue = [],
	    	positionValue = [],
	    	i, obj, country, position, countryObj, positionObj;
    	for (i = 0; i < modelLength; i = i + 1) {
    		obj = model[i],
    		country = obj.nationality,
    		position = obj.position,
    		countryObj = {
    			text: country
    		};
    		positionObj = {
    			text: position
    		};
    		//To create unique array list we keep the check for countryList and positionList.
    		if(!countryList.filter(function(element){
    			return filterFunction(element, 'text', country);
    		}).length) {
    			countryValue.push(country);
    			countryList.push(countryObj);
    		}
    		if(!positionList.filter(function(element){
    			return filterFunction(element, 'text', position);
    		}).length) {
    			positionValue.push(position);
    			positionList.push(positionObj);
    		}
    	}
    	CLUB.data = model;
    	CLUB.selectedData = model;
    	CLUB.countryList = countryList;
    	CLUB.positionList = positionList;
    	CLUB.countryValue = countryValue.slice();
    	CLUB.positionValue = positionValue.slice();
	} else {
		alert('error in data');
	}
}
/*
	In intializeDropDown() we initialize dropdown using a library.
	We pass the div and data for dropdown creation.
*/
function initializeDropDown(div, data, selectAllText) {
	var dataLength = data.length, i, dataIndex, html = '';
	for(i = 0; i < dataLength; i = i + 1) {
		dataIndex = data[i];
		html = html + '<option value="' + dataIndex.text + '" selected=selected>' + dataIndex.text + '</option>';
	}
	$(div).html(html);
	$(div).multipleSelect({
		onClick: $.proxy(dropdownSelect, window, div),
		onCheckAll: $.proxy(dropdownSelect, window, div),
		onUncheckAll: $.proxy(dropdownSelect, window, div)
	});
}
/*
	In initializeSlider() we create an age slider usign jqueryUI slider.
*/
function initializeSlider(div) {
	var minValue = CLUB.lowValue,
		maxValue = CLUB.highValue;
		updateSliderValues();
	this.$(div).slider({
		range: true,
		min: minValue,
		max: maxValue,
		values: [minValue, maxValue],
		slide: onSlide
	});
}
/*
	onSlide() function will be caaled whenever user changes age slider values.
	In this function we get the low and high values of a slider and set controller properties.
*/
function onSlide(event, ui) {
	var values = ui.values;
	CLUB.lowValue = values[0];
	CLUB.highValue = values[1];
	updateSliderValues();
	setSelectedData();
}
/*
	pageChange() will be called when we click on pages button.
	It sets the selectedPage to the clicked page.
*/
function pageChange(event){
	var elem = $(event.target),
		pageData = CLUB.pageData,
		selectedPage = pageData.selectedPage,
		noOfPages = pageData.noOfPages;
	if(elem.hasClass('prev_page')) {
		if(selectedPage > 1) {
			selectedPage = selectedPage - 1;
		}
	} else if(elem.hasClass('next_page')) {
		if(selectedPage < noOfPages) {
			selectedPage = selectedPage + 1;
		}
	} else {
		selectedPage = Number(elem.text());
	}
	pageData.selectedPage = selectedPage;
}
/*
	resizeHandler() detects the size of the available space for plyer bio.
	According to available space we set number of players per page.
*/
function resizeHandler() {
	var contentHeight = $('.content').height(),
		boxHeight = $('.info_box').height(),
		pageData = CLUB.pageData,
		pageSize = Math.floor(contentHeight/(boxHeight + 15));
	if(pageData.pageSize !== pageSize) {
		pageData.pageSize = pageSize;
		setPageNumber();
	}
}
/*
	setpageNumber() will be called once selectedData is set.
	In this function we check the length of the selectedData and set no. of pages.
	Each page will contain 4 data items.
*/
function setPageNumber() {
	var selectedData = CLUB.selectedData,
		pageData = CLUB.pageData,
		pageSize = pageData.pageSize,
		selectedDataLength = selectedData.length,
		noOfPages;
	if(selectedDataLength % pageSize) {
		noOfPages = Math.floor(selectedDataLength / pageSize) + 1;
	} else {
		noOfPages = Math.floor(selectedDataLength / pageSize);
	}
	pageData.noOfPages = noOfPages;
	pageData.selectedPage = 1;
	setSelectedPageData();
}
/*
	setSelectedData() function observes change in coutry, position, and age values.
	We set the selectedData based on the filter values.
	Starting from the complete data, we filter the data using country, position and age values. 
*/
function setSelectedData() {
	var data = CLUB.data,
		selectedData = data,
		dataArray = [],
		ageData = [],
		i, selectedObj, age, selectedDataLength;
	//if position or country has default(Select All) then we dont filter the data.
	selectedData = filterData(selectedData, CLUB.countryValue, 'nationality');
	selectedData = filterData(selectedData, CLUB.positionValue, 'position');
	selectedDataLength = selectedData.length;
	//we check the age for remaining data then pass it to selectedData only if age lies between the range. 
	for(i = 0; i < selectedDataLength; i = i + 1) {
		selectedObj = selectedData[i];
		age = selectedObj.age;
		if(age >= CLUB.lowValue && age <= CLUB.highValue) {
			ageData.push(selectedObj);
		}
	}
	selectedData = ageData;
	CLUB.selectedData = selectedData;
	setPageNumber();
}
/*
	setSelectedPageData() will be called on change of selectedPage.
	Based on the selectedPage and selectedData, we create selectedPageData.
*/
function setSelectedPageData() {
	var selectedData = CLUB.selectedData,
		selectedDataLength = selectedData.length,
		pageData = CLUB.pageData,
		pageSize = pageData.pageSize,
		startIndex = pageSize * (pageData.selectedPage - 1),
		endIndex = Math.min(selectedDataLength, (startIndex + pageSize)),
		selectedPageData = [];
	for(i = startIndex; i < endIndex; i = i + 1) {
		selectedPageData.push(selectedData[i]);
	}
	pageData.startIndex = Math.min(startIndex + 1, endIndex);
	pageData.endIndex = endIndex;
	pageData.maxIndex = selectedDataLength;
	CLUB.selectedPageData = selectedPageData;
	//calling createClubData library function.
	$('.main_content').createClubData({
		playerData: CLUB.selectedPageData,
		pageInfo: pageData
	});
	$('.page_box').click(function(event){
		pageChange(event);
		setSelectedPageData();
	});
}
/*
	updateSliderValues() will update low and high slider values.
*/
function updateSliderValues() {
	$('.slider_min').text(CLUB.lowValue);
	$('.slider_max').text(CLUB.highValue);
};