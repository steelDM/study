
//更新是以ng-controller为单位进行的，如果里面有任何数据的变化，更新
// 整个模块，模块中需要引用的scope方法和变量也立即调用

angular.module('hello',[])
.controller('limitCtrl', function(){
	var MAX_LEN = 100;

	$scope.remaining = function(){
		if($scope.message){
			return MAX_LEN - $scope.message.length;
		}else{
			return MAX_LEN;
		}
	}

	$scope.hasValidLength = function(){
		if($scope.message){
			if($scope.message.length < MAX_LEN){
				return true
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	$scope.shouldWarn = function(){
		return $scope.remaining() < 0;
	}
	//只需要操作数据
	$scope.send = function(){
		alert(1);
	}
	$scope.clear = function(){
		$scope.message = '';
	}
});
