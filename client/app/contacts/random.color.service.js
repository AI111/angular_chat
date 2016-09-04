 'use strict';

 class ColorUtil{
 	constructor(){
 		this.COLORS = 
 		[ '#FFCDD2',    '#F44336',    '#B71C1C', '#FF8A80',     
 		'#F8BBD0',    '#E91E63',    '#880E4F', '#FF80AB',     
 		'#E1BEE7',    '#9C27B0',    '#4A148C', '#EA80FC',     
 		'#D1C4E9',    '#673AB7',    '#311B92', '#B388FF',     
 		'#C5CAE9',    '#3F51B5',    '#1A237E', '#8C9EFF',     
 		'#BBDEFB',    '#2196F3',    '#0D47A1', '#82B1FF',     
 		'#B3E5FC',    '#03A9F4',    '#01579B', '#80D8FF',     
 		'#B2EBF2',    '#00BCD4',    '#006064', '#84FFFF',     
 		'#B2DFDB',    '#009688',    '#004D40', '#A7FFEB',     
 		'#C8E6C9',    '#4CAF50',    '#1B5E20', '#B9F6CA',     
 		'#DCEDC8',    '#8BC34A',    '#33691E', '#CCFF90',     
 		'#F0F4C3',    '#CDDC39',    '#827717', '#F4FF81',     
 		'#FFF9C4',    '#FFEB3B',    '#F57F17', '#FFFF8D',     
 		'#FFECB3',    '#FFC107',    '#FF6F00', '#FFE57F',     
 		'#FFE0B2',    '#FF9800',    '#E65100', '#FFD180',     
 		'#FFCCBC',    '#FF5722',    '#BF360C', '#FF9E80',     
 		'#D7CCC8',    '#795548',    '#3E2723',  
 		'#F5F5F5',    '#9E9E9E',    '#212121',  
 		'#CFD8DC',    '#607D8B',    '#263238',  ]
 	}
 	randomColor() {
 		return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
 	}
 }


 angular.module('angularChatApp')
 .factory('ColorUtil', function(){return new  ColorUtil()});



 
