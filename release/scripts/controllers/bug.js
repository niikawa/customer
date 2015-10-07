var bugCtrl = angular.module('bugCtrl',['BugServices']);
bugCtrl.controller('BugCtrl',['$rootScope','$scope', '$sce', 'Upload', 'Shared', 'Bug', 'Modal','Utility',
function ($rootScope, $scope, $sce, Upload, Shared, Bug, Modal, Utility)
{
    $scope.selectedFile = [];
    
    function setInitializeScope()
    {
        $scope.bug = {resolve: 0, type: null};
    }
    
    function getInitializeData()
    {
        getInfo();
    }
    
    function getInfo()
    {
        Bug.resource.getByConditon($scope.bug).$promise.then(function(response)
        {
            $scope.isBugShow = response.data.length > 0;
            if ($scope.isBugShow)
            {
                Bug.addViewInfo(response.data);
                $scope.bugList = response.data;
                $scope.roleId = response.role;
            }
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.show = function()
    {
      $scope.modalParam = 
      {
          type: '',
          title: '',
          contents: '',
          category: '',
          categoryList: Bug.categoryList,
          files: null,
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/send.html");
    };
    
    $scope.apology = function()
    {
        Utility.info('障害ですか。。。<br>すみません！');
    };
    
    $scope.getByCondition = function()
    {
        getInfo();
    };

    $scope.resolve = function(index)
    {
        var name = $scope.bugList[index].title;
        Bug.resource.resolve({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を解決しました。');
            $scope.bugList[index].resolve_name = '解決';
            getInfo();
        });
    };

    $scope.save = function()
    {
        var params = 
        {
            type: $scope.modalParam.type,
            title: $scope.modalParam.title,
            contents: $scope.modalParam.contents,
            category: $scope.modalParam.category.type,
        };
        
        if (null !== $scope.modalParam.files)
        {
            $rootScope.$broadcast('requestStart');
            Bug.saveAndUpload($scope.modalParam.files, params, function(err)
            {
                $scope.modalInstance.close();
                if (null !== err)
                {
                    Utility.error(err);
                }
                getInfo();
                $rootScope.$broadcast('requestEnd');
            });
        }
        else
        {
            Bug.resource.save(params).$promise.then(function(response)
            {
                Utility.info('ありがとございました。');
                $scope.modalInstance.close();
                getInfo();
            });
        }
    };
    
    $scope.showComment = function(index)
    {
        $scope.modalParam = 
        {
            execute: saveComment,
            onFileSelect: onFileSelect,
            files: null,
            newComment: '',
            id: $scope.bugList[index].id,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/comment.html");
    };
    
    function onFileSelect($files)
    {
		$scope.selectedFile.push($files[0]);
    }
    
    $scope.showCommentView = function(index)
    {
        Bug.resource.getComment({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            $scope.bugList[index].comments = response.data;
        });
    };
    
    $scope.vote = function(index)
    {
        Bug.resource.vote({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            getInfo();
//            $scope.bugList[index].comments = response.data;
        });
    };

    function saveComment()
    {
        if (0 === $scope.modalParam.newComment.length) return;
        var params = 
        {
            demand_bug_id: $scope.modalParam.id,
            comment: $scope.modalParam.newComment,
        };
        if (null !== $scope.modalParam.files)
        {
            $rootScope.$broadcast('requestStart');
            Bug.commentSaveAndUpload($scope.modalParam.files, params, function(err)
            {
                $scope.modalInstance.close();
                if (null !== err)
                {
                    Utility.error(err);
                }
                getInfo();
                $rootScope.$broadcast('requestEnd');
            });
        }
        else
        {
            Bug.resource.saveComment(params).$promise.then(function(response)
            {
                $scope.modalInstance.close();
                getInfo();
            });
        }
    }
    
    $scope.download = function(id)
    {
        if (null === id || void 0 === id) return false;
        Bug.resource.download({id: id}).$promise.then(function(response)
        {
            $scope.modalInstance.close();
            getInfo();
        });
    };
}]);
