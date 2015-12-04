window.onload=function(){
	var lis=document.querySelectorAll('.wrapper .navbar ul li');
	for(var i=0,len=lis.length;i<len;i++){

		lis[i].onclick=function(j){
			return function(){
				console.log('j='+j)
				for(var i=0,len=lis.length;i<len;i++)
					lis[i].className='';
				
				lis[j].className='active';
			}
		}(i);
	}
};