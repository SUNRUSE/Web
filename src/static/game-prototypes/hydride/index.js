function SprigganBoot(a){return a.add(SprigganSpriteSheet,"logo"),a.add(SprigganSpriteSheet,"fontBig"),a.add(SprigganSpriteSheet,"fontSmall"),sharedContent=a,function(){SprigganEventWasTriggeredByUserInteraction=!0,LoadBattle()}}function LoadBattle(){function a(){for(var a={fromDoor:null,map:"tutorial/throwing",areaPath:"test",inventory:[],party:[{legs:"brownTrousers",torso:"leatherJacket",weapon:"sword",hair:"orangeHair"},{legs:"brownTrousers",torso:"leatherJacket",weapon:"pistol",hair:"orangeHair"}]};a.inventory.length<12;)a.inventory.push(null);new Battle.Game(a)}BattleContent?a():(BattleContent=ShowLoadingScreen(function(){Battle=BattleContent.get(SprigganJavaScript,"battle.js"),a()}),BattleContent.add(SprigganJavaScript,"battle.js"),BattleContent.add(SprigganSpriteSheet,"battle/inventory"),BattleContent.add(SprigganSpriteSheet,"battle/character"),BattleContent.add(SprigganSpriteSheet,"battle/battle"),BattleContent.add(SprigganSpriteSheet,"battle/itemPickups"),BattleContent.add(SprigganSpriteSheet,"battle/markers"),BattleContent.add(SprigganSpriteSheet,"battle/effects"),BattleContent.sounds={footstep:new SoundSet(BattleContent,"battle/footstep",4),pistolFire:new SoundSet(BattleContent,"battle/pistolFire",4),pistolDraw:new SoundSet(BattleContent,"battle/pistolDraw",1),pistolStow:new SoundSet(BattleContent,"battle/pistolStow",1),throwWrench:new SoundSet(BattleContent,"battle/throwWrench",1),hitWrench:new SoundSet(BattleContent,"battle/hitWrench",1),pickUpWrench:new SoundSet(BattleContent,"battle/pickUpWrench",1),openDoor:new SoundSet(BattleContent,"battle/openDoor",1),closeDoor:new SoundSet(BattleContent,"battle/closeDoor",1)})}function ShowLoadingScreen(a){var b=new SprigganViewport(screenWidth,screenHeight,"right","bottom"),c=new SprigganSprite(b,sharedContent,"logo");c.loop("nowLoading"),c.move(screenWidth,screenHeight);var d=new SprigganSprite(b,sharedContent,"logo");d.hide(),d.move(screenWidth,screenHeight);var e;if(firstLoadingScreen){e=new SprigganViewport(screenWidth,screenHeight);var f=new SprigganSprite(e,sharedContent,"logo");f.move(screenWidth/2,screenHeight/2),f.loop("logo"),firstLoadingScreen=!1}var g=new SprigganContentManager({progress:function(a,b){switch(a%4){case 0:d.hide();break;case 1:d.show();default:d.loop("ellipsis"+a%4)}},loaded:function(){b.dispose(),e&&e.dispose(),a()}});return g}function LoadNavigation(){function a(){for(var a={map:"tutorial/throwing",areaPath:"test",inventory:[]};a.inventory.length<12;)a.inventory.push(null);new Navigation.Game(a)}NavigationContent?a():(NavigationContent=ShowLoadingScreen(function(){Navigation=NavigationContent.get(SprigganJavaScript,"navigation.js"),a()}),NavigationContent.add(SprigganJavaScript,"navigation.js"))}function SoundSet(a,b,c){this.contentManager=a,this.url=b,this.count=c;for(var d=0;d<c;d++)a.add(SprigganSound,b+d+".mp3")}var sharedContent,screenWidth=428,screenHeight=240,fontBig={lineSpacing:6,lineHeight:8,letterSpacing:1,kerning:{"default":5,i:1,j:1,c:4,f:3,t:4,r:4,k:4,l:3," ":2,":":1,";":2,"!":1,"?":4,"(":3,")":3,"[":3,"]":3,"{":3,"}":3,"\t":9,"-":3,_:6,"'":1,'"':4,"=":4,"%":4,"/":4,"\\":4,",":2,I:1,"|":1,".":1}},BattleContent,Battle,firstLoadingScreen=!0,NavigationContent,Navigation;SoundSet.prototype.play=function(){if(!this.sounds){this.sounds=[];for(var a=0;a<this.count;a++)this.sounds.push(this.contentManager.get(SprigganSound,this.url+a+".mp3"))}var b=Math.floor(Math.pow(Math.random(),4)*this.sounds.length),c=this.sounds.splice(b,1);this.sounds.push(c[0]),c[0]()};