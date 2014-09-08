$(function(){
	NProgress.start();
	
	$(window).scroll(function() { if($(window).scrollTop() >= 100){ $('.topfade').fadeIn(300); }else{ $('.topfade').fadeOut(300); } });

	$('.topfade').click(function(){ $('html,body').animate({scrollTop: '0px'}, 800);});
	
	NProgress.done();
});