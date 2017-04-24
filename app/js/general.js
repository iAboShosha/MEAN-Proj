// JavaScript Document
var siteURL='http://www.blaady.com/iread2/';
//jQuery(document).ready(function($){
var lastOrgObj='';
var lastObj,texttype,oldclass,oldhref,objhtml;
var casename='users';
var templatename='';
var loactionid='Al aqsa Hospital';
var reservationdate='';
var reservationtime='';
var MyData= new Array();
var orgdata;
/************************  --------General Submit Form ---**************************/
function submitForm(frm,op,type,itemid)
{
	//////////alert('rania');
	if($('#'+op+'-error'))
		$('#'+op+'-error').hide();
	if($('#'+op+'-success'))
		$('#'+op+'-success').hide();
	var data = $("#"+frm).serialize();
	var i=itemid;
	////////alert(siteURL+'lib/modules/'+type+'.php?id='+op+'&lang='+langName+'&itemid='+itemid);
	$.ajax({
		url  : siteURL+'lib/modules/'+type+'.php?id='+op+'&lang='+langName+'&itemid='+itemid,
		type : 'POST',
		data : data,
		success:function(data){
			//////////alert(data);
			switch(op){
				case "comptition-form":
					//alert(data);
					console.log(data);
					console.log(i);
					if(i=='1')
					{
						$('div#rmsgdiv').show();
						$('strong#rmsg').empty();
						$('strong#rmsg').html(data);
					}
					else
					{
						$('div#vmsgdiv').show();
						$('strong#vmsg').empty();
						$('strong#vmsg').html(data);
					}
					break;
				default:
					console.log(data);
					json_obj = $.parseJSON(data);
					if(json_obj.hasData)
					{
						$('#logincontainer').empty();
						$('#logincontainer').html(json_obj.Data);
					}
					else if(json_obj.hasError)
					{
						//alert('mmmmmmmmmmmmmm'+data);
						ShowMsg(json_obj,json_obj.id);
					}
					else
						ShowMsg(json_obj,op);
					break;
			}
		}});
}
/********************************** ----- General Validate --- ******************************/
function validateThis(thisID,op,type)
{
	if(!op)
		op='signup';
	console.log(siteURL+'lib/modules/'+type+'.php?id='+thisID);
	$('#'+op+'-error').hide();
	$('#'+op+'-success').hide();
	//alert(siteURL+'lib/modules/'+type+'.php?id='+thisID);
	$.ajax({
		url  : siteURL+'lib/modules/'+type+'.php?id='+thisID,
		type : 'POST',
		data:
		{
			controller: 'authentication',
			SubmitCreate: 1,
			ajax: true,
			thisVar: $('#'+thisID).val(),
			thisVar2: $('input[name=email_create]').val(),
			back: $('input[name=back]').val(),
		},
		success:function(data){
			console.log(data);
			ShowMsg(json_obj = $.parseJSON(data),thisID);
		}});
}
/************************* ------Function General ShowMsg ------*********************************/
function ShowMsg(json_obj,op)
{
	//////////alert('1111');
	$('#'+op+'-success').hide();
	$('#'+op+'-error').hide();
	if(json_obj.hasError)
	{
		//////////alert(json_obj.msg);
		$('#'+op+'-error').html(json_obj.msg);
		$('#'+op+'-error').show(
			function() {
				$( '#'+op+'-error').fadeIn( 3000, function() {
					$( "strong" ).fadeIn( 100 );
				});
				if(json_obj.hasLocation)
				{
					setTimeout(function() {
						window.location.href =json_obj.location ;
					}, 1000);
				}
				return false;
			}
		);
	}
	else
	{
		//////////alert(json_obj.hasLocation);
		$('#'+op+'-success').html(json_obj.msg);
		$('#'+op+'-success').show();

		if(json_obj.hasLocation)
		{

			setTimeout(function() {
				window.location.href =json_obj.location ;
			}, 2000);
		}

	}
	setTimeout(function() {
		$('#'+op+'-error').hide();
		$('#'+op+'-success').hide();
	}, 3000);
}
/***************************** ---- Function Logout  ------- **************************************/
function logout(type)
{
	////////////alert('test1');
	$.ajax({
		url  : siteURL+'lib/modules/'+type+'.php?id=logout',
		type : 'POST',
		success:function(Data){
			////////////alert(Data);			
			window.location= siteURL;
		}});
}