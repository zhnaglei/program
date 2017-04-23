/**
 * Created by zhanglei on 2016/11/14.
 */

var count = 10;
var level = 1;
var type = 'diff'
function Game(){
    this.oWrap = $('#wrap');
    this.oBg = $('#bg');
    this.oValue = $('#value');
    this.oTxt = $('#txt');
    this.Mask = $('#mask');
    this.LevWrap = $('#level');
    this.Level = $('#lev');
    this.Next = $('#next');
    this.oBegin = $('#begin');
    this.className = {
        imgClass:'pic',
        dropClass:'lit'
    };
    this.aImg = [];
    this.timer = null;
    this.imgSrc = ['img/0.png','img/1.png','img/2.png','img/3.png','img/4.png'];
    this.dropImgSrc = ['img/u.png','img/d.png','img/l.png','img/r.png'];
    this.row = 6;					//水滴行数
    this.col = 6;					//水滴列数
}

Game.prototype = {
    /**************************初始化*************************************/
    init:function (){
        var _this = this;

        this.count = count;					//shidishui~~~~~

        this.level = level;

        this.type = type;

        this.over = true;				//水滴是否运动完成;

        this.pass = false;				//是否过关

        this.spread();

        this.aDiv = ('<div>',this.oBg);		//背景方格

        this.aImg = $('<img>',this.oWrap);	//注意this.aImg.length是变化的;

        this.events();

        //alert(this.count+';'+count)
        this.oTxt.innerHTML = parseInt(this.count)+'滴水';

        fnMove(this.oValue,{'height':parseInt((this.count/20)*200)});

        this.Mask.style.display = 'block';
        this.oBegin.style.display = 'block';
        this.oBegin.style.opacity = 1;
        this.oBegin.style.opacity = 'filter:alpha(opacity:100)';

        fnMove(_this.Mask,{'opacity':0});
        fnMove(_this.oBegin,{'opacity':60});
        _this.oBegin.innerHTML = 'go!';

        setTimeout(function (){
            _this.oBegin.style.display = 'none';
            _this.Mask.style.display = 'none';
        },1000);
    },
    events:function (){				//鼠标事件
        var _this = this;
        for(var i=0;i<this.aImg.length;i++){
            this.aImg[i].index = i;
            this.aImg[i].onmouseover = function (){
                _this.mouseOver(this,{'width':'90px','height':'90px'});
            };
            this.aImg[i].onclick = function (){
                _this.count--;
                count--;
                _this.isPass();
                if( _this.count >= 0  && !_this.pass){
                    _this.onclick(this);
                    //document.title = _this.count;
                    fnMove(_this.oValue,{'height':parseInt(_this.count)*10});
                    _this.oTxt.innerHTML = parseInt(_this.count)+'滴水';
                }
                if(i<0){
                    i=0;
                }
            };
        }
    },
    isOver:function (){

    },
    isPass:function (){						//是否闯关成功;
        var _this = this;
        if(!this.timer){
            this.timer = setInterval(function (){
                _this.pass = true;
                for(var i=0;i<_this.aImg.length;i++){
                    if(_this.aImg[i].value != 0){
                        _this.pass = false;
                        //document.title = _this.pass;
                    }
                }
                //document.title = parseInt(_this.count)+';'+_this.over
                if(parseInt( _this.count) < 1 && _this.over){
                    clearInterval(_this.timer);
                    _this.timer  = null;
                    fnMove(_this.Mask,{'opacity':60});
                    _this.Mask.style.display = 'block';
                    _this.LevWrap.style.display = 'block';
                    fnMove(_this.LevWrap,{opacity:100});
                    _this.Level.innerHTML = '第'+ _this.level +'关失败！';
                    _this.Next.innerHTML = '重来';
                    count = 10;
                    level = 1;
                }
                //document.title = _this.pass;
                if(_this.pass){
                    clearInterval(_this.timer);
                    _this.timer  = null;
                    fnMove(_this.Mask,{'opacity':60});
                    _this.Mask.style.display = 'block';
                    _this.LevWrap.style.display = 'block';
                    fnMove(_this.LevWrap,{opacity:100});
                    if(_this.level >=9 && _this.type == 'diff'){
                        _this.Level.innerHTML = '第'+ _this.level +'关通过！';
                        _this.Next.innerHTML = '恭喜你通关了！再来一次！';
                        count = 10;
                        level = 1;
                    }else{
                        _this.Level.innerHTML = '第'+ _this.level +'关通过！';
                        _this.level++;
                        level++;
                        _this.Next.innerHTML = '下一关';
                    }
                }
            },500)
        }

    },
    /***************************水滴分布**********************************/
    spread:function (){
        var arr = [];
        if(this.type == 'easy'){
            for(var i=0;i<36;i++){
                arr.push(Math.floor(Math.random()*5));
            }
        }
        else if(this.type == 'diff'){
            for(var i=0;i<8-this.level;i++){
                arr.push(4);
            }
            for(var i=0;i<8+this.level;i++){
                arr.push(3);
            }
            for(var i=0;i<10-this.level;i++){
                arr.push(2);
            }
            for(var i=0;i<5+this.level;i++){
                arr.push(1);
            }
            for(var i=31;i<36;i++){
                arr.push(0);
            }
            arr.sort(function (a,b){return Math.random()-0.5;})
        }
        for(var n=0;n<36;n++){
            var oFrag1 = document.createDocumentFragment();
            var oFrag2 = document.createDocumentFragment();
            var img = document.createElement('img');
            var div = document.createElement('div');
            img.value = arr[n];
            img.className = this.className.imgClass;
            img.src = this.imgSrc[arr[n]];
            img.style.top = (parseInt(n/this.col)*100+10)+'px';
            img.style.left = ((n%this.col)*100+10) +'px';
            oFrag1.appendChild(div);
            oFrag2.appendChild(img)
            this.oBg.appendChild(oFrag1);
            this.oWrap.appendChild(oFrag2);
        }
    },
    /*********************************点击事件****************************************/
    onclick:function (obj){
        var _this = this;
        _this.mouseOver(obj,{'width':'90px','height':'90px'});
        switch(obj.value){
            case 0:
                obj.src = _this.imgSrc[1];
                obj.value++;
                break;
            case 1:
                obj.src = _this.imgSrc[2];
                obj.value++;
                break;
            case 2:
                obj.src = _this.imgSrc[3];
                obj.value++;
                break;
            case 3:
                obj.src = _this.imgSrc[4];
                obj.value++;
                break;
            case 4:
                obj.src = _this.imgSrc[0];
                obj.value = 0;
                _this.drop(obj);
                _this.count+=0.25;
                count+=0.25;
                _this.oTxt.innerHTML = parseInt(_this.count)+'滴水';
                fnMove(_this.oValue,{'height':parseInt(_this.count)*10});
                break;
        }
    },

    /*********************************点击创建水滴*************************************/
    drop:function (obj){
        var oFrag = document.createDocumentFragment();
        var oUp = document.createElement('img');
        var oDown = document.createElement('img');
        var oLeft = document.createElement('img');
        var oRight = document.createElement('img');
        oUp.src = this.dropImgSrc[0];
        oDown.src = this.dropImgSrc[1];
        oLeft.src = this.dropImgSrc[2];
        oRight.src = this.dropImgSrc[3];
        oUp.value = oDown.value = oLeft.value = oRight.value = 0;
        oUp.className = oDown.className = oLeft.className = oRight.className = this.className.dropClass;
        oUp.style.left = oDown.style.left= oLeft.style.left= oRight.style.left= obj.offsetLeft+'px';
        oUp.style.top = oDown.style.top = oLeft.style.top = oRight.style.top = obj.offsetTop + 'px';
        oUp.index = oDown.index = oLeft.index = oRight.index = obj.index;

        oFrag.appendChild(oUp);
        oFrag.appendChild(oDown);
        oFrag.appendChild(oLeft);
        oFrag.appendChild(oRight);
        this.oWrap.appendChild(oFrag);

        this.dropMove(oUp,'top',-100);
        this.dropMove(oDown,'top',650);
        this.dropMove(oLeft,'left',-100);
        this.dropMove(oRight,'left',650);
    },


    /*++++++++++++++++++++++++++++++水珠动画 +++++++++++++++++++++++++++++++++++*/
    mouseOver:function (obj,jTarget){
        var t = 0;
        var A = 0;
        var fnSin = 0;
        if(!obj.timer){
            obj.timer = setInterval(function (){
                for(var attr in jTarget){
                    A = Math.pow(2,-t/200);
                    fnSin = Math.sin(t*Math.PI/180);
                    obj.style[attr] = parseInt(jTarget[attr])+10*Math.abs(A*fnSin) + 'px';
                }
                t+=20;
                if(A<1/10){
                    clearInterval(obj.timer);
                    obj.timer = null;
                }
            },30);
        }
    },

    /*++++++++++++++++++++++++++++++水滴移动动画+++++++++++++++++++++++++++++++++++*/
    dropMove:function (obj,attr,target){
        var _this = this;
        var iCur = parseInt(getStyle(obj,attr));
        var speed = 0;
        var i =0;
        var flag = true;
        obj.timer = setInterval(function (){
            _this.over = false;
            flag = true;
            if(iCur>target){
                speed = (iCur-=5)
                if(attr == 'top'){
                    for(i=obj.index-_this.col;i>=0;i-=_this.col){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
                else if(attr == 'left'){
                    for(i=obj.index-1;i>=obj.index-(obj.index%_this.col);i--){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
            }
            if(iCur<target){
                speed = (iCur+=5)
                if(attr == 'top'){
                    for(i=obj.index+_this.col;i<_this.aImg.length;i+=_this.col){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
                else if(attr == 'left'){
                    for(i=obj.index+1;i<obj.index+(_this.col-(obj.index%_this.col));i++){
                        _this.isCollision(obj,_this.aImg[i],attr);
                    }
                }
            }
            obj.style[attr] = speed +'px';

            if(speed != target){
                flag = false;
            }
            if(flag){
                if(obj){
                    clearInterval(obj.timer);
                    _this.oWrap.removeChild(obj);
                    obj.timer = null;
                }
                _this.over = true;

            }
            //document.title = _this.over+';'+_this.count;
        },30)
    },
    isCollision:function (obj1,obj2,attr){
        if(obj2.value && Math.abs(parseInt(getStyle(obj2,attr))-parseInt(getStyle(obj1,attr)))<=50){
            this.onclick(obj2);
            clearInterval(obj1.timer);
            this.oWrap.removeChild(obj1);
            this.over = true;
        }
    }
}

/*++++++++++++++++++++++++++++++获取样式+++++++++++++++++++++++++++++++++++*/

function $(str,oParent){//getElement
    var id = /^#[\w\d]+/;
    var tag = /^<\w{1,}>$/;
    if(id.test(str)){
        return (oParent||document).getElementById(str.substring(1));
    }
    if(tag.test(str)){
        return (oParent||document).getElementsByTagName(str.substring(1,(str.length-1)));
    }
}
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
    return getComputedStyle(obj,false)[attr];
}
function getByClass(parent,sClass){
    var aEles = (parent||document).getElementsByTagName('*');
    var re = new RegExp('\\b'+sClass+'\\b')
    var result = [];
    for(var i=0; i<aEles.length; i++){
        if( re.test(aEles[i].className) ){
            result.push(aEles[i]);
        }
    }
    return result;
}
function fnMove(obj,json,fn){					//页面运动效果
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var flag=true;
        for(var attr in json){
            var iCur = 0;
            if( attr == 'opacity'){
                iCur = Math.round(getStyle(obj,attr)*100);
            }else{
                iCur = parseInt(getStyle(obj,attr));
            }
            var iSpeed = (json[attr]-iCur)/8;
            iSpeed = iSpeed >0 ? Math.ceil(iSpeed):Math.floor(iSpeed);

            if(iCur != json[attr]){
                flag=false;
            }
            if( attr == 'opacity'){
                obj.style.filter = 'alpha(opacity:'+(iCur+iSpeed)+')';
                obj.style.opacity = (iCur + iSpeed)/100;
            }else{
                obj.style[attr]=iCur+iSpeed+'px';
            }
        }
        if(flag){
            clearInterval(obj.timer);
            obj.timer = null;
            if(fn){
                fn();
            }
        }
    },30)
}
