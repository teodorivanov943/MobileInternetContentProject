$(window).load(function() {
	var coef;
	var brm;
	var start
	var checkIfStarted = false;
	var result = $(".result").text();
	
	$("#calc").click(function()
	{
		var age = $("#age").val().length ? parseInt($("#age").val()) : 0;
		var height = $("#height").val().length ? parseInt($("#height").val()) : 0;
		var weight = $("#weight").val().length ? parseInt($("#weight").val()) : 0;
		var gender = $('input[name=sex]:checked').val();
		
		var exercise = parseInt($(".exercise").val());
		
		var genders = ["male", "female"];
		var exerciseLevel = [1, 2, 3, 4, 5];
		
		var minAge = 1;
		var maxAge = 130;

		var minHeight = 40;
		var maxHeight = 260;

		var minWeight = 20;
		var maxWeight = 600;
		
		if(age < minAge || age > maxAge || height < minHeight || height > maxHeight
			|| weight < minWeight || weight > maxWeight || $.inArray(gender, genders) == -1
			|| !$.inArray(exercise, exerciseLevel) == -1) 
		{
			$(".result").css("color", "red");
			$(".result").text("Invalid input!");
		}		
		else
		{
			if(exercise == 1)
			{
				coef = 1.2;
			}
			else if(exercise == 2)
			{
				coef = 1.375;
			}
			else if(exercise == 3)
			{
				coef = 1.55;
			}
			else if(exercise == 4)
			{
				coef = 1.725;
			}
			else
			{
				coef = 1.9;
			}
			
			if(gender == 'male')
			{
				brm = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
			}
			else if(gender == 'female')
			{
				brm = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
			}
			$(".result").css("color", "green");
			$(".result").text("Your recommended  daily caloric intake is " + parseInt(brm * coef));
		}
	})
	
	$("#start").click(function() 
	{
		$("#start").attr("disabled", "disabled");

		start = setInterval(function()
		{
			var currentTime = "00:00:00";

			if(checkIfStarted)
			{
				currentTime = $("#time").val();
			}
			
			var timeArray = currentTime.split(":");

			timeArray[0] = parseInt(timeArray[0]);
			timeArray[1] = parseInt(timeArray[1]);
			timeArray[2] = parseInt(timeArray[2]) + 1;

			if(timeArray[2] == 60)
			{
				timeArray[1] = timeArray[1] + 1;
				timeArray[2] = 0;
			}

			if(timeArray[1] == 60)
			{
				timeArray[0] = timeArray[0] + 1;
				timeArray[1] = 0;
			}
			

			var length = timeArray.length;
			for(var i = 0; i < length; i++)
			{
				if(timeArray[i] >= 0 && timeArray[i] < 10)
				{
					timeArray[i] = 0 + timeArray[i].toString();
				}
			}
			currentTime = timeArray.join(":");
			$("#time").val(currentTime);
			checkIfStarted = true;			
		}, 1000);
	});

	$("#stop").click(function()
	{	
		$("#start").attr("disabled", false);
		checkIfStarted = false;
		clearInterval(start);
	})	
		
	
		//Pedometer functions

	/******** GLOBAL NAMESPACE AND VARIABLES ********/
	var wnt = {};
			wnt.mobile = false;
			wnt.steps = parseInt(localStorage.steps);
		
	/******** DEVICE TYPE AND IE DETECTION ********/
	if( navigator.userAgent.match(/Android/i)
	  || navigator.userAgent.match(/webOS/i)
	  || navigator.userAgent.match(/iPhone/i)
	  || navigator.userAgent.match(/iPad/i)
	  || navigator.userAgent.match(/iPod/i)
	  || navigator.userAgent.match(/BlackBerry/i)
	  )
	{
		wnt.mobile = true;
	}

	if(wnt.mobile == true)
	{
		var watchid = navigator.geolocation.watchPosition(gotPosition, errorGettingPosition, 					
			{'enableHighAccuracy':true, 'timeout':10000, 'maximumAge':0});   //10 sec
	}
	else 
	{
		$('#result').html('You are not using a mobile device.');
	}


	/******** ONLOAD ********/
	$(function() {
		$('#clear').click(function(){
			localStorage.clear();
			wnt.steps = 0;
			stepstaken(wnt.steps);
		});
	});

	//2.5 feet = 0.762 meters (average stride)   ...   conversion factor is 3.2808
	//1 foot = 0.3048 meters
	//1 mile = 1609.344 meters
	//1 meter per second = 2.23693629 miles per hour
	
	function gotPosition(pos)
	{
		//alert(pos.coords.speed);									
		var steps = pos.coords.speed / 0.762;
		stepstaken(steps);
	}

	function errorGettingPosition(err)
	{
		if(err.code==1)
		{
			alert("User denied geolocation.");
		} 
		else if(err.code==2)
		{
			alert("Position unavailable.");
		} 
		else if(err.code==3)
		{
			alert("Timeout expired.");
		} 
		else 
		{
			alert("ERROR:"+ err.message);
		}
	}

	function stepstaken(steps)
	{
		wnt.steps = wnt.steps + steps;
		localStorage.steps = wnt.steps;
		$('#result').html('Total Steps<br /><span style="color:#ff0000;">' + 0 + ' Steps</span>');
	}
	
})


