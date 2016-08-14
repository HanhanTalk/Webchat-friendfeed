$(function(){
  var showComt = '';
  $(".overplay").click(function(){
    event.stopPropagation();
    $(".inset").addClass("hidden");
    $(".replybox").addClass("hidden");
    $(".overplay").addClass("hidden");
  })
  $(".inset input").click(function(){
    event.stopPropagation();
  })
  $.getJSON("mock/data.json",function(response){

    var allfeeds = response.data
    $.getJSON("mock/user-info.json",function (response) {
      var userinfo = response.data;
      renderDom(allfeeds,userinfo);
    })
  })

  function renderDom(allFeeds,gUserInfo){
    var app = new Vue({
      el: '#webchat',
      data: {
        AllFeeds: allFeeds,
        userinfo: gUserInfo,
        clickFeed:null,
        replyUser:''
      },
      ready: function () {
        this.AllFeeds.forEach(function (feed) {
          // 初始化showComt,false为不显示
          Vue.set(feed, 'showComt', false);
        })
      },
      methods: {
        showCommentClick: function (event, feed) {
          event.stopPropagation();
          this.clickFeed = feed;
          feed.showComt = !feed.showComt;
        },
        likeClick: function (event, feed) {
          event.stopPropagation();
          if (feed.like === "赞") {
            if (gUserInfo) {
              feed.userLike.push(gUserInfo.username);
              feed.like = '取消';
            }
          } else {
            if (gUserInfo) {
              feed.userLike.pop();
              feed.like = '赞';
            }
          }
        },
        comtClick: function (event,feed) {
          this.clickFeed = feed;
          event.stopPropagation();
          feed.showComt = false;
          $(".inset").removeClass("hidden");
          $(".inset input").focus();
          $(".overplay").removeClass("hidden").css("opacity", "0.6");

        },
        inputClick: function (event) {
          event.stopPropagation();
          var comText = $(".inset input").val();
          this.clickFeed.comment.push({"name": gUserInfo.username, "content": comText});
          $(".inset").addClass("hidden");
          $(".overplay").addClass("hidden");
          $('.inset input').val('');
        },
        replyComt:function (event,feed,onecommet) {
          event.stopPropagation();
          this.clickFeed = feed;
          this.replyUser = onecommet.name;
          $(".replybox").removeClass("hidden");
          $(".replybox input").focus();
          $(".overplay").removeClass("hidden").css("opacity","0.6");
        },
        replyClick:function(event){
          event.stopPropagation();
          var replyText = $(".replybox input").val();
          this.clickFeed.comment.push({
            "name":gUserInfo.username,
            "content":replyText,
            "reply":this.replyUser
          });
          $(".replybox").addClass("hidden");
          $(".overplay").addClass("hidden");
          $(".replybox input").val('');
        },
        appClick:function(){
          this.clickFeed.showComt = false;
        }
      }
    });
  }

})
